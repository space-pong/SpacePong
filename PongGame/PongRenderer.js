import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'

export class PongRenderer {
  constructor() {

  }

  async init(canvasID, pongGame) {
    
    // 캔버스 얻기
    this.canvas = document.getElementById(canvasID);

    // 퐁게임 참조 저장
    this.pongGameInstance = pongGame;

    // 그래픽 에셋 로더
    this.gltfLoader = new GLTFLoader();
    this.rgbeLoader = new RGBELoader();

    // 씬
    this.scene = new THREE.Scene();

    // 카메라
    this.camera = new THREE.PerspectiveCamera(
      90,   // 시야각
      window.innerWidth / window.innerHeight, // 화면비율
      0.1,  // 최소 렌더링 거리
      1000  // 최대 렌더링 거리
    )
    this.camera.position.set(0, 40, 95);
    this.camera.lookAt(new THREE.Vector3(0, 0, 35));
    this.rotationCenter = new THREE.Object3D();
    this.rotationCenter.add(this.camera);
    this.scene.add(this.rotationCenter);

    // 렌더러
    this.renderer  = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      precision: "highp",
      powerPreference: "high-performance"
    });
    this.renderer.autoClear = false;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 2.0;
    document.body.appendChild(this.renderer.domElement);

    // 포스트 프로세싱
    this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.pmremGenerator.compileEquirectangularShader();

    // 오디오 로더, 오디오 리스너
    this.audioLoader = new THREE.AudioLoader();
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);

    // 배경 맵 (environment, background)
    this.rgbeLoader.load("./assets/hdri/Nebula3_t.hdr", (texture) => {
      this.envMap = this.pmremGenerator.fromEquirectangular(texture).texture;
      this.scene.background = this.envMap;
      this.scene.environment = this.envMap;
      this.scene.backgroundBlurriness = 0.03;
      this.scene.backgroundRotation.set(3, 0, 0);
      this.scene.environmentRotation.set(3, 0, 0);
      texture.dispose();
    });

    // 앰비언트 라이트
    this.ambientLight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(this.ambientLight);
    
    // 배경 음악
    this.bgmSound = new THREE.Audio(this.listener);
    this.audioLoader.load("./assets/sound/bgm.mp3", (buffer) => {
      this.bgmSound.setBuffer(buffer);
      this.bgmSound.setLoop(true);
      this.bgmSound.setVolume(0);
      this.bgmSound.offset = 120;
      this.bgmSound.play();
      function fadeInAudio(audio, duration) {
        const initialVolume = 0.0;
        const targetVolume = 0.5;
        const step = (targetVolume - initialVolume) / (duration / 100);
        let currentVolume = initialVolume;
        function increaseVolume() {
          currentVolume = Math.min(currentVolume + step, targetVolume);
          audio.setVolume(currentVolume);
          if (currentVolume < targetVolume) {
            setTimeout(increaseVolume, 100);
          }
        }
        increaseVolume();
      }
      fadeInAudio(this.bgmSound, 2000);
    });

    // 충격 효과음
    this.strikeSound = new THREE.Audio(this.listener);
    this.audioLoader.load("./assets/sound/strike-sound.mp3", (buffer) => {
      this.strikeSound.setBuffer(buffer);
      this.strikeSound.setLoop(false);
      this.strikeSound.setVolume(0.2);
    });

    // 공
    const ballGeometry = new THREE.SphereGeometry( 2, 16, 16 ); 
    const ballMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0,
      metalness: 1,
    });
    this.ball = new THREE.Mesh( ballGeometry, ballMaterial );
    this.scene.add(this.ball);

    // 플레이어1 기체
    await this.setPlayer1UnitDefault();

    // 플레이어2 기체
    await this.setPlayer2UnitDefault();
    


    this.animate = this.animate.bind(this);
    
  }

  loadGltfModel(url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(url, (gltf) => {
        resolve(gltf);
      }, undefined, (error) => {
        reject(error);
      });
    });
  }

  async setPlayer1UnitDefault() {
    try {
      const gltf = await this.loadGltfModel("./assets/glb/sabre.glb");
      this.player1Unit = gltf.scene;
      this.player1Unit.position.set(0, 0, 80);
      this.player1Unit.rotation.set(Math.PI * -0.2, 0, 0);
      this.player1Unit.scale.set(6, 4, 4);
      this.player1Unit.traverse(function(child) {
        if (child.isMesh) {
          if (child.material) {
            child.material.metalness = 1.0;
            child.material.roughness = 0.0;
            child.material.needsUpdate = true;
          }
        }
      });
      const thrustLight = new THREE.PointLight(0xff0000, 10000, 100);
      thrustLight.position.set(0, 6, -2); // 부모 객체의 로컬 좌표계 기준으로 위치 설정
      this.player1Unit.add(thrustLight);
      this.scene.add(this.player1Unit);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  }

  async setPlayer2UnitDefault() {
    try {
      const gltf = await this.loadGltfModel("./assets/glb/sabre.glb");
      this.player2Unit = gltf.scene;
      this.player2Unit.position.set(0, 0, -80);
      this.player2Unit.rotation.set(Math.PI * +0.2, Math.PI, 0);
      this.player2Unit.scale.set(6, 4, 4);
      this.player2Unit.traverse(function(child) {
        if (child.isMesh) {
          if (child.material) {
            child.material.metalness = 1.0;
            child.material.roughness = 0.0;
            child.material.needsUpdate = true;
          }
        }
      });
      const thrustLight = new THREE.PointLight(0xff0000, 10000, 100);
      thrustLight.position.set(0, 6, -2); // 부모 객체의 로컬 좌표계 기준으로 위치 설정
      this.player2Unit.add(thrustLight);
      this.scene.add(this.player2Unit);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  }

  setPlayer1UnitZerg() {
    this.player1Unit = null;
  }

  setPlayer2UnitZerg() {

  }

  setPlayer1UnitTerran() {

  }

  setPlayer2UnitTerran() {

  }

  setPlayer1UnitProtoss() {

  }

  setPlayer2UnitProtoss() {

  }

  setTopView() {
    this.camera.position.set(0, 100, 0);
    this.camera.lookAt(new THREE.Vector3(0,0,0));
  }

  animate() {
    requestAnimationFrame(this.animate);
    const rotationSpeed = -0.01;
    this.scene.environmentRotation.z += rotationSpeed;
    this.scene.backgroundRotation.z += rotationSpeed;
    this.pongGameInstance.update();
    this.player1Unit.position.x = this.pongGameInstance.player1.position.x;
    this.player2Unit.position.x = this.pongGameInstance.player2.position.x;
    this.renderer.render(this.scene, this.camera);
  }
}
