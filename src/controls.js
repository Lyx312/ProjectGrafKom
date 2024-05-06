import * as THREE from 'https://jspm.dev/three';
import { camera, updateStaminaBar } from "./main.js";

export var keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false,
    c: false
};

const MAX_STAMINA = 100;
const  SPRINT_MULTIPLIER = 2;
const  CROUCH_MULTIPLIER = 0.5;

export let player = {
    width: 1,
    height: 5,
    baseSpeed: 1,
    sprintMultiplier: 1,
    crouchMultiplier: 1,
    hVelocity: new THREE.Vector3(),
    vVelocity: 0,
    onGround: true,
    currentStamina: MAX_STAMINA
}

let gravity = new THREE.Vector3(0, -0.005, 0);

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
                player.sprintMultiplier *= SPRINT_MULTIPLIER;
                keys.shift = true;
            }
            break;
        case 'KeyC':
            if (!keys.c) {
                player.height -= crouchHeightChange;
                camera.position.y -= crouchHeightChange;
                player.crouchMultiplier *= CROUCH_MULTIPLIER;
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
                player.sprintMultiplier = 1;
                keys.shift = false;
            }
            break;
        case 'KeyC':
            if (keys.c) {
                player.height += crouchHeightChange;
                camera.position.y += crouchHeightChange;
                player.crouchMultiplier = 1;
                keys.c = false;
            }
            break;
    }
});

export function updateVelocity(controls) {
    player.hVelocity.x -= player.hVelocity.x * 1.0 * player.baseSpeed;
    player.hVelocity.z -= player.hVelocity.z * 1.0 * player.baseSpeed;

    if (keys.w) player.hVelocity.z -= 0.1 * player.baseSpeed * player.sprintMultiplier * player.crouchMultiplier;
    if (keys.a) player.hVelocity.x += 0.1 * player.baseSpeed * player.sprintMultiplier * player.crouchMultiplier;
    if (keys.s) player.hVelocity.z += 0.1 * player.baseSpeed * player.sprintMultiplier * player.crouchMultiplier;
    if (keys.d) player.hVelocity.x -= 0.1 * player.baseSpeed * player.sprintMultiplier * player.crouchMultiplier;

    controls.moveRight(-player.hVelocity.x);
    controls.moveForward(-player.hVelocity.z);
}

export function updateJump(controls) {
    if (!player.onGround) {
        player.vVelocity = Math.max(player.vVelocity + gravity.y, -0.2);
        controls.getObject().position.y += player.vVelocity; // Apply vertical velocity to player position
        if (controls.getObject().position.y <= player.height) {
            controls.getObject().position.y = player.height;
            player.vVelocity = 0;
            player.onGround = true;
        }
    } else if (keys.space) {
        player.vVelocity = 0.2; // Set initial jump velocity
        player.onGround = false;
    }
}


export function updateStamina() {
    if (keys.shift && ( keys.w || keys.a || keys.s || keys.d )) {
        if (player.currentStamina > 0) {
            player.currentStamina -= 0.5;
        } else {
            player.sprintMultiplier = 1;
            // keys.shift = false;
        }
    } else if (player.currentStamina < MAX_STAMINA) {
        player.currentStamina += 0.2;
    }

    // Update stamina bar UI
    updateStaminaBar((player.currentStamina / MAX_STAMINA) * 100);
}


export function checkCollision(controls, collisionCube) {
    const playerBox = new THREE.Box3().setFromObject(controls.getObject());
    const collisionBox = new THREE.Box3().setFromObject(collisionCube);
    return playerBox.intersectsBox(collisionBox);
}
