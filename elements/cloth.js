import * as CANNON from "cannon-es";
import * as THREE from "three";

const Nx = 10;
const Ny = Nx * 2;

export default class Cloth {
  constructor(world, position, velocity) {
    this.world = world;
    this.mass = 1;
    this.clothSize = 50;
    this.position = position;
    this.velocity = velocity;
    this.dist = this.clothSize / Nx;
    this.shape = new CANNON.Particle();
    this.particles = [];

    this.createGeometry();
    this.generateParticles();
    this.connectParticles();
  }

  createGeometry() {
    this.clothGeometry = new THREE.PlaneGeometry(50, 100, Nx, Ny);
    const clothMaterial = new THREE.MeshStandardMaterial({
      color: 0xb5af9c,
      transparent: true,
      opacity: 0.7,
    });

    this.clothMesh = new THREE.Mesh(this.clothGeometry, clothMaterial);
    this.clothMesh.castShadow = true;
    this.clothMesh.receiveShadow = true;
    return this.clothMesh;
  }

  generateParticles() {
    for (let i = 0; i < Nx + 1; i++) {
      this.particles.push([]);
      for (let j = 0; j < Ny + 1; j++) {
        const particle = new CANNON.Body({
          mass: j === Ny ? 0 : this.mass,
          shape: this.shape,
          position: new CANNON.Vec3(
            (i - Nx * 0.5) * this.dist + this.position.x,
            (j - Ny * 0.5) * this.dist + this.position.y,
            this.position.z
          ),
          velocity: new CANNON.Vec3(
            this.velocity.x * (Nx - i),
            this.velocity.y,
            this.velocity.z * (Ny - j)
          ),
        });
        this.particles[i].push(particle);
        this.world.addBody(particle);
      }
    }
  }

  connect(i1, j1, i2, j2) {
    this.world.addConstraint(
      new CANNON.DistanceConstraint(
        this.particles[i1][j1],
        this.particles[i2][j2],
        this.dist
      )
    );
  }

  connectParticles() {
    for (let i = 0; i < Nx + 1; i++) {
      for (let j = 0; j < Ny + 1; j++) {
        if (i < Nx) {
          this.connect(i, j, i + 1, j);
        }
        if (j < Ny) {
          this.connect(i, j, i, j + 1);
        }
      }
    }
  }

  updateParticles() {
    for (let i = 0; i < Nx + 1; i++) {
      for (let j = 0; j < Ny + 1; j++) {
        const index = j * (Nx + 1) + i;
        const positionAttribute = this.clothGeometry.attributes.position;
        const position = this.particles[i][Ny - j].position;
        positionAttribute.setXYZ(index, position.x, position.y, position.z);
        positionAttribute.needsUpdate = true;
      }
    }
  }
}
