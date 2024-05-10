// main.js
import * as THREE from 'three';
import { Octree } from 'three/addons/math/Octree.js';
import { updateStamina, updatePlayer, playerControls } from './controls.js';
import { loadObject, loadModel, loadModelInterior, createBoundingBox } from './objectLoader.js';
import { scene, camera } from './sceneSetup.js';
import renderer from './sceneSetup.js';

export const worldOctree = new Octree();
export const boundingBox = [];
const clock = new THREE.Clock();

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
worldOctree.fromGraphNode(ground);

loadObject(scene, "deer_small", [3, 0, -9], [1, 1, 1], [0, 0, 0]);
createBoundingBox(scene, [2.6, 0.5, -7.7], [2, 15.5, 7], [0, 0, 0], worldOctree, boundingBox);

loadObject(scene, "mickey_small", [-8, 4.5, -13], [1, 1, 1], [0, 90, 0]);
createBoundingBox(scene, [-8.3, 0.5, -12.9], [4.6, 17, 6], [0, 0, 0], worldOctree, boundingBox);

loadModel(scene, "modular_gym", [0, 0.1, -50], [1, 1, 1], [0, 90, 0]);

loadModelInterior(scene, "barbell_set", [0, 0, 50], [10, 10, 10], [0, 90, 0]);
createBoundingBox(scene, [12.4, 0.5, 38.9], [7, 4.6, 2.9], [0, 0, 0], worldOctree, boundingBox);
createBoundingBox(scene, [9.4, 5.5, 38.9], [2.7, 2.7, 10.2], [0, 0, 0], worldOctree, boundingBox);

loadModelInterior(scene, "barbells", [10, 0, 50], [10, 10, 10], [0, 90, 0]);
createBoundingBox(scene, [16.4, 5.2, 51.3], [2.7, 2.7, 10.2], [0, 0, 0], worldOctree, boundingBox);

function animate() {
    const deltaTime = Math.min(0.05, clock.getDelta())

    playerControls(deltaTime);

    updatePlayer(deltaTime);
    // Update stamina
    updateStamina();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
console.log(worldOctree);