import * as THREE from "three";

export default class Walls {
  constructor() {}

  createWindowWall() {
    const wallShape = new THREE.Shape();
    wallShape.moveTo(0, 0);
    wallShape.lineTo(0, 200);
    wallShape.lineTo(300, 200);
    wallShape.lineTo(300, 0);
    wallShape.lineTo(0, 0);

    const holeShape1 = new THREE.Path();
    holeShape1.moveTo(110, 127.5);
    holeShape1.lineTo(110, 160);
    holeShape1.lineTo(147.5, 160);
    holeShape1.lineTo(147.5, 127.5);
    holeShape1.lineTo(110, 127.5);

    const holeShape2 = new THREE.Path();
    holeShape2.moveTo(152.5, 127.5);
    holeShape2.lineTo(152.5, 160);
    holeShape2.lineTo(190, 160);
    holeShape2.lineTo(190, 127.5);
    holeShape2.lineTo(152.5, 127.5);

    const holeShape3 = new THREE.Path();
    holeShape3.moveTo(110, 90);
    holeShape3.lineTo(110, 122.5);
    holeShape3.lineTo(147.5, 122.5);
    holeShape3.lineTo(147.5, 90);
    holeShape3.lineTo(110, 90);

    const holeShape4 = new THREE.Path();
    holeShape4.moveTo(152.5, 90);
    holeShape4.lineTo(152.5, 122.5);
    holeShape4.lineTo(190, 122.5);
    holeShape4.lineTo(190, 90);
    holeShape4.lineTo(152.5, 90);

    wallShape.holes = [holeShape1, holeShape2, holeShape3, holeShape4];

    const extrudeSettings = {
      depth: 10,
    };

    const wallGeo = new THREE.ExtrudeGeometry(wallShape, extrudeSettings);
    this.windowWall = new THREE.Mesh(
      wallGeo,
      new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
    );
    this.windowWall.position.x = -150;
    this.windowWall.position.z = -150;

    this.windowWall.castShadow = true;
    this.windowWall.receiveShadow = true;

    return this.windowWall;
  }

  createNormalWall() {
    const normWallGeo = new THREE.BoxGeometry(300, 200, 10);
    const normWallMat = new THREE.MeshStandardMaterial();

    this.normWall = new THREE.Mesh(normWallGeo, normWallMat);
    this.normWall.rotation.y = -Math.PI / 2;
    this.normWall.position.x = -145;
    this.normWall.position.y = 100;

    this.normWall.receiveShadow = true;
    this.normWall.castShadow = true;

    return this.normWall;
  }
}
