import * as THREE from 'three';
import { camera } from "./sceneSetup.js";
import { updateStaminaBar } from './uiSetup.js';
import { worldOctree, capsuleMesh, stats, updateableCollision } from './main.js';
import { Capsule } from 'three/addons/math/Capsule.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { renderer } from './sceneSetup.js';
import { boundingMaterial, lineMaterial } from './objectLoader.js';

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
    e: false,
    o: false,
    ctrl: false,
};

export const resetControls = () => {
    Object.keys(keyMap).forEach(code => {
        const event = new KeyboardEvent('keyup', { code });
        onKeyUp(event);
    });
}


export let MAX_STAMINA = 100;
const SPRINT_MULTIPLIER = 2;
const CROUCH_MULTIPLIER = 0.5;
const PLAYER_SIZE = 1.3;
const GRAVITY = PLAYER_SIZE * 120;

export const player = {
    height: PLAYER_SIZE * 6,
    width: PLAYER_SIZE * 2,
    baseSpeed: PLAYER_SIZE * 128,
    sprintMultiplier: 1,
    crouchMultiplier: 1,
    crouchHeightChange: 0.8,
    jumpStrength: PLAYER_SIZE * 50,
    velocity: new THREE.Vector3(),
    direction: new THREE.Vector3(),
    onGround: true,
    currentStamina: MAX_STAMINA,
    viewMode: 0,
    cheat: false,
    inDialog: false,
    pause: false,
    str: 0,
    spd: 0,
    canExercise: false
}

const cameraOffset = {
    firstPerson: PLAYER_SIZE,
    thirdPerson: -PLAYER_SIZE * 8
}

let debug = false;

export const playerCollider = new Capsule(new THREE.Vector3(-20, 0, 40), new THREE.Vector3(-20, player.height, 40), player.width / 2);

export const controls = new PointerLockControls(camera, renderer.domElement);
controls.minPolarAngle = 0.001; // radians
controls.maxPolarAngle = Math.PI - 0.001; // radians

const keyMap = {
    'KeyW': 'w',
    'KeyA': 'a',
    'KeyS': 's',
    'KeyD': 'd',
    'Space': 'space',
    'ShiftLeft': 'shift',
    'ShiftRight': 'shift',
    'KeyC': 'c',
    'KeyF': 'f',
    'KeyP': 'p',
    'KeyE': 'e',
    'KeyO': 'o'
};

export const onKeyDown = (e) => {
    const key = keyMap[e.code];
    if (key) {
        switch (key) {
            case 'w':
            case 'a':
            case 's':
            case 'd':
            case 'space':
            case 'e':
                keys[key] = true;
                break;
            case 'shift':
                if (!keys.shift) {
                    player.sprintMultiplier *= SPRINT_MULTIPLIER;
                    keys.shift = true;
                }
                break;
            case 'c':
                if (!keys.c) {
                    playerCollider.end.y -= player.height * (1 - player.crouchHeightChange);
                    player.crouchMultiplier *= CROUCH_MULTIPLIER;
                    keys.c = true;
                }
                break;
            case 'f':
                if (!keys.f) {
                    toggleDebugMode();
                    keys.f = true;
                }
                break;
            case 'p':
                if (!keys.p) {
                    keys.p = true;
                    player.viewMode = (player.viewMode + 1) % 2;
                }
                break;
            case 'o':
                if (!keys.o) {
                    keys.o = true;
                    player.cheat = !player.cheat;
                }
                break;
        }
    }
}

