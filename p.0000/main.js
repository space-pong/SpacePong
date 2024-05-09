import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 캔버스 얻기
const canvas = document.getElementById('art');

// 로더
const loader = new GLTFLoader();

// 씬
const scene = new THREE.Scene();

// 카메라
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

// 렌더러
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );

renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild( renderer.domElement );

// 인공위성
loader.load(
  "./satellite.glb",  // 모델의 경로
  function (gltf) {
    const satellite = gltf.scene;
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

// 직선 광원
const sunLight = new THREE.DirectionalLight(0xffffff, 10);
sunLight.position.set(0, 5, 3);
sunLight.target.position.set(0,0,0);
scene.add(sunLight);

// 애니메이션(매번 호출 됨)
function animate() {
	requestAnimationFrame( animate );
  if (scene.children.length > 1) {
    const satellite = scene.children[1];
    satellite.rotation.x += 0.005;
    satellite.rotation.y += 0.005;
    satellite.rotation.z += 0.005;
  }
	renderer.render( scene, camera );
}
window.onload = animate;



// 리스너
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
