import * as THREE from 'three';
import { player, getPlayerLookDirection, controls, movePlayerCollider, loadLocationLook, saveLocationLook, MAX_STAMINA, addStamina } from "./controls.js";
import { changeDayOverlay, createBlackScreen, showBlackScreen, hideBlackScreen, goalStr, goalSpd } from "./uiSetup.js";
import { playPlayerAnimation } from './main.js';
import { introHelpMonolog } from './npcInteraction.js';

export let day = 1;

function waitForNextFrame() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve);
    });
}

function updateBoundingBox(collision, position, rotation) {
    // Apply the new position and rotation to the box
    collision.box.position.set(position[0], position[1], position[2]);
    collision.box.rotation.set(rotation[0], rotation[1], rotation[2]);

    // Ensure the world matrix is updated with the new position and rotation
    collision.box.updateMatrixWorld(true); 

    // Recalculate Box3 from the transformed object
    const box3 = new THREE.Box3().setFromObject(collision.box);
    collision.collider.copy(box3);

    // Apply the new position and rotation to the line
    collision.line.position.set(position[0], position[1], position[2]);
    collision.line.rotation.set(rotation[0], rotation[1], rotation[2]);
    collision.line.updateMatrixWorld(true);
}

function incrementBoundingBox(collision, positionIncrement, rotationIncrement) {
    const newPosition = [
        collision.box.position.x + positionIncrement[0],
        collision.box.position.y + positionIncrement[1],
        collision.box.position.z + positionIncrement[2]
    ];

    const newRotation = [
        collision.box.rotation.x + rotationIncrement[0],
        collision.box.rotation.y + rotationIncrement[1],
        collision.box.rotation.z + rotationIncrement[2]
    ];

    updateBoundingBox(collision, newPosition, newRotation);
}

export const doorAnimation = async (door) => {
    if (door && !door.isAnimating) {
        door.isAnimating = true;
        const isOpening = door.state === 0;

        if (isOpening) {
            door.initialLookDirection = getPlayerLookDirection() > 0 ? 1 : -1;
            door.positionChanges = [];
            door.rotationChanges = [];
        } else {
            door.positionChanges.reverse();
            door.rotationChanges.reverse();
        }

        const pivotOffset = 9;
        const direction = isOpening ? 1 : -1;

        for (let substate = 0; substate < 30; substate++) {
            const rotationChange = door.initialLookDirection * 3 * (Math.PI / 180);
            const currentRotation = (substate + 1) * door.initialLookDirection * (Math.PI / 180);
            door.model.rotation.y += direction * rotationChange;

            if (isOpening) {
                const positionChangeX = -pivotOffset * (Math.cos(currentRotation) - Math.cos(currentRotation - rotationChange));
                const positionChangeZ = (pivotOffset+door.initialLookDirection) * 0.3 * (Math.sin(currentRotation) - Math.sin(currentRotation - rotationChange));

                const positionChange = [direction * positionChangeX, 0, direction * positionChangeZ];
                const rotationChangeArr = [0, direction * rotationChange, 0];

                door.positionChanges.push(positionChange);
                door.rotationChanges.push(rotationChangeArr);

                incrementBoundingBox(door.collision, positionChange, rotationChangeArr);
            } else {
                incrementBoundingBox(door.collision, door.positionChanges[substate].map(val => -val), door.rotationChanges[substate].map(val => -val));
            }

            await waitForNextFrame();
        }

        door.state = isOpening ? door.initialLookDirection : 0;
        door.isAnimating = false;
    }
};



