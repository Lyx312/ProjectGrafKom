// uiSetup.js
// Create a UI element for the stamina bar
const staminaBar = document.createElement('div');
staminaBar.style.position = 'absolute';
staminaBar.style.top = '10px';
staminaBar.style.left = '10px';
staminaBar.style.width = '100px';
staminaBar.style.height = '20px';
staminaBar.style.backgroundColor = 'gray';
document.body.appendChild(staminaBar);

// Function to update the stamina bar UI
export const updateStaminaBar = (percentage) => {
    staminaBar.style.width = `${percentage}%`;
}
