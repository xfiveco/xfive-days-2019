import {
    Scene,
    Object3D,
    PerspectiveCamera,
    WebGLRenderer,
    BoxBufferGeometry,
    MeshBasicMaterial,
    InstancedMesh,
    Color
} from "https://unpkg.com/three@0.110.0/build/three.module.js";

const getRandom = (min, max) => Math.random() * (max - min) + min;
const { innerWidth, innerHeight } = window;
const scene = new Scene();
const camera = new PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
);
const renderer = new WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(
    innerWidth,
    innerHeight
);

const color = new Color(getComputedStyle(document.documentElement)
    .getPropertyValue('--color-distinct').trim());
const totalNumber = Math.max(50, Math.floor(window.innerWidth / 10));
const dummies = new Array(totalNumber).fill().map(() => new Object3D());
const speeds = new Array(totalNumber).fill(0).map(() => getRandom(0.01, 0.02));
const positionsY = new Array(totalNumber).fill(0).map(() => getRandom(-3, 3));

const geometry = new BoxBufferGeometry(1, 1, 1);
const material = new MeshBasicMaterial({ color, wireframe: true });
const cubes = new InstancedMesh(geometry, material, totalNumber);
scene.add(cubes);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    speeds.forEach((speed, index) => {
    	dummies[index].position.set(-totalNumber * 0.04 + index / (totalNumber * 0.04), positionsY[index], 0);
    	dummies[index].rotation.x += speed;
    	dummies[index].rotation.y += speed;
    	dummies[index].updateMatrix();
    	cubes.setMatrixAt(index, dummies[index].matrix);
    });

    cubes.instanceMatrix.needsUpdate = true;
}
const onWindowResize = ()=> {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

animate();

renderer.domElement.classList.add('animated-bg');
document.body.appendChild(renderer.domElement);
renderer.domElement.addEventListener("touchmove", event => {
    event.preventDefault();
});
window.addEventListener('resize', onWindowResize, false);
