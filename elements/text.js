import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export default class Text {
  constructor(scene) {
    this.scene = scene;
  }

  createText() {
    new FontLoader().load("./fonts/bold.json", (font) => {
      const text1Geo = new TextGeometry("HI, I'M ŁUKASZ, I AM A DEVELOPER", {
        font: font,
        size: 9,
        height: 2.5,
      });
      const text2Geo = new TextGeometry("WELCOME TO MY ROOM!", {
        font: font,
        size: 9,
        height: 2.5,
      });

      const textMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
      });
      const textSideMat = new THREE.MeshStandardMaterial({
        color: 0x474747,
      });

      this.text1 = new THREE.Mesh(text1Geo, [textMat, textSideMat]);
      this.text1.position.set(-135, 155, 120);
      this.text1.rotation.set(0, Math.PI / 2, 0);
      // this.text1.castShadow = true
      // this.text1.receiveShadow = true

      this.scene.add(this.text1);

      this.text2 = new THREE.Mesh(text2Geo, [textMat, textSideMat]);
      this.text2.position.set(-135, 130, 50);
      this.text2.rotation.set(0, Math.PI / 2, 0);
      // this.text2.castShadow = true
      // this.text2.receiveShadow = true

      this.scene.add(this.text2);
    });
  }
}
