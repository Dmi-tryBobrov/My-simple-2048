import {createTile, moveUp, moveRight, moveDown, moveLeft, initializeField} from "./tiles.js";
import {startNewGame, is2048} from "./utils.js";

const buttonNewGame = document.querySelector(".button-new-game");

buttonNewGame.addEventListener("click", () => {
    buttonNewGame.scrollIntoView(true);
    startNewGame();
});

window.addEventListener("keydown", (e) =>{
    switch (e.code){
        case "KeyW":
            moveUp();     
            break;
            
        case "KeyD":
            moveRight();
            break;

        case "KeyA":
            moveLeft();
            break;  

        case "KeyS":
            moveDown();
            break;
    }
    is2048();
});