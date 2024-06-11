// uiSetup.js
import { controls, player, playerCollider } from './controls.js'
import * as THREE from 'three';

// Create a UI element for the stamina bar
const staminaBarBorder = document.createElement('div');
staminaBarBorder.style.position = 'absolute';
staminaBarBorder.style.top = '10px';
staminaBarBorder.style.right = '13.5px';
staminaBarBorder.style.width = '20px';
staminaBarBorder.style.height = '200px';
staminaBarBorder.style.backgroundColor = 'gray';
staminaBarBorder.style.border = '1px solid black';
document.body.appendChild(staminaBarBorder);

const staminaBar = document.createElement('div');
staminaBar.style.position = 'absolute';
staminaBar.style.top = '10px';
staminaBar.style.right = '13.5px';
staminaBar.style.width = '20px';
staminaBar.style.height = '200px';
staminaBar.style.backgroundColor = 'yellow';
staminaBar.style.border = '1px solid black';
document.body.appendChild(staminaBar);

const staText = document.createElement('div');
staText.textContent = 'STA';
staText.style.position = 'absolute';
staText.style.top = '215px';
staText.style.right = '12px';
staText.style.fontWeight = 'bold';
staText.style.fontSize = '10px';
staText.style.color = 'red';
staText.style.padding = '3px';
staText.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
staText.style.borderRadius = '3px';
//staText.style.textShadow = '0 0 2px white';
document.body.appendChild(staText);

export const updateStaminaBar = (percentage) => {
    const maxHeight = 200;
    const newHeight = maxHeight * (percentage / 100);
    const topPosition = Math.min(window.innerHeight - newHeight - 10, maxHeight - newHeight + 10);
    staminaBar.style.height = `${newHeight}px`;
    staminaBar.style.top = `${topPosition}px`;
}

let interact = null;

export const initInteractables = () => {
    // Create the interactable element
    interact = document.createElement('div');
    interact.style.position = 'absolute';
    interact.style.width = '40px'; // Adjust size to fit key text
    interact.style.height = '40px';
    interact.style.backgroundColor = 'lightgray';
    interact.style.border = '2px solid black';
    interact.style.borderRadius = '5px';
    interact.style.textAlign = 'center';
    interact.style.lineHeight = '40px'; // Center text vertically
    interact.style.fontFamily = 'Arial, sans-serif';
    interact.style.fontSize = '16px';

    // Append the interactable element to the body
    document.body.appendChild(interact);
}

export const showInteractables = (text) => {
    // Ensure interactable is initialized
    if (!interact) {
        initInteractables();
    }

    // Set the text content
    interact.innerHTML = `<div style="text-align: center;">E<br>${text}</div>`;

    // Position the interactable at the middle of the screen
    interact.style.top = '40%';
    interact.style.left = '50%';
    interact.style.transform = 'translate(-50%, -50%)';

    // Show the interactable
    interact.style.display = 'block';
}

export const hideInteractables = () => {
    // Hide the interactable
    if (interact) {
        interact.style.display = 'none';
    }
}

export function updateDebugScreen() {
    document.getElementById('pos_x').innerText = "x: " + playerCollider.end.x;
    document.getElementById('pos_y').innerText = "y: " + playerCollider.end.y;
    document.getElementById('pos_z').innerText = "z: " + playerCollider.end.z;
    document.getElementById('velocity_x').innerText = "vx: " + player.velocity.x;
    document.getElementById('velocity_y').innerText = "vy: " + player.velocity.y;
    document.getElementById('velocity_z').innerText = "vz: " + player.velocity.z;
    document.getElementById('look_x').innerText = "lx: " + controls.getObject().rotation.x;
    document.getElementById('look_y').innerText = "ly: " + controls.getObject().rotation.y;
    document.getElementById('look_z').innerText = "lz: " + controls.getObject().rotation.z;
}

const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);

const initializeAudio = () => {
    sound.setLoop(false);
    sound.setVolume(0.5);
};

