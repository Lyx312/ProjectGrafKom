// main.js
import * as THREE from 'three';
import { Octree } from 'three/addons/math/Octree.js';
import Stats from 'three/addons/libs/stats.module.js';
import { controls, updateStamina, updatePlayer, playerControls, getPlayerLookDirection, getMoveDirection, getCameraOffset, player } from './controls.js';
import { loadModel, loadModelInterior, createBoundingBox, loadPlayer, createBoundingCylinder, loadGroundModel, loadAnimatedModel, loadAudio, loadAnimatedModelInterior } from './objectLoader.js';
import { scene, camera, updateBackground, renderer, composer, outlinePass } from './sceneSetup.js';
import { doorAnimation, punchingBag1Animation, punchingBag2Animation, barbellsAnimation, treadmillAnimation, bikeAnimation, lockerAnimation, carAnimation, bandAnimation, dumpsterAnimation } from './objectAnimation.js';
import { changeDayOverlay, updateDebugScreen, startScreen, startButton, loadingBar, loadingBarContainer, title } from './uiSetup.js';
import { doctor, girl, introMonolog } from './npcInteraction.js';

const loadingManager = new THREE.LoadingManager();
export const worldOctree = new Octree();
export let updateableCollision = [];
const clock = new THREE.Clock();
export const stats = new Stats();

//init raycasting
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(); // crosshair position
// set pointer location to center of the window
pointer.x = 0;
pointer.y = 0;

function traverseUntilLastParent(obj) {
    if (obj.parent == scene) return obj;
    else {
        return traverseUntilLastParent(obj.parent);
    }
}
function createTextElement(text, top, left) {
    const textElement = document.createElement('div');
    textElement.innerText = text;
    textElement.style.position = 'absolute';
    textElement.style.top = top;
    textElement.style.left = left;
    textElement.style.fontSize = '1.5em';
    textElement.style.fontFamily = 'Arial, sans-serif';
    textElement.style.color = 'white';
    textElement.style.padding = '5px 10px';
    textElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    textElement.style.borderRadius = '5px';
    return textElement;
}

// Create text elements
const staminaText = createTextElement('', '10px', '10px');
const speedText = createTextElement('', '50px', '10px');
const strengthText = createTextElement('', '90px', '10px');

// Append text elements to the body
document.body.appendChild(staminaText);
document.body.appendChild(speedText);
document.body.appendChild(strengthText);

const equipmentStats = {
    barbells: { stamina: '-20 stamina', speed: '+0 speed', strength: '+10 strength' },
    punching: { stamina: '-1 stamina', speed: '+0 speed', strength: '+1 strength' },
    exercise: { stamina: '-10 stamina', speed: '+10 speed', strength: '+0 strength' },
    treadmill: { stamina: '-10 stamina', speed: '+10 speed', strength: '+0 strength' },
};

let hoveredInteractable;
function raycasting() {
    outlinePass.selectedObjects = [];

    if (player.inDialog || player.pause) {
        return;
    }

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    const cameraOffset = getCameraOffset();
    const maxDistance = 20 - cameraOffset;
    const minDistance = -cameraOffset;

    // console.log('intersects:',intersects);
    hoveredInteractable = "";
    // hideInteractables();

    for (const intersect of intersects) {
        if (intersect.object.interact && intersect.distance > minDistance && intersect.distance<maxDistance) {
            const name = intersect.object.interact;

            if (interactables[name].isAnimating) {
                continue;
            }
            if (name.startsWith("object_exercise_bike_") && interactables[`object_bike_pedals_${parseInt(name.replace("object_exercise_bike_", ""))}`].isAnimating) {
                continue;
            }

            const object = traverseUntilLastParent(intersect.object);
            outlinePass.selectedObjects = [object];
            hoveredInteractable = name;
            if (!name.startsWith("npc_") && !name.startsWith("object_door_") && !name.startsWith("object_locker_door_") && !name.startsWith("object_lowpoly_car_")) {
                const equipmentTypes = name.split('_');
                const equipmentType = equipmentTypes[1];
                const stats = equipmentStats[equipmentType];
                if (stats) {
                    staminaText.innerText = stats.stamina;
                    speedText.innerText = stats.speed;
                    strengthText.innerText = stats.strength;

                    staminaText.style.visibility = 'visible';
                    speedText.style.visibility = 'visible';
                    strengthText.style.visibility = 'visible';
                }
            }
            //console.log(name)

            if (name.startsWith("object_exercise_bike_")) {
                let number = parseInt(name.replace("object_exercise_bike_", ""));
                outlinePass.selectedObjects.push(traverseUntilLastParent(interactables[`object_bike_pedals_${number}`].model));
                hoveredInteractable = `object_bike_pedals_${number}`;
            } else if (name.startsWith("object_bike_pedals_")) {
                let number = parseInt(name.replace("object_bike_pedals_", ""));
                outlinePass.selectedObjects.push(traverseUntilLastParent(interactables[`object_exercise_bike_${number}`].model));
            }
            // if (!interactables[name].isAnimating) showInteractables(name);
            // if (isInteracting()) {
            //     interactables[name].isAnimating = true;
            // }
            console.log(hoveredInteractable);
            break;
        }
        else{
            staminaText.style.visibility = 'hidden';
            speedText.style.visibility = 'hidden';
            strengthText.style.visibility = 'hidden';
        }
    }
}

