import { controls, onKeyDown, onKeyUp, player, resetControls } from "./controls.js";

const dialogBox = document.getElementById("dialog");
const playerName = document.getElementById("playerName");
const npcName = document.getElementById("npcName");
const dialogOptions = [document.getElementById("option0"), document.getElementById("option1"), document.getElementById("option2")]

let dialogAnswers = [];
let awaitAnswer = false;
let dialogStates = [0];
let currentNPC = null;
let index = 0;

const initializeDialog = (name, npc) => {
    currentNPC = npc;
    dialogAnswers = [];
    player.inDialog = true;
    dialogBox.style.display = "flex";
    npcName.textContent = name;
    controls.unlock();
    document.body.ownerDocument.removeEventListener('keydown', onKeyDown);
    document.body.ownerDocument.removeEventListener('keyup', onKeyUp);
    resetControls()
}

const finishDialog = () => {
    dialogStates = [0];
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
    dialogBox.style.color = color || "white";
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

// Function to handle dialog option click
function buttonClick(index) {
    dialogAnswers.push(index);
    dialogStates[dialogStates.length - 1]++;
    dialogStates.push(-1);
    awaitAnswer = false;
    console.log(dialogStates);
    hideDialogs();
}

const showDialogOption = (optionText, optionColor) => {
    optionColor = optionColor || new Array(optionText.length).fill("white");
    for (let i = 0; i < optionText.length; i++) {
        const index = optionText.length - 1 - i; // Calculate the reverse index
        dialogOptions[i].style.display = 'flex';
        dialogOptions[i].textContent = optionText[index];
        dialogOptions[i].style.color = optionColor[index] || "white";
        dialogOptions[i].onclick = buttonClick.bind(null, index);
    }
    awaitAnswer = true;
}

const concludeSubdialog = () => {
    dialogAnswers.pop();
    dialogStates.pop();
    dialogStates[dialogStates.length-1]++;
    currentNPC.startDialog();
    index--;
}


document.addEventListener('click', function () {
    if (player.inDialog && !awaitAnswer) {
        dialogStates[dialogStates.length-1]++;
        currentNPC.startDialog();
    }
}, false);

export const doctor = (npc) => {
    switch(dialogStates[0]) {
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
    index = 0;
    switch(dialogStates[index]) {
        case 0:
            initializeDialog("Girl A", npc);
            showNPCDialog("Hey there, I'm a tutorial. I'm here to help you.", "blue");
            break;
        case 1:
            showDialogOption(["Accept", "Refuse"], ["red"]);
            break;
        case 2:
            index++;
            if (dialogAnswers[index-1] == 0) {
                switch (dialogStates[index]) {
                    case 0:
                        showPlayerDialog("Can you kill me please?", "white");
                        break;
                    case 1:
                        showNPCDialog("*Stab Noises*", "red");
                        break;
                    case 2:
                        showPlayerDialog("*AHHHHHHHHH*", "red");
                        break;
                    case 3:
                        concludeSubdialog();
                        break;
                }
            } else if (dialogAnswers[index-1] == 1) {
                switch (dialogStates[index]) {
                    case 0:
                        showPlayerDialog("No thanks, I know what I'm doing.", "white");
                        break;
                    case 1:
                        showNPCDialog("Oh okay", "yellow");
                        break;
                    case 2:
                        showNPCDialog("Have a nice day!", "yellow");
                        break;
                    case 3:
                        concludeSubdialog();
                        break;
                }
            }
            break;

        case 3:
            showDialogOption(["2 subdialog", "3 subdialog"])
            break;
        case 4:
            index++;
            if (dialogAnswers[index-1] == 0) {
                switch (dialogStates[index]) {
                    case 0:
                        showPlayerDialog("test00", "white");
                        break;
                    case 1:
                        showNPCDialog("test01", "yellow");
                        break;
                    case 2:
                        concludeSubdialog();
                        break;
                }
    
            } else {
                switch (dialogStates[index]) {
                    case 0:
                        showPlayerDialog("test10", "white");
                        break;
                    case 1:
                        showNPCDialog("test11", "yellow");
                        break;
                    case 2:
                        showNPCDialog("test12", "yellow");
                        break;
                    case 3:
                        concludeSubdialog();
                        break;
                }
            }
            break;
        case 5:
            showDialogOption(["branch again to 3 option", "branch again and again"]);
            break;
        case 6:
            index++;
            if (dialogAnswers[index-1] == 0) {
                switch(dialogStates[index]) {
                    case 0:
                        showNPCDialog("aaaa", "white");
                        break;
                    case 1:
                        showDialogOption(["a", "b", "c"], []);
                        break;
                    case 2:
                        index++;
                        if (dialogAnswers[index-1] == 0) {
                            switch(dialogStates[index]) {
                                case 0:
                                    showPlayerDialog("test001", "white");
                                    break;
                                case 1:
                                    concludeSubdialog();
                                    break;
                            }
                        } else if (dialogAnswers[index-1]==1) {
                            switch(dialogStates[index]) {
                                case 0:
                                    showPlayerDialog("test010", "white");
                                    break;
                                case 1:
                                    showPlayerDialog("test011", "white");
                                    break;
                                case 2:
                                    concludeSubdialog();
                                    break;
                            }
                        } else {
                            switch(dialogStates[index]) {
                                case 0:
                                    showPlayerDialog("test010", "white");
                                    break;
                                case 1:
                                    showPlayerDialog("test011", "white");
                                    break;
                                case 2:
                                    showPlayerDialog("test012", "white");
                                    break;
                                case 3:
                                    concludeSubdialog();
                                    break;
                            }
                        }
                        break;
                    case 3:
                        concludeSubdialog();
                        break;
                }
            } else {
                switch(dialogStates[index]) {
                    case 0:
                        showNPCDialog("bbbb", "white");
                        break;
                    case 1:
                        showDialogOption(["a", "b"], []);
                        break;
                    case 2:
                        if (dialogAnswers[index-1] == 0) {
                            switch(dialogStates[index]) {
                                case 0:
                                    showPlayerDialog("aaaasdasd", "white");
                                    break;
                                case 1:
                                    showDialogOption(["a", "b"]);
                                    break;
                                case 2:
                                    index++;
                                    if (dialogAnswers[index-1] == 0) {
                                        switch(dialogStates[index]) {
                                            case 0:
                                                showPlayerDialog("test1000", "white");
                                                break;
                                            case 1:
                                                concludeSubdialog();
                                                break;
                                        }
                                    } else {
                                        switch(dialogStates[index]) {
                                            case 0:
                                                showPlayerDialog("test1010", "white");
                                                break;
                                            case 1:
                                                concludeSubdialog();
                                                break;
                                        }
                                    }
                                    break;
                                case 3:
                                    concludeSubdialog();
                                    break;
                            }
                        } else {
                            switch(dialogStates[index]) {
                                case 0:
                                    showPlayerDialog("test1100", "white");
                                    break;
                                case 1:
                                    showPlayerDialog("test1101", "white");
                                    break;
                                case 2:
                                    concludeSubdialog();
                                    break;
                            }
                        }
                        break;
                    case 3:
                        concludeSubdialog();
                        break;
                }
            }
            break;
        case 7:
            finishDialog();
            break;
    } 
}