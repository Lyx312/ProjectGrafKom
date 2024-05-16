// main.js
import * as THREE from 'three';
import { Octree } from 'three/addons/math/Octree.js';
import { controls, updateStamina, updatePlayer, playerControls, getPlayerLookDirection, getMoveDirection, getCameraOffset, player } from './controls.js';
import { loadObject, loadModel, loadModelInterior, createBoundingBox, loadPlayer } from './objectLoader.js';
import { scene, camera, updateBackground } from './sceneSetup.js';
import renderer from './sceneSetup.js';
import { doorAnimation } from './objectAnimation.js';

export const worldOctree = new Octree();
export const boundingBox = [];
const clock = new THREE.Clock();

let casualMaleModel;
const mixers = {};
let playerAnimations;
let fanModel = {};

export const interactibles = {};

// Set up the ground
const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('./assets/images/road.jpg');
groundTexture.wrapS = THREE.RepeatWrapping;
groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(25, 25);

const groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });
const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
worldOctree.fromGraphNode(ground);

// loadObject(scene, "deer_small", [3, 0, -9], [1, 1, 1], [0, 0, 0]);
// createBoundingBox(scene, [2.6, 0.5, -7.7], [2, 15.5, 7], [0, 0, 0], worldOctree, boundingBox);

// loadObject(scene, "mickey_small", [-8, 4.5, -13], [1, 1, 1], [0, 90, 0]);
// createBoundingBox(scene, [-8.3, 0.5, -12.9], [4.6, 17, 6], [0, 0, 0], worldOctree, boundingBox);

loadModelInterior(scene, "new_room_2", [0, 0.1, -30], [1, 1, 1], [0, 90, 0]);

loadModelInterior(scene, "door", [-10.65, 0.1, 12], [1, 1, 1], [0, 90, 0], interactibles, [-14, 9, 12])
// createBoundingBox(scene, [-14, 7, 11.5], [2.5, 13, 6.5], [0, 90, 0], worldOctree, boundingBox)

loadModelInterior(scene, "yoga_mat", [20, 0.1, 0], [3, 3, 3], [0, 90, 0]);

loadModelInterior(scene, "gym_decoration_1_v2", [-24, 0.1, -29], [11, 11, 11], [0, 90, 0]);

loadModelInterior(scene, "punching_bag_1", [-20.035, 0.1, 1.2], [11, 11, 11], [0, 90, 0], interactibles, [-20.035, 9, 1.2]);

loadModelInterior(scene, "punching_bag_2", [-19.69, 0.1, -13.2], [11, 11, 11], [0, 90, 0], interactibles, [-19.69, 9, -13.2]);

loadModelInterior(scene, "gym_decoration_2", [28.5, 3, -28], [9, 9, 9], [0, -90, 0]);

loadModelInterior(scene, "gym_decoration_3", [-10, 0.1, -50], [10, 10, 10], [0, 90, 0]);

loadModel(scene, "ceiling_fan", [0, 11, -10], [10, 2.8, 10], [0, 90, 0], function(mixer) {
    fanModel["one"] = mixer.getRoot();
});

loadModel(scene, "ceiling_fan", [0, 11, -45], [10, 2.8, 10], [0, 90, 0], function(mixer) {
    fanModel["two"] = mixer.getRoot();
});

loadPlayer(scene, "casual_male", [0, 0, 0], [player.height * 0.72, player.height * 0.72, player.height * 0.72], [0, 0, 0], (model, mixer, animations) => {
    casualMaleModel = model;
    mixers["casual_male"] = mixer;
    playerAnimations = animations;
});

loadModelInterior(scene, "barbell_chair", [-10, 0, -40], [10, 10, 10], [0, 90, 0]);
createBoundingBox(scene, [-10.13, 0.5, -40.15], [7, 4.6, 2.9], [0, 0, 0], worldOctree, boundingBox);

loadModelInterior(scene, "barbells", [-10, 0, -40], [10, 10, 10], [0, 90, 0], interactibles, [-10, 9, -40]);
createBoundingBox(scene, [-12.9, 5.5, -40], [2.7, 2.7, 10.2], [0, 0, 0], worldOctree, boundingBox);

loadModelInterior(scene, "treadmill", [10, 0, -50], [10, 10, 10], [0, 90, 0], interactibles, [10, 9, -50]);
createBoundingBox(scene, [9.4, 0, -50], [6.8, 2.45, 4], [0, 0, 0], worldOctree, boundingBox);
createBoundingBox(scene, [14, 2.45, -50], [2, 8.3, 4], [0, 0, 0], worldOctree, boundingBox);
createBoundingBox(scene, [12, 2.45, -51.7], [5, 6, 0.4], [0, 0, 0], worldOctree, boundingBox);
createBoundingBox(scene, [12, 2.45, -48.3], [5, 6, 0.4], [0, 0, 0], worldOctree, boundingBox);

