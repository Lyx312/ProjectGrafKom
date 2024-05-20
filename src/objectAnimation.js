import { player, getPlayerLookDirection } from "./controls.js";
import { changeDayOverlay } from "./uiSetup.js";

export let day = 1;

export function doorAnimation(interactables) {
    const door = interactables["object_door"];
    if (door && door.isAnimating) {
        if (door.state === 0 && door.substate === 0) {
            door.initialLookDirection = getPlayerLookDirection() > 0 ? 1 : -1;
        }

        door.substate++;
        const rotationChange = door.initialLookDirection * (Math.PI/180);
        door.model.rotation.y += door.state === 0 ? rotationChange : -rotationChange;

        if (door.substate === 90) {
            door.substate = 0;
            if (door.state == 1 || door.state == -1) {
                door.state = 0;
            } else {
                door.state = door.initialLookDirection;
            }
            door.isAnimating = false;
        }
    }
}

export function lockerAnimation(interactables) {
    const door = interactables["object_locker_door"];
    if (door && door.isAnimating) {
        if (door.state === 0 && door.substate === 0) {
            door.initialLookDirection = 1;
        }

        door.substate++;
        const rotationChange = Math.PI/30;
        door.model.rotation.y += door.state === 0 ? rotationChange : -rotationChange;

        if (door.substate === 15) {
            door.substate = 0;
            if (door.state == 1 || door.state == -1) {
                door.state = 0;
            } else {
                door.state = door.initialLookDirection;
            }
            door.isAnimating = false;
        }
    }
}

export function punchingBag1Animation(interactables) {
    const punchingBag = interactables["object_punching_bag_1"];

    if (punchingBag && punchingBag.isAnimating) {

        if (punchingBag.substate === 0) {
            punchingBag.deltaRotationX = 0;
            punchingBag.deltaRotationZ = 0;
            punchingBag.deltaPositionX = 0;
            punchingBag.deltaPositionZ = 0;
            const playerLookDirection = getPlayerLookDirection() * 180/Math.PI;
            // -45 <-> -135 -> rotate x positive, move z negative
            // -135 <-> 135 -> rotate z negative, move x negative
            // 135 <-> 45 -> rotate x negative, move z positive
            // 45 <-> -45 -> rotate z positive, move x positive
            if (playerLookDirection<=-45 && playerLookDirection>-135) {
                punchingBag.deltaRotationX = 1;
                punchingBag.deltaPositionZ = -1;
            } else if (playerLookDirection<=-135 || playerLookDirection>135) {
                punchingBag.deltaRotationZ = -1;
                punchingBag.deltaPositionX = -1;
            } else if (playerLookDirection<=135 && playerLookDirection>45) { 
                punchingBag.deltaRotationX = -1;
                punchingBag.deltaPositionZ = 1;
            } else if (playerLookDirection<=45 && playerLookDirection>-45) {
                punchingBag.deltaRotationZ = 1;
                punchingBag.deltaPositionX = 1;
            }
        }

        punchingBag.substate++;
        const rotationChangeXZ = 1 * (Math.PI/180);
        const positionChangeXZ = 0.22;
        const positionChangeY = 0.0008 * Math.pow(punchingBag.state == 0? punchingBag.substate%45 : 44-punchingBag.substate%45, 1.5);

        punchingBag.model.rotation.x += punchingBag.deltaRotationX * (punchingBag.state === 0 ? rotationChangeXZ : -rotationChangeXZ);
        punchingBag.model.rotation.z += punchingBag.deltaRotationZ * (punchingBag.state === 0 ? rotationChangeXZ : -rotationChangeXZ);
        punchingBag.model.position.x += punchingBag.deltaPositionX * (punchingBag.state === 0 ? positionChangeXZ : -positionChangeXZ);
        punchingBag.model.position.z += punchingBag.deltaPositionZ * (punchingBag.state === 0 ? positionChangeXZ : -positionChangeXZ);
        punchingBag.model.position.y += punchingBag.state === 0 ? positionChangeY : -positionChangeY;

        if (punchingBag.substate === 45 || punchingBag.substate === 90) {
            punchingBag.state ^= 1;
        }
        if (punchingBag.substate === 90) {
            punchingBag.substate = 0;
            punchingBag.deltaRotationX = 0;
            punchingBag.deltaRotationZ = 0;
            punchingBag.deltaPositionX = 0;
            punchingBag.deltaPositionZ = 0;
            punchingBag.isAnimating = false;
            player.str++;
        }
    }
}


