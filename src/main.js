// main.js
import * as THREE from 'https://jspm.dev/three';
import { PointerLockControls } from 'https://jspm.dev/three/examples/jsm/controls/PointerLockControls.js';
import { keys, player, jump, speed, checkCollision } from './controls.js';

const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Define maximum stamina and initial stamina level
const maxStamina = 100;
let currentStamina = maxStamina;
let isSprinting = false;

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
function updateStaminaBar() {
    const percentage = (currentStamina / maxStamina) * 100;
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

    // Update position of the camera
    if (keys.w) {
        if (isSprinting && currentStamina > 1) {
            controls.moveForward(speed); // Sprinting speed
        } else if (isSprinting && currentStamina < 1) {
            controls.moveForward(speed / 2);
        } else {
            controls.moveForward(speed); // Normal speed
        }
    }
    if (keys.a) {
        if (isSprinting && currentStamina > 1) {
            controls.moveRight(-speed); // Sprinting speed
        } else if (isSprinting && currentStamina < 1) {
            controls.moveRight(-speed / 2);
        } else {
            controls.moveRight(-speed); // Normal speed
        }
    }
    if (keys.s) {
        if (isSprinting && currentStamina > 1) {
            controls.moveForward(-speed); // Sprinting speed
        } else if (isSprinting && currentStamina < 1) {
            controls.moveForward(-speed / 2);
        } else {
            controls.moveForward(-speed); // Normal speed
        }
    }
    if (keys.d) {
        if (isSprinting && currentStamina > 1) {
            controls.moveRight(speed); // Sprinting speed
        } else if (isSprinting && currentStamina < 1) {
            controls.moveRight(speed / 2);
        } else {
            controls.moveRight(speed); // Normal speed
        }
    }
    if (isSprinting && keys.w || isSprinting && keys.a || isSprinting && keys.s || isSprinting && keys.d) {
        currentStamina -= 0.5;
        if (currentStamina < 0) {
            currentStamina = 0;
        }
    }

    if (jump.jumping) {
        controls.getObject().position.y += jump.speed;
        jump.speed -= jump.gravity;
        if (controls.getObject().position.y <= player.height) {
            controls.getObject().position.y = player.height;
            jump.speed = 0;
            jump.jumping = false;
        }
    }

    if (checkCollision(THREE, controls, collisionCube)) {
        const playerPosition = controls.getObject().position.clone();
        const collisionPosition = collisionCube.position.clone();
        const direction = playerPosition.sub(collisionPosition).normalize();
        controls.getObject().position.add(direction.multiplyScalar(speed));
    }

    // Recharge stamina when not sprinting
    if (isSprinting && !keys.w && currentStamina < maxStamina || isSprinting && !keys.a && currentStamina < maxStamina || isSprinting && !keys.s && currentStamina < maxStamina || isSprinting && !keys.d && currentStamina < maxStamina || !isSprinting && currentStamina < maxStamina) {
        currentStamina += 0.2;
        if (currentStamina > maxStamina) {
            currentStamina = maxStamina;
        }
    }

    // Update stamina bar UI
    updateStaminaBar();

    renderer.render(scene, camera);
}

animate();

// Event listeners for keydown and keyup
document.addEventListener('keydown', (e) => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        isSprinting = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        isSprinting = false;
    }
});
