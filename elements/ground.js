import * as THREE from "three";

export class Ground {
  constructor() {}

  createGround() {
    const woodTex = this.loadTexture()
    const groundGeo = new THREE.BoxGeometry(300, 300, 10);
    const groundMat = new THREE.MeshLambertMaterial({
      map:woodTex,
    });

    this.ground = new THREE.Mesh(groundGeo, groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    return this.ground;
  }

  loadTexture(){
    const loader = new THREE.TextureLoader()
    const wood = loader.load('../assets/woodfloor.jpg')
    wood.wrapS = wood.wrapS = THREE.RepeatWrapping
    wood.repeat.set(1,1)

    return wood
  }
}
