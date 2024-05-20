import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { LUTPass } from 'three/addons/postprocessing/LUTPass.js';
import { LUTCubeLoader } from 'three/addons/loaders/LUTCubeLoader.js';
import { LUT3dlLoader } from 'three/addons/loaders/LUT3dlLoader.js';



import { shakeCamera, tiltZ } from './visualUtils.js';

import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/17/Stats.js'

// 캔버스 얻기
const canvas = document.getElementById('art');

// 그래픽 에셋 로더
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

// 씬
const scene = new THREE.Scene();

// 카메라
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
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
rgbeLoader.load('../a/Nebula3_t.hdr', (texture) => {
  envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.background = envMap;
  scene.backgroundBlurriness = 0.03;
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
    satellite1.position.set(0, 0, 80);
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
gltfLoader.load("../a/mutalisk.glb",  function (gltf) {
  dragon = gltf.scene;
  dragon.position.set(0, 0, -80);
  dragon.scale.set(10, 10, 10);
  //dragon.rotation.set(Math.PI * -0.3, 0, 0);
  dragon.traverse(function (child) {
    if (child.isMesh) { // 메쉬인 경우
      if (child.material) { // 재질이 있는 경우
        child.material.metalness = 0.7;
        child.material.roughness = 0.2;
        child.material.needsUpdate = true;
      }
    }
  });
  scene.add(dragon); // 로드된 모델을 씬에 추가
  dragonMixer = new THREE.AnimationMixer(gltf.scene);
  const action = dragonMixer.clipAction(gltf.animations[1]);
  action.timeScale = 1;
  action.play();
});
const dragonLight = new THREE.PointLight( 0xff0000, 800, 100 );
dragonLight.position.set( 0, -10, -70 );
scene.add( dragonLight );
/* const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper( dragonLight, sphereSize );
scene.add( pointLightHelper ); */

// 홀로그램
/* let hologram = null;
let hologramMixer = null;
gltfLoader.load("../a/hologram.glb", function(gltf) {
  hologram  = gltf.scene;
  hologram.position.set(0,20,-100);
  hologram.rotation.set(0, 0, Math.PI * 0.5);
  const hologramSize = 120;
  hologram.scale.set(hologramSize * 1.2, hologramSize, hologramSize);
  scene.add(hologram);
  hologramMixer = new THREE.AnimationMixer(gltf.scene);
  const action = hologramMixer.clipAction(gltf.animations[0]);
  action.play();
}) */
let hologram = null;
let hologramMixer = null;
gltfLoader.load("../a/space_station.glb", function(gltf) {
  hologram  = gltf.scene;
  hologram.position.set(0,10,-500);
  //hologram.position.set(0,-50,-130);
  hologram.rotation.set(0, 0, 0);
  const hologramSize = 20;
  hologram.scale.set(hologramSize * 1.2, hologramSize, hologramSize);
  hologram.traverse(function (child) {
    if (child.isMesh) { // 메쉬인 경우
      if (child.material) { // 재질이 있는 경우
        child.material.metalness = 0.8;
        child.material.roughness = 0.7;
        child.material.needsUpdate = true;
      }
    }
  });
  scene.add(hologram);

})

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
var cradle2 = null;
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

  cradle2 = cradle.clone();
  cradle2.position.set(-90, 0, -20);
  scene.add(cradle2);
});












// 게임 로직
let ballSpeed = 2.5;
let ballDir = new THREE.Vector3(0, 0, 1);
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
    dragon.position.x += 1.5;
    tiltZ(dragon, -0.1);
    dragonLight.position.x += 1.5;
  } else if (dragon.position.x > ball.position.x) {
    //satellite2.position.x -= 1.5;\
    dragon.position.x -= 1.5;
    dragonLight.position.x -= 1.5;
    tiltZ(dragon, 0.1);
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
    shakeCamera(camera, 100, 3);
  }
  // 공과 인공위성 충돌
  if (ball.position.z <= satellite1.position.z + paddleDepth / 2 + 0.5 && ball.position.z >= satellite1.position.z - paddleDepth / 2 - 0.5 &&
      ball.position.x >= satellite1.position.x - paddleWidth / 2 && ball.position.x <= satellite1.position.x + paddleWidth / 2) {
    //ballDir.z *= -1;
    
    ballDir.x = (ball.position.x - satellite1.position.x) / ((paddleWidth / 2) + 0.1);
    ballDir.z *= -1;
    strikeSound.play();
    shakeCamera(camera, 500, 4);
    const gamepads = navigator.getGamepads();
    for (let gamepad of gamepads) {
      if (gamepad) {
        gamepad.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: 300,
          weakMagnitude: 1.0,
          strongMagnitude: 1.0,
        });
      }
    }

  }
  if (ball.position.z <= dragon.position.z + paddleDepth / 2 + 0.5 && ball.position.z >= dragon.position.z - paddleDepth / 2 - 0.5 &&
      ball.position.x >= dragon.position.x - paddleWidth / 2 && ball.position.x <= dragon.position.x + paddleWidth / 2) {
    ballDir.z *= -1;
    //shakeCamera(camera, 300, 3);
    //attackSound.play();
  }
  // 공 초기화
  if (ball.position.z < -fieldDepth / 2) {
    player2Score++;
    ball.position.set(0, 0, 0);
    ballDir.x = Math.random() * 2 -1;
    ballDir.z = -1;
  } else if (ball.position.z > fieldDepth / 2) {
    player1Score++;
    ball.position.set(0, 0, 0);
    ballDir.x = Math.random() * 2 -1;
    ballDir.z = -1;
  }
}

// 애니메이션 루프
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

const clock = new THREE.Clock();

// 개발용 
const NDEBUG = false;

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms/frame, 2: memory
document.body.appendChild(stats.dom);


let controls = null;
if (NDEBUG) {
  controls = new OrbitControls(camera, renderer.domElement);
}
//const controls = new OrbitControls( camera, renderer.domElement );

function animate() {
  
  
  requestAnimationFrame(animate);
  
  stats.begin();
  const gamepads = navigator.getGamepads();
  
  for (let gamepad of gamepads) {
    if (gamepad) {
      console.log(gamepad.axes[0]);
      if (gamepad.axes[0] < -0.1) {
        moveLeft = true;
        moveRight = false;
      } else if (gamepad.axes[0] > 0.1) {
        moveRight = true;
        moveLeft = false;
      } else {
        moveLeft = false;
        moveRight = false;
      }
    }
  }

  const rotationSpeed = -0.01;
  scene.environmentRotation.z += rotationSpeed;
  scene.backgroundRotation.z += rotationSpeed;

  const delta = clock.getDelta();

  if (dragonMixer) {
    dragonMixer.update(delta);
  }

  if (hologram) {
    hologram.rotation.y += 0.01;
  }

  if (satellite1) {
    gameProcess();
  }
  
  if (controls) {
    controls.update();
  }

  renderer.render(scene, camera);
  stats.end();
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

window.addEventListener("gamepadconnected", function(e) {
  console.log("게임패드 연결됨:", e.gamepad);
});

window.addEventListener("gamepaddisconnected", function(e) {
  console.log("게임패드 연결 해제됨:", e.gamepad);
});