export function punchingBag2Animation(interactables) {
    const punchingBag = interactables["object_punching_bag_2"];
    
    if (punchingBag && punchingBag.isAnimating) {

        if (punchingBag.substate === 0) {
            punchingBag.deltaRotationX = 0;
            punchingBag.deltaRotationZ = 0;
            punchingBag.deltaPositionX = 0;
            punchingBag.deltaPositionZ = 0;
            const playerLookDirection = getPlayerLookDirection() * 180/Math.PI;
            // -45 <-> -135 -> rotate x positive, move z negative
            // -135 <-> 135 -> rotate z negative, move x negative
            // 135 <-> 45 -> rotate x negative, move z positive
            // 45 <-> -45 -> rotate z positive, move x positive
            if (playerLookDirection<=-45 && playerLookDirection>-135) {
                punchingBag.deltaRotationX = 1;
                punchingBag.deltaPositionZ = -1;
            } else if (playerLookDirection<=-135 || playerLookDirection>135) {
                punchingBag.deltaRotationZ = -1;
                punchingBag.deltaPositionX = -1;
            } else if (playerLookDirection<=135 && playerLookDirection>45) { 
                punchingBag.deltaRotationX = -1;
                punchingBag.deltaPositionZ = 1;
            } else if (playerLookDirection<=45 && playerLookDirection>-45) {
                punchingBag.deltaRotationZ = 1;
                punchingBag.deltaPositionX = 1;
            }
        }

        punchingBag.substate++;
        const rotationChangeXZ = 1 * (Math.PI/180);
        const positionChangeXZ = 0.22;
        const positionChangeY = 0.0008 * Math.pow(punchingBag.state == 0? punchingBag.substate%45 : 44-punchingBag.substate%45, 1.5);

        punchingBag.model.rotation.x += punchingBag.deltaRotationX * (punchingBag.state === 0 ? rotationChangeXZ : -rotationChangeXZ);
        punchingBag.model.rotation.z += punchingBag.deltaRotationZ * (punchingBag.state === 0 ? rotationChangeXZ : -rotationChangeXZ);
        punchingBag.model.position.x += punchingBag.deltaPositionX * (punchingBag.state === 0 ? positionChangeXZ : -positionChangeXZ);
        punchingBag.model.position.z += punchingBag.deltaPositionZ * (punchingBag.state === 0 ? positionChangeXZ : -positionChangeXZ);
        punchingBag.model.position.y += punchingBag.state === 0 ? positionChangeY : -positionChangeY;

        if (punchingBag.substate === 45 || punchingBag.substate === 90) {
            punchingBag.state ^= 1;
        }
        if (punchingBag.substate === 90) {
            punchingBag.substate = 0;
            punchingBag.deltaRotationX = 0;
            punchingBag.deltaRotationZ = 0;
            punchingBag.deltaPositionX = 0;
            punchingBag.deltaPositionZ = 0;
            punchingBag.isAnimating = false;
            player.str++;
        }
    }
}


export function barbellsAnimation(interactables) {
    const barbells = interactables["object_barbells"];
    if (barbells && barbells.isAnimating) {
        barbells.substate++;
        const heightChange = 0.05; // Change in y-position per frame, adjust as needed
        const previousPositionY = barbells.model.position.y;
        
        if (barbells.state === 0) {
            // Move up
            barbells.model.position.set(barbells.model.position.x, previousPositionY + heightChange, barbells.model.position.z);
        } else if (barbells.state === 1) {
            // Move down
            barbells.model.position.set(barbells.model.position.x, previousPositionY - heightChange, barbells.model.position.z);
        }

        if (barbells.state === 0 && barbells.substate === 45) {
            barbells.state = 1; // Switch to downward movement
            barbells.substate = 0;
        } else if (barbells.state === 1 && barbells.substate === 45) {
            barbells.state = 0; // Reset state to 0 for next cycle
            barbells.substate = 0;
            barbells.isAnimating = false; // End the animation
            player.str+=10;
        }
    }
}

export function bikeAnimation(interactables) {
    const bike = interactables["object_bike_pedals"];
    if (bike && bike.isAnimating) {
        // Increment the rotation angle
        const rotationIncrement = Math.PI / 30; // 6 degrees per frame
        bike.model.rotation.z += rotationIncrement;
        
        // Check if a full rotation (2*PI radians) has been completed
        if (bike.model.rotation.z >= 2 * Math.PI) {
            // Reset the rotation to 0 and stop animating
            bike.model.rotation.z = 0;
            bike.isAnimating = false;
            player.spd+=10;
        }
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

export function carAnimation(interactables) {
    const car = interactables["object_lowpoly_car"];
    
    if (car && car.isAnimating) {
        changeDayOverlay(++day, player.str, player.spd);
        car.isAnimating = false;
    }
}