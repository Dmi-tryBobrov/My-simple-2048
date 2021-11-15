export {createTile, moveUp, moveRight, moveDown, moveLeft, initializeField};
export {rows, changeTilePosition, mergeTiles, storeData, resumeGame};
import { isLost } from "./game_flow.js";
import {createVectors, createMergeVectors, animateTiles } from "./animation.js";

let positionsAll = new Map();
//positionsAll -> key(int: 0-15): [row, col]
let positionsOccupied = [
    [], [], [], []
];
const rows = document.querySelectorAll(".row");
let positionsFree = [];
let any_tile_moved = false;
// let positionsVal = [
//     [], [], [], []
// ];
    
//10% cnance to greate new tile with value 4
const CHANCE_TO_GET_4 = 0.1;

class Tile{
    constructor(isOccupied, value, alreadyMerged){
        this.isOccupied = isOccupied;
        this.value = value;
        this.alreadyMerged = alreadyMerged;
    }
}

function initializeField(){
    for(let row=0, i=0; row<4; row++){
        for(let col=0; col<4; col++, i++){
            positionsAll.set(i, [row, col]);
            positionsOccupied[row][col] = new Tile(false, 0, false);//init to false
        }
    }
}

 function createTile(){
    obtainFreePositions();

    if(positionsFree.length === 0){
        //check if there is a game over since no more space available
        isLost();
        return;
    }

    let index = Math.floor(Math.random()*positionsFree.length);
    
    let row = positionsAll.get(positionsFree[index])[0];
    let col = positionsAll.get(positionsFree[index])[1];
    
    if(Math.random() < CHANCE_TO_GET_4)
        setNewTile(row, col, "4");
    else
        setNewTile(row, col);
 }

 function setNewTile(row, col, tileText="2"){
    let startTile = document.createElement("div");
    startTile.textContent = tileText;
    startTile.setAttribute("class", "tile-new");
    startTile.classList.add("tile-"+tileText);
    rows[row].children[col].appendChild(startTile);

    positionsOccupied[row][col].isOccupied = true;
    positionsOccupied[row][col].value = tileText;

    console.log(JSON.stringify(positionsOccupied));
}

function removeTile(row, col){
    while(rows[row].children[col].hasChildNodes())
      rows[row].children[col].removeChild(rows[row].children[col].firstChild);
    
    positionsOccupied.set([row, col].toString(), false);
}

function obtainFreePositions(){
    positionsFree = [];
    for(let i=0; i < positionsAll.size; i++){
        //obtain x,y coord of a tile
        let row = positionsAll.get(i)[0];
        let col = positionsAll.get(i)[1];
        if(!positionsOccupied[row][col].isOccupied){
            positionsFree.push(i);
        }
    }
    // console.log(positionsFree);
}

function moveUp(){
    //nowhere to move up if row==0
    for(let currentRow=1; currentRow < 4; currentRow++){
        for(let currentColumn=0; currentColumn < 4; currentColumn++){
            if(positionsOccupied[currentRow][currentColumn].isOccupied){
                                
                let newRow = currentRow;
                //must not move up if upper cell is occupied
                while(newRow > 0 && !positionsOccupied[newRow-1][currentColumn].isOccupied){
                    positionsOccupied[newRow][currentColumn].isOccupied = false;
                    positionsOccupied[newRow-1][currentColumn].isOccupied = true;
                    positionsOccupied[newRow-1][currentColumn].value = 
                    positionsOccupied[newRow][currentColumn].value;
                    positionsOccupied[newRow][currentColumn].value = 0;
                    
                    newRow--;
                }

                if(newRow > 0 && positionsOccupied[newRow][currentColumn].value === 
                    positionsOccupied[newRow-1][currentColumn].value &&
                    !positionsOccupied[newRow-1][currentColumn].alreadyMerged){

                    createVectors(currentRow, currentColumn, newRow-1, currentColumn);
                    createMergeVectors(newRow-1, currentColumn);

                    positionsOccupied[newRow][currentColumn].isOccupied = false;
                    let tmp = positionsOccupied[newRow-1][currentColumn].value;
                    positionsOccupied[newRow-1][currentColumn].value = (parseInt(tmp)*2).toString();
                    positionsOccupied[newRow][currentColumn].value = 0;
                    //can merge only once
                    positionsOccupied[newRow-1][currentColumn].alreadyMerged = true;
                    any_tile_moved = true;
                }
                else if(newRow !== currentRow) {
                    createVectors(currentRow, currentColumn, newRow, currentColumn);
                    any_tile_moved = true;
                }
            }
        }
    }

    updateField();   
}

