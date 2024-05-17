export function doorAnimation(interactibles) {
    const door = interactibles["door"];
    if (door && door.isAnimating) {
        
        door.substate++;
        const rotationChange = 1 * (Math.PI/180);
        const previousRotation = door.model.rotation.y;
        
        if (door.state === 0) {
            door.model.rotation.set(0, previousRotation + rotationChange, 0);
        } else {
            door.model.rotation.set(0, previousRotation - rotationChange, 0);
        }

        if (door.substate === 90) {
            door.substate = 0;
            door.state = 1 - door.state; // Switches between 0 and 1
            door.isAnimating = false;
        }
    }
}

export function punchingBag1Animation(interactibles) {
    const punchingBag = interactibles["punching_bag_1"];
    if (punchingBag && punchingBag.isAnimating) {
        
        punchingBag.substate++;
        const rotationChange = - 1 * (Math.PI/180);
        const previousRotation = punchingBag.model.rotation.z;

        const positionChangeX = -0.22;
        const positionChangeY = 0.0008 * Math.pow(punchingBag.state == 0? punchingBag.substate%45 : 44-punchingBag.substate%45, 1.5);
        const previousPosition = punchingBag.model.position;

        if (punchingBag.state === 0) {
            punchingBag.model.rotation.set(0, 0, previousRotation + rotationChange);
            punchingBag.model.position.set(previousPosition.x + positionChangeX, previousPosition.y + positionChangeY, previousPosition.z);
        } else {
            punchingBag.model.rotation.set(0, 0, previousRotation - rotationChange);
            punchingBag.model.position.set(previousPosition.x - positionChangeX, previousPosition.y - positionChangeY, previousPosition.z);
        }

        if (punchingBag.substate === 45) {
            punchingBag.state = 1 - punchingBag.state;
        } else if (punchingBag.substate === 90) {
            punchingBag.substate = 0;
            punchingBag.state = 1 - punchingBag.state; // Switches between 0 and 1
            punchingBag.isAnimating = false;
        }
    }
}

export function punchingBag2Animation(interactibles) {
    const punchingBag = interactibles["punching_bag_2"];
    if (punchingBag && punchingBag.isAnimating) {
        
        punchingBag.substate++;
        const rotationChange = - 1 * (Math.PI/180);
        const previousRotation = punchingBag.model.rotation.z;

        const positionChangeX = -0.22;
        const positionChangeY = 0.0008 * Math.pow(punchingBag.state == 0? punchingBag.substate%45 : 44-punchingBag.substate%45, 1.5);
        const previousPosition = punchingBag.model.position;

        if (punchingBag.state === 0) {
            punchingBag.model.rotation.set(0, 0, previousRotation + rotationChange);
            punchingBag.model.position.set(previousPosition.x + positionChangeX, previousPosition.y + positionChangeY, previousPosition.z);
        } else {
            punchingBag.model.rotation.set(0, 0, previousRotation - rotationChange);
            punchingBag.model.position.set(previousPosition.x - positionChangeX, previousPosition.y - positionChangeY, previousPosition.z);
        }

        if (punchingBag.substate === 45) {
            punchingBag.state = 1 - punchingBag.state;
        } else if (punchingBag.substate === 90) {
            punchingBag.substate = 0;
            punchingBag.state = 1 - punchingBag.state; // Switches between 0 and 1
            punchingBag.isAnimating = false;
        }
    }
}