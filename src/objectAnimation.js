import { getPlayerLookDirection } from "./controls.js";

export function doorAnimation(interactibles) {
    const door = interactibles["door"];
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



export function punchingBag1Animation(interactibles) {
    const punchingBag = interactibles["punching_bag_1"];
    if (punchingBag && punchingBag.isAnimating) {
        punchingBag.substate++;
        const rotationChange = - 1 * (Math.PI/180);
        const positionChangeX = -0.22;
        const positionChangeY = 0.0008 * Math.pow(punchingBag.state == 0? punchingBag.substate%45 : 44-punchingBag.substate%45, 1.5);

        punchingBag.model.rotation.z += punchingBag.state === 0 ? rotationChange : -rotationChange;
        punchingBag.model.position.x += punchingBag.state === 0 ? positionChangeX : -positionChangeX;
        punchingBag.model.position.y += punchingBag.state === 0 ? positionChangeY : -positionChangeY;

        if (punchingBag.substate === 45 || punchingBag.substate === 90) {
            punchingBag.state ^= 1;
        }
        if (punchingBag.substate === 90) {
            punchingBag.substate = 0;
            punchingBag.isAnimating = false;
        }
    }
}


export function punchingBag2Animation(interactibles) {
    const punchingBag = interactibles["punching_bag_2"];
    if (punchingBag && punchingBag.isAnimating) {
        
        punchingBag.substate++;
        const rotationChange = - 1 * (Math.PI/180);
        const positionChangeX = -0.22;
        const positionChangeY = 0.0008 * Math.pow(punchingBag.state == 0? punchingBag.substate%45 : 44-punchingBag.substate%45, 1.5);

        punchingBag.model.rotation.z += punchingBag.state === 0 ? rotationChange : -rotationChange;
        punchingBag.model.position.x += punchingBag.state === 0 ? positionChangeX : -positionChangeX;
        punchingBag.model.position.y += punchingBag.state === 0 ? positionChangeY : -positionChangeY;

        if (punchingBag.substate === 45 || punchingBag.substate === 90) {
            punchingBag.state ^= 1;
        }
        if (punchingBag.substate === 90) {
            punchingBag.substate = 0;
            punchingBag.isAnimating = false;
        }
    }
}

export function barbellsAnimation(interactibles) {
    const barbells = interactibles["barbells"];
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
        }
    }
}

export function treadmillAnimation(player, interactibles) {
    //console.log(player.direction)
    const treadmill = interactibles["treadmill"];
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