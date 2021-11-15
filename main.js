import {moveUp, moveRight, moveDown, moveLeft, storeData, resumeGame, undo} from "./tiles.js";
import {startNewGame, is2048} from "./game_flow.js";
import {key_pressed} from "./animation.js";

const keys = ["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];
const buttonNewGame = document.querySelector(".button-new-game");
const linkNewGame = document.querySelector(".link-new-game");
const buttonUndo = document.querySelector(".button-undo");


buttonNewGame.addEventListener("click", () => {
    buttonNewGame.scrollIntoView(true);
    buttonUndo.style.display = "block";
    startNewGame();
});

linkNewGame.addEventListener("click", () => {
    buttonNewGame.scrollIntoView(true);
    startNewGame();
});

buttonUndo.addEventListener("click", (e) => {
    undo();
    e.stopPropagation();
})

window.addEventListener("keydown", (e) =>{
    if(keys.indexOf(e.code) > -1){
        e.preventDefault();
    }
    if(key_pressed)
        return;
    if(e.code == "KeyZ" && (e.ctrlKey || e.metaKey)){
        undo();
        return;
    }
    switch (e.code){
        case "KeyW":
        case "ArrowUp":
            moveUp();     
            break;
            
        case "KeyD":
        case "ArrowRight":
            moveRight();
            break;

        case "KeyA":
        case "ArrowLeft":
            moveLeft();
            break;  

        case "KeyS":
        case "ArrowDown":
            moveDown();
            break;
    }
    is2048();
});

window.addEventListener("load", () => {
    resumeGame();
    buttonNewGame.scrollIntoView(true);
    buttonUndo.style.display = "block";
});

window.addEventListener("beforeunload", () => {
    storeData();
});