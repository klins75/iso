// CANVAS
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
let grid0 = [];
let busy = false;
canvas.width = 960;
canvas.height = 600;

// GRID CONSTANTS
const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const GRID_COLS = 20;
const GRID_ROWS = 20;
let GRID_GAP = 1;
let gridHeight = GRID_HEIGHT*GRID_ROWS;
let gridWidth = GRID_WIDTH*GRID_COLS*2;
let gridCenterY = canvas.height/2;
let gridCenterX = (canvas.width-gridWidth)/2;

// IMAGES
let house = new Image();
house.src = 'house.png';

// CLOCK
let gameClock = performance.now();
let deltaTime;

function transform1(){
  ctx.transform(1, -.5, 1, .5, gridCenterX, gridCenterY);
}
function transform2(dx,dy){
  ctx.transform(1, 0, -1, 1, dx+20, dy);
}
function transform3(dx,dy){
  ctx.transform(1, -1, 0, 1, dx, dy);
}


// DRAW INSTRUCTIONS FOR ISOMETRIC GRID SQUARES
function drawIsometricRectangle(x,y,width,height,color){
  ctx.fillStyle = color;
  transform1();
  ctx.fillRect(x,y,width,height);
  ctx.resetTransform();//does this reset fillstyle?
}

// DRAW INSTRUCTIONS FOR ISOMETRIC GRID SQUARES Z
function drawIsometricRectangleZ(x,y,width,height,color,dx,dy){
  ctx.fillStyle = color;
  // left side
  transform1();
  transform3(dx,dy);
  ctx.fillRect(x,y,width*3,height);
  // right side
  ctx.resetTransform();
  transform1();
  transform2(dx,dy);
  ctx.fillRect(x,y+20,width,height*(-3));
  ctx.resetTransform();
}


// DRAW INSTRUCTIONS FOR REGULAR GRID SQUARES
function drawRectangle(x,y,width,height,color){
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(x,y,width,height);
  ctx.restore();
}

// CLEAR CANVAS
function clear(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
}
// CANVAS BACKGROUND COLOR
function canvasBackground(color){
  drawRectangle(0,0,canvas.width,canvas.height,color);
}

