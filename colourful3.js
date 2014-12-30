//width/height of the canvas
var width = 500;
var height = 600;

var wallLeft = 0;
var wallRight = width;
var xCenter = width/2;

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
var speed = -10;
var xSpeed = 0;
var maxXspeed = 2;
var xSpeedChange = 0.3;

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

var Flash = function (position, scale, absolute) {
	this.x = absolute ? position : positionToX(position);
	this.maxWidth = noteSize*scale;
	this.currentWidth = this.maxWidth;
	this.colorPart = 'rgba('+red+', '+Math.floor(green)+', '+Math.floor(blue)+', ';
	this.color = this.colorPart + '255)';
	this.frame = 0;
};

Flash.prototype.resetFrame = function() {
	if (this.frame >= 7) {
		this.frame = 7;
	}
};
	
Flash.prototype.move = function() {
	if (this.frame < 12) {
		var fraction = 1 - (this.frame/12);
		var a = 2*fraction;
		if (a > 1) a = 1;
		a /= 2;
		this.color = this.colorPart + a + ')';
		this.currentWidth = this.maxWidth*(this.frame/8);
		this.frame++;
		return true;
	} else {
		return false;
	}
};

Flash.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.rect(this.x - (this.currentWidth/2),0,this.currentWidth,height);
	ctx.closePath();
	ctx.fill();
};

var Note = function(position, dy, scale, absolute) {
	this.x = absolute ? position : positionToX(position);
	this.y = baseHeight;// + dy;
	this.radius = noteSize*scale;
	this.color = 'rgba('+red+', '+Math.floor(green)+', '+Math.floor(blue)+', 255)';
	this.vx = xSpeed;
	//this.vx = (Math.random()-0.5)*10;
	this.accel = 0.000*scale*scale;
};

Note.prototype.checkCollide = function() {
	if (this.x > wallRight) {
		this.x = 2*wallRight - this.x;
		if (this.vx > 0) {
			this.vx = -this.vx;
		}
	} else if (this.x < wallLeft) {
		this.x = 2*wallLeft - this.x;
		if (this.vx < 0) {
			this.vx = -this.vx;
		}
	}
};
	
Note.prototype.move = function() {
	this.y += speed * (this.y+400)/550 * speedMultiplier;
	this.x += this.vx;
	//vx += speed*(x-xCenter)*accel;
	this.checkCollide();
	if (this.y < topHeight) {
		return false;
	}
	return true;
};
	
Note.prototype.draw = function() {
	ctx.fillStyle = this.color;
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI, true);
	//console.log(x + ' ' + y);
	ctx.closePath();
	ctx.fill();
};

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
	if (!keyPressed[index]) {
		keyPressed[index] = true;
		keyClicked[index] = true;
	}
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

function clear(){
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

function xSpeedUpdate() {
	var frac = Math.abs(xSpeed/maxXspeed);
	frac = frac*frac;
	frac = 1-frac;
	if (frac < 0 ) frac = 0;
	frac = Math.sqrt(frac);
	frac *= 0.7;
	frac += 0.3;
	
	xSpeed += xSpeedChange*frac;
	if (xSpeedChange > 0) {
		if (xSpeed >= maxXspeed) {
			xSpeedChange = -xSpeedChange;
		}
	} else { // xSpeedChange <= 0;
		if (xSpeed <= -maxXspeed) {
			xSpeedChange = -xSpeedChange;
		}
	}
}

var frameCount = 3;
function updateFrame(){
	adjustSpeedMultiplier();

	keyboardUpdate();
	if (frameCount <= 0) {
		colourUpdate();
		xSpeedUpdate();
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

function drawFrame(){
	for (i = 0; i < notes.length; i++) {
		notes[i].draw();
	}
};

function gameLoop(){
  clear();
  updateFrame();
  drawFrame();
  setTimeout(gameLoop, 1000 / 50);
}

gameLoop();