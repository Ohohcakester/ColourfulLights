//width/height of the canvas
var width = 400;
var height = 500;
var gLoop;

// Initialisation
var mainCanvas = document.getElementById('mainCanvas');
var ctx = mainCanvas.getContext('2d');

var win = document.getElementById('window');
window.addEventListener("keydown", keyboardInput, false);

mainCanvas.width = width;
mainCanvas.height = height;

var baseHeight = 490;
var topHeight = -20;
var speed = -8;

var noteSize = 9;

var red = 255;
var green = 255;
var blue = 0;


var notes = [];


function positionToX(position) {
	return position * 40 + 20;
}


function Note(position, dy, scale) {
	var x = positionToX(position);
	var y = baseHeight;// + dy;
	var radius = noteSize*scale;
	var color = 'rgba('+red+', '+Math.floor(green)+', '+Math.floor(blue)+', 255)';
	var vx = 0;
	var accel = 0.000004*scale*scale;
	
	this.move = function() {
		y += speed * (y+200)/350;
		x += vx;
		vx += speed*(x-200)*accel;
		if (y < topHeight) {
			return false;
		}
		return true;
	}
	
	this.draw = function() {
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2*Math.PI, true);
		//console.log(x + ' ' + y);
		ctx.closePath();
		ctx.fill();
	}
}


function keyboardInput(e) {
	//console.log(e.keyCode);
	switch(e.keyCode) {
	case 81: // Q
		triggerBox(0,0);break;
	case 87: // W
		triggerBox(1,0);break;
	case 69: // E
		triggerBox(2,0);break;
	case 82: // R
		triggerBox(3,0);break;
	case 84: // T
		triggerBox(4,0);break;
	case 89: // Y
		triggerBox(5,0);break;
	case 85: // U
		triggerBox(6,0);break;
	case 73: // I
		triggerBox(7,0);break;
	case 79: // O
		triggerBox(8,0);break;
	case 80: // P
		triggerBox(9,0);break;
		
	case 65: // A
		triggerBox(0,1);break;
	case 83: // S
		triggerBox(1,1);break;
	case 68: // D
		triggerBox(2,1);break;
	case 70: // F
		triggerBox(3,1);break;
	case 71: // G
		triggerBox(4,1);break;
	case 72: // H
		triggerBox(5,1);break;
	case 74: // J
		triggerBox(6,1);break;
	case 75: // K
		triggerBox(7,1);break;
	case 76: // L
		triggerBox(8,1);break;
	case 186: // ;
		triggerBox(9,1);break;
		
	case 90: // Z
		triggerBox(0,2);break;
	case 88: // X
		triggerBox(1,2);break;
	case 67: // C
		triggerBox(2,2);break;
	case 86: // V
		triggerBox(3,2);break;
	case 66: // B
		triggerBox(4,2);break;
	case 78: // N
		triggerBox(5,2);break;
	case 77: // M
		triggerBox(6,2);break;
	case 188: // ,
		triggerBox(7,2);break;
	case 190: // .
		triggerBox(8,2);break;
	case 191: // /
		triggerBox(9,2);break;
	}
}

var clear = function(){
  ctx.fillStyle = '#102030';
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.closePath();
  ctx.fill();
};

function triggerBox(x,y) {
	spawnCircle(x, y, 0.5*(y+4));
}

function spawnCircle(x, dy, scale) {
	notes.push(new Note(x, dy, scale));
}


var UpdateFrame = function(){
	red += 4;
	green += 3.3;
	blue = 255 - (red+green)/2;
	if (red > 255) {
		red -= 255;
	}
	if (green > 255) {
		green -= 255;
	}


	var current = 0;
	while (current < notes.length) {
		if (notes[current].move()) {
			current++;
		} else {
			notes.splice(current,1);
		}
	}
};

var DrawFrame = function(){
	for (i = 0; i < notes.length; i++) {
		notes[i].draw();
	}
};

var GameLoop = function(){
  clear();
  UpdateFrame();
  DrawFrame();
  gLoop = setTimeout(GameLoop, 1000 / 50);
}

GameLoop();