function moveDown(){
    //nowhere to move down if row==3 -> last row
    for(let currentRow=2; currentRow >= 0; currentRow--){
        for(let currentColumn=0; currentColumn < 4; currentColumn++){
            if(positionsOccupied[currentRow][currentColumn].isOccupied){
                                
                let newRow = currentRow;
                //must not move down if lower cell is occupied
                while(newRow < 3 && !positionsOccupied[newRow+1][currentColumn].isOccupied){
                    positionsOccupied[newRow][currentColumn].isOccupied = false;
                    positionsOccupied[newRow+1][currentColumn].isOccupied = true;
                    positionsOccupied[newRow+1][currentColumn].value = 
                    positionsOccupied[newRow][currentColumn].value;
                    positionsOccupied[newRow][currentColumn].value = 0;
                    
                    newRow++;
                }

                if(newRow < 3 && positionsOccupied[newRow][currentColumn].value === 
                    positionsOccupied[newRow+1][currentColumn].value &&
                    !positionsOccupied[newRow+1][currentColumn].alreadyMerged){
                    
                    createVectors(currentRow, currentColumn, newRow+1, currentColumn);
                    createMergeVectors(newRow+1, currentColumn);

                    positionsOccupied[newRow][currentColumn].isOccupied = false;
                    let tmp = positionsOccupied[newRow+1][currentColumn].value;
                    positionsOccupied[newRow+1][currentColumn].value = (parseInt(tmp)*2).toString();
                    positionsOccupied[newRow][currentColumn].value = 0;
                    //can merge only once
                    positionsOccupied[newRow+1][currentColumn].alreadyMerged = true;
                    any_tile_moved = true;
                }
                else if(newRow !== currentRow) {
                    createVectors(currentRow, currentColumn, newRow, currentColumn);
                    any_tile_moved = true;
                }
            }
        }
    }

    updateField();
}

function moveRight(){
    //nowhere to move right if col==3 -> last col
    for(let currentColumn=2; currentColumn >= 0; currentColumn--){
        for(let currentRow=0; currentRow < 4; currentRow++){
            if(positionsOccupied[currentRow][currentColumn].isOccupied){
                                
                let newColumn = currentColumn;
                //must not move right if a cell to the right is occupied
                while(newColumn < 3 && !positionsOccupied[currentRow][newColumn+1].isOccupied){
                    positionsOccupied[currentRow][newColumn].isOccupied = false;
                    positionsOccupied[currentRow][newColumn+1].isOccupied = true;
                    positionsOccupied[currentRow][newColumn+1].value = 
                    positionsOccupied[currentRow][newColumn].value;
                    positionsOccupied[currentRow][newColumn].value = 0;
                    
                    newColumn++;
                }
                
                if(newColumn < 3 && positionsOccupied[currentRow][newColumn].value === 
                    positionsOccupied[currentRow][newColumn+1].value &&
                    !positionsOccupied[currentRow][newColumn+1].alreadyMerged){
                    
                    createVectors(currentRow, currentColumn, currentRow, newColumn+1);
                    createMergeVectors(currentRow, newColumn+1);

                    positionsOccupied[currentRow][newColumn].isOccupied = false;
                    let tmp = positionsOccupied[currentRow][newColumn+1].value;
                    positionsOccupied[currentRow][newColumn+1].value = (parseInt(tmp)*2).toString();
                    positionsOccupied[currentRow][newColumn].value = 0;
                    //can merge only once
                    positionsOccupied[currentRow][newColumn+1].alreadyMerged = true;
                    any_tile_moved = true;
                }
                else if(newColumn !== currentColumn) {
                    createVectors(currentRow, currentColumn, currentRow, newColumn);
                    any_tile_moved = true;
                }
            }
        }
    }
    
    updateField();
}

