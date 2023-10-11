import * as THREE from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default class Text{
    constructor(scene){
        this.scene = scene
    }

    createText(){
        new FontLoader().load('./fonts/bold.json',(font) => {
            const text1Geo = new TextGeometry("Hi, I'm Łukasz, I'm a developer.",{
              font:font,
              size:9,
              height:2.5
            })
            const text2Geo = new TextGeometry("Welcome to my room!",{
              font:font,
              size:9,
              height:2.5
            })
      
            const textMat = new THREE.MeshStandardMaterial({
              color:0x7e895f,
            })
            const textSideMat =  new THREE.MeshStandardMaterial({
                color:0x7e895f,
                emissive:0xc9c9c9,
                emissiveIntensity:0.3
              })
      
            this.text1 = new THREE.Mesh(text1Geo,[textMat,textSideMat])
            this.text1.position.set(-135,150,120)
            this.text1.rotation.set(0,Math.PI/2,0)
            // this.text1.castShadow = true
            // this.text1.receiveShadow = true
      
            this.scene.add(this.text1)
      
            this.text2 = new THREE.Mesh(text2Geo,[textMat,textSideMat])
            this.text2.position.set(-135,130,50)
            this.text2.rotation.set(0,Math.PI/2,0)
            // this.text2.castShadow = true
            // this.text2.receiveShadow = true
      
            this.scene.add(this.text2)
          })
    }
}