export function doorAnimation(interactibles) {
    const door = interactibles["door"];
    if (door && door.isAnimating) {
        
        door.substate++;
        const rotationAngle = door.state === 0 ? Math.PI/2 + door.substate * (Math.PI/180) : Math.PI - door.substate * (Math.PI/180);
        door.model.rotation.set(0, rotationAngle, 0);

        if (door.substate === 90) {
            door.substate = 0;
            door.state = 1 - door.state; // Switches between 0 and 1
            door.isAnimating = false;

            console.log(door);
        }
    }
}