document.addEventListener('click', function () {
    if (controls.isLocked && !player.pause) {
        if (hoveredInteractable.startsWith("object")) {
            interactables[hoveredInteractable].startAnimation(interactables[hoveredInteractable]);
        } else if (hoveredInteractable.startsWith("npc")) {
            interactables[hoveredInteractable].startDialog(interactables[hoveredInteractable]);
        }
    } else if (!player.inDialog) {
        controls.lock();
    }
}, false);

let casualMaleModel;
const mixers = {};
let playerAnimations;
let fanModel = {};

const interactables = {};

// Set up the ground
loadGroundModel(loadingManager, scene, "ground_road", worldOctree, [0, -0.1, 0], [10, 10, 10], [0, 0, 0]);

// const textureLoader = new THREE.TextureLoader();
// const groundTexture = textureLoader.load('./assets/images/road.jpg');
// groundTexture.wrapS = THREE.RepeatWrapping;
// groundTexture.wrapT = THREE.RepeatWrapping;
// groundTexture.repeat.set(25, 25);

// const groundMaterial = new THREE.MeshBasicMaterial({ map: groundTexture });
// const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
// const ground = new THREE.Mesh(groundGeometry, groundMaterial);
// ground.rotation.x = -Math.PI / 2;
// ground.receiveShadow = true;
// scene.add(ground);
// worldOctree.fromGraphNode(ground);

// loadObject(scene, "deer_small", [3, 0, -9], [1, 1, 1], [0, 0, 0]);
// createBoundingBox(scene, [2.6, 0.5, -7.7], [2, 15.5, 7], [0, 0, 0], worldOctree, boundingBox);

// loadObject(scene, "mickey_small", [-8, 4.5, -13], [1, 1, 1], [0, 90, 0]);
// createBoundingBox(scene, [-8.3, 0.5, -12.9], [4.6, 17, 6], [0, 0, 0], worldOctree, boundingBox);

loadModelInterior(loadingManager, scene, "new_room_5", [0, 0.1, -30], [1, 1, 1], [0, 90, 0]);

loadModelInterior(loadingManager, scene, "door", [-10.65, 0.1, 12], [1, 1, 1], [0, 90, 0], interactables, doorAnimation)

loadModelInterior(loadingManager, scene, "yoga_mat", [20, 0.1, 0], [3, 3, 3], [0, 90, 0]);

loadModelInterior(loadingManager, scene, "gym_decoration_1_v2", [-24, 0.1, -29], [11, 11, 11], [0, 90, 0]);
createBoundingBox(scene, [-25, 6, -27.8], [1, 6, 12.2], [0, 0, 0], worldOctree)

loadModelInterior(loadingManager, scene, "punching_bag_1", [-20.2, 0.1, 1.2], [11, 11, 11], [0, 0, 0], interactables, punchingBag1Animation);
createBoundingCylinder(scene, [-20.1, 8, 1.1], [1.5, 2, 1.5], [0, 0, 0], worldOctree)

