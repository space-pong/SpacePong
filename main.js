import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'


// 캔버스 얻기
const canvas = document.getElementById('art');

// 로더
const loader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

// 씬
const scene = new THREE.Scene();

// 카메라
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0,30,30);
const lookAtPoint = new THREE.Vector3(0, 0, 0);
camera.lookAt(lookAtPoint);

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


const container = new THREE.Group();
scene.add(container);

rgbeLoader.load('Nebula4.hdr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.minFilter = THREE.NearestFilter; // 최소화 필터
    texture.magFilter = THREE.NearestFilter; // 최대화 필터
    texture.generateMipmaps = false;
    scene.background = texture;
    scene.environment = texture;
});


const light = new THREE.AmbientLight( 0xffffff, 1 ); // soft white light
scene.add( light );
var satellite = null;

loader.load("./satellite_low_.glb",  function (gltf) {
    satellite = gltf.scene;
    satellite.position.set(0, 0, 20);
    satellite.rotation.set(Math.PI * 0.7, 0, 0);
    scene.add(satellite); // 로드된 모델을 씬에 추가
});

var satellite2 = null;
loader.load("./satellite_low_.glb",  function (gltf) {
  satellite2 = gltf.scene;
  satellite2.position.set(0, 0, -20);
  satellite2.rotation.set(0.5, 0, 0);
  scene.add(satellite2); // 로드된 모델을 씬에 추가
});

const geometry = new THREE.SphereGeometry( 1, 16, 16 ); 
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0,
  metalness: 1
}); 
const sphere = new THREE.Mesh( geometry, material ); scene.add( sphere );


// 애니메이션 루프
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let n = 0;
let flag = "up";
function animate() {
  requestAnimationFrame(animate);

  //camera.rotation.z += 0.01;
  //satellite.rotation.z += 0.01;
  container.rotation.z += 0.1;
  if (moveLeft) {
    satellite.position.x -= 1;
  }
  if (moveRight) {
    satellite.position.x += 1;
  }
  if (moveUp) {
    satellite.rotation.x -= 0.01;
  }
  if (moveDown) {
    satellite.rotation.x += 0.01;
  }

  if (flag == "up") {
    sphere.position.z -= 0.5;
    if (sphere.position.z == -19) {
      flag = "down";
    }
  } else if (flag == "down") {
    sphere.position.z += 0.5;
    if (sphere.position.z == 19) {
      flag = "up";
    }
  }
  renderer.render(scene, camera);
}


  

window.onload = animate;


// 리스너
window.addEventListener('resize', () => {
  // Update camera and renderer on resize
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