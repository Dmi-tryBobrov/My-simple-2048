export {createTile, moveUp, moveRight, moveDown, moveLeft, initializeField};
export {rows, changeTilePosition}
import { isLost } from "./utils.js";
import { animateTile, createVectors, animateTiles } from "./animation.js";

var positionsAll = new Map();
//positionOccupied -> key: "row,col", value:boolean
var positionsOccupied = new Map();
const rows = document.querySelectorAll(".row");
var positionsFree = [];
//10% cnance to greate new tile with value 4
const CHANCE_TO_GET_4 = 0.1;

function initializeField(){
    for(let row=0, i=0; row<4; row++){
        for(let col=0; col<4; col++, i++){
            positionsAll.set(i, [row, col]);
            //to make keys in map immutable
            positionsOccupied.set([row, col].toString(), false);//change to false
        }
    }
    // positionsOccupied.set([0, 2].toString(), true);
    // positionsOccupied.set([0, 3].toString(), true);
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
    
    let tileText;
    if(Math.random() < CHANCE_TO_GET_4)
        tileText = "4";
    else
        tileText = "2";
    setNewTile(row, col, tileText);
 }

function moveUp(){
    //nowhere to move up if row==0
    for(let currentRow=1; currentRow < 4; currentRow++){
        for(let currentColumn=0; currentColumn < 4; currentColumn++){
            if(positionsOccupied.get([currentRow, currentColumn].toString()) === true){
                                
                let newRow = currentRow;
                //must not move up if upper cell is occupied
                while(positionsOccupied.get([newRow-1, currentColumn].toString()) === false
                    && newRow > 0){
                    newRow--;
                      
                }

                if(newRow > 0 &&
                    (rows[currentRow].children[currentColumn].textContent == 
                    rows[newRow-1].children[currentColumn].textContent)){
                        removeTile(currentRow, currentColumn);
                        mergeTiles(newRow-1, currentColumn);
                    }
                else if(newRow !== currentRow) {
                    // changeTilePosition(newRow, currentColumn,
                    //     rows[currentRow].children[currentColumn].textContent);
                    // removeTile(currentRow, currentColumn);
                    createVectors(currentRow, currentColumn, newRow, currentColumn);
                    // setTimeout(changeTilePosition, 800, currentRow, currentColumn, newRow, currentColumn);
                }
            }
        }
    }
    animateTiles();
    
}

function moveDown(){
    //nowhere to move down if row==3 -> last row
    for(let currentRow=2; currentRow >= 0; currentRow--){
        for(let currentColumn=0; currentColumn < 4; currentColumn++){
            if(positionsOccupied.get([currentRow, currentColumn].toString()) === true){
                                
                let newRow = currentRow;
                //must not move down if lower cell is occupied
                while(positionsOccupied.get([newRow+1, currentColumn].toString()) === false
                    && newRow < 3){
                    newRow++;
                }

                if(newRow < 3 &&
                    (rows[currentRow].children[currentColumn].textContent == 
                    rows[newRow+1].children[currentColumn].textContent)){
                        removeTile(currentRow, currentColumn);
                        mergeTiles(newRow+1, currentColumn);
                    }
                else if(newRow !== currentRow) {
                    // changeTilePosition(newRow, currentColumn,
                    //     rows[currentRow].children[currentColumn].textContent);
                    // removeTile(currentRow, currentColumn);
                    // changeTilePosition(currentRow, currentColumn, newRow, currentColumn);
                    createVectors(currentRow, currentColumn, newRow, currentColumn);
                }
            }
        }
    }

    animateTiles();
}

function moveRight(){
    //nowhere to move right if col==3 -> last col
    for(let currentColumn=2; currentColumn >= 0; currentColumn--){
        for(let currentRow=0; currentRow < 4; currentRow++){
            if(positionsOccupied.get([currentRow, currentColumn].toString()) === true){
                                
                let newColumn = currentColumn;
                //must not move down if lower cell is occupied
                while(positionsOccupied.get([currentRow, newColumn+1].toString()) === false
                    && newColumn < 3){
                    newColumn++;
                }

                if(newColumn < 3 &&
                    (rows[currentRow].children[currentColumn].textContent == 
                    rows[currentRow].children[newColumn+1].textContent)){
                        removeTile(currentRow, currentColumn);
                        mergeTiles(currentRow, newColumn+1);
                    }
                else if(newColumn !== currentColumn) {
                    // changeTilePosition(currentRow, newColumn,
                    //     rows[currentRow].children[currentColumn].textContent);
                    // removeTile(currentRow, currentColumn);
                    // changeTilePosition(currentRow, currentColumn, currentRow, newColumn);
                    createVectors(currentRow, currentColumn, currentRow, newColumn);

                }
            }
        }
    }
    
    animateTiles();
}