export const lockerAnimation = async (locker) => {
    if (locker && !locker.isAnimating) {
        locker.isAnimating = true;
        const isOpening = locker.state === 0;

        if (isOpening) {
            locker.positionChanges = [];
            locker.rotationChanges = [];
        } else {
            locker.positionChanges.reverse();
            locker.rotationChanges.reverse();
        }

        const pivotOffset = 1.3;
        const direction = isOpening ? 1 : -1;
        
        for (let substate = 0; substate < 15; substate++) {
            const rotationChange = 6 * (Math.PI/180);
            locker.model.rotation.y += locker.state === 0 ? rotationChange : -rotationChange;

            const currentRotation = (substate + 1) * (Math.PI / 180);
            if (isOpening) {
                const positionChangeX = -pivotOffset * 11 * (Math.cos(currentRotation) - Math.cos(currentRotation - rotationChange));
                const positionChangeZ = pivotOffset * (Math.sin(currentRotation) - Math.sin(currentRotation - rotationChange));

                const positionChange = [direction * positionChangeX, 0, direction * positionChangeZ];
                const rotationChangeArr = [0, direction * rotationChange, 0];

                locker.positionChanges.push(positionChange);
                locker.rotationChanges.push(rotationChangeArr);

                incrementBoundingBox(locker.collision, positionChange, rotationChangeArr);
            } else {
                incrementBoundingBox(locker.collision, locker.positionChanges[substate].map(val => -val), locker.rotationChanges[substate].map(val => -val));
            }

            await waitForNextFrame();
        }

        locker.state ^= 1;
        locker.isAnimating = false;
    }
}

export const punchingBag1Animation = async (punchingBag) => {
    if (!player.canExercise) {
        introHelpMonolog();
    }
    else{
        if (player.currentStamina>=1) {
            if (punchingBag && !punchingBag.isAnimating) {
                punchingBag.isAnimating = true;
                let deltaRotationX = 0;
                let deltaRotationZ = 0;
                let deltaPositionX = 0;
                let deltaPositionZ = 0;
                const playerLookDirection = getPlayerLookDirection() * 180/Math.PI;
                // -45 <-> -135 -> rotate x positive, move z negative
                // -135 <-> 135 -> rotate z negative, move x negative
                // 135 <-> 45 -> rotate x negative, move z positive
                // 45 <-> -45 -> rotate z positive, move x positive
                if (playerLookDirection<=-45 && playerLookDirection>-135) {
                    deltaRotationX = 1;
                    deltaPositionZ = -1;
                } else if (playerLookDirection<=-135 || playerLookDirection>135) {
                    deltaRotationZ = -1;
                    deltaPositionX = -1;
                } else if (playerLookDirection<=135 && playerLookDirection>45) { 
                    deltaRotationX = -1;
                    deltaPositionZ = 1;
                } else if (playerLookDirection<=45 && playerLookDirection>-45) {
                    deltaRotationZ = 1;
                    deltaPositionX = 1;
                }

                const rotationChangeXZ = 1 * (Math.PI/180);
                const positionChangeXZ = 0.22;
                const staminaToDecrease = 1;
                const staminaDecrementPerFrame = staminaToDecrease / 45;
                
                for (let substate = 0; substate < 45; substate++) {
                    const positionChangeY = 0.0008 * Math.pow(substate, 1.5);
                    punchingBag.model.rotation.x += deltaRotationX * rotationChangeXZ;
                    punchingBag.model.rotation.z += deltaRotationZ * rotationChangeXZ;
                    punchingBag.model.position.x += deltaPositionX * positionChangeXZ;
                    punchingBag.model.position.z += deltaPositionZ * positionChangeXZ;
                    punchingBag.model.position.y += positionChangeY;
                    player.currentStamina -= staminaDecrementPerFrame;
                    await waitForNextFrame();
                }
                for (let substate = 44; substate >= 0; substate--) {
                    const positionChangeY = 0.0008 * Math.pow(substate, 1.5);
                    punchingBag.model.rotation.x += deltaRotationX * -rotationChangeXZ;
                    punchingBag.model.rotation.z += deltaRotationZ * -rotationChangeXZ;
                    punchingBag.model.position.x += deltaPositionX * -positionChangeXZ;
                    punchingBag.model.position.z += deltaPositionZ * -positionChangeXZ;
                    punchingBag.model.position.y += -positionChangeY;
                    await waitForNextFrame();
                }

                player.currentStamina = Math.round(player.currentStamina);
                player.str++;
                punchingBag.isAnimating = false;
            }
        }
    }
}


