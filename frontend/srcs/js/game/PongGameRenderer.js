import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'


export class PongGameRenderer {
  constructor() {

  }

  async init(divID, pongGame, player1Skin, player2Skin) {

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
    this.camera.position.set(0, 40, 100);
    this.camera.lookAt(new THREE.Vector3(0, 0, 35));
    this.rotationCenter = new THREE.Object3D();
    this.rotationCenter.add(this.camera);
    this.scene.add(this.rotationCenter);

    // 렌더러
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      precision: "lowp",
      powerPreference: "high-performance"
    });
    this.renderer.autoClear = false;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 2.0;
    document.getElementById(divID).appendChild(this.renderer.domElement);

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
      //this.scene.backgroundBlurriness = 0.03;
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
        const targetVolume = 0.3;
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
    const ballGeometry = new THREE.SphereGeometry(2, 16, 16);
    const ballMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0,
      metalness: 1,
    });
    this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
    this.scene.add(this.ball);

    // 플레이어 기체
    if (player1Skin == "Default") {
      await this.setPlayer1UnitDefault();
    } else if (player1Skin == "Zerg") {
      await this.setPlayer1UnitZerg();
    }
    
    if (player2Skin == "Default") {
      await this.setPlayer2UnitDefault();
    } else if (player2Skin == "Zerg") {
      await this.setPlayer2UnitZerg();
    }


    

    // 양 옆 가이드라인
    try {
      const gltf = await this.loadGltfModel("./assets/glb/cradle.glb");
      this.wallLeft = gltf.scene;
      this.wallLeft.position.set(85, 0, -20);
      this.wallLeft.scale.set(2, 3.5, 3);
      this.wallLeft.traverse(function (child) {
        if (child.isMesh) {
          if (child.material) {
            child.material.metalness = 1.0;
            child.material.roughness = 0.3;
            child.material.needsUpdate = true;
          }
        }
      });
      this.scene.add(this.wallLeft);
      this.wallRight = this.wallLeft.clone();
      this.wallRight.position.set(-85, 0, -20);
      this.scene.add(this.wallRight);
    } catch (error) {
      console.error('Error loading model:', error);
    }

    // 우주 정거장
    try {
      const gltf = await this.loadGltfModel("./assets/glb/space-station.glb");
      this.spaceStation = gltf.scene;
      this.spaceStation.position.set(0, 10, -500);
      this.spaceStation.rotation.set(0, 0, 0);
      const size = 20;
      this.spaceStation.scale.set(size * 1.2, size, size);
      this.spaceStation.traverse(function (child) {
        if (child.isMesh) {
          if (child.material) {
            child.material.metalness = 0.8;
            child.material.roughness = 0.7;
            child.material.needsUpdate = true;
          }
        }
      });
      this.scene.add(this.spaceStation);
    } catch (error) {
      console.error('Error loading model:', error);
    }




    // 함수 바인드
    this.animate = this.animate.bind(this);
    this.resizeListener = this.resizeListener.bind(this);
    // 리사이즈 리스너
    window.addEventListener('resize', this.resizeListener);

    // 시계
    this.clock  = new THREE.Clock();
  }

  resizeListener() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // 함수: gltf모델 로드, 프로미스 리턴
  loadGltfModel(url) {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(url, (gltf) => {
        resolve(gltf);
      }, undefined, (error) => {
        reject(error);
      });
    });
  }

  // 함수: 기본 유닛 모델 설정
  async setPlayer1UnitDefault() {
    try {
      const gltf = await this.loadGltfModel("./assets/glb/sabre.glb");
      this.player1Unit = gltf.scene;
      this.player1Unit.position.set(0, 0, 80);
      this.player1Unit.rotation.set(Math.PI * -0.2, 0, 0);
      this.player1Unit.scale.set(6, 4, 4);
      this.player1Unit.traverse(function (child) {
        if (child.isMesh) {
          if (child.material) {
            child.material.metalness = 1.0;
            child.material.roughness = 0.1;
            child.material.needsUpdate = true;
          }
        }
      });
      this.player1UnitMixer = null;
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
      this.player2Unit.traverse(function (child) {
        if (child.isMesh) {
          if (child.material) {
            child.material.metalness = 1.0;
            child.material.roughness = 0.0;
            child.material.needsUpdate = true;
          }
        }
      });
      this.player1UnitMixer = null;
      const thrustLight = new THREE.PointLight(0xff0000, 10000, 100);
      thrustLight.position.set(0, 6, -2); // 부모 객체의 로컬 좌표계 기준으로 위치 설정
      this.player2Unit.add(thrustLight);
      this.scene.add(this.player2Unit);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  }

  async setPlayer1UnitZerg() {
    try {
      const gltf = await this.loadGltfModel("./assets/glb/mutalisk.glb");
      this.player1Unit = gltf.scene;
      this.player1Unit.position.set(0, 0, 80);
      this.player1Unit.scale.set(8, 8, 8);
      this.player1Unit.traverse(function (child) {
        if (child.isMesh) {
          if (child.material) {
            child.material.metalness = 0.7;
            child.material.roughness = 0.2;
            child.material.needsUpdate = true;
          }
        }
      });
      this.player1UnitMixer = new THREE.AnimationMixer(gltf.scene);
      const action = this.player1UnitMixer.clipAction(gltf.animations[1]);
      action.timeScale = 1;
      action.play();
      const pLight = new THREE.PointLight(0xff0000, 800, 100);
      pLight.position.set(0, -10 / this.player1Unit.scale.x, -10 / this.player1Unit.scale.x);
      this.player1Unit.add(pLight);
      this.scene.add(this.player1Unit);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  }

  async setPlayer2UnitZerg() {
    try {
      const gltf = await this.loadGltfModel("./assets/glb/mutalisk.glb");
      this.player2Unit = gltf.scene;
      this.player2Unit.position.set(0, 0, -80);
      this.player2Unit.scale.set(8, 8, 8);
      this.player2Unit.rotation.set(0, Math.PI, 0);
      this.player2Unit.traverse(function (child) {
        if (child.isMesh) {
          if (child.material) {
            child.material.metalness = 0.7;
            child.material.roughness = 0.2;
            child.material.needsUpdate = true;
          }
        }
      });
      this.player2UnitMixer = new THREE.AnimationMixer(gltf.scene);
      const action = this.player2UnitMixer.clipAction(gltf.animations[1]);
      action.timeScale = 1;
      action.play();
      const pLight = new THREE.PointLight(0xff0000, 800, 100);
      pLight.position.set(0, -10 / this.player2Unit.scale.x, -10 / this.player2Unit.scale.x);
      this.player2Unit.add(pLight);
      this.scene.add(this.player2Unit);
    } catch (error) {
      console.error('Error loading model:', error);
    }
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
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  tiltZ(object, targetRotationZ) {
    if (targetRotationZ == object.rotation.z) {
      return;
    } else {
      if (targetRotationZ > object.rotation.z) {
        object.rotation.z += 0.04;
        if (object.rotation.y > targetRotationZ) {
          object.rotation.z = targetRotationZ;
        }
      } else if (targetRotationZ < object.rotation.z) {
        object.rotation.z -= 0.04;
        if (object.rotation.z < targetRotationZ) {
          object.rotation.z = targetRotationZ;
        }
      }
    }
  }

  shakeCamera(camera, duration = 100, intensity = 0.05) {
    const startTime = Date.now();
    const originalPosition = camera.position.clone();
    function shake() {
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < duration) {
        const progress = elapsedTime / duration;
        const xShake = (Math.random() - 0.5) * intensity * (1 - progress);
        const yShake = (Math.random() - 0.5) * intensity * (1 - progress);
        camera.position.x = originalPosition.x + xShake;
        camera.position.y = originalPosition.y + yShake;
        requestAnimationFrame(shake);
      } else {
        camera.position.copy(originalPosition); // 흔들림 종료 후 원래 위치로 복귀
      }
    }
    shake();
  }

  animateEnvironments() {
    const rotationSpeed = (Math.abs(this.pongGameInstance.ball.velocity.z) / 1.8) / 100;
    this.scene.environmentRotation.z += rotationSpeed;
    this.scene.backgroundRotation.z += rotationSpeed;
    this.spaceStation.rotation.y += 0.01;
  }

  animateGame() {
    // 기체 위치 반영
    this.player1Unit.position.x = this.pongGameInstance.player1.position.x;
    this.player2Unit.position.x = this.pongGameInstance.player2.position.x;

    // 공 위치 반영
    this.ball.position.x = this.pongGameInstance.ball.position.x;
    this.ball.position.z = this.pongGameInstance.ball.position.z;

    // 컨트롤러 입력값을 기반으로 기울기 반영
    if (Math.abs(this.pongGameInstance.player1.controller.stick.x) < 0.05) {
      if ((this.pongGameInstance.player1.controller.left == true &&
        this.pongGameInstance.player1.controller.right == false)) {
        this.tiltZ(this.player1Unit, 0.3);
      } else if (this.pongGameInstance.player1.controller.left == false &&
        this.pongGameInstance.player1.controller.right == true) {
        this.tiltZ(this.player1Unit, -0.3);
      } else {
        this.tiltZ(this.player1Unit, 0);
      }
    } else {
      this.tiltZ(this.player1Unit, -this.pongGameInstance.player1.controller.stick.x * 0.5);
    }
    if (Math.abs(this.pongGameInstance.player2.controller.stick.x) < 0.05) {
      if (this.pongGameInstance.player2.controller.left == true &&
        this.pongGameInstance.player2.controller.right == false) {
        this.tiltZ(this.player2Unit, -0.3);
      } else if (this.pongGameInstance.player2.controller.left == false &&
        this.pongGameInstance.player2.controller.right == true) {
        this.tiltZ(this.player2Unit, 0.3);
      } else {
        this.tiltZ(this.player2Unit, 0);
      }
    } else {
      this.tiltZ(this.player2Unit, -this.pongGameInstance.player2.controller.stick.x * 0.5);
    }

    // 충돌시 화면흔들림, 충격음
    if (this.pongGameInstance.isWallStrike == true) {
      this.shakeCamera(this.camera, 200, 4);
      if (this.strikeSound.isPlaying) {
        this.strikeSound.stop();
      }
      this.strikeSound.play();
      this.pongGameInstance.isWallStrike = false;
    }
    if (this.pongGameInstance.isPlayer1Strike == true) {
      this.shakeCamera(this.camera, 500, 4);
      if (this.strikeSound.isPlaying) {
        this.strikeSound.stop();
      }
      this.strikeSound.play();
      this.pongGameInstance.isPlayer1Strike = false;
    }
    if (this.pongGameInstance.isPlayer2Strike == true) {
      this.shakeCamera(this.camera, 300, 4);
      if (this.strikeSound.isPlaying) {
        this.strikeSound.stop();
      }
      this.strikeSound.play();
      this.pongGameInstance.isPlayer2Strike = false;
    }

    // 유닛 애니메이션
    let delta = this.clock.getDelta();
    if (this.player1UnitMixer) {
      this.player1UnitMixer.update(delta);
    }
    if (this.player2UnitMixer) {
      this.player2UnitMixer.update(delta);
    }
  }

  animate() {
    if (this.pongGameInstance.isEnd == false) {
      requestAnimationFrame(this.animate);
    } else {
      return ;
    }
    this.animateEnvironments();
    this.animateGame();
    this.renderer.render(this.scene, this.camera);
  }

  async loop() {

    this.animate();
  }

  removeEventListeners() {
    window.removeEventListener('resize', this.resizeListener);
  }
  disposeAudio() {
    if (this.bgmSound && this.bgmSound.isPlaying) {
      this.bgmSound.stop();
    }
    if (this.strikeSound && this.strikeSound.isPlaying) {
      this.strikeSound.stop();
    }
  }

  disposeScene() {
    // 씬의 모든 객체 제거
    while (this.scene.children.length > 0) {
      const object = this.scene.children[0];
      this.scene.remove(object);

      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (object.material instanceof Array) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
      if (object.texture) {
        object.texture.dispose();
      }
    }
    // 씬의 배경과 환경맵 제거
    if (this.scene.background) {
      this.scene.background.dispose();
    }
    if (this.scene.environment) {
      this.scene.environment.dispose();
    }
  }

  dispose() {
    this.isDisposed = true;

    // 씬 정리
    this.disposeScene();

    // 이벤트 리스너 제거
    this.removeEventListeners();

    // 오디오 리소스 해제
    this.disposeAudio();

    // 렌더러와 PMREM 생성기 정리
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.pmremGenerator) {
      this.pmremGenerator.dispose();
    }

    // DOM 요소 제거
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }

    console.log('Resources have been released.');
  }
}
