import { controls, onKeyDown, onKeyUp, player, resetControls } from "./controls.js";

const dialogBox = document.getElementById("dialog");
const playerName = document.getElementById("playerName");
const npcName = document.getElementById("npcName");

let dialogAnswer = [];
let awaitAnswer = false;
const dialogOptions = [document.getElementById("option0"), document.getElementById("option1"), document.getElementById("option2")]
for(let i = 0; i < dialogOptions.length; i++) {
    dialogOptions[i].onclick = (function(index) {
        return function() {
            dialogAnswer.push(index);
            awaitAnswer = false;
            hideDialogs();
        }
    })(i);
}

const initializeDialog = (name, npc) => {
    currentNPC = npc;
    dialogAnswer = [];
    player.inDialog = true;
    dialogBox.style.display = "flex";
    npcName.textContent = name;
    controls.unlock();
    document.body.ownerDocument.removeEventListener('keydown', onKeyDown);
    document.body.ownerDocument.removeEventListener('keyup', onKeyUp);
    resetControls()
}

const finishDialog = () => {
    dialogState = 0;
    player.inDialog = false;
    dialogBox.style.display = "none";
    playerName.style.display = 'none';
    npcName.style.display = 'none';
    controls.lock();
    document.body.ownerDocument.addEventListener('keydown', onKeyDown);
    document.body.ownerDocument.addEventListener('keyup', onKeyUp);
}

function showDialog(text, color) {
    dialogBox.textContent = text
    dialogBox.style.color = color;
}

const showPlayerDialog = (text, color) => {
    dialogBox.style.borderRadius = '20px 0px 20px 20px';
    dialogBox.style.justifyContent = 'right';
    npcName.style.display = 'none';
    playerName.style.display = 'flex';
    showDialog(text, color);
}

const showNPCDialog = (text, color) => {
    dialogBox.style.borderRadius = '0px 20px 20px 20px';
    dialogBox.style.justifyContent = 'left';
    playerName.style.display = 'none';
    npcName.style.display = 'flex';
    showDialog(text, color);
}

const hideDialogs = () => {
    for (const option of dialogOptions) {
        option.style.display = 'none';
    }
}

const showDialogOption = (optionText, optionColor) => {
    for (let i = 0; i < optionText.length; i++) {
        dialogOptions[i].style.display = 'flex';
        dialogOptions[i].textContent = optionText[i];
        dialogOptions[i].style.color = optionColor[i] || "white";
    }
    awaitAnswer = true;
}

let dialogState = 0;
let currentNPC = null;
document.addEventListener('click', function () {
    if (player.inDialog && !awaitAnswer) {
        dialogState++;
        currentNPC.startDialogue();
    }
}, false);

export const doctor = (npc) => {
    switch(dialogState) {
        case 0:
            initializeDialog("The Doctor", npc);
            showNPCDialog("Hello, sick people and their loved ones!", "yellow");
            break;
        case 1:
            showNPCDialog("In the interest of saving time and avoiding a lot of boring chitchat later, I'm Doctor Gregory House; you can call me Greg.", "yellow");
            break;
        case 2:
            showNPCDialog("I'm one of three doctors staffing this clinic this morning.", "yellow");
            break;
        case 3:
            showNPCDialog("I am a Board certified diagnostician with a double specialty in infectious disease and nephrology.", "yellow");
            break;
        case 4:
            showNPCDialog("I am also the only doctor currently employed at this clinic who is forced to be here against his will.", "yellow");
            break;
        case 5:
            showNPCDialog("But not to worry, because for most of you, this job could be done by a monkey with a bottle of Motrin.", "yellow");
            break;
        case 6:
            showNPCDialog("Speaking of which, if you're particularly annoying, you may see me reach for this: this is Vicodin.", "yellow");
            break;
        case 7:
            showPlayerDialog("It's mine. You can't have any.", "red");
            break;
        case 8:
            showNPCDialog("And no, I do not have a pain management problem, I have a pain problem.", "yellow");
            break;
        case 9:
            showNPCDialog("But who knows?", "yellow");
            break;
        case 10:
            showNPCDialog("Maybe I'm wrong.", "yellow");
            break;
        case 11:
            showPlayerDialog("Maybe I'm too stoned to tell.", "red");
            break;
        case 12:
            showNPCDialog("So, who wants me?", "yellow");
            break;
        case 13:
            showNPCDialog("Well, I'll be in Exam Room One if you change your mind.", "yellow");
            break;
        case 14:
            finishDialog();
            break;
    } 
}

export const girl = (npc) => {
    switch(dialogState) {
        case 0:
            initializeDialog("Girl A", npc);
            showNPCDialog("Hey there, I'm a tutorial. I'm here to help you.", "blue");
            break;
        case 1:
            showDialogOption(["Refuse", "Accept"], ["white", "red"]);
            break;
        case 2:
            if (dialogAnswer[0] == 0) {
                showPlayerDialog("No thanks, I know what I'm doing.", "white");
            } else if (dialogAnswer[0] == 1) {
                showPlayerDialog("Can you kill me please?", "white");
            }
            break;
        case 3:
            if (dialogAnswer[0] == 0) {
                showNPCDialog("Oh okay", "yellow");
            } else if (dialogAnswer[0] == 1) {
                showNPCDialog("*Stab Noises*", "red");
            }
            break;
        case 4:
            if (dialogAnswer[0] == 0) {
                showNPCDialog("Have a nice day!", "yellow");
            } else if (dialogAnswer[0] == 1) {
                showPlayerDialog("*AHHHHHHHHH*", "red");
            }
            break;
        case 5:
            finishDialog();
            break;
    } 
}