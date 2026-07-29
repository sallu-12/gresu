import * as THREE from 'three';
import { ControlState, CustomizationSettings, GameStats } from '../types';
import { soundEngine } from '../utils/audio';

interface Platform {
  mesh: THREE.Mesh;
  box: THREE.Box3;
  isBoost?: boolean;
}

interface Gem {
  mesh: THREE.Mesh;
  collected: boolean;
}

export class GravitySphere3D {
  private container: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private sphereMesh: THREE.Mesh;
  private platforms: Platform[] = [];
  private gems: Gem[] = [];

  private isRunning = false;
  private animFrameId: number | null = null;

  // Sphere Physics
  private position = new THREE.Vector3(0, 3, 0);
  private velocity = new THREE.Vector3(0, 0, 0);
  private radius = 1.0;
  private isGrounded = false;

  private score = 0;
  private gemsCollected = 0;
  private distance = 0;
  private health = 100;

  private onStatsUpdate: (stats: GameStats) => void;
  private onGameOver: (finalStats: GameStats) => void;

  constructor(
    container: HTMLDivElement,
    customization: CustomizationSettings,
    onStatsUpdate: (stats: GameStats) => void,
    onGameOver: (finalStats: GameStats) => void
  ) {
    this.container = container;
    this.onStatsUpdate = onStatsUpdate;
    this.onGameOver = onGameOver;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060814);
    this.scene.fog = new THREE.FogExp2(0x060814, 0.012);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      65,
      container.clientWidth / container.clientHeight,
      0.1,
      500
    );

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
    dirLight.position.set(20, 40, 20);
    this.scene.add(dirLight);

    // Energy Sphere
    const sphereGeo = new THREE.SphereGeometry(this.radius, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: customization.shipColor,
      roughness: 0.1,
      metalness: 0.9,
      emissive: customization.glowColor,
      emissiveIntensity: 0.4,
      wireframe: false,
    });
    this.sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    this.sphereMesh.position.copy(this.position);
    this.scene.add(this.sphereMesh);

    // Build Floating Course
    this.buildCourse();

    window.addEventListener('resize', this.onResize);
  }

  private buildCourse() {
    // Starting Platform
    this.addPlatform(0, 0, 0, 12, 1, 30);

    // Elevated Section with Ramps
    this.addPlatform(0, 0, -50, 8, 1, 40);
    this.addPlatform(0, 2, -100, 10, 1, 40, true); // Boost pad
    this.addPlatform(8, 4, -150, 12, 1, 40);
    this.addPlatform(-8, 6, -200, 10, 1, 50);

    // Spawn Gems on course
    const gemGeo = new THREE.OctahedronGeometry(0.7, 0);
    const gemMat = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });

    for (let i = 0; i < 20; i++) {
      const mesh = new THREE.Mesh(gemGeo, gemMat);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        2 + Math.random() * 2,
        -15 - i * 10
      );
      this.scene.add(mesh);
      this.gems.push({ mesh, collected: false });
    }
  }

  private addPlatform(x: number, y: number, z: number, w: number, h: number, d: number, isBoost = false) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({
      color: isBoost ? 0x00ffaa : 0x1a1a3a,
      roughness: 0.4,
      emissive: isBoost ? 0x00ffaa : 0x0a0a1f,
      emissiveIntensity: isBoost ? 0.8 : 0.2,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);

    const box = new THREE.Box3().setFromObject(mesh);
    this.platforms.push({ mesh, box, isBoost });
  }

  public start() {
    this.isRunning = true;
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (!this.isRunning) return;
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      this.update(delta);
      this.renderer.render(this.scene, this.camera);
      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  public pause(isPaused: boolean) {
    this.isRunning = !isPaused;
    if (this.isRunning) this.start();
  }

  public updateControls(controls: ControlState) {
    if (!this.isRunning) return;

    const accel = 35;
    if (controls.moveLeft || controls.tiltX < -0.2) this.velocity.x -= accel * 0.016;
    if (controls.moveRight || controls.tiltX > 0.2) this.velocity.x += accel * 0.016;
    if (controls.moveUp || controls.tiltY < -0.2) this.velocity.z -= accel * 0.016;
    if (controls.moveDown || controls.tiltY > 0.2) this.velocity.z += accel * 0.016;

    if (controls.boost && this.isGrounded) {
      this.velocity.y = 14;
      soundEngine.playBoost();
      this.isGrounded = false;
    }
  }

  private update(delta: number) {
    // Gravity
    this.velocity.y -= 25 * delta;

    // Apply friction to X/Z
    this.velocity.x *= 0.96;
    this.velocity.z *= 0.98;

    // Apply Velocity
    this.position.add(this.velocity.clone().multiplyScalar(delta));

    // Platform Collisions
    this.isGrounded = false;
    const sphereBox = new THREE.Box3().setFromCenterAndSize(
      this.position,
      new THREE.Vector3(this.radius * 2, this.radius * 2, this.radius * 2)
    );

    for (const plat of this.platforms) {
      if (plat.box.intersectsBox(sphereBox)) {
        // Top surface collision
        if (this.position.y > plat.mesh.position.y + 0.3 && this.velocity.y < 0) {
          this.position.y = plat.mesh.position.y + 0.5 + this.radius;
          this.velocity.y = 0;
          this.isGrounded = true;

          if (plat.isBoost) {
            this.velocity.z = -60;
            soundEngine.playBoost();
          }
        }
      }
    }

    // Sphere Rolling visual rotation
    this.sphereMesh.rotation.x += (this.velocity.z * delta) / this.radius;
    this.sphereMesh.rotation.z -= (this.velocity.x * delta) / this.radius;
    this.sphereMesh.position.copy(this.position);

    // Collect Gems
    for (const gem of this.gems) {
      if (!gem.collected && this.position.distanceTo(gem.mesh.position) < 1.8) {
        gem.collected = true;
        this.scene.remove(gem.mesh);
        this.gemsCollected++;
        this.score += 150;
        soundEngine.playPickup();
      } else if (!gem.collected) {
        gem.mesh.rotation.y += 3 * delta;
      }
    }

    // Update Distance
    this.distance = Math.max(this.distance, Math.floor(-this.position.z));

    // Fall in Chasm -> Game Over
    if (this.position.y < -15) {
      this.handleGameOver();
      return;
    }

    // Camera follow
    const camTarget = this.position.clone().add(new THREE.Vector3(0, 6, 14));
    this.camera.position.lerp(camTarget, 0.1);
    this.camera.lookAt(this.position.clone().add(new THREE.Vector3(0, 0, -5)));

    this.onStatsUpdate({
      score: this.score + this.distance * 2,
      multiplier: 1,
      speed: Math.floor(Math.abs(this.velocity.z)),
      health: this.health,
      maxHealth: 100,
      shield: 0,
      distance: this.distance,
      kills: 0,
      gemsCollected: this.gemsCollected,
      isGameOver: false,
      isPaused: false,
    });
  }

  private handleGameOver() {
    this.isRunning = false;
    soundEngine.playGameOver();
    this.onGameOver({
      score: this.score + this.distance * 2,
      multiplier: 1,
      speed: 0,
      health: 0,
      maxHealth: 100,
      shield: 0,
      distance: this.distance,
      kills: 0,
      gemsCollected: this.gemsCollected,
      isGameOver: true,
      isPaused: false,
    });
  }

  private onResize = () => {
    if (!this.container) return;
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  };

  public destroy() {
    this.isRunning = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.onResize);

    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
