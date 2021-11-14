export {is2048, startNewGame, isLost};
import {initializeField, createTile, rows} from "./tiles.js";

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

function is2048() {
    let tiles = $(".tile");
    // let i = 0;
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

    $(".popup-close-btn").click( () => {
        winPopup.close();
    });
    
    $(".try-again").click( () => {
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

    $(".popup-close-btn").click( () => {
        lostPopup.close();
    });
    
    $(".try-again").click( () => {
        lostPopup.close();
        startNewGame();
    });
}

function Popup(Obj) {
    this.popup = $(Obj.popup);
    this.content = $(Obj.content);
    this.overlay = $(Obj.overlay);

    let pop = this;

    this.open = () => {
        pop.popup.addClass("open").fadeIn(1000);
        pop.overlay.addClass("open");
        pop.content.addClass("visible");
    };

    this.close = () => {
        pop.popup.removeClass("open");
        pop.overlay.removeClass("open");
        pop.content.removeClass("visible");
    };

    this.overlay.click(function(e) {
        if (!pop.popup.is(e.target) && pop.popup.has(e.target).length === 0) {
            pop.close();
        }
    });
}