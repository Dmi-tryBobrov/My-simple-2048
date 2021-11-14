export {createVectors, createMergeVectors, animateTiles, key_pressed};
import { rows, changeTilePosition, createTile, mergeTiles } from "./tiles.js";

const timeInterval = 100;
let timeStart, previousTimeStamp;
let vectors = [];
let mergeVectors = [];
let tilesArr = [];
let key_pressed = false;


class Vector{
    constructor(x, y, newX, newY, deltaX, deltaY){
        this.x = x;
        this.y = y;
        this.newX = newX;
        this.newY = newY;
        this.deltaX = deltaX;
        this.deltaY = deltaY;
    }
    get coordinates(){
        return [this.x, this.y, this.newX, this.newY];
    }
}

class MergeVector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

function createMergeVectors(row, col){
    mergeVectors.push(new MergeVector(row, col));
}

function createVectors(row, col, newRow, newCol){
    let rectFrom = rows[row].children[col].getBoundingClientRect();
    let rectTo = rows[newRow].children[newCol].getBoundingClientRect();
    let topChange = rectTo.top - rectFrom.top;
    let leftChange = rectTo.left - rectFrom.left;
    vectors.push(new Vector(row, col, newRow, newCol, leftChange, topChange));
}

function animateTiles(){
    for (let i=0; i < vectors.length; i++){
        tilesArr.push(rows[vectors[i].x].children[vectors[i].y].firstElementChild)
    }
    key_pressed = !key_pressed;
    requestAnimationFrame(redrawTilePositions);
}

function redrawTilePositions(timestamp){
    if(!timeStart)
        timeStart = timestamp;
    const timeElapsed = timestamp - timeStart;
    // console.log(timeElapsed);
    

    if(previousTimeStamp !== timestamp){

        for(let i=0; i < vectors.length; i++){
            let changeX = timeElapsed*vectors[i].deltaX/timeInterval;
            let changeY = timeElapsed*vectors[i].deltaY/timeInterval;
            tilesArr[i].style.transform = `translate(${changeX}px, ${changeY}px)`;
        }
    }

    if (timeElapsed < timeInterval){
        previousTimeStamp = timestamp;
        requestAnimationFrame(redrawTilePositions);
    }
    else{
        timeStart = null;
        for (let i=0; i < tilesArr.length; i++){
            // tilesArr[i].removeAttribute("style");
            tilesArr[i].style = "";
            changeTilePosition.call(vectors[i], ...vectors[i].coordinates);
        }
        for (let j=0; j < mergeVectors.length; j++){
            mergeTiles.call(mergeVectors[j], mergeVectors[j].x, mergeVectors[j].y);
        }
        createTile();
        key_pressed = !key_pressed;
        vectors = [];
        tilesArr = [];
        mergeVectors = [];
    }
}