export const onKeyUp = (e) => {
    const key = keyMap[e.code];
    if (key) {
        keys[key] = false;
        if (key === 'shift') {
            player.sprintMultiplier = 1;
        } else if (key === 'c') {
            if (Math.round(playerCollider.end.y - playerCollider.start.y) != Math.round(player.height)) {
                playerCollider.end.y += player.height * (1 - player.crouchHeightChange);
            }
            player.crouchMultiplier = 1;
        }
    }
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

export const movePlayerCollider = (x, y, z) => {
    // New position for the capsule's start and end
    const startVector = new THREE.Vector3(x, y, z);
    const endVector = new THREE.Vector3(x, y + player.height, z);

    // Set the new positions
    playerCollider.start.copy(startVector);
    playerCollider.end.copy(endVector);
}

let prevPosition = new THREE.Vector3();
let prevLook;
export const saveLocationLook = () => {
    player.pause = true;
    document.body.ownerDocument.removeEventListener('keydown', onKeyDown);
    document.body.ownerDocument.removeEventListener('keyup', onKeyUp);
    resetControls();
    player.velocity.set(0, 0, 0);
    prevPosition.set(...playerCollider.start);
    prevLook = {
        x: controls.getObject().rotation.x,
        y: controls.getObject().rotation.y,
        z: controls.getObject().rotation.z
    };
}
export const loadLocationLook = () => {
    player.pause = false;
    document.body.ownerDocument.addEventListener('keydown', onKeyDown);
    document.body.ownerDocument.addEventListener('keyup', onKeyUp);
    controls.getObject().rotation.set(prevLook.x, prevLook.y, prevLook.z);
    movePlayerCollider(...prevPosition);
}

function toggleDebugMode() {
    debug = !debug;
    if (debug) {
        document.body.appendChild(stats.dom);
        document.getElementById('pos').style.display = 'block';
    } else {
        document.body.removeChild(stats.dom);
        document.getElementById('pos').style.display = 'none';
    }
    boundingMaterial.opacity = debug ? 0.5 : 0;
    lineMaterial.opacity = debug ? 1 : 0;
    capsuleMesh.visible = !capsuleMesh.visible;
}


const vector1 = new THREE.Vector3();
const vector2 = new THREE.Vector3();
const vector3 = new THREE.Vector3();
const deltaPosition = new THREE.Vector3();

function closestPointOnBox3(point, box) {
    return new THREE.Vector3(
        Math.max(box.min.x, Math.min(point.x, box.max.x)),
        Math.max(box.min.y, Math.min(point.y, box.max.y)),
        Math.max(box.min.z, Math.min(point.z, box.max.z))
    );
}

function handleCollision(point, collider, velocity, radius) {
    const closestPoint = closestPointOnBox3(point, collider);
    const d2 = point.distanceToSquared(closestPoint);
    const r2 = radius * radius;

    if (d2 < r2) {
        const normal = vector1.subVectors(point, closestPoint).normalize();
        const v1 = vector2.copy(normal).multiplyScalar(normal.dot(velocity));
        velocity.sub(v1);

        const d = (radius - Math.sqrt(d2)) / 2;
        const correction = vector3.copy(normal).multiplyScalar(d);

        return { correction, normal };
    }
    return null;
}

function resolveCollision(collider, velocity, radius) {
    const center = vector1.addVectors(playerCollider.start, playerCollider.end).multiplyScalar(0.5);

    for (const point of [playerCollider.start, playerCollider.end, center]) {
        const result = handleCollision(point, collider, velocity, radius);
        if (result) {
            playerCollider.start.add(result.correction);
            playerCollider.end.add(result.correction);
            if (result.normal.y > 0.5) {
                player.onGround = true;
            }
        }
    }
}

function playerCollisions() {
    const result = worldOctree.capsuleIntersect(playerCollider);
    if (result) {
        player.onGround = result.normal.y > 0;
        if (!player.onGround) {
            player.velocity.addScaledVector(result.normal, -result.normal.dot(player.velocity));
        }
        playerCollider.translate(result.normal.multiplyScalar(result.depth));
    }
}

function playerBoxCollision(boxes) {
    boxes.forEach(box => {
        resolveCollision(box.collider, player.velocity, playerCollider.radius);
    });
}

export function updatePlayer(deltaTime) {
    let damping = Math.exp(-8 * deltaTime) - 1;

    if (!player.onGround && !player.cheat && !player.pause) {
        player.velocity.y -= GRAVITY * deltaTime;
        damping *= 0.5;
    }

    player.velocity.addScaledVector(player.velocity, damping);
    deltaPosition.copy(player.velocity).multiplyScalar(deltaTime);
    playerCollider.translate(deltaPosition);

    player.onGround = false;
    if (!player.cheat && !player.pause) {
        playerCollisions();
        playerBoxCollision(updateableCollision);
    }

    camera.position.copy(playerCollider.end);

    if (!player.cheat && !player.pause) {
        capsuleMesh.position.copy(playerCollider.start);
        capsuleMesh.position.y += player.height / 2; // Adjust for the fact that CylinderGeometry is centered at its midpoint
    }
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
    const speedDelta = deltaTime * player.sprintMultiplier * player.crouchMultiplier * ((player.onGround || player.cheat) ? player.baseSpeed : player.baseSpeed / 3);

    if (keys.w) {
        player.velocity.add(getForwardVector().multiplyScalar(speedDelta * (player.cheat ? 3 / player.sprintMultiplier : 1)));
    }
    if (keys.s) {
        player.velocity.add(getForwardVector().multiplyScalar(- speedDelta * (player.cheat ? 3 / player.sprintMultiplier : 1)));
    }
    if (keys.a) {
        player.velocity.add(getSideVector().multiplyScalar(- speedDelta * (player.cheat ? 3 / player.sprintMultiplier : 1)));
    }
    if (keys.d) {
        player.velocity.add(getSideVector().multiplyScalar(speedDelta * (player.cheat ? 3 / player.sprintMultiplier : 1)));
    }
    if (player.onGround || player.cheat) {
        if (keys.space) {
            player.velocity.y = (player.cheat ? player.jumpStrength / 1 * player.crouchMultiplier : player.jumpStrength);
        }
        if (keys.shift && player.cheat) {
            player.velocity.y = - player.jumpStrength / 1 * player.crouchMultiplier;
        }
    }
}


let lastStaminaValue = player.currentStamina;
export function updateStamina() {
    if (player.currentStamina !== lastStaminaValue) {
        updateStaminaBar((player.currentStamina / MAX_STAMINA) * 100);
        lastStaminaValue = player.currentStamina;
    }
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
    if (player.viewMode == 0 || player.cheat) return cameraOffset.firstPerson;
    return cameraOffset.thirdPerson;
}

export function addStamina() {
    MAX_STAMINA += 20;
    player.currentStamina += 20;
    updateStamina();
}