createBoundingBox(scene, [30, 7, -27.5], [3, 8, 80], [0, 0, 0], worldOctree, boundingBox);
createBoundingBox(scene, [-28, 7, -28], [3, 8, 80], [0, 0, 0], worldOctree, boundingBox);
createBoundingBox(scene, [9, 7, 11.5], [2.5, 8, 39.5], [0, 90, 0], worldOctree, boundingBox);
createBoundingBox(scene, [-23.5, 7, 11.5], [2.5, 8, 12], [0, 90, 0], worldOctree, boundingBox);
createBoundingBox(scene, [0.5, 7, -66.5], [2.5, 8, 57], [0, 90, 0], worldOctree, boundingBox);
createBoundingBox(scene, [1, 20, -27.5], [79, 1, 59], [0, 90, 0], worldOctree, boundingBox);

//createBoundingBox(scene, [30, player.height + player.width + 0.5, 1], [player.width * 2, 1, player.width * 2], [0, 0, 0], worldOctree, boundingBox)

const geometry = new THREE.CylinderGeometry(player.width / 2, player.width / 2, player.height + player.width, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }); // Yellow, wireframe material
export const capsuleMesh = new THREE.Mesh(geometry, material);
capsuleMesh.visible = false;
scene.add(capsuleMesh);

let modelOffset = new THREE.Vector3();
let cameraLookDirectionBack = new THREE.Vector3();

function animate() {
    const deltaTime = Math.min(0.05, clock.getDelta());
    
    updateBackground(clock);

    playerControls(deltaTime);

    updatePlayer(deltaTime);
    // Update stamina
    updateStamina();

    // Check if casualMaleModel is assigned before accessing its position
    if (casualMaleModel) {
        if (!player.cheat) {

            // Get the player's look direction
            const lookDirection = getPlayerLookDirection();
            const moveDirection = getMoveDirection();
    
            // Calculate a position slightly behind or in front of the camera in the look direction
            modelOffset.set(Math.cos(lookDirection), 0, Math.sin(lookDirection));
            modelOffset.multiplyScalar(getCameraOffset() + ((player.sprintMultiplier != 1 && moveDirection == "forward") ? player.height * 0.1 : 0));
    
            casualMaleModel.position.copy(camera.position);
            casualMaleModel.position.y -= player.height + player.width / 2;
    
            // Rotate the model to face the direction the camera is looking
            casualMaleModel.rotation.y = -lookDirection + Math.PI / 2;
    
            // Adjust the camera position based on the view mode
            switch (player.viewMode) {
                case 0: // First person view
                    camera.position.add(modelOffset);
                    break;
                case 1: // Third person back view
                    controls.getDirection(cameraLookDirectionBack);
                    camera.position.add(cameraLookDirectionBack.multiplyScalar(getCameraOffset()));
                    break;
            }
            camera.position.y += player.height / 17;
    
            // Play the correct animation
            if (moveDirection == "forward" && player.sprintMultiplier != 1) {
                playAnimation("Rig|new_man_run_in_place");
            } else if (moveDirection == "forward") {
                playAnimation("Rig|new_man_walk_in_place");
            } else if (moveDirection == "left") {
                playAnimation("Rig|new_man_walk_left_in_place");
            } else if (moveDirection == "right") {
                playAnimation("Rig|new_man_walk_right_in_place");
            } else {
                playAnimation("Rig|new_man_idle");
            }
        } else {
            playAnimation("Rig|new_man_idle");
        }

    }

    for (const fanName in fanModel) {
        if (fanModel.hasOwnProperty(fanName)) {
            // Rotate the fan model on the x-axis
            fanModel[fanName].rotation.y += deltaTime * 10; // Adjust the speed of rotation as needed
        }
    }

    for (const mixerName in mixers) {
        if (mixers.hasOwnProperty(mixerName)) {
            mixers[mixerName].update(deltaTime);
        }
    }

    doorAnimation(interactibles);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


function playAnimation(animationName) {
    for (let anim in playerAnimations) {
        if (playerAnimations.hasOwnProperty(anim)) {
            if (anim === animationName) {
                playerAnimations[anim].play();
            } else {
                playerAnimations[anim].stop();
            }
        }
    }
}

animate();