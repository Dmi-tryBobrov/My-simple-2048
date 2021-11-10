import {createTile, moveUp, moveRight, moveDown, moveLeft, initializeField} from "./tiles.js";
import {startNewGame, is2048} from "./utils.js";
import {key_pressed} from "./animation.js";

const keys = ["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"];
const buttonNewGame = document.querySelector(".button-new-game");
const linkNewGame = document.querySelector(".link-new-game");


buttonNewGame.addEventListener("click", () => {
    buttonNewGame.scrollIntoView(true);
    startNewGame();
});

linkNewGame.addEventListener("click", () => {
    buttonNewGame.scrollIntoView(true);
    startNewGame();
});

window.addEventListener("keydown", (e) =>{
    if(keys.indexOf(e.code) > -1){
        e.preventDefault();
    }
    if(key_pressed)
        return;
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