// ISOMETRIC MAP CLASS
class CanvasIsometricMap {
  constructor(obstacleColor, safeColor, gridNo) {
    this.obstacleColor = obstacleColor;
    this.safeColor = safeColor;
    this.gridNo = gridNo;
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
      // underlayer for grid lines
      drawIsometricRectangle(0,0,GRID_WIDTH*GRID_COLS,GRID_HEIGHT*GRID_ROWS,'rgb(180,180,0');
      // create grid array
      for(let i=0; i < GRID_COLS; i++){
        for(let j=0; j < GRID_ROWS; j++) {
          if(this.gridNo[i][j] =='obstacle'){
            drawIsometricRectangle([i]*GRID_WIDTH, [j]*GRID_HEIGHT, GRID_WIDTH-GRID_GAP, GRID_HEIGHT-GRID_GAP, this.obstacleColor);
          } 
          else /*(grid[i][j] == 'Safe')*/{
            drawIsometricRectangle([i]*GRID_WIDTH, [j]*GRID_HEIGHT, GRID_WIDTH-GRID_GAP, GRID_HEIGHT-GRID_GAP, this.safeColor);
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

// ISOMETRIC MAP CLASS 'Z'
class CanvasIsometricMapZ {
  constructor(obstacleColor, safeColor, gridNo,dx,dy) {
    this.obstacleColor = obstacleColor;
    this.safeColor = safeColor;
    this.gridNo = gridNo;
    this.dx = dx;
    this.dy = dy;
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
      // underlayer for grid lines
      drawIsometricRectangleZ(0,0,GRID_WIDTH*GRID_COLS,GRID_HEIGHT*GRID_ROWS,'rgb(180,180,0'),this.dx,this.dy;
      // create grid array
      for(let i=0; i < GRID_COLS; i++){
        for(let j=0; j < GRID_ROWS; j++) {
          if(this.gridNo[i][j] =='obstacle'){
            drawIsometricRectangleZ([i]*GRID_WIDTH, [j]*GRID_HEIGHT, GRID_WIDTH-GRID_GAP, GRID_HEIGHT-GRID_GAP, this.obstacleColor, this.dx, this.dy);
          } 
          else /*(grid[i][j] == 'Safe')*/{
            drawIsometricRectangleZ([i]*GRID_WIDTH, [j]*GRID_HEIGHT, GRID_WIDTH-GRID_GAP, GRID_HEIGHT-GRID_GAP, this.safeColor, this.dx, this.dy);
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

// REGULAR MAP CLASS
class CanvasMap {
  constructor(obstacleColor, safeColor, gridNo) {
    this.obstacleColor = obstacleColor;
    this.safeColor = safeColor;
    this.gridNo = gridNo;
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
      // underlayer for grid
      drawRectangle(0,0,GRID_WIDTH*GRID_COLS,GRID_HEIGHT*GRID_ROWS,'black');
      // create a grid array
      for(let i=0; i < GRID_COLS; i++){
        for(let j=0; j < GRID_ROWS; j++) {
          if(this.gridNo[i][j] =='obstacle'){
            drawRectangle([i]*GRID_WIDTH, [j]*GRID_HEIGHT, GRID_WIDTH-GRID_GAP, GRID_HEIGHT-GRID_GAP, this.obstacleColor);
          } 
          else /*(grid[i][j] == 'Safe')*/{
            drawRectangle([i]*GRID_WIDTH, [j]*GRID_HEIGHT, GRID_WIDTH-GRID_GAP, GRID_HEIGHT-GRID_GAP, this.safeColor);
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
  get top() {return GRID_HEIGHT*GRID_ROWS/2}
}

// CREATE ISOMETRIC MAP WITH UNDERLAYER
let isometricGrid = new CanvasIsometricMap('gray','green', grid0);
let isometricGridZ = new CanvasIsometricMapZ('gray', 'blue', grid0, 200, 0);

// CREATE REGULAR MAP
let grid = new CanvasMap('gray','rgba(255,255,0,.2)',grid0);

// MOVING BLOCK CLASS
class Block {
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.vel = .1; // this should change when motion is applied
    this.update = function(){
      drawIsometricRectangle(this.x,this.y,GRID_WIDTH,GRID_HEIGHT,'blue');
      this.x < 0 ? this.x = 0 : {};
      this.x > gridWidth/2-GRID_WIDTH ? this.x = gridWidth/2-GRID_WIDTH : {};
      this.y < 0 ? this.y = 0 : {};
      this.y > gridHeight-GRID_HEIGHT ? this.y = gridHeight-GRID_HEIGHT : {};
      if(canvas.keys && canvas.keys[39]){
        this.x += 1*(deltaTime*this.vel);
      }
      if(canvas.keys && canvas.keys[37]){
        this.x -= 1*(deltaTime*this.vel);
      }
      if(canvas.keys && canvas.keys[38]){
        this.y -= 1*(deltaTime*this.vel);
      }
      if(canvas.keys && canvas.keys[40]){
        this.y += 1*(deltaTime*this.vel);
      }
    }
  }
}

// MOVING BLOCK CLASS Z
class BlockZ {
  constructor(x,y,dx,dy){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.vel = .1; // this should change when motion is applied
    this.update = function(){
      drawIsometricRectangleZ(this.x,this.y,GRID_WIDTH,GRID_HEIGHT,'rgba(255,255,0,.8)',this.dx, this.dy);
      this.dx < 0 ? this.dx = 0 : {};
      this.dx > gridWidth/2-GRID_WIDTH ? this.dx = gridWidth/2-GRID_WIDTH : {};
      this.dy < 0 ? this.dy = 0 : {};
      this.dy > gridHeight-GRID_HEIGHT ? this.dy = gridHeight-GRID_HEIGHT : {};
      if(canvas.keys && canvas.keys[39]){
        // this.x += 1*(deltaTime*this.vel);
        this.dx += 1*(deltaTime*this.vel);
      }
      if(canvas.keys && canvas.keys[37]){
        this.dx -= 1*(deltaTime*this.vel);
      }
      if(canvas.keys && canvas.keys[38]){
        this.dy -= 1*(deltaTime*this.vel);
      }
      if(canvas.keys && canvas.keys[40]){
        this.dy += 1*(deltaTime*this.vel);
      }
    }
  }
}

// CREATE MOVING BLOCK (floor part)
let blockie = new Block(0,0);
// CREATE MOVING BLOCK (upward left)
let blockie2 = new BlockZ(0,0,0,0);
let blockie3 = new BlockZ(0,0,0,0);

// EVENT LISTENER FOR MOUSE COORDINATES
canvas.addEventListener('mousemove', function(e){
  
})

// EVENT LISTENERS FOR KEYDOWN/UP
document.addEventListener('keydown', function(e) {
  canvas.keys = (canvas.keys || []);
  canvas.keys[e.which] = true;
  // console.log(e.which);
})
document.addEventListener('keyup', function(e) {
  canvas.keys = (canvas.keys || []);
  canvas.keys[e.which] = false;
})

// INITIALIZE ON WINDOW LOAD
window.onload = function(){ 
  // CREATE CANVAS
  document.body.insertBefore(canvas, document.body.childNodes[0]); 
  // CREATE GRIDS
  // isometricGrid.load(); 
  // isometricGridZ.load(); 
  grid.load();
  // INITIATE DRAWING LOOP
  drawAll();
}

// DRAWING LOOP
function drawAll(){
  requestID = requestAnimationFrame(drawAll);
  // MEASURE PERFORMANCE/TIME
  gameClockPrevious = gameClock;
  gameClock = performance.now();
  deltaTime = gameClock - gameClockPrevious;

  busy = true;
  // CLEAR PREVIOUS DRAW
  clear();
  // DRAW CANVAS BACKGROUND
  canvasBackground('black');
  // UPDATE GRIDS
  // grid.update(); //comparison grid shows isometric grid untransformed.
  isometricGrid.update();
  // isometricGridZ.update();
  // blockie.update();
  // blockie2.update();
  blockie3.update();
  
}

