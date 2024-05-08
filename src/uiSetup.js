// uiSetup.js
// Create a UI element for the stamina bar
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
document.body.appendChild(staText);

export const updateStaminaBar = (percentage) => {
    const maxHeight = 200;
    const newHeight = maxHeight * (percentage / 100);
    const topPosition = Math.min(window.innerHeight - newHeight - 10, maxHeight - newHeight + 10);
    staminaBar.style.height = `${newHeight}px`;
    staminaBar.style.top = `${topPosition}px`;
}
