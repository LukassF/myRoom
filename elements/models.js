import * as THREE from "three";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "../node_modules/three/examples/jsm/loaders/FBXLoader";


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
    return this.loadModel("equipped_desk.glb", 70, new THREE.Vector3(-545,5,-35),-Math.PI/2);
  }

  loadPC(){
    return this.loadModel("computer.glb",20,new THREE.Vector3(0, 70, 0),-Math.PI/1.7)
  }

  loadChair() {
    return this.loadModel(
      "chair.fbx",
      0.33,
      new THREE.Vector3(-60, 5, -60),
      -Math.PI / 5
    );
  }

  loadBed() {
    return this.loadModel(
      "bed.glb",
      170,
      new THREE.Vector3(-20, 5, 50),
      Math.PI
    );
  }

  loadCarpet() {
    return this.loadModel(
      "carpet.glb",
      70,
      new THREE.Vector3(50, 5, 60),
      Math.PI / 15
    );
  }

  loadPlant(){
    return this.loadModel('plant.glb',20,new THREE.Vector3(-100,5,50))
  }

  loadCurtains(){
    return this.loadModel('curtains.glb',0.45,new THREE.Vector3(-90,48,-5),-Math.PI/2)
  }

  loadDogBed(){
    return this.loadModel('dogbed.glb',45, new THREE.Vector3(-80,4,110),3*Math.PI/7)
  }

  loadDog(){
    return this.loadModel('dog.glb',0.18,new THREE.Vector3(-80,15,110),Math.PI)
  }

  loadPoster(){
    for(let i = 0 ; i<5;i++){
     this.loadModel('poster.glb',52,new THREE.Vector3(-140,155,100 -48 * i), -Math.PI/2)
    }
  }
}
