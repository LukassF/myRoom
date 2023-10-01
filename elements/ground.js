import * as THREE from "three";

export class Ground {
  constructor() {}

  createGround() {
    const groundGeo = new THREE.BoxGeometry(300, 300, 10);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });

    this.ground = new THREE.Mesh(groundGeo, groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    return this.ground;
  }
}
