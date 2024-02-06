
import Sprite from "../../objects/sprite.js";
import InputController from "../../controllers/inputController.js";
import { displaySize } from "../../config.js"


const gridSize = 100;
const cellSize = 8;

const squareOffsetX = 0;
const squareOffsetY = 0;
const gridOffsetX = 0;
const gridOffsetY = 0;

const mainCanvas = document.getElementById('mainCanvas');
const ctx = mainCanvas.getContext('2d');

const squares = {};
let optimizedSquares = {};

const map = new Sprite({
    position: {x:0, y: 0},
    image: "/src/img/largeMap.png"
})

const controller = new InputController({remote: input});

function drawGrid(){
    
        map.draw()
      // Define cell size and grid dimensions
    
      // Calculate origin position
      var originX = Math.floor(mainCanvas.width / 2);
      var originY = Math.floor(mainCanvas.height / 2);
    
    
      // Draw grid lines
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;

      for (var i = -gridSize / 2; i <= gridSize / 2; i++) {
          var x = originX + i * cellSize;
          ctx.moveTo(x+gridOffsetX, 0);
          ctx.lineTo(x+gridOffsetX, mainCanvas.height);
      }
      for (var j = -gridSize / 2; j <= gridSize / 2; j++) {
          var y = originY + j * cellSize;
          ctx.moveTo(0, y+gridOffsetY);
          ctx.lineTo(mainCanvas.width, y+gridOffsetY);
      }
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.closePath();
    
      // Draw origin point
      ctx.fillStyle = 'red';
      ctx.fillRect(originX - 1, originY - 1, 1, 1);

      
      ctx.globalAlpha = 1;
        
    
}
drawGrid();


function coordKey(x,y){
    return x + "," + y;
}


function handleClick(input){
    if(input.canvasCoords){

        let x = input.canvasCoords.x - (cellSize/2);
        let y = input.canvasCoords.y - (cellSize/2);

        x =  squareOffsetX + Math.round(x/8) * 8;
        y =  squareOffsetY + Math.round(y/8) * 8;

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

    for (let key in squares){
        if (squares.hasOwnProperty(key)) {
            var value = squares[key];
            ctx.fillStyle = 'blue'; // Change the fill color here
            ctx.fillRect(value.x , value.y , cellSize, cellSize);
        }
    }

    for (let key in optimizedSquares){
        if (optimizedSquares.hasOwnProperty(key)) {
            var value = optimizedSquares[key];
            const width = value.right-value.x;
            const height = value.bottom-value.y;

            const red = Math.random()*255;
            const green = Math.random()*255;
            const blue = Math.random()*255;

            ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`; // Change the fill color here
            ctx.fillRect(value.x , value.y , width, height);
        }
    }
}


function input(input){
    handleClick(input);
    if(input.code === "KeyG"){
        drawGrid();
    }
    if(input.code === "KeyH"){
        ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        map.draw();
    }
    if(input.code === "KeyP"){
        console.log(squares)
        console.log(optimizedSquares)
    }
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




