
import Sprite from "../../objects/sprite.js";
import InputController from "../../controllers/inputController.js";
import MapController from "../../controllers/mapController.js";
import { displaySize, displayOffset } from "../../config.js"

const mapBoundryUrl = "largeMap";
let fileName = "";

let cellSize = 8;
let squareOffsetX = 0;
let squareOffsetY = 0;
let showGroupings = true;



if(!fileName || fileName.length === 0){
    fileName = mapBoundryUrl;
}

const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');
let squares = {};
let optimizedSquares = {};

const map = new Sprite({
    position: {x:0, y: 0},
    image: "/src/img/maps/largeMap.png"
})

try{

    import(`../../boundryLayers/${mapBoundryUrl}.js`).then(module => {
        optimizedSquares = module.mapBoundry;
        squares = module.mapBoundry
    });
}catch(error){
    console.log("no map to load")
}

function saveBoundryLayer(){
    fetch('http://localhost:3000/saveMapBoundry', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ optimizedSquares, fileName })
    })
    .then(response => response.text())
    .then(message => console.log(message))
    .catch(error => console.error('Error saving file:', error));
}





const inputController = new InputController();
inputController.changeRemote(input)
const mapController = new MapController({map, inputController})


function drawMap(){
    if(!map.imageLoaded){
        setTimeout(()=>drawMap(), 10)
        return;
    }
    drawSquares();
}
drawMap()


function coordKey(x,y){
    return x + "," + y;
}


function handleClick(input){
    if(input.localCoords){

        let x = input.localCoords.x - (cellSize/2) - map.localPosition.x;
        let y = input.localCoords.y - (cellSize/2) - map.localPosition.y;

        x =  squareOffsetX + Math.round(x/cellSize) * cellSize;
        y =  squareOffsetY + Math.round(y/cellSize) * cellSize;

        if(squares[coordKey(x, y)]){
            delete squares[coordKey(x, y)];
        }
        else{
            squares[coordKey(x, y)] = {
                x,
                y,
                left: x,
                top: y,
                right: x + cellSize,
                bottom: y + cellSize
            }
        }
        
        mergeAdjacentCells(squares);
        drawSquares();
    }
};

function drawSquares(){
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    map.draw();


    for (let key in optimizedSquares){
        if (optimizedSquares.hasOwnProperty(key)) {
            var value = optimizedSquares[key];
            const width = value.right-value.x;
            const height = value.bottom-value.y;

            if(showGroupings){
                const red = 100+ Math.random()*155;
                ctx.fillStyle = `rgb(${red}, 0, 0)`; // Change the fill color here
            }
            else{
                ctx.fillStyle = "red";
            }
            ctx.fillRect(value.x+displayOffset.x + map.localPosition.x , value.y+displayOffset.y + map.localPosition.y , width, height);
        }
    }
}


function input(input){
    mapController.moveMap(input)
    handleClick(input);
    if(input.code === "KeyG"){
        saveBoundryLayer()
    }

    if(input.code === "KeyH"){
        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        map.draw();
    }

    if(input.code === "KeyP"){
        console.log(squares)
        console.log(optimizedSquares)
    }

    if(input.code === "KeyC"){
        if(showGroupings){
            showGroupings = false;
        }
        else{
            showGroupings = true;
        }
    }

    if(input.code === "NumpadAdd"){
        cellSize *= 2;
    }
    
    if(input.code === "NumpadSubtract"){
        cellSize /= 2;
    }
    if(input.code === "Numpad8"){
        squareOffsetY--;
    }
    if(input.code === "Numpad2"){
        squareOffsetY++;
    }
    if(input.code === "Numpad4"){
        squareOffsetX--;
    }
    if(input.code === "Numpad6"){
        squareOffsetX++;
    }

    
    drawSquares();
}


function mergeAdjacentCells(inputObject) {
    // Convert input object to array of cell objects
    var cellArray = Object.values(inputObject);
    let didMerge = false;

    // Sort cell array by x and y coordinates
    cellArray.sort((a, b) => {
        if (a.x === b.x) {
            return a.y - b.y;
        }
        return a.x - b.x;
    });

    // Function to check if two cells are adjacent
    function areAdjacent(cell1, cell2) {
        const result = (cell1.right === cell2.left || cell1.left === cell2.right) && cell1.top === cell2.top && cell1.bottom === cell2.bottom ||
            (cell1.bottom === cell2.top || cell1.top === cell2.bottom) && cell1.left === cell2.left && cell1.right === cell2.right;
        if(result){
            didMerge = true;
        }
        return result;
    }

    // Function to merge two adjacent cells
    function mergeCells(cell1, cell2) {
        var mergedCell = {
            x: Math.min(cell1.x, cell2.x),
            y: Math.min(cell1.y, cell2.y),
            left: Math.min(cell1.left, cell2.left),
            top: Math.min(cell1.top, cell2.top),
            right: Math.max(cell1.right, cell2.right),
            bottom: Math.max(cell1.bottom, cell2.bottom)
        };
        return mergedCell;
    }

    // Iterate through the sorted cell array to merge adjacent cells
    var mergedCells = [];
    for (var i = 0; i < cellArray.length; i++) {
        var currentCell = cellArray[i];
        var merged = false;
        for (var j = 0; j < mergedCells.length; j++) {
            var mergedCell = mergedCells[j];
            if (areAdjacent(currentCell, mergedCell)) {
                mergedCells[j] = mergeCells(currentCell, mergedCell);
                merged = true;
                break;
            }
        }
        if (!merged) {
            mergedCells.push(currentCell);
        }
    }

    // Convert merged cell array back to object format
    var outputObject = {};
    for (var k = 0; k < mergedCells.length; k++) {
        var cell = mergedCells[k];
        var key = cell.x + "," + cell.y;
        outputObject[key] = cell;
    }

    optimizedSquares = outputObject;
    if(didMerge){
        mergeAdjacentCells(optimizedSquares);
    }
}




