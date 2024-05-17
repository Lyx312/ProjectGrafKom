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