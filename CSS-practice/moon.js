let scene;
let camera;
let renderer;
let size = 600;
function main()
{
    const canvas = document.querySelector('#moon');

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(37, 1, 0.1, 1000);
    camera.position.z = 2;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.autoClear = false;
    renderer.setClearColor(0x00000, 0.0);

    const earthgeometry = new THREE.SphereGeometry(0.6,32,32);
    const eatrhmaterial = new THREE.MeshPhysicalMaterial({
        roughness: 1.0,
        metalness: 0.0,
        map: THREE.ImageUtils.loadTexture('assets/3d-texture/moonmap4k.jpeg'),
        bumpMap: THREE.ImageUtils.loadTexture('assets/3d-texture/moonbump4k.jpeg'),
        bumpScale: 0.002,
        shininess: 0.0
    });
    const earthmesh = new THREE.Mesh(earthgeometry,eatrhmaterial);
    earthmesh.rotation.set(0,-0.8,0);
    scene.add(earthmesh);

    const pointerlight =  new THREE.PointLight(0xffffff, 1.3);
    pointerlight.position.set(10, 10, 10);
    scene.add(pointerlight);

    const animate = () =>{
        requestAnimationFrame(animate);
        earthmesh.rotation.y -= 0.0015;
        render();
    }

    const render = () => {
        renderer.render(scene,camera);

    }
    animate();
}

window.onload = main;