loadModelInterior(loadingManager, scene, "punching_bag_2", [-20, 0.1, -12.8], [11, 11, 11], [0, 0, 0], interactables, punchingBag2Animation);
createBoundingCylinder(scene, [-20.1, 7, -13.1], [1.5, 5, 1.5], [0, 0, 0], worldOctree)

loadModelInterior(loadingManager, scene, "gym_decoration_2_v2", [28.7, 3, -28], [9, 9, 9], [0, -90, 0]);
createBoundingBox(scene, [26, 14, -23.3], [3, 1, 7.5], [0, 0, 0], worldOctree)

loadAnimatedModelInterior(loadingManager, scene, "band_1", [28.8, 10.05, -35.05], [9, 9, 9], [0, -90, 0], bandAnimation);
loadAnimatedModelInterior(loadingManager, scene, "band_2", [28.8, 10.05, -34.64], [9, 9, 9], [0, -90, 0], bandAnimation);
loadAnimatedModelInterior(loadingManager, scene, "band_3", [28.8, 10.05, -33.85], [9, 9, 9], [0, -90, 0], bandAnimation);
loadAnimatedModelInterior(loadingManager, scene, "band_4", [28.8, 10.05, -33.42], [9, 9, 9], [0, -90, 0], bandAnimation);

loadModelInterior(loadingManager, scene, "gym_decoration_3", [-10, 0.1, -50], [10, 10, 10], [0, 90, 0]);

loadModel(loadingManager, scene, "ceiling_fan", [0, 11, -10], [10, 2.8, 10], [0, 90, 0], function (mixer) {
    fanModel["one"] = mixer.getRoot();
});

loadModel(loadingManager, scene, "ceiling_fan", [0, 11, -45], [10, 2.8, 10], [0, 90, 0], function (mixer) {
    fanModel["two"] = mixer.getRoot();
});

loadPlayer(loadingManager, scene, "casual_male", [0, 0, 0], [player.height * 0.72, player.height * 0.72, player.height * 0.72], [0, 0, 0], (model, mixer, animations) => {
    casualMaleModel = model;
    mixers["casual_male"] = mixer;
    playerAnimations = animations;
});

for (let i = 0; i < 2; i++) {
    loadModelInterior(loadingManager, scene, "barbell_chair", [-10, 0, -40+(i*15)], [10, 10, 10], [0, 90, 0]);
    createBoundingBox(scene, [-10.13, 2, -40.15+(i*15)], [7, 2, 2.9], [0, 0, 0], worldOctree);
    loadModelInterior(loadingManager, scene, "barbells", [-10, 0, -40+(i*15)], [10, 10, 10], [0, 90, 0], interactables, barbellsAnimation, i);
    createBoundingBox(scene, [-12.9, 5.5, -40+(i*15)], [2.7, 2.7, 10.2], [0, 0, 0], worldOctree);
}

for (let i = 0; i < 2; i++) {
    loadModelInterior(loadingManager, scene, "treadmill", [15, 0, -45+(i*8)], [10, 10, 10], [0, 90, 0], interactables, treadmillAnimation, i);
    createBoundingBox(scene, [14.4, 1, -45+(i*8)], [6.8, 1, 4], [0, 0, 0], worldOctree);
    createBoundingBox(scene, [19, 3.5, -45+(i*8)], [2, 6, 4], [0, 0, 0], worldOctree);
    createBoundingBox(scene, [17, 5.5, -46.8+(i*8)], [5, 0.5, 0.5], [0, 0, 0], worldOctree);
    createBoundingBox(scene, [17, 5.5, -43.2+(i*8)], [5, 0.5, 0.5], [0, 0, 0], worldOctree);
}

createBoundingBox(scene, [30, 10, -27.5], [3, 18, 80], [0, 0, 0], worldOctree);
createBoundingBox(scene, [-28, 10, -28], [3, 18, 80], [0, 0, 0], worldOctree);
createBoundingBox(scene, [9, 10, 11.5], [2.5, 18, 39.5], [0, 90, 0], worldOctree);
createBoundingBox(scene, [-23.5, 10, 11.5], [2.5, 18, 12], [0, 90, 0], worldOctree);
createBoundingBox(scene, [0.5, 10, -66.5], [2.5, 18, 57], [0, 90, 0], worldOctree);
createBoundingBox(scene, [1, 20, -27.5], [79, 1, 59], [0, 90, 0], worldOctree);
createBoundingBox(scene, [-14, 16.5, 11.5], [2.5, 5, 10], [0, 90, 0], worldOctree);

