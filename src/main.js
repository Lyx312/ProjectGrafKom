// Import necessary modules from three.js
import * as THREE from 'https://jspm.dev/three';
import { PointerLockControls } from 'https://jspm.dev/three/examples/jsm/controls/PointerLockControls.js';
import { keys, player, jump, speed, checkCollision } from './controls.js';

// Create a scene, camera, and renderer
const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Update the camera and renderer on window resize
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// Change the background color of the scene
scene.background = new THREE.Color(0xdddddd);

// Add PointerLockControls
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject()); // Add controls to the scene

// Set initial position of the camera
controls.getObject().position.y = player.height;

// Add an event listener for the 'click' event on the document
document.addEventListener('click', function () {
    controls.lock();
}, false);

// Create a geometry and material for a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Add the cube to the scene
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Create a second cube for collision
const collisionCube = new THREE.Mesh(geometry, material);
collisionCube.position.set(0, 2, -10); // Position the collision cube in front of the player
collisionCube.scale.set(3, 3, 3); // Set the scale to make it bigger
scene.add(collisionCube);

// Create a texture loader
const textureLoader = new THREE.TextureLoader();

// Load the texture for the ground
const groundTexture = textureLoader.load('./assets/images/bricks.png');

// Repeat the texture across the ground
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(100, 100); // Adjust the number of repetitions as needed

// Create a ground material using the texture
const groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });

// Create a ground plane
const groundGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Rotate to lay flat
scene.add(ground);

// Animate the scene
function animate() {
    requestAnimationFrame(animate);

    // Update position of the camera

    if (keys.w) {
        controls.moveForward(speed);
    }
    if (keys.a) {
        controls.moveRight(-speed);
    }
    if (keys.s) {
        controls.moveForward(-speed);
    }
    if (keys.d) {
        controls.moveRight(speed);
    }

    // Jumping
    if (jump.jumping) {
        controls.getObject().position.y += jump.speed;
        jump.speed -= jump.gravity;
        if (controls.getObject().position.y <= player.height) {
            controls.getObject().position.y = player.height;
            jump.speed = 0;
            jump.jumping = false;
        }
    }

    // Check collision and handle player movement
    if (checkCollision(THREE, controls, collisionCube)) {
        const playerPosition = controls.getObject().position.clone();
        const collisionPosition = collisionCube.position.clone();

        const direction = playerPosition.sub(collisionPosition).normalize();

        controls.getObject().position.add(direction.multiplyScalar(speed));
    }

    renderer.render(scene, camera);
}

animate();
