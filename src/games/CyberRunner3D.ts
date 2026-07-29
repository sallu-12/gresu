import * as THREE from 'three';
import { ControlState, CustomizationSettings, GameStats } from '../types';
import { soundEngine } from '../utils/audio';

export class CyberRunner3D {
  private container: HTMLDivElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private playerShip: THREE.Group;
  private shipBodyMat: THREE.MeshStandardMaterial;
  private glowMat: THREE.MeshBasicMaterial;
  private trailParticles: THREE.Points;

  private obstacles: THREE.Group[] = [];
  private powerups: THREE.Group[] = [];
  private buildings: THREE.Mesh[] = [];

  private gridMesh: THREE.GridHelper;
  private isRunning = false;
  private animFrameId: number | null = null;

  // State
  private playerX = 0;
  private targetPlayerX = 0;
  private playerY = 0;
  private playerVelocityY = 0;
  private speed = 40; // units/sec
  private score = 0;
  private health = 100;
  private shield = 0;
  private distance = 0;
  private multiplier = 1;

  private activePowerup: string | null = null;
  private powerupTimer = 0;

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

    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050510);
    this.scene.fog = new THREE.FogExp2(0x050510, 0.015);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.1,
      500
    );
    this.camera.position.set(0, 4, 10);
    this.camera.lookAt(0, 2, -10);

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(this.renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
    dirLight.position.set(10, 20, 10);
    this.scene.add(dirLight);

    const pointLight = new THREE.PointLight(0xff0077, 2, 50);
    pointLight.position.set(0, 5, -5);
    this.scene.add(pointLight);

    // 5. Highway Grid
    const gridHelper = new THREE.GridHelper(200, 40, 0x00f0ff, 0xff0077);
    gridHelper.position.set(0, 0, -50);
    this.scene.add(gridHelper);
    this.gridMesh = gridHelper;

    // 6. Player Ship
    this.shipBodyMat = new THREE.MeshStandardMaterial({
      color: customization.shipColor,
      metalness: 0.8,
      roughness: 0.2,
      emissive: customization.shipColor,
      emissiveIntensity: 0.2,
    });
    this.glowMat = new THREE.MeshBasicMaterial({
      color: customization.glowColor,
    });

    this.playerShip = this.createShipGroup();
    this.playerShip.position.set(0, 1, 0);
    this.scene.add(this.playerShip);

    // 7. Trail Particles
    this.trailParticles = this.createTrailParticles(customization);
    this.scene.add(this.trailParticles);

    // 8. Background City Skyline
    this.createCitySkyline();

    // Resize handler
    window.addEventListener('resize', this.onResize);
  }

  private createShipGroup(): THREE.Group {
    const group = new THREE.Group();

    // Main hull (Futuristic Jet Wedge)
    const hullGeo = new THREE.ConeGeometry(0.8, 2.5, 4);
    hullGeo.rotateX(Math.PI / 2);
    const hull = new THREE.Mesh(hullGeo, this.shipBodyMat);
    group.add(hull);

    // Wings
    const wingGeo = new THREE.BoxGeometry(3.2, 0.1, 0.8);
    const wing = new THREE.Mesh(wingGeo, this.shipBodyMat);
    wing.position.set(0, 0, 0.4);
    group.add(wing);

    // Engine glow cubes
    const engineGeo = new THREE.BoxGeometry(0.3, 0.3, 0.4);
    const leftEngine = new THREE.Mesh(engineGeo, this.glowMat);
    leftEngine.position.set(-0.6, 0, 1.2);
    const rightEngine = new THREE.Mesh(engineGeo, this.glowMat);
    rightEngine.position.set(0.6, 0, 1.2);

    group.add(leftEngine);
    group.add(rightEngine);

    // Shield Dome (invisible by default)
    const shieldGeo = new THREE.SphereGeometry(1.8, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.name = 'shieldDome';
    group.add(shieldMesh);

    return group;
  }

  private createTrailParticles(customization: CustomizationSettings): THREE.Points {
    const count = 100;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 50;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const color = customization.trailType === 'rainbow' ? 0xffff00 : 0x00f0ff;
    const mat = new THREE.PointsMaterial({
      color,
      size: 0.3,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    return new THREE.Points(geo, mat);
  }

  private createCitySkyline() {
    const boxGeo = new THREE.BoxGeometry(4, 30, 4);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x0a0a20,
      wireframe: true,
    });

    for (let i = 0; i < 40; i++) {
      const b = new THREE.Mesh(boxGeo, mat);
      const side = i % 2 === 0 ? -1 : 1;
      b.position.set(side * (25 + Math.random() * 30), 10, -Math.random() * 200);
      this.buildings.push(b);
      this.scene.add(b);
    }
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
    if (this.isRunning) {
      this.start();
    }
  }

  public updateControls(controls: ControlState) {
    if (!this.isRunning) return;

    // Movement horizontally (Lanes from -6 to +6)
    if (controls.moveLeft || controls.tiltX < -0.2) {
      this.targetPlayerX = Math.max(-6, this.targetPlayerX - 0.35);
    }
    if (controls.moveRight || controls.tiltX > 0.2) {
      this.targetPlayerX = Math.min(6, this.targetPlayerX + 0.35);
    }

    // Jump / Hop
    if ((controls.moveUp || controls.boost) && this.playerY === 0) {
      this.playerVelocityY = 12;
      soundEngine.playBoost();
    }
  }

  private update(delta: number) {
    // 1. Move Player X smooth interp & Roll rotation
    this.playerX += (this.targetPlayerX - this.playerX) * 12 * delta;
    this.playerShip.position.x = this.playerX;

    // Roll rotation when turning
    const rollTarget = -(this.targetPlayerX - this.playerX) * 0.4;
    this.playerShip.rotation.z += (rollTarget - this.playerShip.rotation.z) * 8 * delta;

    // Gravity / Jump Y update
    this.playerY += this.playerVelocityY * delta;
    if (this.playerY > 0) {
      this.playerVelocityY -= 30 * delta; // Gravity
    } else {
      this.playerY = 0;
      this.playerVelocityY = 0;
    }
    this.playerShip.position.y = 1 + this.playerY;

    // 2. Highway grid scrolling
    this.distance += this.speed * delta;
    this.gridMesh.position.z = (this.distance % 5) - 50;

    // Buildings scroll
    this.buildings.forEach((b) => {
      b.position.z += this.speed * delta;
      if (b.position.z > 20) {
        b.position.z = -180 - Math.random() * 20;
      }
    });

    // 3. Powerup timer update
    if (this.powerupTimer > 0) {
      this.powerupTimer -= delta;
      if (this.powerupTimer <= 0) {
        this.activePowerup = null;
        this.multiplier = 1;
      }
    }

    // 4. Update Shield Mesh
    const shieldMesh = this.playerShip.getObjectByName('shieldDome') as THREE.Mesh;
    if (shieldMesh) {
      const shieldMat = shieldMesh.material as THREE.MeshBasicMaterial;
      shieldMat.opacity = this.shield > 0 ? 0.6 : 0;
    }

    // 5. Spawn Obstacles
    if (Math.random() < delta * 1.8) {
      this.spawnObstacle();
    }

    // 6. Spawn Powerups
    if (Math.random() < delta * 0.6) {
      this.spawnPowerup();
    }

    // 7. Update Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.position.z += this.speed * delta;

      // Collision Check
      const dist = this.playerShip.position.distanceTo(obs.position);
      if (dist < 1.8) {
        this.scene.remove(obs);
        this.obstacles.splice(i, 1);

        if (this.shield > 0) {
          this.shield = Math.max(0, this.shield - 50);
          soundEngine.playShieldHit();
        } else {
          this.health -= 35;
          soundEngine.playExplosion();
          if (this.health <= 0) {
            this.handleGameOver();
            return;
          }
        }
        continue;
      }

      // Remove passed
      if (obs.position.z > 15) {
        this.scene.remove(obs);
        this.obstacles.splice(i, 1);
        this.score += 25 * this.multiplier;
      }
    }

    // 8. Update Powerups
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.position.z += this.speed * delta;
      p.rotation.y += 3 * delta;

      const dist = this.playerShip.position.distanceTo(p.position);
      if (dist < 2.0) {
        const type = p.userData.type as string;
        this.scene.remove(p);
        this.powerups.splice(i, 1);

        soundEngine.playPickup();

        if (type === 'shield') {
          this.shield = 100;
        } else if (type === 'multiplier') {
          this.multiplier = 2;
          this.powerupTimer = 8;
        } else if (type === 'repair') {
          this.health = Math.min(100, this.health + 30);
        }
        this.score += 100 * this.multiplier;
        continue;
      }

      if (p.position.z > 15) {
        this.scene.remove(p);
        this.powerups.splice(i, 1);
      }
    }

    // Gradually increase speed
    this.speed = Math.min(90, 40 + this.distance * 0.015);
    this.camera.fov = 70 + (this.speed - 40) * 0.2;
    this.camera.updateProjectionMatrix();

    // Stats callback
    this.onStatsUpdate({
      score: Math.floor(this.score),
      multiplier: this.multiplier,
      speed: Math.floor(this.speed),
      health: Math.floor(this.health),
      maxHealth: 100,
      shield: Math.floor(this.shield),
      distance: Math.floor(this.distance),
      kills: 0,
      gemsCollected: 0,
      isGameOver: false,
      isPaused: false,
    });
  }

  private spawnObstacle() {
    const group = new THREE.Group();
    const type = Math.random() > 0.4 ? 'barrier' : 'pillar';
    const lanes = [-5, -2.5, 0, 2.5, 5];
    const laneX = lanes[Math.floor(Math.random() * lanes.length)];

    if (type === 'barrier') {
      const geo = new THREE.BoxGeometry(2.5, 1.2, 0.5);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xff0055,
        emissive: 0xff0055,
        emissiveIntensity: 0.8,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 0.6, 0);
      group.add(mesh);
    } else {
      const geo = new THREE.CylinderGeometry(0.5, 0.5, 4, 8);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xff7700,
        emissive: 0xff7700,
        emissiveIntensity: 0.6,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 2, 0);
      group.add(mesh);
    }

    group.position.set(laneX, 0, -140);
    this.obstacles.push(group);
    this.scene.add(group);
  }

  private spawnPowerup() {
    const group = new THREE.Group();
    const types = ['shield', 'multiplier', 'repair'];
    const pType = types[Math.floor(Math.random() * types.length)];
    group.userData.type = pType;

    const geo = new THREE.OctahedronGeometry(0.8, 0);
    const color = pType === 'shield' ? 0x00ffff : pType === 'multiplier' ? 0xffff00 : 0x00ff66;
    const mat = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 1.2, 0);
    group.add(mesh);

    const lanes = [-5, -2.5, 0, 2.5, 5];
    const laneX = lanes[Math.floor(Math.random() * lanes.length)];
    group.position.set(laneX, 0, -140);

    this.powerups.push(group);
    this.scene.add(group);
  }

  private handleGameOver() {
    this.isRunning = false;
    soundEngine.playGameOver();
    this.onGameOver({
      score: Math.floor(this.score),
      multiplier: this.multiplier,
      speed: Math.floor(this.speed),
      health: 0,
      maxHealth: 100,
      shield: 0,
      distance: Math.floor(this.distance),
      kills: 0,
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
