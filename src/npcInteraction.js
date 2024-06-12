import * as THREE from 'three';
import { controls, onKeyDown, onKeyUp, player, resetControls, addStamina } from "./controls.js";
import { day } from "./objectAnimation.js";
import { camera } from "./sceneSetup.js";

const dialogBox = document.getElementById("dialog");
const playerName = document.getElementById("playerName");
const npcName = document.getElementById("npcName");
const dialogOptions = [document.getElementById("option0"), document.getElementById("option1"), document.getElementById("option2")]

let dialogAnswers = [];
let awaitAnswer = false;
let dialogStates = [0];
let currentNPC = null;
let index = 0;

function waitForNextFrame() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve);
    });
}

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

let spacePressed = false;
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !spacePressed) {
        spacePressed = true;
        if (player.inDialog && !awaitAnswer) {
            dialogStates[dialogStates.length-1]++;
            currentNPC.startDialog();
        }
    }
})
document.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
        spacePressed = false;
    }
})

let upgrade = 1;
let tempUpgrade = false;

export const doctor = (npc) => {
    index = 0;
    switch(dialogStates[index]) {
        case 0:
            initializeDialog("Dr. Ahmad", npc);
            showNPCDialog("Halo, saya Dr. Ahmad. Saya di sini untuk membantu kamu menjaga kesehatan selama berlatih. Ada yang bisa saya bantu?", "yellow");
            break;
        case 1:
            showDialogOption(["Stats", "Chat", "Nevermind"]);
            break;
        case 2:
            index++;
            if (dialogAnswers[index-1] == 0) {
                switch (dialogStates[index]) {
                    case 0:
                        showPlayerDialog("Bisa beri tahu stat ku dok?", "white");
                        break;
                    case 1:
                        showNPCDialog(`Ok, kamu saat ini memiliki ${(player.str)} Strength dan ${(player.spd)} Speed. Ketika kamu mencapai ${(upgrade*50)} Strength dan ${(upgrade*50)} Speed, kamu bisa kembali untuk menambah stamina mu sebanyak 20. Jadi mau upgrade?`, "yellow");
                        break;
                    case 2:
                        showDialogOption(["Upgrade", "Lain Kali"]);
                        break;
                    case 3:
                        index++;
                        if (dialogAnswers[index-1] == 0) {
                            if (player.str < (upgrade*50) || player.spd < (upgrade*50)) {
                                switch(dialogStates[index]) {
                                    case 0:
                                        showPlayerDialog("Upgrade stamina saya dok", "white");
                                        break;
                                    case 1:
                                        showNPCDialog("Maaf tetapi stat mu belum cukup untuk upgrade stamina.", "yellow");
                                        break;
                                    case 2:
                                        let tempStr = Math.max(0, (upgrade * 50) - player.str);
                                        let tempSpd = Math.max(0, (upgrade * 50) - player.spd);
                                        showNPCDialog(`kamu masih perlu ${tempStr} Strength dan ${tempSpd} Speed lagi.`, "yellow");
                                        break;
                                    case 3:
                                        tempUpgrade = false; 
                                        concludeSubdialog();
                                        break;
                                }
                            }
                            else{
                                switch(dialogStates[index]) {
                                    case 0:
                                        showPlayerDialog("Upgrade stamina saya dok.", "white");
                                        break;
                                    case 1:
                                        showNPCDialog(`Ok, stamina kamu sudah ditambah 20.`, "yellow");
                                        break;
                                    case 2:
                                        showNPCDialog(`Kembali lagi jika kamu memiliki ${(upgrade*50)+50} Strength dan ${(upgrade*50)+50} Speed, dan saya bisa upgrade stamina mu lagi.`, "yellow");
                                        break;
                                    case 3:
                                        showPlayerDialog("Ok, terima kasih dok", "white");
                                        break;
                                    case 4:
                                        concludeSubdialog();
                                        break;
                                    }
                                tempUpgrade = true;                          
                                }
                        } else if (dialogAnswers[index-1]==1) {
                            switch(dialogStates[index]) {
                                case 0:
                                    showPlayerDialog("Lain kali saja dok.", "white");
                                    break;
                                case 1:
                                    showNPCDialog("Ok, kembali ke saya jika mau upgrade.", "yellow");
                                    break;
                                case 2:
                                    concludeSubdialog();
                                    break;
                                }
                            }
                        break;
                    case 4:
                        concludeSubdialog();
                        break;
                }
            } else if (dialogAnswers[index-1] == 1) {
                switch (dialogStates[index]) {
                    case 0:
                        showNPCDialog("Hmm? Mau bicara tentang apa?", "yellow");
                        break;
                    case 1:
                        showDialogOption(["Dokter di luar gym?", "Ada cerita menarik?"])
                        break;
                    case 2:
                        index++;
                        if (dialogAnswers[index-1] == 0) {
                            switch(dialogStates[index]) {
                                case 0:
                                    showPlayerDialog("Kok ada dokter di luar gym?", "white");
                                    break;
                                case 1:
                                    showNPCDialog("Karena kesehatan dan kebugaran tak bisa dipisahkan. Saya di sini untuk memastikan para atlet dan pengunjung gym ini tetap dalam kondisi terbaik saat mereka berlatih keras.", "yellow");
                                    break;
                                case 2:
                                    showPlayerDialog("Menarik. Apakah Anda sering melihat cedera atau masalah kesehatan lainnya di sini?", "white");
                                    break;
                                case 3:
                                    showNPCDialog("Tentu saja. Olahraga yang intens dapat meningkatkan risiko cedera, jadi penting untuk selalu siap siaga.", "yellow");
                                    break;
                                case 4:
                                    showPlayerDialog("Benar sekali. Saya merasa lebih aman berlatih dengan ada dokter di dekatnya.", "white");
                                    break;
                                case 5:
                                    showNPCDialog("Itu memang tujuannya. Selalu lebih baik mencegah daripada mengobati, bukan?", "yellow");
                                    break;
                                case 6:
                                    concludeSubdialog();
                                    break;
                                }
                        } else if (dialogAnswers[index-1]==1) {
                            switch(dialogStates[index]) {
                                case 0:
                                    showPlayerDialog("Dok, saya penasaran. Apa ada cerita yang menarik?", "white");
                                    break;
                                case 1:
                                    showNPCDialog("Ada satu, cerita lama. Saya dulu seorang atlet juga, suka bermain sepak bola. Sayangnya, satu kali kecelakaan mengubah segalanya.", "yellow");
                                    break;
                                case 2:
                                    showPlayerDialog("Bisakah Anda menceritakan lebih banyak?", "white");
                                    break;
                                case 3:
                                    showNPCDialog("Ketika itu, saya mengalami patah tulang yang cukup parah saat bermain. Itu saat saya mulai tertarik pada kedokteran dan rehabilitasi fisik.", "yellow");
                                    break;
                                case 4:
                                    showPlayerDialog("Saya bisa bayangkan betapa sulitnya itu.", "white");
                                    break;
                                case 5:
                                    showNPCDialog("Ya, tapi dari situ saya belajar banyak. Sekarang, saya bisa membantu orang lain dengan pengalaman dan pengetahuan yang saya dapatkan.", "yellow");
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
                        showNPCDialog("Oh, Ok", "yellow");
                        break;
                    case 2:
                        concludeSubdialog();
                        break;
                }
            }
            break;
        case 3:
            if (tempUpgrade) {
                upgrade++;
                addStamina();
                tempUpgrade = false;
            }
            finishDialog();
            break;
    } 
}

const rotateModel = async (npc, targetPosition, totalFrames) => {
    const startQuaternion = npc.model.quaternion.clone();
    npc.model.lookAt(...targetPosition);
    const endQuaternion = npc.model.quaternion.clone();
    npc.model.quaternion.copy(startQuaternion); // Reset to start orientation

    // Gradually interpolate from start to end quaternion
    for (let i = 0; i <= totalFrames; i++) {
        const t = i / totalFrames; // Interpolation factor
        npc.model.quaternion.slerp(endQuaternion, t);
        await waitForNextFrame();
    }
}

export const girl = async (npc) => {
    index = 0;
    switch(dialogStates[index]) {
        case 0:
            initializeDialog("Lia", npc);
            currentNPC.animations["Take 001"].stop();
            rotateModel(currentNPC, [camera.position.x, currentNPC.model.position.y, camera.position.z], 60)

            showNPCDialog("Hai, selamat datang di gym! Saya Lia. Bagaimana bisa saya membantumu hari ini?", "yellow");
            break;
        case 1:
            if (!player.canExercise) {
                showDialogOption(["Help"]); 
                player.canExercise = true;  
            }
            else{
                showDialogOption(["Help", "Chat", "Nevermind"]);                
            }
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
                                    showPlayerDialog(`Sebenarnya sih, saya ada reuni SMA dalam ${(8-day)} hari tapi saya tidak terlalu pd dengan tubuh saya maka saya memutuskan untuk pergi ke GYM untuk menjadi kekar`, "white");
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
            currentNPC.animations["Take 001"].play();
            rotateModel(currentNPC, [currentNPC.model.position.x, currentNPC.model.position.y, currentNPC.model.position.z-1], 60)
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

export const introHelpMonolog = () => {
    index = 0;
    switch(dialogStates[index]) {
        case 0:
            initializeDialog("AAA", {startDialog: introHelpMonolog});
            showPlayerDialog("Hmm mulai dari mana ya?");
            break;
        case 1:
            showPlayerDialog("Aku gak pernah ke gym sebelumnya.");
            break;
        case 2:
            showPlayerDialog("Huh?");
            break;
        case 3:
            showPlayerDialog("Mungkin aku bisa bertanya pada gadis di sana itu.");
            break;
        case 4:
            finishDialog();
            break;
    }
}