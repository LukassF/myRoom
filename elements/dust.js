import * as THREE from "three";

export default class Dust {
  constructor() {
    this.dustQuantity = 300;
  }

  generateDust() {
    const dustGeo = new THREE.BufferGeometry();
    const dustMat = new THREE.PointsMaterial({
      size: 0.8,
      color: 0xeaeaea,
      transparent: true,
      //   blending: THREE.AdditiveBlending,
      // map: new THREE.TextureLoader().load("../assets/rock.jpg"),
    });

    const dustParticles = [];
    const dustVelocities = [];

    for (let i = 0; i < this.dustQuantity; i++) {
      const x = Math.random() * 86 - 43;
      const z = Math.random() * 220 - 150;
      const y = Math.random() * 80 - z / 1.5;

      dustParticles.push(x, y, z);

      const xVel = Math.random() * 0.1;
      const yVel = Math.random() * 0.1;
      const zVel = Math.random() * 0.1;

      dustVelocities.push(xVel, yVel, zVel);
    }

    dustGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(dustParticles, 3)
    );
    dustGeo.setAttribute(
      "velocity",
      new THREE.Float32BufferAttribute(dustVelocities, 3)
    );

    this.dustParticles = new THREE.Points(dustGeo, dustMat);

    return this.dustParticles;
  }

  moveDust() {
    for (let i = 0; i < this.dustQuantity * 3; i += 3) {
      this.dustParticles.geometry.attributes.position.array[i] -=
        this.dustParticles.geometry.attributes.velocity.array[i];

      this.dustParticles.geometry.attributes.position.array[i + 1] -=
        this.dustParticles.geometry.attributes.velocity.array[i + 1];

      this.dustParticles.geometry.attributes.position.array[i + 2] -=
        this.dustParticles.geometry.attributes.velocity.array[i + 2];

      const x = this.dustParticles.geometry.attributes.position.array[i];
      const y = this.dustParticles.geometry.attributes.position.array[i + 1];
      const z = this.dustParticles.geometry.attributes.position.array[i + 2];

      if (x < -43 || x > 43)
        this.dustParticles.geometry.attributes.position.array[i] =
          Math.random() * 86 - 43;

      if (y < -z / 1.5 || y > 80 - z / 1.5)
        this.dustParticles.geometry.attributes.position.array[i + 1] =
          Math.random() * 90 - z / 1.5;

      if (z < -140 || z > 80)
        this.dustParticles.geometry.attributes.position.array[i + 2] =
          Math.random() * 220 - 150;
    }

    this.dustParticles.geometry.attributes.position.needsUpdate = true;
  }
}