export const punchingBag2Animation = async (punchingBag) => {
    if (!player.canExercise) {
        introHelpMonolog();
    }
    else{
        if (player.currentStamina>=1) {
            if (punchingBag && !punchingBag.isAnimating) {
                punchingBag.isAnimating = true;
                let deltaRotationX = 0;
                let deltaRotationZ = 0;
                let deltaPositionX = 0;
                let deltaPositionZ = 0;
                const playerLookDirection = getPlayerLookDirection() * 180/Math.PI;
                // -45 <-> -135 -> rotate x positive, move z negative
                // -135 <-> 135 -> rotate z negative, move x negative
                // 135 <-> 45 -> rotate x negative, move z positive
                // 45 <-> -45 -> rotate z positive, move x positive
                if (playerLookDirection<=-45 && playerLookDirection>-135) {
                    deltaRotationX = 1;
                    deltaPositionZ = -1;
                } else if (playerLookDirection<=-135 || playerLookDirection>135) {
                    deltaRotationZ = -1;
                    deltaPositionX = -1;
                } else if (playerLookDirection<=135 && playerLookDirection>45) { 
                    deltaRotationX = -1;
                    deltaPositionZ = 1;
                } else if (playerLookDirection<=45 && playerLookDirection>-45) {
                    deltaRotationZ = 1;
                    deltaPositionX = 1;
                }

                const rotationChangeXZ = 1 * (Math.PI/180);
                const positionChangeXZ = 0.22;
                const staminaToDecrease = 1;
                const staminaDecrementPerFrame = staminaToDecrease / 45;
                for (let substate = 0; substate < 45; substate++) {
                    const positionChangeY = 0.0008 * Math.pow(substate, 1.5);
                    punchingBag.model.rotation.x += deltaRotationX * rotationChangeXZ;
                    punchingBag.model.rotation.z += deltaRotationZ * rotationChangeXZ;
                    punchingBag.model.position.x += deltaPositionX * positionChangeXZ;
                    punchingBag.model.position.z += deltaPositionZ * positionChangeXZ;
                    punchingBag.model.position.y += positionChangeY;
                    player.currentStamina -= staminaDecrementPerFrame;
                    await waitForNextFrame();
                }
                for (let substate = 44; substate >= 0; substate--) {
                    const positionChangeY = 0.0008 * Math.pow(substate, 1.5);
                    punchingBag.model.rotation.x += deltaRotationX * -rotationChangeXZ;
                    punchingBag.model.rotation.z += deltaRotationZ * -rotationChangeXZ;
                    punchingBag.model.position.x += deltaPositionX * -positionChangeXZ;
                    punchingBag.model.position.z += deltaPositionZ * -positionChangeXZ;
                    punchingBag.model.position.y += -positionChangeY;
                    await waitForNextFrame();
                }
                player.currentStamina = Math.round(player.currentStamina);
                player.str++;
                punchingBag.isAnimating = false;
            }
        }
    }
}

// Call this function once during initialization to create the overlay
createBlackScreen();