loadModelInterior(loadingManager, scene, "Gym_Poster", [-7.65, 7.9, 11.3], [4, 4, 4], [0, 180, 0]);

loadAnimatedModel(loadingManager, scene, "mujer_bodytech", "workout_girl", [5, 0, 0], [0.13, 0.13, 0.13], [0, 180, 0], "Take 001", interactables, girl, (animationMixer) => {
    mixers["mujer_bodytech"] = animationMixer;
});
createBoundingCylinder(scene, [5, 5, 0], [1.5, 10, 1.5], [0, 0, 0], worldOctree)

loadAnimatedModel(loadingManager, scene, "dr_ahmad_sitting_pose", "Dr.Ahmad", [10, 1, 20], [3, 3, 3], [0, 0, 0], "mixamo.com", interactables, doctor, (animationMixer) => {
    mixers["dr_ahmad_sitting_pose"] = animationMixer;
});
createBoundingCylinder(scene, [10, 5, 21], [2, 10, 2], [0, 0, 0], worldOctree)

loadModelInterior(loadingManager, scene, "lowpoly_car", [-50, 0, -20], [7, 7, 7], [0, 90, 0], interactables, carAnimation);
createBoundingBox(scene, [-22, 7, 50.5], [34, 8, 14], [0, 0, 0], worldOctree);

for (let i = 0; i < 2; i++) {
    loadModelInterior(loadingManager, scene, "exercise_bike", [15, 0, -25+(i*8)], [3, 3, 3], [0, 90, 0], interactables, null , i);
    loadModelInterior(loadingManager, scene, "bike_pedals", [13.2, 2.4, -25+(i*8)], [3, 3, 3], [0, 180, 0], interactables, bikeAnimation, i);
    createBoundingBox(scene, [15, 4, -25+(i*8)], [9, 8, 2], [0, 0, 0], worldOctree);
}

for (let i = 0; i < 10; i++) {
    loadModelInterior(loadingManager, scene, "locker", [26-(i*4), 0.2, -63.5], [8, 8, 8], [0, 0, 0]);
    loadModelInterior(loadingManager, scene, "locker_door", [28-(i*4), 0.2, -61.5], [8, 8, 8], [0, 0, 0], interactables, lockerAnimation, i);
    createBoundingBox(scene, [24-(i*4), 7.5, -63.5], [0.5, 14, 4], [0, 0, 0], worldOctree);
    createBoundingBox(scene, [26-(i*4), 14.5, -63.5], [4, 0, 4], [0, 0, 0], worldOctree);
}
createBoundingBox(scene, [28, 7.5, -63.5], [0.5, 14, 4], [0, 0, 0], worldOctree);

loadModelInterior(loadingManager, scene, "bench", [10, 0, 20], [8, 8, 8], [0, 0, 0]);
createBoundingBox(scene, [10, 4, 18], [18, 1, 7], [0, 0, 0], worldOctree);
createBoundingBox(scene, [10, 7, 15], [18, 2, 5], [65, 0, 0], worldOctree);

//createBoundingBox(scene, [30, player.height + player.width + 0.5, 1], [player.width * 2, 1, player.width * 2], [0, 0, 0], worldOctree, boundingBox)

loadModelInterior(loadingManager, scene, "dumpster_base", [20, 0, -72.5], [1, 1, 1], [0, 90, 0]);
loadModelInterior(loadingManager, scene, "dumpster_lid", [20, 9.4, -68], [1, 1, 1], [0, 90, 0], interactables, dumpsterAnimation);
createBoundingBox(scene, [13.75, 5.5, -72], [0.5, 5, 10], [-20, 0, 0], worldOctree);
createBoundingBox(scene, [20, 4, -77.25], [12, 4, 0.5], [0, 0, 0], worldOctree);
createBoundingBox(scene, [26.5, 5.5, -72], [0.5, 5, 10], [-20, 0, 0], worldOctree);
// createBoundingBox(scene, [13.5, 3.5, -72.5], [0.5, 5, 10], [0, 0, 0], worldOctree);
// createBoundingBox(scene, [26.5, 3.5, -72.5], [0.5, 5, 10], [0, 0, 0], worldOctree);

