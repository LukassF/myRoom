import * as THREE from "three";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "../node_modules/three/examples/jsm/loaders/FBXLoader";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

export default class Models {
  constructor(scene) {
    this.scene = scene;
  }

  loadModel(url, scale, position, rotationY) {
    let loader;
    const objectType = url.split(".").pop();
    if (objectType === "gltf" || objectType === "glb")
      loader = new GLTFLoader();
    else if (objectType === "fbx") loader = new FBXLoader();

    loader.load(`../assets/${url}`, (el) => {
      let element;
      if (objectType === "fbx") element = el;
      else if (objectType === "gltf" || objectType === "glb")
        element = el.scene;

      element.scale.setScalar(scale);
      element.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      element.position.copy(position);
      if (rotationY) element.rotation.y = rotationY;
      this.scene.add(element);
    });
  }

  loadDesk() {
    return this.loadModel("desk.fbx", 0.17, new THREE.Vector3(-130, 5, -60));
  }

  loadChair() {
    return this.loadModel(
      "chair.fbx",
      0.33,
      new THREE.Vector3(-70, 5, -80),
      Math.PI / 5
    );
  }

  loadBed() {
    return this.loadModel(
      "messy_bed.glb",
      0.85,
      new THREE.Vector3(90, 5, -45)
      // Math.PI / 5
    );
  }

  // loadBedSide() {
  //   return this.loadModel(
  //     "bedside.glb",
  //     0.7,
  //     new THREE.Vector3(35, 5, -110),
  //     Math.PI
  //   );
  // }

  loadCarpet() {
    return this.loadModel(
      "carpet.glb",
      2.1,
      new THREE.Vector3(0, -13, 40),
      Math.PI / 15
    );
  }
}