function moveLeft(){
    //nowhere to move left if col==0 -> first col
    for(let currentColumn=1; currentColumn < 4; currentColumn++){
        for(let currentRow=0; currentRow < 4; currentRow++){
            if(positionsOccupied[currentRow][currentColumn].isOccupied){
                                
                let newColumn = currentColumn;
                //must not move left if a cell to the left is occupied
                while(newColumn > 0 && !positionsOccupied[currentRow][newColumn-1].isOccupied){
                    positionsOccupied[currentRow][newColumn].isOccupied = false;
                    positionsOccupied[currentRow][newColumn-1].isOccupied = true;
                    positionsOccupied[currentRow][newColumn-1].value = 
                    positionsOccupied[currentRow][newColumn].value;
                    positionsOccupied[currentRow][newColumn].value = 0;

                    newColumn--;
                }
                
                if(newColumn > 0 && positionsOccupied[currentRow][newColumn].value === 
                    positionsOccupied[currentRow][newColumn-1].value &&
                    !positionsOccupied[currentRow][newColumn-1].alreadyMerged){
                    
                    createVectors(currentRow, currentColumn, currentRow, newColumn-1);
                    createMergeVectors(currentRow, newColumn-1);
                    
                    positionsOccupied[currentRow][newColumn].isOccupied = false;
                    let tmp = positionsOccupied[currentRow][newColumn-1].value;
                    positionsOccupied[currentRow][newColumn-1].value = (parseInt(tmp)*2).toString();
                    positionsOccupied[currentRow][newColumn].value = 0;
                    //can merge only once
                    positionsOccupied[currentRow][newColumn-1].alreadyMerged = true;
                    any_tile_moved = true;
                }
                else if(newColumn !== currentColumn) {
                    createVectors(currentRow, currentColumn, currentRow, newColumn);
                    any_tile_moved = true;
                }
            }
        }
    }

    updateField();
}

function mergeTiles(row, col){
    //tile inner value doubles on merge
    let value = positionsOccupied[row][col].value;
    let newTile = document.createElement("div");
    newTile.textContent = value;
    newTile.setAttribute("class", "tile-merged");
    newTile.classList.add("tile-" + value);
    rows[row].children[col].replaceChild(newTile, rows[row].children[col].firstChild);

    positionsOccupied[row][col].alreadyMerged = false;
}

function changeTilePosition(row, col, newRow, newCol){
    let tile = rows[row].children[col].removeChild(rows[row].children[col].firstChild);
    tile.classList.remove("tile-new");
    tile.classList.remove("tile-merged");
    tile.classList.add("tile-moved");
    
    if(!rows[newRow].children[newCol].firstChild)
        rows[newRow].children[newCol].appendChild(tile);
    else
        rows[newRow].children[newCol].replaceChild(tile, rows[newRow].children[newCol].firstChild);

    positionsOccupied[row][col].isOccupied = false;
    positionsOccupied[newRow][newCol].isOccupied = true;
}

function updateField(){
    if(any_tile_moved){
        animateTiles();
        any_tile_moved = false;
    }
    else{
        obtainFreePositions();
        if(positionsFree.length === 0){
            //check if there is a game over since no more space available
            isLost();
        }
    }
}

function storeData(){
    localStorage.setItem("positions", JSON.stringify(positionsOccupied));
}

function resumeGame(){
    if(localStorage.length === 0)
        return;
    else{
        let positions = localStorage.getItem("positions");
        positionsOccupied = JSON.parse(positions);

        for(let row=0, i=0; row<4; row++){
            for(let col=0; col<4; col++, i++){
                positionsAll.set(i, [row, col]);
                
                if(positionsOccupied[row][col].isOccupied)
                    setNewTile(row, col, positionsOccupied[row][col].value);
            }
        }
    }
}