const audioPosition = new THREE.Vector3(0,17,-65); // Example position
const audioVolume = 2; // Example volume (0.0 to 1.0)
const audioFile = '../assets/audio/chill_workout.mp3';
const loopAudio = true; // Example: Loop the audio

// Call the function to load the audio
const audio = loadAudio(loadingManager, scene, audioFile, audioPosition, audioVolume, loopAudio);

loadModelInterior(loadingManager, scene, "speaker", [0,16,-65.2], [2, 2, 2], [0, -90, 0]);

const capsuleGeometry = new THREE.CapsuleGeometry(player.width/2, player.height);
const capsuleMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }); // Yellow, wireframe material
export const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
capsuleMesh.visible = false;
scene.add(capsuleMesh);

let modelOffset = new THREE.Vector3();
let cameraLookDirectionBack = new THREE.Vector3();

let lastRaycastTime = 0;
const raycastInterval = 0.1; // run raycasting every 0.1 seconds

document.addEventListener("DOMContentLoaded", function () {
    loadingBarContainer.appendChild(loadingBar);
    startScreen.appendChild(title);
    startScreen.appendChild(startButton);
    startScreen.appendChild(loadingBarContainer);
    document.body.appendChild(startScreen);

    // Function to enable start button when assets are loaded
    function enableStartButton() {
        startButton.style.backgroundColor = "green";
        startButton.style.cursor = "pointer";
        startButton.disabled = false;
        startButton.style.transform = "scale(1.05)";
    }

    // Add click event to the button
    startButton.addEventListener("click", function () {
        if (!startButton.disabled) {
            const intro = document.getElementById("intro-overlay");
            intro.style.display = "flex";
            document.body.removeChild(startScreen); // Remove start screen
            setTimeout(() => {
                audio.play();
                document.body.removeChild(intro);
                changeDayOverlay(1, player.str, player.spd);
                introMonolog();
            }, 100);
        }
    });

    // Simulate loading of assets
    const loadingManager = {
        totalAssets: 10, // Assume 10 assets for this example
        loadedAssets: 0,
        onLoad: function () {
            this.loadedAssets++;
            const progress = (this.loadedAssets / this.totalAssets) * 100;
            loadingBar.style.width = `${progress}%`;

            if (this.loadedAssets === this.totalAssets) {
                console.log('All assets loaded.');
                enableStartButton(); // Enable the start button
                // Rest of your onLoad functionality
                animate();

                // door collision
                createBoundingBox(scene, [-14, 7, 11.5], [6.5, 13, 1.7], [0, 0, 0], null, (collision) => {
                    updateableCollision.push(collision);
                    interactables["object_door_0"].collision = collision;
                });

                // dumpster collision
                createBoundingBox(scene, [20, 8, -72.5], [13, 1, 10], [-20, 0, 0], null, (collision) => {
                    updateableCollision.push(collision);
                    interactables["object_dumpster_lid_0"].collision = collision;
                });

                // locker collisions
                for (let i = 0; i < 10; i++) {
                    createBoundingBox(scene, [26 - (i * 4), 7.5, -61.5], [4, 14, 0.5], [0, 0, 0], null, (collision) => {
                        updateableCollision.push(collision);
                        interactables[`object_locker_door_${i}`].collision = collision;
                    });
                }
            }
        }
    };

    // Simulate asset loading (for demonstration purposes)
    for (let i = 0; i < loadingManager.totalAssets; i++) {
        setTimeout(() => loadingManager.onLoad(), 300 * (i + 1)); // Simulate a staggered load time
    }
});


