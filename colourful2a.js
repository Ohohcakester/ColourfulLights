//width/height of the canvas
var width = 500;
var height = 600;
var gLoop;

// Initialisation
var mainCanvas = document.getElementById('mainCanvas');
var ctx = mainCanvas.getContext('2d');

var win = document.getElementById('window');
window.addEventListener("keydown", keyboardPress, false);
window.addEventListener("keyup", keyboardRelease, false);
mainCanvas.addEventListener("touchstart", touchPress, false);

mainCanvas.width = width;
mainCanvas.height = height;

var baseHeight = 590;
var topHeight = -20;
var speed = -12;

var noteSize = 9;

var realRed = 255;
var realGreen = 255;
var red = 255;
var green = 255;
var blue = 0;

var keyPressed = [false,false,false,false,false,false,false,false];
var keyFlash = new Array(8);
var keyClicked = [false,false,false,false,false,false,false,false];

var notes = [];

var speedMultiplier = 1;

function positionToX(position) {
	return position * 50 + 75;
}

function Flash(position, scale, absolute) {
	var x = absolute ? position : positionToX(position);
	var width = noteSize*scale;
	var currentWidth = width;
	var colorPart = 'rgba('+red+', '+Math.floor(green)+', '+Math.floor(blue)+', ';
	var color = colorPart + '255)';
	var frame = 0;
	
	this.resetFrame = function() {
		if (frame >= 7) {
			frame = 7;
		}
	}
	
	this.move = function() {
		if (frame < 12) {
			var fraction = 1 - (frame/12);
			var a = 2*fraction;
			if (a > 1) a = 1;
			a /= 2;
			color = colorPart + a + ')';
			currentWidth = width*(frame/8);
			frame++;
			return true;
		} else {
			return false;
		}
	}
	
	this.draw = function() {
		console.log(color);
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.rect(x - (currentWidth/2),0,currentWidth,height);
		ctx.closePath();
		ctx.fill();
	}

}

function Note(position, dy, scale, absolute) {
	var x = absolute ? position : positionToX(position);
	var y = baseHeight;// + dy;
	var radius = noteSize*scale;
	var color = 'rgba('+red+', '+Math.floor(green)+', '+Math.floor(blue)+', 255)';
	var vx = 0;
	var accel = -0.000001*scale*scale;
	
	this.move = function() {
		y += speed * (y+400)/550 * speedMultiplier;
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

function touchPress(e) {
	e.preventDefault();
	var touches = e.changedTouches;
        
	for (var i=0; i < touches.length; i++) {
		spawnCircleAbsoluteX(touches[i].pageX-(width/2), 1, 2.5);
		//ongoingTouches.push(copyTouch(touches[i]));
		//touches[i].pageY
	}
}

function keyboardRelease(e) {
	keyPressed[getKeyIndex(e)] = false;
}

function keyboardPress(e) {
	var index = getKeyIndex(e);
	keyPressed[index] = true;
	keyClicked[index] = true;
	//triggerBox(getKeyIndex(e), 1);
}

function getKeyIndex(e) {
	//console.log(e.keyCode);
	switch(e.keyCode) {
	case 65: // A
		return 0;
	case 83: // S
		return 1;
	case 68: // D
		return 2;
	case 70: // F
		return 3;
		
	case 74: // J
		return 4;
	case 75: // K
		return 5;
	case 76: // L
		return 6;
	case 186: // ;
		return 7;
	}

}

var clear = function(){
  ctx.fillStyle = '#040818';
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.closePath();
  ctx.fill();
};

function triggerBox(x,y) {
	spawnCircle(x, y, 0.5*(y+4));
}

function spawnCircleAbsoluteX(x, dy, scale) {
	var flash = new Flash(x, scale, true);
	notes.push(new Note(x, dy, scale, true));
	notes.push(flash);
	return flash;
}
function spawnCircle(x, dy, scale) {
	var flash = new Flash(x, scale);
	notes.push(new Note(x, dy, scale));
	notes.push(flash);
	return flash;
}

function keyboardUpdate() {
	for (i=0;i<keyClicked.length;i++) {
		if (keyClicked[i]) {
			var flash = spawnCircle(i, 1, 2.5);
			keyFlash[i] = flash;
		}
		
		if (keyPressed[i]) {
			if (keyFlash[i] != null) {
				keyFlash[i].resetFrame();
			}
		} else {
			keyFlash[i] = null;
		}
		
		
		
		keyClicked[i] = false;
	}
}

function colourUpdate() {
	realRed += 12;
	realGreen += 9.7;
	if (realRed > 510) {
		realRed -= 510;
	}
	if (realGreen > 510) {
		realGreen -= 510;
	}
	
	red = Math.abs(realRed - 255);
	green = Math.abs(realGreen - 255);
	
	blue = 255 - (red+green)/2;
}

var frameCount = 3;
var UpdateFrame = function(){
	adjustSpeedMultiplier();

	keyboardUpdate();
	if (frameCount <= 0) {
		colourUpdate();
		frameCount = 3;
	}
	frameCount--;



	var current = 0;
	while (current < notes.length) {
		if (notes[current].move()) {
			current++;
		} else {
			notes.splice(current,1);
		}
	}
};

function adjustSpeedMultiplier() {
	speedMultiplier = Math.sqrt(notes.length/15);
	if (speedMultiplier < 1) {
		speedMultiplier = Math.sqrt(speedMultiplier);
	}
}

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