import { camera } from "./main.js";

export var keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false,
    c: false
};

export let player = {
    width: 1,
    height: 5
}

export const jump = {
    speed: 0,
    gravity: 0.005,
    jumping: false
};


export let speed = 0.1;

let crouchHeightChange = 1;


// Add event listeners for keydown and keyup
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW':
            keys.w = true;
            break;
        case 'KeyA':
            keys.a = true;
            break;
        case 'KeyS':
            keys.s = true;
            break;
        case 'KeyD':
            keys.d = true;
            break;
        case 'Space':
            keys.space = true;
            if (!jump.jumping) {
                jump.speed = 0.2;
                jump.jumping = true;
            }
            break;
        case 'ShiftLeft':
        case 'ShiftRight':
            if (!keys.shift) {
                speed *= 2;
                keys.shift = true;
            }
            break;
        case 'KeyC':
            if (!keys.c) {
                player.height -= crouchHeightChange;
                camera.position.y -= crouchHeightChange;
                speed *= 0.5;
                keys.c = true;
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW':
            keys.w = false;
            break;
        case 'KeyA':
            keys.a = false;
            break;
        case 'KeyS':
            keys.s = false;
            break;
        case 'KeyD':
            keys.d = false;
            break;
        case 'Space':
            keys.space = false;
            break;
        case 'ShiftLeft':
        case 'ShiftRight':
            if (keys.shift) {
                speed *= 0.5;
                keys.shift = false;
            }
            break;
        case 'KeyC':
            if (keys.c) {
                player.height += crouchHeightChange;
                camera.position.y += crouchHeightChange;
                speed *= 2;
                keys.c = false;
            }
            break;
    }
});

export function checkCollision(THREE, controls, collisionCube) {
    const playerBox = new THREE.Box3().setFromObject(controls.getObject());
    const collisionBox = new THREE.Box3().setFromObject(collisionCube);
    return playerBox.intersectsBox(collisionBox);
}
