import * as THREE from 'three';
import { ControlState, CustomizationSettings, GameStats } from '../types';
import { soundEngine } from '../utils/audio';

interface LaserBullet {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
}

interface EnemyShip {
  group: THREE.Group;
  health: number;
  maxHealth: number;
  velocity: THREE.Vector3;
}

interface Asteroid {
  mesh: THREE.Mesh;
  radius: number;
  velocity: THREE.Vector3;
  rotVelocity: THREE.Vector3;
}

export class SpaceCombat3D {
  private container: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private playerShip: THREE.Group;
  private bullets: LaserBullet[] = [];
  private enemies: EnemyShip[] = [];
  private asteroids: Asteroid[] = [];
  private stars: THREE.Points;

  private isRunning = false;
  private animFrameId: number | null = null;

  // Flight Physics State
  private shipPos = new THREE.Vector3(0, 0, 0);
  private shipRot = new THREE.Euler(0, 0, 0, 'YXZ');
  private speed = 0;
  private maxSpeed = 35;

  private score = 0;
  private kills = 0;
  private health = 100;
  private shield = 100;
  private multiplier = 1;

  private shootCooldown = 0;

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

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x020208);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffaa00, 1.5);
    sunLight.position.set(100, 100, 50);
    this.scene.add(sunLight);

    // Deep Space Starfield
    this.stars = this.createStarfield();
    this.scene.add(this.stars);

    // Player Starfighter
    this.playerShip = this.createPlayerShip(customization);
    this.scene.add(this.playerShip);

    // Spawn Initial Asteroids
    for (let i = 0; i < 25; i++) {
      this.spawnAsteroid();
    }

    window.addEventListener('resize', this.onResize);
  }

  private createStarfield(): THREE.Points {
    const count = 1500;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 800;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.2,
      transparent: true,
      opacity: 0.8,
    });
    return new THREE.Points(geo, mat);
  }

  private createPlayerShip(customization: CustomizationSettings): THREE.Group {
    const group = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
      color: customization.shipColor,
      metalness: 0.9,
      roughness: 0.1,
      emissive: customization.shipColor,
      emissiveIntensity: 0.3,
    });

    const noseGeo = new THREE.ConeGeometry(0.7, 3, 4);
    noseGeo.rotateX(Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, bodyMat);
    group.add(nose);

    const wingGeo = new THREE.BoxGeometry(4, 0.1, 1.2);
    const wing = new THREE.Mesh(wingGeo, bodyMat);
    wing.position.set(0, 0, 0.5);
    group.add(wing);

    return group;
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

    // Steering
    let pitch = 0;
    let yaw = 0;

    if (controls.moveUp) pitch -= 1.8;
    if (controls.moveDown) pitch += 1.8;
    if (controls.moveLeft) yaw += 1.8;
    if (controls.moveRight) yaw -= 1.8;

    if (controls.tiltX !== 0 || controls.tiltY !== 0) {
      yaw = -controls.tiltX * 2.2;
      pitch = controls.tiltY * 2.2;
    }

    this.shipRot.x += pitch * 0.016;
    this.shipRot.y += yaw * 0.016;

    // Thrust
    if (controls.boost) {
      this.speed = Math.min(this.maxSpeed, this.speed + 25 * 0.016);
    } else {
      this.speed = Math.max(10, this.speed - 10 * 0.016);
    }

    // Shooting
    if (controls.shoot && this.shootCooldown <= 0) {
      this.fireLaser();
      this.shootCooldown = 0.18; // Rate of fire
    }
  }

  private fireLaser() {
    soundEngine.playLaser();

    const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    const geo = new THREE.CylinderGeometry(0.08, 0.08, 2, 8);
    geo.rotateX(Math.PI / 2);
    const mesh = new THREE.Mesh(geo, mat);

    // Position laser at nose of ship
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(this.shipRot);
    mesh.position.copy(this.shipPos).add(forward.clone().multiplyScalar(2));
    mesh.rotation.copy(this.shipRot);

    this.scene.add(mesh);
    this.bullets.push({
      mesh,
      velocity: forward.multiplyScalar(120),
      life: 2.5,
    });
  }

  private update(delta: number) {
    if (this.shootCooldown > 0) this.shootCooldown -= delta;

    // Move Ship forward
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(this.shipRot);
    this.shipPos.add(forward.clone().multiplyScalar(this.speed * delta));

    this.playerShip.position.copy(this.shipPos);
    this.playerShip.rotation.copy(this.shipRot);

    // Camera follows behind ship
    const cameraOffset = new THREE.Vector3(0, 3, 10).applyEuler(this.shipRot);
    this.camera.position.copy(this.shipPos).add(cameraOffset);
    this.camera.lookAt(this.shipPos.clone().add(forward.clone().multiplyScalar(10)));

    // Spawn Enemy Drones if count < 6
    if (this.enemies.length < 6 && Math.random() < delta * 0.8) {
      this.spawnEnemy();
    }

    // Update Lasers
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.mesh.position.add(b.velocity.clone().multiplyScalar(delta));
      b.life -= delta;

      let hit = false;

      // Check bullet hit on Enemies
      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        if (b.mesh.position.distanceTo(enemy.group.position) < 3.0) {
          hit = true;
          enemy.health -= 40;
          soundEngine.playExplosion();

          if (enemy.health <= 0) {
            this.scene.remove(enemy.group);
            this.enemies.splice(j, 1);
            this.kills++;
            this.score += 200 * this.multiplier;
          }
          break;
        }
      }

      // Check bullet hit on Asteroids
      if (!hit) {
        for (let aIdx = this.asteroids.length - 1; aIdx >= 0; aIdx--) {
          const ast = this.asteroids[aIdx];
          if (b.mesh.position.distanceTo(ast.mesh.position) < ast.radius) {
            hit = true;
            soundEngine.playExplosion();
            this.scene.remove(ast.mesh);
            this.asteroids.splice(aIdx, 1);
            this.score += 50 * this.multiplier;
            this.spawnAsteroid();
            break;
          }
        }
      }

      if (hit || b.life <= 0) {
        this.scene.remove(b.mesh);
        this.bullets.splice(i, 1);
      }
    }

    // Update Enemies (AI fly towards player)
    for (const enemy of this.enemies) {
      const dir = this.shipPos.clone().sub(enemy.group.position).normalize();
      enemy.group.position.add(dir.multiplyScalar(18 * delta));
      enemy.group.lookAt(this.shipPos);

      // Enemy hit player
      if (enemy.group.position.distanceTo(this.shipPos) < 3.0) {
        if (this.shield > 0) {
          this.shield = Math.max(0, this.shield - 30);
          soundEngine.playShieldHit();
        } else {
          this.health -= 25;
          soundEngine.playExplosion();
          if (this.health <= 0) {
            this.handleGameOver();
            return;
          }
        }
      }
    }

    // Update Asteroids rotation
    for (const ast of this.asteroids) {
      ast.mesh.rotation.x += ast.rotVelocity.x * delta;
      ast.mesh.rotation.y += ast.rotVelocity.y * delta;
    }

    // Pass stats update
    this.onStatsUpdate({
      score: Math.floor(this.score),
      multiplier: this.multiplier,
      speed: Math.floor(this.speed),
      health: Math.floor(this.health),
      maxHealth: 100,
      shield: Math.floor(this.shield),
      distance: Math.floor(this.shipPos.length()),
      kills: this.kills,
      gemsCollected: 0,
      isGameOver: false,
      isPaused: false,
    });
  }

  private spawnEnemy() {
    const group = new THREE.Group();
    const geo = new THREE.OctahedronGeometry(1.5, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xff0044,
      emissive: 0xff0044,
      emissiveIntensity: 0.6,
    });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);

    // Spawn randomly in space around player
    const spawnOffset = new THREE.Vector3(
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 100,
      (Math.random() - 0.5) * 200
    );
    group.position.copy(this.shipPos).add(spawnOffset);

    this.enemies.push({
      group,
      health: 80,
      maxHealth: 80,
      velocity: new THREE.Vector3(),
    });
    this.scene.add(group);
  }

  private spawnAsteroid() {
    const radius = 2 + Math.random() * 4;
    const geo = new THREE.DodecahedronGeometry(radius, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x666688,
      roughness: 0.9,
    });
    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.set(
      (Math.random() - 0.5) * 300,
      (Math.random() - 0.5) * 150,
      (Math.random() - 0.5) * 300
    );

    this.asteroids.push({
      mesh,
      radius,
      velocity: new THREE.Vector3(),
      rotVelocity: new THREE.Vector3(Math.random() * 2, Math.random() * 2, 0),
    });
    this.scene.add(mesh);
  }

  private handleGameOver() {
    this.isRunning = false;
    soundEngine.playGameOver();
    this.onGameOver({
      score: Math.floor(this.score),
      multiplier: this.multiplier,
      speed: 0,
      health: 0,
      maxHealth: 100,
      shield: 0,
      distance: Math.floor(this.shipPos.length()),
      kills: this.kills,
      gemsCollected: 0,
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
