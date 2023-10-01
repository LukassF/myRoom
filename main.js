import * as THREE from "three";
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

    this.setCanvas();
    this.setScene();
    this.setCameras();
    this.setRenderer();
    this.setLights();
    this.setGeometries();
    this.setControls();
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
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      3000
    );
    this.perspectiveCamera.position.z = 400;
    this.perspectiveCamera.position.y = 400;
    this.perspectiveCamera.position.x = 400;
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
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2d891, 1.8);
    this.hemiLight.position.set(0, 60, -40);
    this.scene.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xffce47, 2);
    this.dirLight.position.set(0, 200, -300);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.camera.left = -250;
    this.dirLight.shadow.camera.top = 250;
    this.dirLight.shadow.camera.right = 250;
    this.dirLight.shadow.camera.bottom = -250;

    // const helper = new THREE.DirectionalLightHelper(this.dirLight, 40);

    this.scene.add(this.dirLight);
    // this.scene.add(helper);

    this.godRayLight = new THREE.DirectionalLight(0xffce47, 0);
    this.godRayLight.position.set(0, 130, -180);
    // this.godRayLight.target.position.z = 80;
    this.godRayLight.castShadow = true;
    this.godRayLight.shadow.camera.left = -50;
    this.godRayLight.shadow.camera.top = 50;
    this.godRayLight.shadow.camera.right = 50;
    this.godRayLight.shadow.camera.bottom = -50;
    // const helper2 = new THREE.DirectionalLightHelper(this.godRayLight, 40);
    this.scene.add(this.godRayLight);
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

    const modelClass = new Models(this.scene);
    modelClass.loadDesk();
    modelClass.loadChair();
    modelClass.loadBed();
    modelClass.loadCarpet();
    // modelClass.loadBedSide();

    // this.scene.add(this.normWall);

    this.room = new THREE.Group();
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
      this.orbitControls.update();

      this.dustClass.moveDust();
      // console.log(this.dustParticles.geometry.attributes.velocity.array);

      this.composer.render();
      // this.renderer.render(this.scene, this.perspectiveCamera);
    };

    loop();
  }
}

const story = new Room();
