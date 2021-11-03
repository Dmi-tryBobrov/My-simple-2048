import {createTile, moveUp, moveRight, moveDown, moveLeft, initializeField} from "./tiles.js";

const buttonNewGame = document.querySelector(".button-new-game");
const tileIndexMin = 0;
const tileIndexMax = 15;
var tilePositions = new Map();

buttonNewGame.addEventListener("click", () => {
    startNewGame();
});

function startNewGame(){
    initializeField();
    let gameTiles = document.querySelectorAll(".tile"); 
    for(let i=0; i<gameTiles.length; i++){
        gameTiles[i].textContent = "";
    }
    //create 2 tiles to speed up the begginning of a game
    createTile();
    createTile();
}

window.addEventListener("keydown", (e) =>{
    switch (e.code){
        case "KeyW" || "ArrowUp":
            moveUp();     
            break;
            
        case "KeyD" || "ArrowRight":
            moveRight();
            break;

        case "KeyA" || "ArrowLeft":
            moveLeft();
            break;  

        case "KeyS" || "ArrowDown":
            moveDown();
            break;
    }
    $(is2048());
});

function is2048() {
    var tiles = $(".tile");
    // let i = 0;
    for (let tile of tiles){
        //QA
        // console.log(i, tile.textContent);
        // i++;
        if(tile.textContent === "2048")
            showWinPopup();
    }
}

function showWinPopup() {
    var winPopup = new Popup({
        popup: ".popup",
        content: ".popup-content",
        overlay: ".overlay",
    });

    winPopup.open();

    $(".popup-close-btn").click( () => {
        winPopup.close();
    });
    
    $(".try-again").click( () => {
        winPopup.close();
        startNewGame();
    });
}

function Popup(Obj) {
    this.popup = $(Obj.popup);
    this.content = $(Obj.content);
    this.overlay = $(Obj.overlay);

    var pop = this;
    // function(content);

    this.open = () => {
        // pop.content.html(content);
        pop.popup.addClass("open").fadeIn(1000);
        pop.overlay.addClass("open");
    };

    this.close = () => {
        pop.popup.removeClass("open");
        pop.overlay.removeClass("open");
    };

    this.overlay.click(function(e) {
        if (!pop.popup.is(e.target) && pop.popup.has(e.target).length === 0) {
            pop.close();
        }
    });
}