function moveLeft(){
    //nowhere to move left if col==0 -> first col
    for(let currentColumn=1; currentColumn < 4; currentColumn++){
        for(let currentRow=0; currentRow < 4; currentRow++){
            if(positionsOccupied.get([currentRow, currentColumn].toString()) === true){
                                
                let newColumn = currentColumn;
                //must not move down if lower cell is occupied
                while(positionsOccupied.get([currentRow, newColumn-1].toString()) === false
                    && newColumn > 0){
                    newColumn--;
                }

                if(newColumn > 0 &&
                    (rows[currentRow].children[currentColumn].textContent == 
                    rows[currentRow].children[newColumn-1].textContent)){
                        removeTile(currentRow, currentColumn);
                        mergeTiles(currentRow, newColumn-1);
                    }
                else if(newColumn !== currentColumn) {
                    // changeTilePosition(currentRow, newColumn,
                    //     rows[currentRow].children[currentColumn].textContent);
                    // removeTile(currentRow, currentColumn);
                    // changeTilePosition(currentRow, currentColumn, currentRow, newColumn);
                    createVectors(currentRow, currentColumn, currentRow, newColumn);

                }
            }
        }
    }

    animateTiles();
}

function setNewTile(row, col, tileText="2"){
    let startTile = document.createElement("div");
    startTile.textContent = tileText;
    startTile.setAttribute("class", "tile-new");
    startTile.classList.add("tile-"+tileText);
    rows[row].children[col].appendChild(startTile);

    positionsOccupied.set([row, col].toString(), true);
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
        let tmp = positionsAll.get(i);
        if(positionsOccupied.get(tmp.toString()) === false){
            positionsFree.push(i);
        }
    }
}

function mergeTiles(row, col){
    let value = rows[row].children[col].textContent;
    let startTile = document.createElement("div");
    startTile.textContent = (parseInt(value)*2).toString();
    startTile.setAttribute("class", "tile-merged");
    startTile.classList.add("tile-"+(parseInt(value)*2).toString());
    rows[row].children[col].replaceChild(startTile, rows[row].children[col].firstChild);

    positionsOccupied.set([row, col].toString(), true);
}

async function changeTilePosition(row, col, newRow, newCol){
    // let newTile = document.createElement("div");
    // newTile.textContent = text;
    // newTile.setAttribute("class", "tile-new");
    // newTile.classList.add("tile-"+text);
    // rows[row].children[col].appendChild(newTile);

    // animateTile(row, col, newRow, newCol)
    // .then(response => {
    //     console.log(response);
    //     let tile = rows[row].children[col].removeChild(rows[row].children[col].firstChild);
    //     tile.removeAttribute("style");
    //     rows[newRow].children[newCol].appendChild(tile);
    //     positionsOccupied.set([row, col].toString(), false);
    //     positionsOccupied.set([newRow, newCol].toString(), true);
    // });
    let tile = rows[row].children[col].removeChild(rows[row].children[col].firstChild);
    rows[newRow].children[newCol].appendChild(tile);
    positionsOccupied.set([row, col].toString(), false);
    positionsOccupied.set([newRow, newCol].toString(), true);
}


// async function redrawTilePosition(changeX, changeY){
//     let timeStart = Date.now();
//     let deltaY = 0; let deltaX = 0;

//     let timer = setInterval(() => {
//         let timeElapsed = Date.now() - timeStart;

//         if(timeElapsed > 100){
//             clearInterval(timer);
//             return "fulfilled redraw";
//         }

//         deltaX += changeX;
//         deltaY += changeY;
//         tile.style.top = deltaY.toString()+"px";
//         tile.style.left = deltaX.toString()+"px";
      
//     }, timeInterval);

// }