const playSound = () => {
    if (sound.buffer && sound.context.state === 'suspended') {
        sound.context.resume().then(() => {
            sound.play();
        });
    } else {
        sound.play();
    }
};

const audioLoader = new THREE.AudioLoader();
audioLoader.load('../assets/audio/car_to_rooster_v2.mp3', function (buffer) {
    sound.setBuffer(buffer);
    initializeAudio();
});

const overlay = document.getElementById('change-day-overlay');
export const changeDayOverlay = (day, strength, speed) => {
    overlay.querySelector('#day').textContent = `Day ${day}`;
    overlay.querySelector('#str').textContent = `Strength: ${strength}`;
    overlay.querySelector('#spd').textContent = `Speed: ${speed}`;

    playSound();
    overlay.classList.remove('fade');
    overlay.style.opacity = 1;

    setTimeout(() => {
        void overlay.offsetWidth;
        overlay.classList.add('fade');
        overlay.style.opacity = 0;
    }, 1500);
};

    // Create start screen elements
    export const startScreen = document.createElement("div");
    export const title = document.createElement("h1");
    export const startButton = document.createElement("button");
    export const loadingBarContainer = document.createElement("div");
    export const loadingBar = document.createElement("div");

    startScreen.style.position = "fixed";
    startScreen.style.top = "0";
    startScreen.style.left = "0";
    startScreen.style.width = "100%";
    startScreen.style.height = "100%";
    startScreen.style.backgroundColor = "black";
    startScreen.style.display = "flex";
    startScreen.style.flexDirection = "column";
    startScreen.style.justifyContent = "center";
    startScreen.style.alignItems = "center";
    startScreen.style.zIndex = "1000"; // Ensure it's on top

    title.textContent = "Workout Simulator";
    title.style.color = "white";
    title.style.fontSize = "48px";
    title.style.marginBottom = "20px";

    startButton.textContent = "Start";
    startButton.style.padding = "20px 40px";
    startButton.style.fontSize = "24px";
    startButton.style.color = "white";
    startButton.style.backgroundColor = "gray";
    startButton.style.border = "none";
    startButton.style.borderRadius = "10px";
    startButton.style.cursor = "not-allowed";
    startButton.style.transition = "background-color 0.3s, transform 0.3s";
    startButton.disabled = true;

    loadingBarContainer.style.position = "absolute";
    loadingBarContainer.style.bottom = "50px"; // Adjust this to leave some space
    loadingBarContainer.style.left = "10%"; // Adjust this for desired left margin
    loadingBarContainer.style.width = "80%"; // Adjust this for desired width
    loadingBarContainer.style.height = "30px";
    loadingBarContainer.style.backgroundColor = "#333";
    loadingBarContainer.style.borderRadius = "15px";
    loadingBarContainer.style.overflow = "hidden";

    loadingBar.style.height = "100%";
    loadingBar.style.width = "0%";
    loadingBar.style.backgroundColor = "green";
    loadingBar.style.transition = "width 0.5s";

    export const createBlackScreen = () => {
        const blackScreen = document.createElement('div');
        blackScreen.id = 'black-screen';
        blackScreen.style.position = 'fixed';
        blackScreen.style.top = '0';
        blackScreen.style.left = '0';
        blackScreen.style.width = '100%';
        blackScreen.style.height = '100%';
        blackScreen.style.backgroundColor = 'black';
        blackScreen.style.zIndex = '9999';
        blackScreen.style.display = 'none';
        document.body.appendChild(blackScreen);
    }
    
    export const showBlackScreen = () => {
        const blackScreen = document.getElementById('black-screen');
        if (blackScreen) {
            blackScreen.style.display = 'block';
        }
    }
    
    export const hideBlackScreen = () => {
        const blackScreen = document.getElementById('black-screen');
        if (blackScreen) {
            blackScreen.style.display = 'none';
        }
    }