export const barbellsAnimation = async (barbells) => {
    if (!player.canExercise) {
        introHelpMonolog();
    }
    else{
        if (player.currentStamina>=20) {
            if (barbells && !barbells.isAnimating) {
                barbells.isAnimating = true;

                showBlackScreen();
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 0.1 second
                hideBlackScreen();
                
                const teleportPosition = {
                    x: barbells.model.position.x - 4.5,
                    y: barbells.model.position.y - 5,
                    z: barbells.model.position.z - 0.2
                }
                saveLocationLook();
                controls.getObject().rotation.set(Math.PI/2, -0.0009, Math.PI/2);
                movePlayerCollider(teleportPosition.x, teleportPosition.y, teleportPosition.z);

                const heightChange = 0.05; // Change in y-position per frame, adjust as needed
                const totalLift = 5;
                const totalFrames = 45;
                const staminaToDecrease = 20;
                const staminaDecrementPerFrame = staminaToDecrease / (totalFrames * totalLift * 2);

                for (let i = 0; i < totalLift; i++) {
                    // Animation upwards
                    for (let substate = 0; substate < totalFrames; substate++) {
                        barbells.model.position.y += heightChange;
                        player.currentStamina -= staminaDecrementPerFrame; // Decrease stamina gradually
                        await waitForNextFrame();
                    }
        
                    // Animation downwards
                    for (let substate = 0; substate < totalFrames; substate++) {
                        barbells.model.position.y -= heightChange;
                        player.currentStamina -= staminaDecrementPerFrame; 
                        await waitForNextFrame();
                    }
                }

                loadLocationLook();

                // Adjust any other properties after animation completes
                player.currentStamina = Math.round(player.currentStamina);
                player.str += 10;

                showBlackScreen();
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 0.1 second
                hideBlackScreen();

                barbells.isAnimating = false;
            }
        }
    }
}

export const bikeAnimation = async (bike) => {
    if (!player.canExercise) {
        introHelpMonolog();
    }
    else{
        if (player.currentStamina>=10) {
            if (bike && !bike.isAnimating) {
                bike.isAnimating = true;

                showBlackScreen();
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 0.1 second
                hideBlackScreen();

                const teleportPosition = {
                    x: bike.model.position.x - 2,
                    y: bike.model.position.y - 1.2,
                    z: bike.model.position.z
                }
                saveLocationLook();
                controls.getObject().rotation.set(0, -Math.PI/2, 0);
                movePlayerCollider(teleportPosition.x, teleportPosition.y, teleportPosition.z);

                const rotationIncrement = 12 * (Math.PI / 180); // 12 degrees per frame
                const totalFrames = 300;
                const staminaToDecrease = 10;
                const staminaDecrementPerFrame = staminaToDecrease / totalFrames;

                for (let substate = 0; substate < totalFrames; substate++) {
                    bike.model.rotation.z += rotationIncrement;
                    player.currentStamina -= staminaDecrementPerFrame; // Decrease stamina gradually
                    await waitForNextFrame();
                }

                loadLocationLook();

                player.currentStamina = Math.round(player.currentStamina);
                player.spd+=10;

                showBlackScreen();
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 0.1 second
                hideBlackScreen();

                bike.isAnimating = false;
            }        
        }           
    }
}

export const treadmillAnimation = async (treadmill) => {
    if (!player.canExercise) {
        introHelpMonolog();
    }
    else{
        if (treadmill && !treadmill.isAnimating && player.currentStamina >= 10) {
            treadmill.isAnimating = true;
            
            // Show black screen before starting the animation
            showBlackScreen();
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 0.1 second
            hideBlackScreen();

            const teleportPosition = {
                x: treadmill.model.position.x,
                y: treadmill.model.position.y + 2.8,
                z: treadmill.model.position.z
            };
            saveLocationLook();
            controls.getObject().rotation.set(-Math.PI/2, -0.6, -Math.PI/2);
            movePlayerCollider(teleportPosition.x, teleportPosition.y, teleportPosition.z);
            player.sprintMultiplier = 2;
            playPlayerAnimation("Rig|new_man_run_in_place");

            const totalFrames = 150;
            const staminaToDecrease = 10;
            const staminaDecrementPerFrame = staminaToDecrease / totalFrames;

            for (let substate = 0; substate < totalFrames; substate++) {
                player.currentStamina -= staminaDecrementPerFrame; // Decrease stamina gradually
                await waitForNextFrame();
            }

            loadLocationLook();
            player.sprintMultiplier = 1;
            player.currentStamina = Math.round(player.currentStamina);
            player.spd += 10;

            // Show black screen after the animation ends
            showBlackScreen();
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 0.1 second
            hideBlackScreen();

            treadmill.isAnimating = false;
        }
    }
};
export let tempStaminaTick = 0;

