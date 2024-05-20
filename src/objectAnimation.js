import { player, getPlayerLookDirection } from "./controls.js";
import { changeDayOverlay } from "./uiSetup.js";

export let day = 1;

function waitForNextFrame() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve);
    });
}

export const doorAnimation = async (interactables) => {
    const door = interactables["object_door"];
    if (door) {
        if (door.state === 0) {
            door.initialLookDirection = getPlayerLookDirection() > 0 ? 1 : -1;
        }

        for (let substate = 0; substate < 90; substate++) {
            const rotationChange = door.initialLookDirection * (Math.PI/180);
            door.model.rotation.y += door.state === 0 ? rotationChange : -rotationChange;
            await waitForNextFrame();
        }

        if (door.state == 1 || door.state == -1) {
            door.state = 0;
        } else {
            door.state = door.initialLookDirection;
        }
    }
}

export const lockerAnimation = async (interactables) => {
    const door = interactables["object_locker_door"];
    if (door) {
        for (let substate = 0; substate < 15; substate++) {
            const rotationChange = 6 * (Math.PI/180);
            door.model.rotation.y += door.state === 0 ? rotationChange : -rotationChange;
            await waitForNextFrame();
        }

        door.state ^= 1;
    }
}

export const punchingBag1Animation = async (interactables) => {
    const punchingBag = interactables["object_punching_bag_1"];

    if (punchingBag) {

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
        
        for (let substate = 0; substate < 90; substate++) {
            const positionChangeY = 0.0008 * Math.pow(punchingBag.state == 0? substate%45 : 44-substate%45, 1.5);
            punchingBag.model.rotation.x += deltaRotationX * (punchingBag.state === 0 ? rotationChangeXZ : -rotationChangeXZ);
            punchingBag.model.rotation.z += deltaRotationZ * (punchingBag.state === 0 ? rotationChangeXZ : -rotationChangeXZ);
            punchingBag.model.position.x += deltaPositionX * (punchingBag.state === 0 ? positionChangeXZ : -positionChangeXZ);
            punchingBag.model.position.z += deltaPositionZ * (punchingBag.state === 0 ? positionChangeXZ : -positionChangeXZ);
            punchingBag.model.position.y += punchingBag.state === 0 ? positionChangeY : -positionChangeY;
            
            if (substate === 45) {
                punchingBag.state = 1;
            }
            await waitForNextFrame();
        }
        punchingBag.state = 0;
        player.str++;
    }
}


export const punchingBag2Animation = async (interactables) => {
    const punchingBag = interactables["object_punching_bag_2"];
    
    if (punchingBag) {

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
        
        for (let substate = 0; substate < 90; substate++) {
            const positionChangeY = 0.0008 * Math.pow(punchingBag.state == 0? substate%45 : 44-substate%45, 1.5);
            punchingBag.model.rotation.x += deltaRotationX * (punchingBag.state === 0 ? rotationChangeXZ : -rotationChangeXZ);
            punchingBag.model.rotation.z += deltaRotationZ * (punchingBag.state === 0 ? rotationChangeXZ : -rotationChangeXZ);
            punchingBag.model.position.x += deltaPositionX * (punchingBag.state === 0 ? positionChangeXZ : -positionChangeXZ);
            punchingBag.model.position.z += deltaPositionZ * (punchingBag.state === 0 ? positionChangeXZ : -positionChangeXZ);
            punchingBag.model.position.y += punchingBag.state === 0 ? positionChangeY : -positionChangeY;
            
            if (substate === 45) {
                punchingBag.state = 1;
            }
            await waitForNextFrame();
        }
        punchingBag.state = 0;
        player.str++;
    }
}


export const barbellsAnimation = async (interactables) => {
    const barbells = interactables["object_barbells"];

    if (barbells) {
        const heightChange = 0.05; // Change in y-position per frame, adjust as needed

        for (let substate = 0; substate < 45; substate++) {
            barbells.model.position.y += heightChange;
            await waitForNextFrame();
        }
        for (let substate = 0; substate < 45; substate++) {
            barbells.model.position.y -= heightChange;
            await waitForNextFrame();
        }

        player.str++;
    }
}

export const bikeAnimation = async (interactables) => {
    const bike = interactables["object_bike_pedals"];

    if (bike) {
        const rotationIncrement = 6 * (Math.PI/180); // 6 degrees per frame

        for (let substate = 0; substate < 60; substate++) {
            bike.model.rotation.z += rotationIncrement;
            await waitForNextFrame();
        }

        player.spd+=10;
    }
}

export function treadmillAnimation(player, interactables) {
    //console.log(player.direction)
    const treadmill = interactables["object_treadmill"];
    if (treadmill && treadmill.isAnimating) {
        
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
}

export function carAnimation() {
    if (!player.pause) {
        player.pause = true;
        changeDayOverlay(++day, player.str, player.spd);
        setTimeout(() => {
            player.pause = false;
        }, 5000);
    }
}