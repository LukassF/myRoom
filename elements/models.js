import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';

export default class Models {
  constructor(scene,loadingManager) {
    this.scene = scene;
    this.loadingManager = loadingManager
  }

  loadModel(url, scale, position, rotationY,rotationX,rotationZ) {
    let loader;
    const objectType = url.split(".").pop();
    if (objectType === "gltf" || objectType === "glb")
      loader = new GLTFLoader(this.loadingManager);
    else if (objectType === "fbx") loader = new FBXLoader(this.loadingManager);

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
      if(rotationX) element.rotation.x = rotationX
      if(rotationZ) element.rotation.z = rotationZ
      this.scene.add(element);
    });

 
  }

  loadDesk() {
    this.loadModel("desk.glb", 70, new THREE.Vector3(-155,5,-345),-Math.PI);
  }

  loadCarpet() {
    return this.loadModel(
      "carpet.glb",
      75,
      new THREE.Vector3(60,3,-20)
    );
  }

  loadPlant(){
    return this.loadModel('plant.glb',10,new THREE.Vector3(135,5,-120), Math.PI/2)
  }

  loadCurtains(){
    return this.loadModel('curtains.glb',25,new THREE.Vector3(8,70,-124),)
  }


  loadBookShelf(){
    this.loadModel('bookshelf.glb',1.4,new THREE.Vector3(-125,58,105),-Math.PI/2)
  }

  loadGuitar(){
    this.loadModel('guitar.glb',20,new THREE.Vector3(-85,63,70),4*Math.PI/6,-Math.PI/15)
  }

  loadSofa(){
    this.loadModel('sofa.glb',87,new THREE.Vector3(50,35,100),-Math.PI)
  }

  loadTV(){
    this.loadModel('tvstand.glb',25,new THREE.Vector3(222,5,173))
    this.loadModel('tv.glb',7,new THREE.Vector3(67,39,-120))
  }

  loadBooks(){
    this.loadModel('books.glb',1.1,new THREE.Vector3(-120,121,80),Math.PI/2)
  }

  loadBooks2(){
    this.loadModel('books2.glb',70,new THREE.Vector3(-120,111,120),Math.PI/2)
  }

}