export function addStaminaTick(){
    tempStaminaTick++;
}

const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);

const initializeAudio = () => {
    sound.setLoop(false);
    sound.setVolume(0.35);
};

const playSound = () => {
    if (sound.buffer && sound.context.state === 'suspended') {
        sound.context.resume().then(() => {
            sound.play();
        });
    } else {
        sound.play();
    }
};

const audioLoader = new THREE.AudioLoader();

export function carAnimation(car) {
    if (car && !car.isAnimating) {
        car.isAnimating = true;
        for (let i = 0; i < tempStaminaTick; i++) {
            addStamina();
        }
        player.currentStamina = MAX_STAMINA;
        tempStaminaTick = 0;
        if (day<7) {
            changeDayOverlay(++day, player.str, player.spd);
            setTimeout(() => {
                car.isAnimating = false;
            }, 5000);
        } else {
            let outro;
            if (player.str >= goalStr && player.spd >= goalSpd) {
                audioLoader.load('../assets/audio/Victory_Sound_Effect.mp3', function (buffer) {
                    sound.setBuffer(buffer);
                    initializeAudio();
                    playSound();
                });
                outro = document.getElementById("outro-success-overlay");
            } else { 
                audioLoader.load('../assets/audio/Sad_Trombone_Sound_Effect.mp3', function (buffer) {
                    sound.setBuffer(buffer);
                    initializeAudio();
                    playSound();
                });
                outro = document.getElementById("outro-fail-overlay");
            }
            outro.style.display = "flex";

        }
    }
}

export const bandAnimation = async (band) => {
    if (band) {
        for (let i = 0; i < 50; i++) {
            band.rotation.z += 0.001;
            await waitForNextFrame();
        }
        for (let i = 0; i < 100; i++) {
            band.rotation.z -= 0.001;
            await waitForNextFrame();
        }
        for (let i = 0; i < 50; i++) {
            band.rotation.z += 0.001;
            await waitForNextFrame();
        }
        bandAnimation(band);
    }
}

export const dumpsterAnimation = async (dumpster) => {
    if (dumpster && !dumpster.isAnimating) {
        dumpster.isAnimating = true;
        const isOpening = dumpster.state === 0;

        if (isOpening) {
            dumpster.positionChanges = [];
            dumpster.rotationChanges = [];
        } else {
            dumpster.positionChanges.reverse();
            dumpster.rotationChanges.reverse();
        }

        const pivotOffset = 4;
        const direction = isOpening ? 1 : -1;

        for (let substate = 0; substate < 15; substate++) {
            const rotationChange = 6 * (Math.PI/180);
            dumpster.model.rotation.x += dumpster.state === 0 ? rotationChange : -rotationChange;

            const currentRotation = (substate + 1) * (Math.PI / 180);
            if (isOpening) {
                const positionChangeZ = -pivotOffset * 5 * (Math.cos(currentRotation) - Math.cos(currentRotation - rotationChange));
                const positionChangeY = pivotOffset * (Math.sin(currentRotation) - Math.sin(currentRotation - rotationChange));

                const positionChange = [0, direction * positionChangeY, direction * positionChangeZ];
                const rotationChangeArr = [direction * rotationChange, 0, 0];

                dumpster.positionChanges.push(positionChange);
                dumpster.rotationChanges.push(rotationChangeArr);

                incrementBoundingBox(dumpster.collision, positionChange, rotationChangeArr);
            } else {
                incrementBoundingBox(dumpster.collision, dumpster.positionChanges[substate].map(val => -val), dumpster.rotationChanges[substate].map(val => -val));
            }

            await waitForNextFrame();
        }

        dumpster.state ^= 1;
        dumpster.isAnimating = false;
    }
};
