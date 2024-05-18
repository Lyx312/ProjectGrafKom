import { controls, onKeyDown, onKeyUp, player } from "./controls.js";

const dialogBox = document.getElementById("dialog");
const initializeDialog = () => {
    player.inDialog = true;
    dialogBox.style.opacity = 0.7;
    dialogBox.style.display = "block";
    controls.disconnect();
    document.body.ownerDocument.removeEventListener('keydown', onKeyDown);
    document.body.ownerDocument.removeEventListener('keyup', onKeyUp);
    document.body.ownerDocument.addEventListener('click', () => {
        
    });
}

const finishDialog = () => {
    player.inDialog = false;
    dialogBox.style.opacity = 0;
    dialogBox.style.display = "none";
    controls.connect();
    document.body.ownerDocument.addEventListener('keydown', onKeyDown);
    document.body.ownerDocument.addEventListener('keyup', onKeyUp);
}

function showDialog(text, color) {
    dialogBox.textContent = text
    dialogBox.style.color = color;
    dialogBox.classList.remove('fadeout');
    dialogBox.offsetWidth;
    dialogBox.classList.add('fadeout');
}

let dialogState = 0;
document.addEventListener('click', function () {
    if (player.inDialog) {
        dialogState++;
    }
}, false);

export const doctor = () => {
    console.log("yays");
}

export const girl = () => {
    switch(dialogState) {
        case 0:
            initializeDialog();
            showDialog("Hey there, I'm a tutorial. I'm here to help you.", "blue");
            break;
        case 1:
            showDialog("Sike, I'm here to kill you.", "yellow");
            break;
        case 2:
            showDialog("AHHHHHHHH", "red");
            break;
        case 3:
            showDialog("*Stab Noises*", "red");
            break;
        case 4:
            finishDialog();
            dialogState = 0;
            break;
    } 
}