import * as THREE from 'three';
import { player, getPlayerLookDirection } from "./controls.js";
import { changeDayOverlay } from "./uiSetup.js";

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

        const pivotOffset = 3.3;
        const direction = isOpening ? 1 : -1;

        for (let substate = 0; substate < 90; substate++) {
            const rotationChange = door.initialLookDirection * (Math.PI / 180);
            const currentRotation = (substate + 1) * door.initialLookDirection * (Math.PI / 180);
            door.model.rotation.y += direction * rotationChange;

            if (isOpening) {
                const positionChangeX = -pivotOffset * (Math.cos(currentRotation) - Math.cos(currentRotation - rotationChange));
                const positionChangeZ = pivotOffset * (Math.sin(currentRotation) - Math.sin(currentRotation - rotationChange));

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
    console.log(player.currentStamina)
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


export const punchingBag2Animation = async (punchingBag) => {
    console.log(player.currentStamina)
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


export const barbellsAnimation = async (barbells) => {
    console.log(player.currentStamina)
    if (player.currentStamina>=20) {
        if (barbells && !barbells.isAnimating) {
            barbells.isAnimating = true;
            const heightChange = 0.05; // Change in y-position per frame, adjust as needed
            const totalFrames = 45;
            const staminaToDecrease = 10;
            const staminaDecrementPerFrame = staminaToDecrease / totalFrames;

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

            // Adjust any other properties after animation completes
            player.currentStamina = Math.round(player.currentStamina);
            player.str += 10;

            barbells.isAnimating = false;
        }
    }
}

export const bikeAnimation = async (bike) => {
    console.log(player.currentStamina)
    if (player.currentStamina>=10) {
        if (bike && !bike.isAnimating) {
            bike.isAnimating = true;
            const rotationIncrement = 6 * (Math.PI / 180); // 6 degrees per frame
            const totalFrames = 60;
            const staminaToDecrease = 10;
            const staminaDecrementPerFrame = staminaToDecrease / totalFrames;

            for (let substate = 0; substate < totalFrames; substate++) {
                bike.model.rotation.z += rotationIncrement;
                player.currentStamina -= staminaDecrementPerFrame; // Decrease stamina gradually
                await waitForNextFrame();
            }
            player.currentStamina = Math.round(player.currentStamina);
            player.spd+=10;
            bike.isAnimating = false;
        }        
    }
}

export function treadmillAnimation(player, interactables) {
    //console.log(player.direction)
    const treadmill = interactables["object_treadmill"];
    if (treadmill && !treadmill.isAnimating) {
        treadmill.isAnimating = true;
        treadmill.substate++;
        const heightChange = 0.05; // Change in y-position per frame, adjust as needed
        const previousPositionY = player.position;
        
        if (treadmill.state === 0) {
            // Move up
            player.direction.set(0,0,0);
        } else if (treadmill.state === 1) {
            // Move down
            player.direction.set(-1,0,1);
        }

        if (treadmill.state === 0 && treadmill.substate === 45) {
            treadmill.state = 1; // Switch to downward movement
            treadmill.substate = 0;
        } else if (treadmill.state === 1 && treadmill.substate === 45) {
            treadmill.state = 0; // Reset state to 0 for next cycle
            treadmill.substate = 0;
            treadmill.isAnimating = false; // End the animation
        }
    }
    //player.position = [0,0,0];
    treadmill.isAnimating = false;
}

export function carAnimation(car) {
    if (car && !car.isAnimating) {
        car.isAnimating = true;
        player.currentStamina = 100;
        changeDayOverlay(++day, player.str, player.spd);
        setTimeout(() => {
            car.isAnimating = false;
        }, 5000);
    }
}