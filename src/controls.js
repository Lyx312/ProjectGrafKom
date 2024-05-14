import * as THREE from 'three';
import { camera, scene } from "./sceneSetup.js";
import { updateStaminaBar } from './uiSetup.js';
import { worldOctree, boundingBox, capsuleMesh } from './main.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import renderer from './sceneSetup.js';

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false,
    c: false,
    f: false,
    p: false,
};

const MAX_STAMINA = 100;
const SPRINT_MULTIPLIER = 2;
const CROUCH_MULTIPLIER = 0.5;
const GRAVITY = 120;

export const player = {
    height: 6,
    width: 2,
    baseSpeed: 128,
    sprintMultiplier: 1,
    crouchMultiplier: 1,
    crouchHeightChange: 0.8,
    velocity: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    onGround: true,
    currentStamina: MAX_STAMINA,
    viewMode: 0,
}

const cameraOffset = {
    firstPerson: 1,
    thirdPerson: -8
}

let debug = false;

const playerCollider = new Capsule(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, player.height, 0), player.width/2);

export const controls = new PointerLockControls(camera, renderer.domElement);
controls.minPolarAngle = 0.001; // radians
controls.maxPolarAngle = Math.PI - 0.001; // radians
scene.add(controls.getObject());

document.addEventListener('click', function () {
    controls.lock();
}, false);

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
                playerCollider.end.y -= player.height * (1 - player.crouchHeightChange);
                player.crouchMultiplier *= CROUCH_MULTIPLIER;
                keys.c = true;
            }
            break;
        case 'KeyF':
            if (!keys.f) {
                boundingBox.forEach(box => {
                    box.cube.material.opacity = debug? 0 : 0.5;
                    box.line.material.opacity = debug? 0 : 1;
                });
                capsuleMesh.visible = !capsuleMesh.visible;
                debug = !debug;
                keys.f = true;
            }
            break;
        case 'KeyP': 
            if (!keys.p) {
                keys.p = true;
                player.viewMode++;
                player.viewMode%=2;
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
                playerCollider.end.y += player.height * (1 - player.crouchHeightChange);
                player.crouchMultiplier = 1;
                keys.c = false;
            }
            break;
        case 'KeyF':
            keys.f = false;
            break;
        case 'KeyP': 
            keys.p = false;
            break;
    }
});

function playerCollisions() {
    const result = worldOctree.capsuleIntersect(playerCollider);
    player.onGround = false;

    if (result) {
        player.onGround = result.normal.y > 0;

        if (!player.onGround) {
            player.velocity.addScaledVector(result.normal, - result.normal.dot(player.velocity));
        }

        playerCollider.translate(result.normal.multiplyScalar(result.depth));
    }
}

export function updatePlayer(deltaTime) {
    let damping = Math.exp(- 8 * deltaTime) - 1;

    if (!player.onGround) {
        player.velocity.y -= GRAVITY * deltaTime;

        // small air resistance
        damping *= 0.5;
    }

    player.velocity.addScaledVector(player.velocity, damping);

    const deltaPosition = player.velocity.clone().multiplyScalar(deltaTime);
    playerCollider.translate(deltaPosition);

    playerCollisions();

    camera.position.copy(playerCollider.end);

    capsuleMesh.position.copy(playerCollider.start);
    capsuleMesh.position.y += player.height / 2; // Adjust for the fact that CylinderGeometry is centered at its midpoint
}

function getForwardVector() {
    camera.getWorldDirection(player.direction);
    player.direction.y = 0;
    player.direction.normalize();

    return player.direction;
}

function getSideVector() {
    camera.getWorldDirection(player.direction);
    player.direction.y = 0;
    player.direction.normalize();
    player.direction.cross(camera.up);

    return player.direction;
}

export function playerControls(deltaTime) {

    // gives a bit of air control
    const speedDelta = deltaTime * player.sprintMultiplier * player.crouchMultiplier * (player.onGround ? player.baseSpeed : player.baseSpeed/3);

    if (keys.w) {
        player.velocity.add(getForwardVector().multiplyScalar(speedDelta));
    }
    if (keys.s) {
        player.velocity.add(getForwardVector().multiplyScalar(- speedDelta));
    }
    if (keys.a) {
        player.velocity.add(getSideVector().multiplyScalar(- speedDelta));
    }
    if (keys.d) {
        player.velocity.add(getSideVector().multiplyScalar(speedDelta));
    }
    if (player.onGround) {
        if (keys.space) {
            player.velocity.y = 50;
        }
    }
}


export function updateStamina() {
    if (keys.shift && (keys.w || keys.a || keys.s || keys.d)) {
        if (player.currentStamina > 0) {
            player.currentStamina -= 0.5;
        } else {
            player.sprintMultiplier = 1;
        }
    } else if (player.currentStamina < MAX_STAMINA) {
        player.currentStamina += 0.2;
    }

    // Update stamina bar UI
    updateStaminaBar((player.currentStamina / MAX_STAMINA) * 100);
}

export function getPlayerLookDirection() {
    let direction = new THREE.Vector3();
    controls.getDirection(direction);

    // Calculate the angle
    let angleRadians = Math.atan2(direction.z, direction.x);

    // Return the angle in radians
    return angleRadians;
}

export function getMoveDirection() {
    if (keys.w || keys.s) return "forward";
    if (keys.a) return "left";
    if (keys.d) return "right";
    return "none";
}

export function getCameraOffset() {
    if (player.viewMode == 0) return cameraOffset.firstPerson;
    return cameraOffset.thirdPerson;
}
