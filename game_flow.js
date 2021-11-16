export {is2048, startNewGame, isLost};
import {initializeField, createTile, rows, storeSessionData} from "./tiles.js";

function startNewGame(){
    initializeField();
    let gameTiles = document.querySelectorAll(".tile"); 
    for(let i=0; i<gameTiles.length; i++){
        gameTiles[i].textContent = "";
    }
    //create 2 tiles to speed up the begginning of a game
    createTile();
    createTile();
    storeSessionData(true);
}

function is2048() {
    let tiles = document.querySelectorAll(".tile");
 
    for (let tile of tiles){
        //QA
        // console.log(i, tile.textContent);
        // i++;
        if(tile.textContent === "2048")
            showWinPopup();
    }
}

function isLost(){
    let flag_is_lost = true;
    //max row/col number === 3
    for(let row=0; row < 3; row++){
        for(let col=0; col < 3; col++){
                if(rows[row].children[col].textContent === 
                    rows[row+1].children[col].textContent)
                        flag_is_lost = false; //can merge two cells - not yet lost
                    
                if(rows[row].children[col].textContent === 
                    rows[row].children[col+1].textContent)
                        flag_is_lost = false; //can merge two cells - not yet lost
                
                //check for the last row
                if(row === 2 && rows[row+1].children[col].textContent === 
                    rows[row+1].children[col+1].textContent)
                    flag_is_lost = false;
                //check for the last col
                if(col === 2 && rows[row].children[col+1].textContent ===
                    rows[row+1].children[col+1].textContent)
                        flag_is_lost = false;        
        }
    }
    
    if(flag_is_lost){
        showLostPopup();
    }
    
}

function showWinPopup() {
    let winPopup = new Popup({
        popup: ".popup",
        content: ".popup-win-msg",
        overlay: ".overlay",
    });

    winPopup.open();

    const closeBtn = document.querySelector(".popup-close-btn");
    const tryAgainBtn = document.querySelector(".try-again");

    closeBtn.addEventListener("click", () => {
        winPopup.close();
    });

    tryAgainBtn.addEventListener("click", () => {
        winPopup.close();
        startNewGame();
    });
}

function showLostPopup() {
    let lostPopup = new Popup({
        popup: ".popup",
        content: ".popup-lost-msg",
        overlay: ".overlay",
    });

    lostPopup.open();

    const closeBtn = document.querySelector(".popup-close-btn");
    const tryAgainBtn = document.querySelector(".try-again");

    closeBtn.addEventListener("click", () => {
        lostPopup.close();
    });

    tryAgainBtn.addEventListener("click", () => {
        lostPopup.close();
        startNewGame();
    });
}

class Popup {
    constructor(Obj){
        this.popup = document.querySelector(Obj.popup);
        this.content = document.querySelector(Obj.content);
        this.overlay = document.querySelector(Obj.overlay);
    }

    open() {
        this.popup.classList.add("open");
        this.overlay.classList.add("open");
        this.content.classList.add("visible");

        let pop = this;

        this.overlay.addEventListener("click", function(e) {
            pop.close();
        });
        
    }

    close() {
        this.popup.classList.remove("open");
        this.overlay.classList.remove("open");
        this.content.classList.remove("visible");
    }
}