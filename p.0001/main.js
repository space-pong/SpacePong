import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'


// 캔버스 얻기
const canvas = document.getElementById('art');

// 로더
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
  alpha: true,
  precision: 'mediump'
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.0;
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
var satellite = null;

// 인공위성
gltfLoader.load("../a/satellite.glb",  function (gltf) {
    satellite = gltf.scene;
    satellite.position.set(0, 0, 80);
    satellite.rotation.set(Math.PI * 0.5, 0, 0);
    scene.add(satellite); // 로드된 모델을 씬에 추가
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
scene.add( ball );

//
const geometry = new THREE.BoxGeometry(0.5, 1, 160); // 폭 10, 높이 1, 깊이 1
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const elongatedBox = new THREE.Mesh(geometry, ballMaterial);
const elongatedBox2 = new THREE.Mesh(geometry, ballMaterial);
elongatedBox.position.set(60.5, 0, 0);
scene.add(elongatedBox);
elongatedBox2.position.set(-60.5, 0, 0);
scene.add(elongatedBox2);


// 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드
// 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드
// 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드
// 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드 게임 코드



let ballSpeed = { x: 2, z: 2 };
let paddleWidth = 18, paddleHeight = 4, paddleDepth = 4;
let fieldWidth = 120, fieldDepth = 160;
let player1Score = 0, player2Score = 0;

// Paddle movement parameters
let moveSpeed = 1.5;


function gameProcess() {
  // 플레이어 키보드 움직임
  if (moveLeft) {
    if (satellite) satellite.translateOnAxis( new THREE.Vector3( 1, 0, 0 ), -moveSpeed );
  }
  if (moveRight) {
    if (satellite) satellite.translateOnAxis( new THREE.Vector3( 1, 0, 0 ), moveSpeed );
  }

  

  // 인공위성 움직임 범위 제한
  if (satellite) {
    satellite.position.x = Math.max(-fieldWidth / 2 + paddleWidth / 2, Math.min(fieldWidth / 2 - paddleWidth / 2, satellite.position.x));
  }
  if (satellite2) {
    satellite2.position.x = Math.max(-fieldWidth / 2 + paddleWidth / 2, Math.min(fieldWidth / 2 - paddleWidth / 2, satellite2.position.x));
  }

  // 공 움직임
  ball.position.x += ballSpeed.x;
  ball.position.z += ballSpeed.z;
  
  // 공과 벽 충돌
  if (ball.position.x <= -fieldWidth / 2 + 0.5 || ball.position.x >= fieldWidth / 2 - 0.5) {
    ballSpeed.x *= -1;
  }
  if (ball.position.z <= -fieldDepth / 2 + 0.5 || ball.position.z >= fieldDepth / 2 - 0.5) { 
    ballSpeed.z *= -1;
  }

  // 공과 인공위성 충돌
  if (ball.position.z <= satellite.position.z + paddleDepth / 2 + 0.5 && ball.position.z >= satellite.position.z - paddleDepth / 2 - 0.5 &&
      ball.position.x >= satellite.position.x - paddleWidth / 2 && ball.position.x <= satellite.position.x + paddleWidth / 2) {
    ballSpeed.z *= -1;
  }
  if (ball.position.z >= satellite2.position.z - paddleDepth / 2 - 0.5 && ball.position.z <= satellite2.position.z + paddleDepth / 2 + 0.5 &&
      ball.position.x >= satellite2.position.x - paddleWidth / 2 && ball.position.x <= satellite2.position.x + paddleWidth / 2) {
    ballSpeed.z *= -1;
  }

  // AI
  if (ball.position.z > 0) {
    satellite2.position.x += (ball.position.x - satellite2.position.x) * 0.1;
  }
  // 공 초기화
  if (ball.position.z < -fieldDepth / 2) {
    player2Score++;
    ball.position.set(0, 0.5, 0);
  } else if (ball.position.z >= fieldDepth / 2) {
    player1Score++;
    ball.position.set(0, 0.5, 0);
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

const rotationSpeed = -0.005;
function animate() {
  requestAnimationFrame(animate);

  scene.environmentRotation.z += rotationSpeed;
  scene.backgroundRotation.z += rotationSpeed;
  gameProcess();
  
  /* if (flag == "up") {
    ball.position.z -= 2;
    if (ball.position.z == -80) {
      flag = "down";
    }
  } else if (flag == "down") {
    ball.position.z += 2;
    if (ball.position.z == 80) {
      flag = "up";
    }
  } */

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