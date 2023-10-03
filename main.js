import * as THREE from "three";
import gsap from 'gsap'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Ground } from "./elements/ground";
import Walls from "./elements/walls";
import { GodraysPass } from "three-good-godrays";
import { EffectComposer, RenderPass } from "postprocessing";
import Dust from "./elements/dust";
import Models from "./elements/models";
// import groundVertex from "./shaders/ground_vertex.glsl";
// import groundFragment from "./shaders/ground_fragment.glsl";
// import Rocks from "./elements/rocks";

// console.log(groundFragment);

class Room {
  constructor() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.projectsButton = document.getElementById('projects-button')
    this.dayNightButton =  document.getElementById('day-night')
    this.projectIdx = 0
    this.day = true

    this.setCanvas();
    this.setScene();
    this.setCameras();
    this.setRenderer();
    this.setLights();
    this.setGeometries();
    // this.setControls();
    this.eventListeners();
    this.createGodRays();
    this.animations();
  }

  setCanvas() {
    this.canvas = document.querySelector(".webgl");
  }

  setScene() {
    this.scene = new THREE.Scene();
    // this.scene.background=new
  }

  setCameras() {
    // this.boom = new THREE.Group()
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      3000
    );
    this.perspectiveCamera.position.z = 320;
    this.perspectiveCamera.position.y = 260;
    this.perspectiveCamera.position.x = 320;
    this.perspectiveCamera.lookAt(new THREE.Vector3(0,40,0))
    // this.boom.add(this.perspectiveCamera)
    this.scene.add(this.perspectiveCamera)
    
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.render(this.scene, this.perspectiveCamera);
  }

  setLights() {
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2d891, 2.1);
    this.hemiLight.position.set(-30, 20, -35);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xffce47, 4);
    this.dirLight.position.set(0, 200, -300);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.camera.left = -250;
    this.dirLight.shadow.camera.top = 250;
    this.dirLight.shadow.camera.right = 250;
    this.dirLight.shadow.camera.bottom = -250;

    this.scene.add(this.dirLight);

    this.godRayLight = new THREE.DirectionalLight(0xffce47, 0);
    this.godRayLight.position.set(0, 130, -180);
    this.godRayLight.castShadow = true;
    this.godRayLight.shadow.camera.left = -50;
    this.godRayLight.shadow.camera.top = 50;
    this.godRayLight.shadow.camera.right = 50;
    this.godRayLight.shadow.camera.bottom = -50;
    this.scene.add(this.godRayLight);

//     this.tvLight = new THREE.DirectionalLight(0xffffff,10)
//     this.tvLight.position.set(-100,100,0)
//     this.tvLight.target.position.set(0,80,0)
// this.tvLight.castShadow = true
// this.tvLight.shadow.camera.left = -250;
// this.tvLight.shadow.camera.top = 250;
// this.tvLight.shadow.camera.right = 250;
// this.tvLight.shadow.camera.bottom = -250;
//     const helper = new THREE.DirectionalLightHelper(this.tvLight)
//     this.scene.add(this.tvLight,helper)
  }

  setGeometries() {
    const groundClass = new Ground();
    this.ground = groundClass.createGround();
    this.ground.receiveShadow = true;
    // this.scene.add(this.ground);

    const wallsClass = new Walls();
    this.windowWall = wallsClass.createWindowWall();

    // this.scene.add(this.windowWall);

    this.normWall = wallsClass.createNormalWall();

    this.dustClass = new Dust();
    this.dustParticles = this.dustClass.generateDust();
    this.scene.add(this.dustParticles);

    this.room = new THREE.Group();

    const modelClass = new Models(this.room);
    modelClass.loadDesk();
    modelClass.loadPlant()
    modelClass.loadCurtains()
    modelClass.loadCarpet();
    modelClass.loadPoster()
    modelClass.loadBookShelf()
    modelClass.loadGuitar()
    modelClass.loadSofa()
    modelClass.loadTV()

   
    this.room.add(this.ground, this.windowWall, this.normWall);

    this.scene.add(this.room);
  }

  setControls() {
    this.orbitControls = new OrbitControls(this.perspectiveCamera, this.canvas);
    this.orbitControls.enableDamping = true;
    this.orbitControls.enablePan = false;
  }

  eventListeners() {
    window.onresize = () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      this.perspectiveCamera.aspect = this.sizes.width / this.sizes.height;
      this.perspectiveCamera.updateProjectionMatrix();
      this.renderer.setSize(this.sizes.width, this.sizes.height);
    };

    window.onmousemove = (e) => {
      this.mouse = {
        x:e.clientX,
        y:e.clientY
      }
    }

    this.projectsButton.onclick = () => {
      const forward = new THREE.Vector3(0, 0, this.projectIdx > 3 ? this.perspectiveCamera.position.z : -this.perspectiveCamera.position.z).applyQuaternion(this.perspectiveCamera.quaternion); 
      const vector = new THREE.Vector3().copy(this.perspectiveCamera.position).add(forward);
      gsap.to(this.perspectiveCamera.position,{duration:1,x:-85,y:155,z:100 - this.projectIdx*48})
      gsap.to(vector,{duration:1,x:-300,y:155,z:100 - this.projectIdx*48, onUpdate:()=>{
        this.perspectiveCamera.lookAt(vector)
      }})
      this.projectIdx ++;
    }

    this.dayNightButton.onclick = () => {
      this.day = !this.day
      let hemiLightColor;
      let dirLightColor;
      let godRaysColor;

      if(this.day){
        hemiLightColor = 0xffffff
        dirLightColor = 0xffce47
        godRaysColor = 0xffe59e
      }else{
        hemiLightColor = 0x9bceff
        dirLightColor = 0x9bceff
        godRaysColor =  0xdbf1ff
      }



      this.hemiLight.color = new THREE.Color(hemiLightColor)
      this.dirLight.color = new THREE.Color(dirLightColor)

      this.godraysPass = new GodraysPass(
        this.godRayLight,
        this.perspectiveCamera,
        {
          color: godRaysColor,
          density: 0.03,
          distanceAttenuation: 4,
        }
      );
      this.composer.passes.pop()
      this.composer.addPass(this.godraysPass);
      this.godraysPass.renderToScreen = true;
    }
  }

  createGodRays() {
    this.composer = new EffectComposer(this.renderer);

    const renderPass = new RenderPass(this.scene, this.perspectiveCamera);
    renderPass.renderToScreen = false;
    this.composer.addPass(renderPass);

    this.godraysPass = new GodraysPass(
      this.godRayLight,
      this.perspectiveCamera,
      {
        color: 0xffe59e,
        density: 0.03,
        distanceAttenuation: 4,
      }
    );
    this.godraysPass.renderToScreen = true;
    this.composer.addPass(this.godraysPass);
  }

  animations() {
    const loop = () => {
      window.requestAnimationFrame(loop);
      // this.orbitControls.update();

      if(this.mouse && !this.projectIdx){

        this.perspectiveCamera.position.y = 260 - this.mouse.y/80
        this.perspectiveCamera.position.x = 320 - this.mouse.x/70
        this.perspectiveCamera.position.z = 320 + this.mouse.x/70
        // this.perspectiveCamera.lookAt(0,this.mouse.y/10 + 20,0)
      // this.perspectiveCamera.position.y = this.mouse.y 
    // this.perspectiveCamera.position.z = this.mouse.x
      }
      this.dustClass.moveDust();
      // console.log(this.dustParticles.geometry.attributes.velocity.array);

      this.composer.render();
      // this.renderer.render(this.scene, this.perspectiveCamera);
    };

    loop();
  }
}

const story = new Room();
