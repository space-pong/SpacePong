import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { shakeCamera, tiltZ } from './visualUtils.js';

// 캔버스 얻기
const canvas = document.getElementById('art');

// 그래픽 에셋 로더
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

// 씬
const scene = new THREE.Scene();

// 카메라
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 10000 );
camera.position.set(0, 40, 95);
camera.lookAt(new THREE.Vector3(0, 0, 35));
const rotationCenter = new THREE.Object3D();
rotationCenter.add(camera);
scene.add(rotationCenter);

// 렌더러
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: false,
  precision: "lowp",
  powerPreference: "high-performance"
});
renderer.autoClear = false;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.0;
renderer.shadowMap.enabled = true; // 그림자 활성화
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자 매핑 방식 설정 (선택 사항)
document.body.appendChild( renderer.domElement );

// 포스트 프로세싱
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// 오디오 로더, 리스너)
const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
camera.add(listener);

// 배경음악 로드
const bgmSound = new THREE.Audio(listener);
audioLoader.load('../a/bgm.mp3', function(buffer) {
  bgmSound.setBuffer(buffer);
  bgmSound.setLoop(true); // 반복 재생
  bgmSound.setVolume(0); // 볼륨 조절
  bgmSound.offset = 120;
  bgmSound.play(); // 사운드 재생
  function fadeInAudio(audio, duration) {
    const initialVolume = 0;
    const targetVolume = 0.5; // 최종 볼륨
    const step = (targetVolume - initialVolume) / (duration / 100); // 볼륨 증가 단위
    let currentVolume = initialVolume;
    function increaseVolume() {
        currentVolume = Math.min(currentVolume + step, targetVolume);
        audio.setVolume(currentVolume);

        if (currentVolume < targetVolume) {
            setTimeout(increaseVolume, 100); // 0.1초마다 볼륨 증가
        }
    }
    increaseVolume();
  }
  fadeInAudio(bgmSound, 2000);
});

// 타격음 로드
const strikeSound = new THREE.Audio(listener);
audioLoader.load('../a/strike-sound.mp3', function(buffer) {
  strikeSound.setBuffer(buffer);
  strikeSound.setLoop(false);
  strikeSound.setVolume(0.2);
});

// 배경 맵
var envMap = null;
rgbeLoader.load('../a/Nebula3.hdr', (texture) => {
  envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.background = envMap;
  scene.environment = envMap;
  scene.backgroundRotation.set(3,0,0);
  scene.environmentRotation.set(3,0,0);
  texture.dispose();
  pmremGenerator.dispose();
});

// 앰비언트 라이트
const light = new THREE.AmbientLight( 0xffffff, 2 ); // soft white light
scene.add( light );

// 주인공 기체
var satellite1 = null;
gltfLoader.load("../a/sabre.glb",  function (gltf) {
    satellite1 = gltf.scene;
    satellite1.position.set(9.1, 0, 80);
    satellite1.rotation.set(Math.PI * -0.2, 0, 0.0);
    satellite1.scale.set(6,4,4);
    satellite1.traverse(function (child) {
      if (child.isMesh) { // 메쉬인 경우
        if (child.material) { // 재질이 있는 경우
          child.material.metalness = 1;
          child.material.roughness = 0.0;
          child.material.needsUpdate = true;
        }
      }
    });
    scene.add(satellite1); // 로드된 모델을 씬에 추가
});
const thrustLight = new THREE.PointLight( 0xff0000, 10000, 100 );
thrustLight.position.set( 0, 6, 82 );
scene.add( thrustLight );

// 드래곤
let dragonMixer = null;
var dragon = null;
gltfLoader.load("../a/dragon.glb",  function (gltf) {
  dragon = gltf.scene;
  dragon.position.set(0, 0, -80);
  dragon.scale.set(0.06, 0.04, 0.04);
  dragon.rotation.set(Math.PI * -0.3, 0, 0);
  scene.add(dragon); // 로드된 모델을 씬에 추가
  dragonMixer = new THREE.AnimationMixer(gltf.scene);
  const action = dragonMixer.clipAction(gltf.animations[0]);
  action.timeScale =2;
  action.play();
});
const dragonLight = new THREE.PointLight( 0xff0000, 600, 100 );
dragonLight.position.set( 0, 0, -80 );
scene.add( dragonLight );

// 공
const ballGeometry = new THREE.SphereGeometry( 2, 16, 16 ); 
const ballMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0,
  metalness: 1,
});
const ball = new THREE.Mesh( ballGeometry, ballMaterial );
ball.castShadow = true;
ball.receiveShadow = true
scene.add( ball );

// 양 옆 가이드라인
var cradle = null;
gltfLoader.load("../a/cradle.glb",  function (gltf) {
  cradle = gltf.scene;
  cradle.position.set(90, 0, -20);
  cradle.scale.set(2,3,3);
  cradle.traverse(function (child) {
    if (child.isMesh) { // 메쉬인 경우
      if (child.material) { // 재질이 있는 경우
        child.material.metalness = 1;
        child.material.roughness = 0.3;
        child.material.needsUpdate = true;
      }
    }
  });
  scene.add(cradle);
});
var cradle2 = null;
gltfLoader.load("../a/cradle.glb",  function (gltf) {
  cradle2 = gltf.scene;
  cradle2.position.set(-90, 0, -20);
  cradle2.scale.set(2,3,3);
  cradle2.traverse(function (child) {
    if (child.isMesh) { // 메쉬인 경우
      if (child.material) { // 재질이 있는 경우
        child.material.metalness = 1;
        child.material.roughness = 0.3;
        child.material.needsUpdate = true;
      }
    }
  });
  scene.add(cradle2);
});

