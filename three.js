import * as THREE from "three";
import gsap from "gsap";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Ground } from "./elements/ground";
import Walls from "./elements/walls";
import Dust from "./elements/dust";
import Models from "./elements/models";
import Text from "./elements/text";
import Cloth from "./elements/cloth";
import * as CANNON from "cannon-es";

const entranceTrigger = document.getElementById("entrance-trigger");
const dayNightButton = document.getElementById("day-night");
const exitButton = document.getElementById("exit-website");
const website = document.getElementsByTagName("main")[0];
const scrollMe = document.querySelector(".scroll-me-tag");
const dayTimeIcon = document.getElementById("day-time-icon");
const loaderContainer = document.getElementById("loader");
const progressLoader = document.getElementById("loader-progress");
const loaderPercent = document.getElementById("loader-percent");

class Room {
  constructor() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.day = true;
    this.timeoutId = "";
    this.loaded = false;
    this.cameraPostion = { x: 280, y: 150, z: 280 };
    this.cameraPostionZoomed = { x: 220, y: 140, z: 220 };

    this.setCanvas();
    this.setScene();
    this.setWorld();
    this.setCameras();
    this.setRenderer();
    this.setLights();
    this.setGeometries();
    // this.setControls();
    this.eventListeners();
    // this.createGodRays();
    this.animations();
  }

  setCanvas() {
    this.canvas = document.querySelector(".webgl");
  }

  setScene() {
    this.scene = new THREE.Scene();
  }

  setWorld() {
    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.81, 0) });
  }

  setCameras() {
    this.boom = new THREE.Group();
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      3000
    );
    this.perspectiveCamera.position.set(
      this.cameraPostion.x,
      this.cameraPostion.y,
      this.cameraPostion.z
    );
    this.perspectiveCamera.lookAt(new THREE.Vector3(0, 60, 0));
    this.boom.add(this.perspectiveCamera);
    this.scene.add(this.boom);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.render(this.scene, this.perspectiveCamera);
  }

  setLights() {
    //hemilight
    this.hemiLight = new THREE.HemisphereLight(0x9bceff, 0xe2d891, 0.1);
    this.hemiLight.position.set(-30, 20, -35);
    this.scene.add(this.hemiLight);

    this.dirLight2 = new THREE.DirectionalLight(0xffffff, 0.1);
    this.dirLight2.position.set(150, 180, 300);
    this.dirLight2.castShadow = true;
    this.dirLight2.shadow.camera.left = -350;
    this.dirLight2.shadow.camera.top = 350;
    this.dirLight2.shadow.camera.right = 350;
    this.dirLight2.shadow.camera.bottom = -350;

    this.scene.add(this.dirLight2);

    //light for the godrays effect to work
    this.godRayLight = new THREE.DirectionalLight(0xffce47, 0);
    this.godRayLight.position.set(0, 130, -180);
    this.godRayLight.castShadow = true;
    this.godRayLight.shadow.camera.left = -50;
    this.godRayLight.shadow.camera.top = 50;
    this.godRayLight.shadow.camera.right = 50;
    this.godRayLight.shadow.camera.bottom = -50;
    // this.scene.add(this.godRayLight);

    //tv light
    RectAreaLightUniformsLib.init();
    this.tvLight = new THREE.RectAreaLight(0xffffff, 10, 100, 58);
    this.tvLight.position.set(67, 78, -117.5);
    this.tvLight.lookAt(67, 78, 90);
    this.tvLightHelper = new RectAreaLightHelper(this.tvLight);
    this.scene.add(this.tvLight, this.tvLightHelper);
  }

  setGeometries() {
    this.loadingManager = new THREE.LoadingManager();
    this.room = new THREE.Group();
    const groundClass = new Ground();
    const wallsClass = new Walls();
    const modelClass = new Models(this.room, this.loadingManager);
    const textClass = new Text(this.scene);
    this.clothClass1 = new Cloth(
      this.world,
      { x: 34, y: 118, z: -132 },
      { x: -0.1, y: 0.3, z: -0.01 }
    );
    this.clothClass2 = new Cloth(
      this.world,
      { x: -30, y: 118, z: -132 },
      { x: 0.4, y: 0.3, z: 0.01 }
    );

    this.loadingManager.onProgress = (url, progress, total) => {
      progressLoader.value = (progress / total) * 100;
      loaderPercent.style.paddingLeft = (progress / total) * 100 + "%";
      loaderPercent.innerText = Math.round((progress / total) * 100) + "%";
    };
    this.loadingManager.onLoad = () => {
      loaderContainer.style.opacity = 0;
      this.loaded = true;
      setTimeout(() => {
        loaderContainer.style.display = "none";
      }, 1000);
    };

    //floor
    this.ground = groundClass.createGround();
    this.ground.receiveShadow = true;

    //wall with a window
    this.windowWall = wallsClass.createWindowWall();

    //wall without a window
    this.normWall = wallsClass.createNormalWall();

    this.clothObject1 = this.clothClass1.createGeometry();
    this.clothObject2 = this.clothClass2.createGeometry();

    //dust particles effect
    // this.dustParticles = this.dustClass.generateDust();
    // this.scene.add(this.dustParticles);

    // loading all models
    modelClass.loadDesk();
    modelClass.loadPlant();
    modelClass.loadCurtains();
    modelClass.loadCarpet();
    modelClass.loadBookShelf();
    modelClass.loadGuitar();
    modelClass.loadSofa();
    modelClass.loadTV();
    modelClass.loadBooks();
    modelClass.loadBooks2();

    //create text on a wall
    textClass.createText();

    this.room.add(
      this.ground,
      this.windowWall,
      this.normWall,
      this.clothObject1,
      this.clothObject2
    );

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

      //zooming out of the tv when screen is to small
      if (this.isZoomedIn && this.sizes.width < 900)
        gsap.to(this.perspectiveCamera.position, { duration: 0.5, z: -80 });
      else if (this.isZoomedIn && this.sizes.width >= 900) {
        gsap.to(this.perspectiveCamera.position, { duration: 0.2, z: -25 });
      }
    };

    window.onmousemove = (e) => {
      if (this.isZooming) {
        return;
      }
      this.mouse = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    entranceTrigger.onclick = () => {
      entranceTrigger.style.display = "none";
      if (this.isZoomedIn) return;
      this.isZooming = true;
      this.isZoomedIn = true;
      clearTimeout(this.timeoutId);

      const forward = new THREE.Vector3(
        0,
        0,
        -this.perspectiveCamera.position.z
      ).applyQuaternion(this.perspectiveCamera.quaternion);

      const vector = new THREE.Vector3()
        .copy(this.perspectiveCamera.position)
        .add(forward);

      gsap.to(this.boom.rotation, {
        duration: 1,
        y: 0,
        z: 0,
      });

      gsap.to(this.perspectiveCamera.position, {
        duration: 1,
        x: 67,
        y: 78,
        z: window.innerWidth >= 900 ? -25 : -80,
        onComplete: () => {
          this.timeoutId = setTimeout(() => {
            const [x, y, z, _] = this.perspectiveCamera.position;
            const expectedZ = window.innerWidth >= 900 ? -25 : -80;
            // console.log(x,y,z)
            if (x !== 67 || y !== 78 || z != expectedZ) {
              this.perspectiveCamera.lookAt(0, 40, 0);
              this.isZoomedIn = false;
              website.style.display = "none";
              entranceTrigger.style.display = "block";
              exitButton.style.visibility = "hidden";
            }
            this.isZooming = false;
            // console.log(x,y,z)
          }, 100);
        },
      });

      gsap.to(vector, {
        duration: 1,
        x: 67,
        y: 78,
        z: -100,
        onUpdate: () => {
          this.perspectiveCamera.lookAt(vector);
        },
        onComplete: () => {
          website.style.display = "flex";
          website.style.opacity = 1;
          exitButton.style.visibility = "visible";
        },
      });
    };

    entranceTrigger.onmouseenter = () => {
      if (this.isZoomedIn) return;
      this.entranceTriggered = true;
      gsap.to(this.perspectiveCamera.position, {
        duration: 0.9,
        ...this.cameraPostionZoomed,
      });
    };

    entranceTrigger.onmouseleave = () => {
      if (this.isZoomedIn) return;
      this.entranceTriggered = false;
      gsap.to(this.perspectiveCamera.position, {
        duration: 1.8,
        ...this.cameraPostion,
      });
    };

    exitButton.onclick = () => {
      if (!this.isZoomedIn) return;
      website.style.display = "none";
      entranceTrigger.style.display = "block";
      exitButton.style.visibility = "hidden";
      gsap.to(".scroll-me-tag", { duration: 0.7, y: 0, opacity: 1 });

      this.isZoomedIn = false;
      const vector = new THREE.Vector3(67, 78, -100);
      gsap.to(this.perspectiveCamera.position, {
        duration: 1,
        ...this.cameraPostion,
      });

      gsap.to(vector, {
        duration: 1,
        x: 0,
        y: 40,
        z: 0,
        onUpdate: () => {
          this.perspectiveCamera.lookAt(vector);
        },
      });
    };

    // dayNightButton.onclick = () => {
    //   dayNightButton.classList.toggle("active", this.day);
    //   dayTimeIcon.classList.toggle("fa-sun", !this.day);
    //   dayTimeIcon.classList.toggle("fa-moon", this.day);
    //   this.day = !this.day;

    //   let hemiLightColor;
    //   let dirLightColor;

    //   if (this.day) {
    //     hemiLightColor = 0xffffff;
    //     this.hemiLight.intensity = 0.5;
    //     this.tvLight.intensity = 0.8;
    //     this.dirLight2.intensity = 2;
    //     dirLightColor = 0xffce47;

    //     // sceneColor =0x5fd4d8
    //   } else {
    //     hemiLightColor = 0x9bceff;
    //     this.hemiLight.intensity = 0.1;
    //     this.tvLight.intensity = 10;
    //     this.dirLight2.intensity = 0.5;
    //     dirLightColor = 0x9bceff;
    //   }

    //   this.hemiLight.color = new THREE.Color(hemiLightColor);
    //   this.dirLight.color = new THREE.Color(dirLightColor);
    //   this.dirLight2.color = new THREE.Color(dirLightColor);
    //   // this.scene.background = new THREE.Color(sceneColor)
    // };

    website.onscroll = () => {
      gsap.to(".scroll-me-tag", { duration: 0.5, y: -20, opacity: 0 });
    };
  }

  animations() {
    this.startTime = performance.now();
    this.flickerTimer = (Math.random() + 0.5) * 50;
    this.flicker = true;
    this.flickerCounter = 0;

    const timeStep = 1 / 60;

    const loop = () => {
      window.requestAnimationFrame(loop);
      // this.orbitControls.update();

      if (
        performance.now() - this.startTime > this.flickerTimer &&
        this.flickerCounter < 11 &&
        this.loaded
      ) {
        if (this.flicker) {
          this.tvLight.intensity = 10;
          this.scene.add(this.tvLightHelper);
        } else {
          this.tvLight.intensity = 0;
          this.scene.remove(this.tvLightHelper);
        }
        this.flicker = !this.flicker;
        this.flickerCounter++;
        this.startTime = performance.now();
      } else {
        this.flickerTimer = (Math.random() + 0.5) * 150;
      }

      if (this.mouse && !this.isZoomedIn) {
        //rotation
        gsap.to(this.boom.rotation, {
          duration: 0.5,
          y: (-Math.PI * (this.mouse.x - window.innerWidth / 2)) / 15000,
          z: (-Math.PI * (this.mouse.y - window.innerHeight / 2)) / 15000,
        });

        //camera movement
        if (!this.entranceTriggered)
          gsap.to(this.perspectiveCamera.position, {
            duration: 0.5,
            x: this.cameraPostion.x + this.mouse.x / 70,
            y: this.cameraPostion.y - this.mouse.y / 80,
            z: this.cameraPostion.z - this.mouse.x / 70,
          });
        else
          gsap.to(this.perspectiveCamera.position, {
            duration: 0.5,
            x: this.cameraPostionZoomed.x + this.mouse.x / 70,
            y: this.cameraPostionZoomed.y - this.mouse.y / 80,
            z: this.cameraPostionZoomed.z - this.mouse.x / 70,
          });
      }

      // this.dustClass.moveDust();
      this.clothClass1.updateParticles();
      this.clothClass2.updateParticles();
      this.world.step(timeStep);
      this.renderer.render(this.scene, this.perspectiveCamera);
    };

    loop();
  }
}

const story = new Room();
