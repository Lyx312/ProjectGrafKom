// main.js
import * as THREE from 'three';
import { updateVelocity, updateJump, updateStamina } from './controls.js';
import { loadObject, loadModel } from './objectLoader.js';
import { scene, camera } from './sceneSetup.js';
import renderer from './sceneSetup.js';
import controls from './inputHandler.js';

const collidable = [];

// Set up the ground
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

// Set up the objects
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(1, 1, 1);
scene.add(cube);

const collisionCube = new THREE.Mesh(geometry, material);
collisionCube.position.set(0, 2, -10);
collisionCube.scale.set(3, 3, 3);
scene.add(collisionCube);

loadObject(scene, "deer_small", [3, 0, -9], [1, 1, 1], [0, 0, 0], collidable);
loadObject(scene, "mickey_small", [-8, 4.5, -13], [1, 1, 1], [0, 90, 0], collidable);
loadModel(scene, "modular_gym", [0, 0.1, -50], [1, 1, 1], [0, 90, 0]);

function animate() {
    requestAnimationFrame(animate);

    // Update velocity based on keys pressed
    updateVelocity(controls, collidable);

    // Update stamina
    updateStamina();

    // Update jump
    updateJump(controls);

    renderer.render(scene, camera);
}

animate();
