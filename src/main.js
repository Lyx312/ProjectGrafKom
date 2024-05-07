// main.js
import * as THREE from 'https://jspm.dev/three';
import { PointerLockControls } from 'https://jspm.dev/three/examples/jsm/controls/PointerLockControls.js';
import { keys, player, checkCollision, updateVelocity, updateJump, updateStamina } from './controls.js';

const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a UI element for the stamina bar
const staminaBar = document.createElement('div');
staminaBar.style.position = 'absolute';
staminaBar.style.top = '10px';
staminaBar.style.left = '10px';
staminaBar.style.width = '100px';
staminaBar.style.height = '20px';
staminaBar.style.backgroundColor = 'gray';
document.body.appendChild(staminaBar);

// Function to update the stamina bar UI
export const updateStaminaBar = (percentage) => {
    staminaBar.style.width = `${percentage}%`;
}

// Update the camera and renderer on window resize
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// Change the background color of the scene
scene.background = new THREE.Color(0xdddddd);

const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

controls.getObject().position.y = player.height;

document.addEventListener('click', function () {
    controls.lock();
}, false);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(1, 1, 1);
scene.add(cube);

const collisionCube = new THREE.Mesh(geometry, material);
collisionCube.position.set(0, 2, -10);
collisionCube.scale.set(3, 3, 3);
scene.add(collisionCube);

const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('./assets/images/bricks.png');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(100, 100);

const groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });
const groundGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

function animate() {
    requestAnimationFrame(animate);

    // Update velocity based on keys pressed
    updateVelocity(controls, [cube, collisionCube]);

    // Update stamina
    updateStamina();

    // Update jump
    updateJump(controls);

    // // Check for collision with collisionCube
    // checkCollision(collisionCube);

    renderer.render(scene, camera);
}

animate();
