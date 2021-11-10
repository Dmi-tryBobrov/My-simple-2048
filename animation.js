export {animateTile, createVectors, animateTiles, key_pressed};
import { rows, changeTilePosition, createTile } from "./tiles.js";

const timeInterval = 100;
let timeStart, previousTimeStamp;
let topChange, leftChange;
let tile, rectFrom, rectTo, rAF;
let vectors = [];
let tilesArr = [];
let key_pressed = false;

function animateTile(row, col, newRow, newCol){
    
    

    tile = rows[row].children[col].firstElementChild;
    rectFrom = rows[row].children[col].getBoundingClientRect();
    rectTo = rows[newRow].children[newCol].getBoundingClientRect();
    tile.style.cssText = "position:relative";
    tile.style.width = rectFrom.width.toString()+"px";
    tile.style.height = rectFrom.height.toString()+"px";
    console.log(tile.style.cssText);

    topChange = rectTo.top - rectFrom.top;
    leftChange = rectTo.left - rectFrom.left;
    
    requestAnimationFrame(redrawTilePosition);

}

function redrawTilePosition(timestamp){
    if(!timeStart)
        timeStart = timestamp;
    const timeElapsed = timestamp - timeStart;
    console.log(timeElapsed);

    if(previousTimeStamp !== timestamp){
        const changeX = timeElapsed*leftChange/timeInterval;
        const changeY = timeElapsed*topChange/timeInterval;
        tile.style.transform = 'translate(' + changeX + 'px,' + changeY + 'px)';
        // tile.style.transform = 'translateY(' + changeY + 'px)';
    }

    if (timeElapsed < timeInterval){
        previousTimeStamp = timestamp;
        requestAnimationFrame(redrawTilePosition);
    }
    else{
        tile.removeAttribute("style");
        timeStart = null;
        // cancelAnimationFrame(rAF);
    }
}

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

function createVectors(row, col, newRow, newCol){
    let rectFrom = rows[row].children[col].getBoundingClientRect();
    let rectTo = rows[newRow].children[newCol].getBoundingClientRect();
    let topChange = rectTo.top - rectFrom.top;
    let leftChange = rectTo.left - rectFrom.left;
    vectors.push(new Vector(row, col, newRow, newCol, leftChange, topChange));
}

function animateTiles(){
    if(key_pressed)
        return;
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
    console.log(timeElapsed);
    

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
            tilesArr[i].removeAttribute("style");
            changeTilePosition.call(vectors[i], ...vectors[i].coordinates);
        }
        createTile();
        key_pressed = !key_pressed;
        vectors = [];
        tilesArr = [];
    }
}