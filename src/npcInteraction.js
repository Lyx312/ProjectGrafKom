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
    switch(dialogState) {
        case 0:
            initializeDialog();
            showDialog("Hello, sick people and their loved ones!", "yellow");
            break;
        case 1:
            showDialog("In the interest of saving time and avoiding a lot of boring chitchat later, I'm Doctor Gregory House; you can call me Greg.", "yellow");
            break;
        case 2:
            showDialog("I'm one of three doctors staffing this clinic this morning.", "yellow");
            break;
        case 3:
            showDialog("I am a Board certified diagnostician with a double specialty in infectious disease and nephrology.", "yellow");
            break;
        case 4:
            showDialog("I am also the only doctor currently employed at this clinic who is forced to be here against his will.", "yellow");
            break;
        case 5:
            showDialog("But not to worry, because for most of you, this job could be done by a monkey with a bottle of Motrin.", "yellow");
            break;
        case 5:
            showDialog("But not to worry, because for most of you, this job could be done by a monkey with a bottle of Motrin.", "yellow");
            break;
        case 6:
            showDialog("Speaking of which, if you're particularly annoying, you may see me reach for this: this is Vicodin.", "yellow");
            break;
        case 7:
            showDialog("It's mine. You can't have any.", "red");
            break;
        case 8:
            showDialog("And no, I do not have a pain management problem, I have a pain problem.", "yellow");
            break;
        case 9:
            showDialog("But who knows?", "yellow");
            break;
        case 10:
            showDialog("Maybe I'm wrong.", "yellow");
            break;
        case 11:
            showDialog("Maybe I'm too stoned to tell.", "red");
            break;
        case 12:
            showDialog("So, who wants me?", "yellow");
            break;
        case 13:
            showDialog("Well, I'll be in Exam Room One if you change your mind.", "yellow");
            break;
        case 14:
            finishDialog();
            dialogState = 0;
            break;
    } 
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