// main.js
import * as THREE from 'three';
import { Octree } from 'three/addons/math/Octree.js';
import { updateStamina, updatePlayer, playerControls } from './controls.js';
import { loadObject, loadModel, loadModelInterior, createBoundingBox, loadPlayer } from './objectLoader.js';
import { scene, camera } from './sceneSetup.js';
import renderer from './sceneSetup.js';

export const worldOctree = new Octree();
export const boundingBox = [];
const clock = new THREE.Clock();

let casualMaleModel;
const mixers = {};

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

loadModelInterior(scene, "roof_light_gym", [0, 0.1, -50], [1, 1, 1], [0, 90, 0]);

loadModel(scene, "ceiling_fan", [20, 0, 0], [5, 2, 5], [0, 90, 0], "Cylinder.001Action", (animationMixer) => {
    mixers["ceiling_fan"] = animationMixer;
});

loadPlayer(scene, "casual_male", [0, 0, 0], [3, 3, 3], [0, 90, 0], "Rig|new_man_walk_in_place", (model, mixer) => {
    casualMaleModel = model;
    mixers["casual_male"] = mixer;
});

loadModelInterior(scene, "barbell_chair", [0, 0, 50], [10, 10, 10], [0, 90, 0]);
createBoundingBox(scene, [0.13, 0.5, 49.85], [7, 4.6, 2.9], [0, 0, 0], worldOctree, boundingBox);

loadModelInterior(scene, "barbells", [0, 0, 50], [10, 10, 10], [0, 90, 0]);
createBoundingBox(scene, [-2.9, 5.5, 50], [2.7, 2.7, 10.2], [0, 0, 0], worldOctree, boundingBox);

loadModelInterior(scene, "treadmill", [10, 0, 50], [9, 9, 9], [0, 90, 0]);
createBoundingBox(scene, [9.4, 0, 50], [6.8, 2.45, 4], [0, 0, 0], worldOctree, boundingBox);
createBoundingBox(scene, [13.7, 2.45, 50], [1.8, 7, 4], [0, 0, 0], worldOctree, boundingBox);  
createBoundingBox(scene, [12, 2.45, 51.7], [5, 6, 0.4], [0, 0, 0], worldOctree, boundingBox);  
createBoundingBox(scene, [12, 2.45, 48.3], [5, 6, 0.4], [0, 0, 0], worldOctree, boundingBox);  

function animate() {
    const deltaTime = Math.min(0.05, clock.getDelta());

    playerControls(deltaTime);

    updatePlayer(deltaTime);
    // Update stamina
    updateStamina();

    // Check if casualMaleModel is assigned before accessing its position
    if (casualMaleModel) {
        // Update the position of the casual male model to match the camera's position
        const cameraPosition = camera.position;
        casualMaleModel.position.copy(cameraPosition);
        casualMaleModel.position.y -= 5;
        casualMaleModel.position.x -= 0.4;
    }

    for (const mixerName in mixers) {
        if (mixers.hasOwnProperty(mixerName)) {
            mixers[mixerName].update(deltaTime);
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
console.log(worldOctree);