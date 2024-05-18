// uiSetup.js
import { player, playerCollider } from './controls.js'
import { day } from './objectAnimation.js';

// Create a UI element for the stamina bar
const staminaBarBorder = document.createElement('div');
staminaBarBorder.style.position = 'absolute';
staminaBarBorder.style.top = '10px';
staminaBarBorder.style.right = '10px';
staminaBarBorder.style.width = '20px';
staminaBarBorder.style.height = '200px';
staminaBarBorder.style.backgroundColor = 'gray';
staminaBarBorder.style.border = '1px solid black';
document.body.appendChild(staminaBarBorder);

const staminaBar = document.createElement('div');
staminaBar.style.position = 'absolute';
staminaBar.style.top = '10px';
staminaBar.style.right = '10px';
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
}

export const changeDayOverlay = (params) => {
    // Create a black overlay
    let overlay = document.createElement('div');
    overlay.id = 'black-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.opacity = '1';
    overlay.style.zIndex = '1000';
    overlay.style.transition = 'opacity 0.05s linear';
    document.body.appendChild(overlay);
    
    // Create text element
    const textElement = document.createElement('div');
    textElement.textContent = `Day ${day}`;
    textElement.style.position = 'absolute';
    textElement.style.top = '50%';
    textElement.style.left = '50%';
    textElement.style.transform = 'translate(-50%, -50%)';
    textElement.style.color = 'white';
    textElement.style.fontSize = '4em';
    overlay.appendChild(textElement);

    // Create strength text element
    const strengthTextElement = document.createElement('div');
    strengthTextElement.textContent = `Strength: ${player.str}`;
    strengthTextElement.style.position = 'absolute';
    strengthTextElement.style.top = '60%'; // Adjust vertical position as needed
    strengthTextElement.style.left = '45%'; // Adjust horizontal position as needed
    strengthTextElement.style.transform = 'translate(-50%, -50%)';
    strengthTextElement.style.color = 'white';
    strengthTextElement.style.fontSize = '1.5em';
    strengthTextElement.style.display = 'inline-block';
    overlay.appendChild(strengthTextElement);

    // Create speed text element
    const speedTextElement = document.createElement('div');
    speedTextElement.textContent = `Speed: ${player.spd}`;
    speedTextElement.style.position = 'absolute';
    speedTextElement.style.top = '60%'; // Adjust vertical position as needed
    speedTextElement.style.left = '55%'; // Adjust horizontal position as needed
    speedTextElement.style.transform = 'translate(-50%, -50%)';
    speedTextElement.style.color = 'white';
    speedTextElement.style.fontSize = '1.5em';
    speedTextElement.style.display = 'inline-block';
    overlay.appendChild(speedTextElement);

    return overlay;
}