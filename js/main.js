import {
    Scene,
    Object3D,
    PerspectiveCamera,
    WebGLRenderer,
    IcosahedronBufferGeometry,
    MeshBasicMaterial,
    InstancedMesh,
    Color
} from "https://unpkg.com/three@0.110.0/build/three.module.js";

let color = new Color(
    getComputedStyle(document.documentElement)
        .getPropertyValue("--color-distinct")
        .trim()
);
let bgColor = new Color(
    getComputedStyle(document.documentElement)
        .getPropertyValue("--color-background")
        .trim()
);

let leftBoundary = 0;
let rightBoundary = 0;
const media = matchMedia("(prefers-color-scheme: dark)");
const { innerWidth, innerHeight } = window;
const scene = new Scene();
const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(bgColor, 1);

const totalNumber = Math.max(10, Math.floor(window.innerWidth / 50));
const dummies = new Array(totalNumber).fill().map(() => new Object3D());
const speeds = new Array(totalNumber).fill(0).map(() => getRandom(0.001, 0.01));
const positionsY = new Array(totalNumber).fill(0).map(() => getRandom(-2, 2));
const positionsZ = new Array(totalNumber).fill(0).map(() => getRandom(-1, 0));
const geometry = new IcosahedronBufferGeometry();
const material = new MeshBasicMaterial({
    color,
    wireframe: true
});
const cubes = new InstancedMesh(geometry, material, totalNumber);
scene.add(cubes);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    speeds.forEach((speed, index) => {
        dummies[index].position.set(
            leftBoundary +
                (index * (rightBoundary - leftBoundary)) / speeds.length,
            positionsY[index],
            positionsZ[index]
        );
        dummies[index].rotation.x += speed;
        dummies[index].rotation.y += speed;
        dummies[index].updateMatrix();
        cubes.setMatrixAt(index, dummies[index].matrix);
    });

    cubes.instanceMatrix.needsUpdate = true;
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    setScreenBoundaries();
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function setScreenBoundaries() {
    const left = ((camera.fov / 180) * Math.PI) / -2;
    const right = ((camera.fov / 180) * Math.PI) / 2;
    const adjacent = camera.position.distanceTo(scene.position);
    leftBoundary = Math.tan(left) * adjacent * camera.aspect;
    rightBoundary = Math.tan(right) * adjacent * camera.aspect;
}

function updateColors() {
    color = new Color(
        getComputedStyle(document.documentElement)
            .getPropertyValue("--color-distinct")
            .trim()
    );
    bgColor = new Color(
        getComputedStyle(document.documentElement)
            .getPropertyValue("--color-background")
            .trim()
    );

    material.color = color;
    renderer.setClearColor(bgColor, 1);
}

setScreenBoundaries();
renderer.domElement.classList.add("animated-bg");
document.body.appendChild(renderer.domElement);
renderer.domElement.addEventListener("touchmove", event => {
    event.preventDefault();
});
window.addEventListener("resize", onWindowResize, false);
media.addListener(updateColors);
animate();
setTimeout(() => {
    renderer.domElement.classList.add("is-ready");
}, 200);
