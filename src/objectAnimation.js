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
        }
    }
}


export function punchingBag2Animation(interactibles) {
    const punchingBag = interactibles["punching_bag_2"];
    
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
        }
    }
}