let ballSpeed = 2;
let ballDir = new THREE.Vector3(0, 0, 1);
ballDir.normalize();
let paddleWidth = 18, paddleDepth = 4;
let fieldWidth = 120, fieldDepth = 160;
let player1Score = 0, player2Score = 0;

function gameProcess() {
  // 플레이어 키보드 움직임
  if (satellite1 == null || dragon ==  null) {
    return ;
  }
  if (moveLeft || moveRight) {
    if (moveLeft == true && moveRight == false) {
      satellite1.position.x -= 1.5;
      thrustLight.position.x = satellite1.position.x;
      tiltZ(satellite1, 0.3);
    }
    if (moveLeft == false && moveRight == true) {
      satellite1.position.x += 1.5;
      thrustLight.position.x = satellite1.position.x;
      tiltZ(satellite1, -0.3);
    }
  } else {
    thrustLight.position.x = satellite1.position.x;
    tiltZ(satellite1, 0.0);
  }

  // AI
  if (dragon.position.x < ball.position.x) {
    dragon.position.x = ball.position.x;
    tiltZ(dragon, -0.3);
    dragonLight.position.x = ball.position.x;
  } else if (dragon.position.x > ball.position.x) {
    //satellite2.position.x -= 1.5;\
    dragon.position.x = ball.position.x;
    dragonLight.position.x = ball.position.x;
    tiltZ(dragon, 0.3);
  };

  // 인공위성 움직임 범위 제한
  if (satellite1) {
    satellite1.position.x = Math.max(-fieldWidth / 2 + paddleWidth / 2, Math.min(fieldWidth / 2 - paddleWidth / 2, satellite1.position.x));
  }
  if (dragon) {
    dragon.position.x = Math.max(-fieldWidth / 2 + paddleWidth / 2, Math.min(fieldWidth / 2 - paddleWidth / 2, dragon.position.x));
  }
  // 공 움직임
  ball.position.x += ballSpeed * ballDir.x;
  ball.position.z += ballSpeed * ballDir.z;
  // 공과 벽 충돌
  if (ball.position.x <= -fieldWidth / 2 + 0.5 || ball.position.x >= fieldWidth / 2 - 0.5) {
    ballDir.x *= -1;
    shakeCamera(camera, 300, 3);
  }
  // 공과 인공위성 충돌
  if (ball.position.z <= satellite1.position.z + paddleDepth / 2 + 0.5 && ball.position.z >= satellite1.position.z - paddleDepth / 2 - 0.5 &&
      ball.position.x >= satellite1.position.x - paddleWidth / 2 && ball.position.x <= satellite1.position.x + paddleWidth / 2) {
    //ballDir.z *= -1;
    
    ballDir.x = (ball.position.x - satellite1.position.x) / ((paddleWidth / 2) + 0.1);
    ballDir.z = -Math.sqrt(1 - ballDir.x * ballDir.x);
    ballDir.normalize();
    strikeSound.play();
    shakeCamera(camera, 500, 4);
  }
  if (ball.position.z <= dragon.position.z + paddleDepth / 2 + 0.5 && ball.position.z >= dragon.position.z - paddleDepth / 2 - 0.5 &&
      ball.position.x >= dragon.position.x - paddleWidth / 2 && ball.position.x <= dragon.position.x + paddleWidth / 2) {
    ballDir.z *= -1;
    shakeCamera(camera, 500, 4);
    //attackSound.play();
  }
  // 공 초기화
  if (ball.position.z < -fieldDepth / 2) {
    player2Score++;
    ball.position.set(0, 0, 0);
  } else if (ball.position.z > fieldDepth / 2) {
    player1Score++;
    ball.position.set(0, 0, 0);
  }
}

// 애니메이션 루프
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

const clock = new THREE.Clock();

// 개발용 
//const controls = new OrbitControls( camera, renderer.domElement );
function animate() {
  requestAnimationFrame(animate);

  const rotationSpeed = -0.02;
  scene.environmentRotation.z += rotationSpeed;
  scene.backgroundRotation.z += rotationSpeed;

  const delta = clock.getDelta();
  if (dragonMixer) {
    dragonMixer.update(delta);
  }

  if (satellite1) {
    gameProcess();
  }
  
  //controls.update();
  renderer.render(scene, camera);
}

window.onload = animate;




// 리스너
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// 키를 눌렀을 때 이벤트
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      moveLeft = true;
      break;
    case 'ArrowRight':
      moveRight = true;
      break;
    case 'ArrowUp':
      camera.position.set(0, 100, 0);
      camera.lookAt(new THREE.Vector3(0,0,0));
      moveUp = true;
      break;
    case 'ArrowDown':
      moveDown = true;
      bgmSound.setVolume(0);
      break;
  }
});

// 키를 뗐을 때 이벤트
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      moveLeft = false;
      break;
    case 'ArrowRight':
      moveRight = false;
      break;
    case 'ArrowUp':
      moveUp = false;
      break;
    case 'ArrowDown':
      moveDown = false;
      break;
  }
});

