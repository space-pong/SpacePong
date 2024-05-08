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
camera.position.z = 5;

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



rgbeLoader.load('Nebula1.hdr', (texture) => {
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
loader.load(
  "./satellite.glb",  // 모델의 경로
  function (gltf) {
    satellite = gltf.scene;
    satellite.position.set(0, 0, -10);
    scene.add(satellite); // 로드된 모델을 씬에 추가
  },
  function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
      console.error('An error happened', error);
  }
);


let moveLeft = false;
let moveRight = false;

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);

  camera.rotation.z += 0.01;
  satellite.rotation.z += 0.01;
  if (moveLeft) {
    satellite.position.x -= 1;
  }
  if (moveRight) {
    satellite.position.x += 1;
  }

  renderer.render(scene, camera);
}

animate();


// 리스너
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    moveLeft = true;
  } else if (event.key === "ArrowRight") {
    moveRight = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowLeft') {
    moveLeft = false;
  } else if (event.key === "ArrowRight") {
    moveRight = false;
  }
});