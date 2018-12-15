// CANVAS
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let grid0 = [];
let busy = false;
canvas.width = 1200;
canvas.height = 600;
document.body.insertBefore(canvas, document.body.childNodes[0]);
// INITIAL COLOR VALUES
let redComp = 0;
let greenComp = 255;
let blueComp = 255;
// GRID CONSTANTS
const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;
const GRID_COLS = 20;
const GRID_ROWS = 20;
let GRID_GAP = 0;

// DRAW INSTRUCTIONS FOR GRID SQUARES
function drawRectangle(x,y,width,height,color,layer){
  ctx.fillStyle = color;
  // ctx.save();
  ctx.transform(1, -.5, 1, .5, 0, layer);
  ctx.fillRect(x,y,width,height);
  ctx.resetTransform();
}

// MAP CLASS
class CanvasMap {
  constructor(obstacleColor, safeColor, gridNo, layer) {
    this.obstacleColor = obstacleColor;
    this.safeColor = safeColor;
    this.gridNo = gridNo;
    this.layer = layer;
    // BUILD THE MAP ARRAY (replaces grid0 constant)
    this.load = function() {
      for (let i=0; i<GRID_COLS; i++) {
        this.gridNo[i] = (this.gridNo[i] || []);
        for (let j=0; j<GRID_ROWS; j++) {
          if(this.gridNo[i][j]=='obstacle'){}
          else{this.gridNo[i][j] = 'safe'}
        }
      }
    }
    // DRAW MAP TO SCREEN
    this.update = function() {
      for(let i=0; i < GRID_COLS; i++){
        for(let j=0; j < GRID_ROWS; j++) {
          if(this.gridNo[i][j] =='obstacle'){
            drawRectangle([i]*GRID_WIDTH, [j]*GRID_HEIGHT, GRID_WIDTH-GRID_GAP, GRID_HEIGHT-GRID_GAP, this.obstacleColor, this.layer);
          } 
          else /*(grid[i][j] == 'Safe')*/{
            drawRectangle([i]*GRID_WIDTH, [j]*GRID_HEIGHT, GRID_WIDTH-GRID_GAP, GRID_HEIGHT-GRID_GAP, this.safeColor, this.layer);
          }          
        }      
      }
    }
    // CLEAR MAP (unused)
    this.clear = function() {
      // change this to a .forEach
      for (let i=0; i<GRID_COLS; i++) {
        this.gridNo[i] = (this.gridNo[i] || []);
        for (let j=0; j<GRID_ROWS; j++) {
          this.gridNo[i][j] = 'safe'
        }
      }
    }
  }
}

// CREATE A STACK OF PLANES
function finn(){
  for(i=0;i<240;i+=10){
    let chin = new CanvasMap('gray',`rgba(${redComp-i},${greenComp-i},${blueComp-i/2},.2)`,grid0,400-i);
    GRID_GAP += 0.005;
    chin.load();
    chin.update();
  }
}

window.onload = function(){  
  // requestID = requestAnimationFrame(drawAll); 
  finn();
}

function drawAll(){
  requestID = requestAnimationFrame(drawAll);
  busy=true;
  finn();
  redComp += 10;
  greenComp -= 10;
  blueComp -=5;
  // console.log(redComp);
  if(redComp > 255){
    GRID_GAP = 0;
    cancelAnimationFrame(requestID);
    drawOther();
  }  
}

function drawOther(){
  requestID = requestAnimationFrame(drawOther)
  finn();
  redComp -=10;
  greenComp +=10;
  blueComp +=5
  console.log(redComp);
  if(redComp < 10){
    GRID_GAP = 0;
    cancelAnimationFrame(requestID);
    drawAll();
  }
}

document.addEventListener('click', function(e){
  if(e.target.id=='pauseButton'){
    if(busy){
      cancelAnimationFrame(requestID);
      busy=false;
      return;
    }
    if(!busy){
      drawAll();
    }
  }
  if(e.target.id=='startButton'){
    drawAll();
  }
  if(e.target.id=='stopButton'){
    console.log('stop pressed and ignored');
    cancelAnimationFrame(requestID);
  }
})
