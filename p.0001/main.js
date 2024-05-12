import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 캔버스 얻기
const canvas = document.getElementById('art');

// 로더
const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();
const audioLoader = new THREE.AudioLoader();

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
  alpha: true,
  precision: 'mediump'
});
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

// 배경: 우주
rgbeLoader.load('../a/Nebula4.hdr', (texture) => {
  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  scene.background = envMap;
  scene.backgroundBlurriness = 0.01;
  scene.backgroundRotation.set(3,0,0);
  scene.environment = envMap;
  scene.environmentRotation.set(3,0,0);
  texture.dispose();
  pmremGenerator.dispose();
});

// 앰비언트 라이트
const light = new THREE.AmbientLight( 0xffffff, 1 ); // soft white light
scene.add( light );


// 오디오 리스너
const listener = new THREE.AudioListener();
camera.add(listener);

// 오디오 로더


// 배경음악
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

// 충돌효과음
const attackSound = new THREE.Audio(listener);
audioLoader.load('../a/effect.mp3', function(buffer) {
  attackSound.setBuffer(buffer);
  attackSound.setLoop(false); // 반복 재생 안함
  attackSound.setVolume(0.2); // 볼륨 설정
});

// 나레이션
const robertSound = new THREE.Audio(listener);
audioLoader.load('../a/robert.mp3', function(buffer) {
  robertSound.setBuffer(buffer);
  robertSound.setLoop(true); // 반복 재생 안함
  robertSound.setVolume(0.1); // 볼륨 설정
  robertSound.play();
});

// 인공위성1
var satellite1 = null;
gltfLoader.load("../a/satellite.glb",  function (gltf) {
    satellite1 = gltf.scene;
    satellite1.position.set(0, 0, 80);
    satellite1.rotation.set(Math.PI * 0.5, 0, 0.0);
    scene.add(satellite1); // 로드된 모델을 씬에 추가
});

// 인공위성2
var satellite2 = null;
gltfLoader.load("../a/satellite.glb",  function (gltf) {
  satellite2 = gltf.scene;
  satellite2.position.set(0, 0, -80);
  satellite2.rotation.set(Math.PI * 0.5, 0, Math.PI);
  scene.add(satellite2); // 로드된 모델을 씬에 추가
});

// 공
const ballGeometry = new THREE.SphereGeometry( 1, 16, 16 ); 
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
const geometry = new THREE.BoxGeometry(0.5, 5, 200000); // 폭 10, 높이 1, 깊이 1
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const elongatedBox = new THREE.Mesh(geometry, ballMaterial);
const elongatedBox2 = new THREE.Mesh(geometry, ballMaterial);
elongatedBox.position.set(60.5, 0, 0);
elongatedBox.castShadow = true;
elongatedBox.receiveShadow = true;
scene.add(elongatedBox);
elongatedBox2.position.set(-60.5, 0, 0);
elongatedBox2.castShadow = true;
elongatedBox2.receiveShadow = true;
scene.add(elongatedBox2);


// 카메라 흔들림
function shakeCamera(duration = 100, intensity = 0.05) {
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



function tiltSatellite(satellite, targetRotationY) {
  if (targetRotationY == satellite.rotation.y) {
    return ;
  } else {
    if (targetRotationY > satellite.rotation.y) {
      satellite.rotation.y += 0.1;
      if (satellite.rotation.y > targetRotationY) {
        satellite.rotation.y = targetRotationY;
      }
    } else if (targetRotationY < satellite.rotation.y) {
      satellite.rotation.y -= 0.1;
      if (satellite.rotation.y < targetRotationY) {
        satellite.rotation.y = targetRotationY;
      }
    }
  }
}



// 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더
// 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더
// 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더
// 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더
// 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더 게임 코드 헤더



let ballSpeed = 2;
let ballDir = new THREE.Vector3(0, 0, 1);
ballDir.normalize();
let paddleWidth = 18, paddleDepth = 4;
let fieldWidth = 120, fieldDepth = 160;
let player1Score = 0, player2Score = 0;

// Paddle movement parameters
let moveSpeed = 1.5;

function gameProcess() {
  // 플레이어 키보드 움직임
  if (moveLeft || moveRight) {
    if (moveLeft == true && moveRight == false) {
      satellite1.position.x -= 1.5;
      tiltSatellite(satellite1, 0.2);
    }
    if (moveLeft == false && moveRight == true) {
      satellite1.position.x += 1.5;
      tiltSatellite(satellite1, -0.2);
    }
  } else {
    tiltSatellite(satellite1, 0.0);
  }


  // AI

  if (satellite2.position.x < ball.position.x) {
    satellite2.translateOnAxis( new THREE.Vector3( 1, 0, 0 ), -moveSpeed * 1.5 );
  } else if (satellite2.position.x > ball.position.x) {
    satellite2.translateOnAxis( new THREE.Vector3( 1, 0, 0 ), moveSpeed * 1.5 );
  };
  

  // 인공위성 움직임 범위 제한
  if (satellite1) {
    satellite1.position.x = Math.max(-fieldWidth / 2 + paddleWidth / 2, Math.min(fieldWidth / 2 - paddleWidth / 2, satellite1.position.x));
  }
  if (satellite2) {
    satellite2.position.x = Math.max(-fieldWidth / 2 + paddleWidth / 2, Math.min(fieldWidth / 2 - paddleWidth / 2, satellite2.position.x));
  }

  // 공 움직임
  ball.position.x += ballSpeed * ballDir.x;
  ball.position.z += ballSpeed * ballDir.z;
  
  // 공과 벽 충돌
  if (ball.position.x <= -fieldWidth / 2 + 0.5 || ball.position.x >= fieldWidth / 2 - 0.5) {
    ballDir.x *= -1;
    shakeCamera(100, 2);
  }


  // 공과 인공위성 충돌
  if (ball.position.z <= satellite1.position.z + paddleDepth / 2 + 0.5 && ball.position.z >= satellite1.position.z - paddleDepth / 2 - 0.5 &&
      ball.position.x >= satellite1.position.x - paddleWidth / 2 && ball.position.x <= satellite1.position.x + paddleWidth / 2) {
    //ballDir.z *= -1;

    ballDir.x = (ball.position.x - satellite1.position.x) / ((paddleWidth / 2) + 0.1);
    ballDir.z = -Math.sqrt(1 - ballDir.x * ballDir.x);
    ballDir.normalize();
    attackSound.play();
    shakeCamera(500, 4);
  }
  if (ball.position.z <= satellite2.position.z + paddleDepth / 2 + 0.5 && ball.position.z >= satellite2.position.z - paddleDepth / 2 - 0.5 &&
      ball.position.x >= satellite2.position.x - paddleWidth / 2 && ball.position.x <= satellite2.position.x + paddleWidth / 2) {
    ballDir.z *= -1;
    shakeCamera(500, 4);
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

// 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드
// 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드
// 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드
// 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드





// 애니메이션 루프
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

const rotationSpeed = -0.05;

// 개발용 
//const controls = new OrbitControls( camera, renderer.domElement );
function animate() {
  requestAnimationFrame(animate);
  scene.environmentRotation.z += rotationSpeed;
  scene.backgroundRotation.z += rotationSpeed;
  //satellite1.rotation.set(Math.PI * 0.5,0.2,0);
  if (satellite1) gameProcess();
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
      robertSound.setVolume(0);
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