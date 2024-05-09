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
document.body.appendChild( renderer.domElement );

// 앰비언트 라이트
const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
scene.add( light );

// 공
/* const geometry = new THREE.SphereGeometry( 1, 32, 32 ); 
const material = new THREE.MeshStandardMaterial( {
  color: 0xffff00,
  metalness: 1,
  roughness: 0
});
const sphere = new THREE.Mesh( geometry, material );
sphere.position.set(0,0,0);
scene.add( sphere );
*/


// 우주 배경
rgbeLoader.load('../a/Nebula4.hdr', function(hdr) {
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  const geometry = new THREE.SphereGeometry( 1, 32, 32 ); 
  const material = new THREE.MeshStandardMaterial( {
    color: 0xffff00,
    metalness: 1,
    roughness: 0,
    emissiveMap: hdr,
    emissive: 200
  }); 
  const sphere = new THREE.Mesh( geometry, material );
  sphere.position.set(0,0,0);
  scene.add( sphere );
})


// 애니메이션 루프
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;
let n = 0;
let flag = "up";
function animate() {
  requestAnimationFrame(animate);
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