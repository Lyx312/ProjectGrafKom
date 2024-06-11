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

const showPlayerDialog = (text, color="white") => {
    dialogBox.style.borderRadius = '20px 0px 20px 20px';
    dialogBox.style.justifyContent = 'right';
    npcName.style.display = 'none';
    playerName.style.display = 'flex';
    showDialog(text, color);
}

const showNPCDialog = (text, color="white") => {
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
    // console.log(dialogStates);
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
            initializeDialog("Lia", npc);
            showNPCDialog("Hai, selamat datang di gym! Saya Lia. Bagaimana bisa saya membantumu hari ini?", "yellow");
            break;
        case 1:
            showDialogOption(["Help", "Chat", "Nevermind"], ["red"]);
            break;
        case 2:
            index++;
            if (dialogAnswers[index-1] == 0) {
                switch (dialogStates[index]) {
                    case 0:
                        showPlayerDialog("Halo Lia, senang bertemu denganmu, nama saya Bob. Aku butuh bantuan untuk memulai.", "white");
                        break;
                    case 1:
                        showNPCDialog("Tentu saja, saya bisa membantu. Di gym ini, kamu bisa menggunakan berbagai peralatan untuk meningkatkan kekuatan atau kecepatanmu, tergantung pada peralatan yang kamu gunakan. Namun, setiap latihan akan menurunkan stamina kamu.", "yellow");
                        break;
                    case 2:
                        showPlayerDialog("Bagaimana cara mengembalikan stamina saya?", "white");
                        break;
                    case 3:
                        showNPCDialog("Untuk mengembalikan stamina, kamu harus menunggu sampai hari berikutnya. Kamu bisa melakukannya dengan berinteraksi dengan mobilmu di luar gym.", "yellow");
                        break;
                    case 4:
                        showPlayerDialog("Terima kasih, Lia. Itu sangat membantu.", "white");
                        break;
                    case 5:
                        showNPCDialog("Sama-sama! Jangan ragu untuk bertanya jika kamu butuh bantuan lebih lanjut.", "yellow");
                        break;
                    case 6:
                        concludeSubdialog();
                        break;
                }
            } else if (dialogAnswers[index-1] == 1) {
                switch (dialogStates[index]) {
                    case 0:
                        showNPCDialog("Hmm? Mau bicara tentang apa?", "yellow");
                        break;
                    case 1:
                        showDialogOption(["Sering ke gym?", "Suka olah raga apa?"])
                        break;
                    case 2:
                        index++;
                        if (dialogAnswers[index-1] == 0) {
                            switch(dialogStates[index]) {
                                case 0:
                                    showPlayerDialog("Lia, jadi Sudah berapa lama kamu pergi ke sini?", "white");
                                    break;
                                case 1:
                                    showNPCDialog("Saya sudah di gym ini selama lima tahun. Saya sangat menikmati membantu orang-orang mencapai tujuan kebugaran mereka.", "yellow");
                                    break;
                                case 2:
                                    showPlayerDialog("Wah, pasti kamu punya banyak pengalaman ya.", "white");
                                    break;
                                case 3:
                                    showNPCDialog("Ya, saya sudah melihat banyak orang yang datang dan pergi, dan saya senang bisa melihat perkembangan mereka. Apakah kamu punya tujuan khusus dalam latihanmu?", "yellow");
                                    break;
                                case 4:
                                    showPlayerDialog("Sebenarnya sih, saya ada reuni SMA dalam 1 minggu tapi saya tidak terlalu pd dengan tubuh saya maka saya memutuskan untuk pergi ke GYM untuk menjadi kekar", "white");
                                    break;
                                case 5:
                                    showNPCDialog("Ohh begitu. Tetap fokus dan konsisten, dan kamu pasti akan melihat hasilnya.", "yellow");
                                    break;
                                case 6:
                                    showPlayerDialog("Terima kasih, Lia. Saya akan berusaha.", "white");
                                    break;
                                case 7:
                                    showNPCDialog("Semangat ya! Kalau butuh sesuatu, saya selalu ada di sini.", "yellow");
                                    break;
                                case 8:
                                    concludeSubdialog();
                                    break;
                                }
                        } else if (dialogAnswers[index-1]==1) {
                            switch(dialogStates[index]) {
                                case 0:
                                    showPlayerDialog("Lia, kamu suka olahraga apa selain latihan di gym?", "white");
                                    break;
                                case 1:
                                    showNPCDialog("Saya suka bersepeda dan yoga. Keduanya membantu saya tetap bugar dan rileks.", "yellow");
                                    break;
                                case 2:
                                    showPlayerDialog("Kedengarannya menyenangkan. Mungkin aku harus mencobanya juga.", "white");
                                    break;
                                case 3:
                                    showNPCDialog("Tentu! Bersepeda bagus untuk kardio, dan yoga bisa membantu fleksibilitas dan mengurangi stres.", "yellow");
                                    break;
                                case 4:
                                    showPlayerDialog("Terima kasih atas sarannya, Lia.", "white");
                                    break;
                                case 5:
                                    showNPCDialog("Sama-sama! Semoga hari kamu menyenangkan.", "yellow");
                                    break;
                                case 6:
                                    concludeSubdialog();
                                    break;
                                }
                            }
                        break;
                    case 3:
                        concludeSubdialog();
                        break;
                }
            } else if (dialogAnswers[index-1] == 2) {
                switch (dialogStates[index]) {
                    case 0:
                        showPlayerDialog("Maaf gak jadi deh.", "white");
                        break;
                    case 1:
                        showNPCDialog("Ok", "yellow");
                        break;
                    case 2:
                        concludeSubdialog();
                        break;
                }
            }
            break;

        // case 3:
        //     showDialogOption(["Sering ke gym?", "suka olah raga apa?"])
        //     break;
        // case 4:
        //     index++;
        //     if (dialogAnswers[index-1] == 0) {
        //         switch (dialogStates[index]) {
        //             case 0:
        //                 showPlayerDialog("Lia, jadi Sudah berapa lama kamu pergi ke sini?", "white");
        //                 break;
        //             case 1:
        //                 showNPCDialog("Saya sudah di gym ini selama lima tahun. Saya sangat menikmati membantu orang-orang mencapai tujuan kebugaran mereka.", "yellow");
        //                 break;
        //             case 2:
        //                 showPlayerDialog("Wah, pasti kamu punya banyak pengalaman ya.", "white");
        //                 break;
        //             case 3:
        //                 showNPCDialog("Ya, saya sudah melihat banyak orang yang datang dan pergi, dan saya senang bisa melihat perkembangan mereka. Apakah kamu punya tujuan khusus dalam latihanmu?", "yellow");
        //                 break;
        //             case 4:
        //                 showPlayerDialog("Sebenarnya sih, saya ada reuni SMA dalam 1 minggu tapi saya tidak terlalu pd dengan tubuh saya maka saya memutuskan untuk pergi ke GYM untuk menjadi kekar", "white");
        //                 break;
        //             case 5:
        //                 showNPCDialog("Ohh begitu. Tetap fokus dan konsisten, dan kamu pasti akan melihat hasilnya.", "yellow");
        //                 break;
        //             case 6:
        //                 showPlayerDialog("Terima kasih, Lia. Saya akan berusaha.", "white");
        //                 break;
        //             case 7:
        //                 showNPCDialog("Semangat ya! Kalau butuh sesuatu, saya selalu ada di sini.", "yellow");
        //                 break;
        //             case 8:
        //                 concludeSubdialog();
        //                 break;
        //         }
    
        //     } else {
        //         switch (dialogStates[index]) {
        //             case 0:
        //                 showPlayerDialog("Lia, kamu suka olahraga apa selain latihan di gym?", "white");
        //                 break;
        //             case 1:
        //                 showNPCDialog("Saya suka bersepeda dan yoga. Keduanya membantu saya tetap bugar dan rileks.", "yellow");
        //                 break;
        //             case 2:
        //                 showPlayerDialog("Kedengarannya menyenangkan. Mungkin aku harus mencobanya juga.", "white");
        //                 break;
        //             case 3:
        //                 showNPCDialog("Tentu! Bersepeda bagus untuk kardio, dan yoga bisa membantu fleksibilitas dan mengurangi stres.", "yellow");
        //                 break;
        //             case 4:
        //                 showPlayerDialog("Terima kasih atas sarannya, Lia.", "white");
        //                 break;
        //             case 5:
        //                 showNPCDialog("Sama-sama! Semoga hari kamu menyenangkan.", "yellow");
        //                 break;
        //             case 6:
        //                 concludeSubdialog();
        //                 break;
        //         }
        //     }
        //     break;
        // case 5:
        //     showDialogOption(["branch again to 3 option", "branch again and again"]);
        //     break;
        // case 6:
        //     index++;
        //     if (dialogAnswers[index-1] == 0) {
        //         switch(dialogStates[index]) {
        //             case 0:
        //                 showNPCDialog("aaaa", "white");
        //                 break;
        //             case 1:
        //                 showDialogOption(["a", "b", "c"], []);
        //                 break;
        //             case 2:
        //                 index++;
        //                 if (dialogAnswers[index-1] == 0) {
        //                     switch(dialogStates[index]) {
        //                         case 0:
        //                             showPlayerDialog("test001", "white");
        //                             break;
        //                         case 1:
        //                             concludeSubdialog();
        //                             break;
        //                     }
        //                 } else if (dialogAnswers[index-1]==1) {
        //                     switch(dialogStates[index]) {
        //                         case 0:
        //                             showPlayerDialog("test010", "white");
        //                             break;
        //                         case 1:
        //                             showPlayerDialog("test011", "white");
        //                             break;
        //                         case 2:
        //                             concludeSubdialog();
        //                             break;
        //                     }
        //                 } else {
        //                     switch(dialogStates[index]) {
        //                         case 0:
        //                             showPlayerDialog("test010", "white");
        //                             break;
        //                         case 1:
        //                             showPlayerDialog("test011", "white");
        //                             break;
        //                         case 2:
        //                             showPlayerDialog("test012", "white");
        //                             break;
        //                         case 3:
        //                             concludeSubdialog();
        //                             break;
        //                     }
        //                 }
        //                 break;
        //             case 3:
        //                 concludeSubdialog();
        //                 break;
        //         }
        //     } else {
        //         switch(dialogStates[index]) {
        //             case 0:
        //                 showNPCDialog("bbbb", "white");
        //                 break;
        //             case 1:
        //                 showDialogOption(["a", "b"], []);
        //                 break;
        //             case 2:
        //                 index++;
        //                 if (dialogAnswers[index-1] == 0) {
        //                     switch(dialogStates[index]) {
        //                         case 0:
        //                             showPlayerDialog("aaaasdasd", "white");
        //                             break;
        //                         case 1:
        //                             showDialogOption(["a", "b"]);
        //                             break;
        //                         case 2:
        //                             index++;
        //                             if (dialogAnswers[index-1] == 0) {
        //                                 switch(dialogStates[index]) {
        //                                     case 0:
        //                                         showPlayerDialog("test1000", "white");
        //                                         break;
        //                                     case 1:
        //                                         concludeSubdialog();
        //                                         break;
        //                                 }
        //                             } else {
        //                                 switch(dialogStates[index]) {
        //                                     case 0:
        //                                         showPlayerDialog("test1010", "white");
        //                                         break;
        //                                     case 1:
        //                                         concludeSubdialog();
        //                                         break;
        //                                 }
        //                             }
        //                             break;
        //                         case 3:
        //                             concludeSubdialog();
        //                             break;
        //                     }
        //                 } else {
        //                     switch(dialogStates[index]) {
        //                         case 0:
        //                             showPlayerDialog("test1100", "white");
        //                             break;
        //                         case 1:
        //                             showPlayerDialog("test1101", "white");
        //                             break;
        //                         case 2:
        //                             concludeSubdialog();
        //                             break;
        //                     }
        //                 }
        //                 break;
        //             case 3:
        //                 concludeSubdialog();
        //                 break;
        //         }
        //     }
        //     break;
        case 3:
            finishDialog();
            break;
    } 
}


export const introMonolog = () => {
    index = 0;
    switch(dialogStates[index]) {
        case 0:
            initializeDialog("AAA", {startDialog: introMonolog});
            showPlayerDialog("Waduh gimana nih???");
            break;
        case 1:
            showPlayerDialog("Aku harus keliatan kekar dalam 1 mingguu??!");
            break;
        case 2:
            showPlayerDialog("Yasudah aku coba masuk dulu saja");
            break;
        case 3:
            showPlayerDialog("Mungkin ada orang yang bisa mbantu aku latihan");
            break;
        case 4:
            finishDialog();
            break;
    }
}