function animate() {
    const deltaTime = Math.min(0.05, clock.getDelta());
    const currentTime = clock.getElapsedTime();

    // Update audio volume at specified intervals
    if (currentTime - lastUpdateTime >= updateInterval) {
        updateAudioVolume();
        lastUpdateTime = currentTime;
    }

    // Existing code
    updateBackground(player.currentStamina); // Pass the player's current stamina

    if (currentTime - lastRaycastTime > raycastInterval) {
        raycasting();
        lastRaycastTime = currentTime;
    }

    playerControls(deltaTime);
    updatePlayer(deltaTime);
    updateStamina();
    updatePlayerModelPositionAndAnimation(deltaTime);
    updateFanRotation(deltaTime);
    updateMixers(deltaTime);
    stats.update();
    updateDebugScreen();
    composer.render();

    // renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function updateFanRotation(deltaTime) {
    for (const fanName in fanModel) {
        if (fanModel.hasOwnProperty(fanName)) {
            // Rotate the fan model on the x-axis
            fanModel[fanName].rotation.y += deltaTime * 10; // Adjust the speed of rotation as needed
        }
    }
}

function updateMixers(deltaTime) {
    for (const mixerName in mixers) {
        if (mixers.hasOwnProperty(mixerName)) {
            mixers[mixerName].update(deltaTime);
        }
    }
}

async function updatePlayerModelPositionAndAnimation() {
    if (!player.cheat) {
        const lookDirection = getPlayerLookDirection();
        const moveDirection = getMoveDirection();

        modelOffset.set(Math.cos(lookDirection), 0, Math.sin(lookDirection));
        modelOffset.multiplyScalar(getCameraOffset() + ((player.sprintMultiplier != 1 && (moveDirection == "forward" || player.pause)) ? player.height * 0.1 : 0));

        if (camera.position == undefined) {
            await new Promise(resolve => setTimeout(resolve, 100)); 
        }
        
        casualMaleModel.position.copy(camera.position);
        casualMaleModel.position.y -= player.height + player.width / 2;
        casualMaleModel.rotation.y = -lookDirection + Math.PI / 2;

        switch (player.viewMode) {
            case 0:
                camera.position.add(modelOffset);
                break;
            case 1:
                controls.getDirection(cameraLookDirectionBack);
                camera.position.add(cameraLookDirectionBack.multiplyScalar(getCameraOffset()));
                break;
        }
        camera.position.y += player.height / 17;

        if (!player.pause) handlePlayerAnimations(moveDirection);
    } else {
        playPlayerAnimation("Rig|new_man_idle");
    }
}

function handlePlayerAnimations(moveDirection) {
    if (moveDirection === "forward" && player.sprintMultiplier !== 1) {
        playPlayerAnimation("Rig|new_man_run_in_place");
    } else if (moveDirection === "forward") {
        playPlayerAnimation("Rig|new_man_walk_in_place");
    } else if (moveDirection === "left") {
        playPlayerAnimation("Rig|new_man_walk_left_in_place");
    } else if (moveDirection === "right") {
        playPlayerAnimation("Rig|new_man_walk_right_in_place");
    } else {
        playPlayerAnimation("Rig|new_man_idle");
    }
}

export function playPlayerAnimation(animationName) {
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

const updateInterval = 1; // Update every 0.1 seconds
let lastUpdateTime = 0;

// Function to calculate volume based on distance
function calculateVolume(distance) {
    const maxVolumeDistance = 50; // Maximum distance where audio is audible
    const minVolumeDistance = 85; // Minimum distance where audio becomes inaudible
    const rolloffFactor = 0.5; // Rolloff factor for attenuation
    
    if (!isFinite(distance) || distance <= 0) {
        return 0; // Return 0 volume if distance is non-finite or non-positive
    }

    if (distance > minVolumeDistance) {
        return 0; // Volume is 0 beyond minVolumeDistance
    }

    // Calculate volume based on distance (inverse square law attenuation)
    let volume = audioVolume / Math.pow(distance / maxVolumeDistance, rolloffFactor);

    // Gradually fade out volume beyond maxVolumeDistance
    if (distance > maxVolumeDistance) {
        volume *= 1 - (distance - maxVolumeDistance) / (minVolumeDistance - maxVolumeDistance);
    }
    
    return Math.max(volume, 0); // Ensure volume doesn't go negative
}

function updateAudioVolume() {
    const distance = camera.position.distanceTo(audio.position);
    
    // Calculate volume based on distance
    const volume = calculateVolume(distance) * 0.5;
    
    // Update audio volume
    audio.setVolume(volume);
}

