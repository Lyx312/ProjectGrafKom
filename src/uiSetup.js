// uiSetup.js
// Create a UI element for the stamina bar
import { interactibles } from './main.js';

const staminaBarBorder = document.createElement('div');
staminaBarBorder.style.position = 'absolute';
staminaBarBorder.style.top = '10px';
staminaBarBorder.style.left = '10px';
staminaBarBorder.style.width = '20px';
staminaBarBorder.style.height = '200px';
staminaBarBorder.style.backgroundColor = 'gray';
staminaBarBorder.style.border = '1px solid black';
document.body.appendChild(staminaBarBorder);

const staminaBar = document.createElement('div');
staminaBar.style.position = 'absolute';
staminaBar.style.top = '10px';
staminaBar.style.left = '10px';
staminaBar.style.width = '20px';
staminaBar.style.height = '100px';
staminaBar.style.backgroundColor = 'yellow';
staminaBar.style.border = '1px solid black';
document.body.appendChild(staminaBar);

const staText = document.createElement('div');
staText.textContent = 'STA';
staText.style.position = 'absolute';
staText.style.top = '215px';
staText.style.left = '12px';
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
    interact.style.top = '50%';
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