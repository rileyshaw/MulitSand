var canvas = document.getElementById('playArea');
var context = canvas.getContext('2d');
var blockSize = 5;
var moving = new Array();//what blocks are moving
var backgroundCompare = '#ffffffff';//white
var background = 'white';

context.beginPath()
context.rect(0, 0, canvas.width, canvas.height);
context.fillStyle = 'white';
context.fill();

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b, a) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
}

//block:
//	x: x position (int)
//	y: y position (int)
//	color: color of block
// class Block{
// 	constructor(x, y, color){
// 		this.x = x;
// 		this.y = y;
// 		this.color = color;
// 	}
// }

function consblock(x, y, color) {
	return {
		x: x,
		y: y,
		color: color
	};
}


//fills canvas with block at it's location with it's color
function setBlock(block){
	if(block.x >= 0 && block.x<canvas.width/blockSize && block.y>=0 && block.y<canvas.height/blockSize){
		context.beginPath()
		context.rect(block.x * blockSize, block.y * blockSize, blockSize, blockSize);
		context.fillStyle = block.color;
		context.fill();
	}else{
		console.log("tried to color:", block.x, block.y, block.color);
	}
}

//Does a block exist at the location (x,y)?
//return 0 if no, 1 if yes
//if color is background, then no block
function doesExist(x,y){
	if(x < 0 || x>=canvas.width/blockSize || y<0 || y>=canvas.height/blockSize){
		return 1;
	}
	var imgData=context.getImageData(x*blockSize, y*blockSize, 1, 1);
	//console.log(rgbToHex(imgData.data[0], imgData.data[1], imgData.data[2], imgData.data[3]), background);
	if(backgroundCompare == rgbToHex(imgData.data[0], imgData.data[1], imgData.data[2], imgData.data[3])){
		return 0;
	}else{
		return 1;
	}
}

//Creates block object, sets the canvas color, adds to array
//Call when info received from server
function createBlock(x, y, color){
	var block = consblock(x,y,color);
	setBlock(block);
	moving.push(block);
}

//removes a block at pos from moving array
function doneMoving(pos){
	moving.splice(pos, 1);
}

//move the block to a new position
function move(dx, dy, block){
	var c = block.color;
	
	//erase current location
	block.color = background;
	setBlock(block);
	
	block.x=block.x+dx;
	block.y=block.y+dy;
	block.color = c;
	setBlock(block);
}
//do be run on every tick
//loops through moving array, moves blocks, does physics, er-thang
function update(){
	drop();
	for (i = 0; i < moving.length && i >= 0; i++) {
		var block = moving[i];
		if(doesExist(block.x, block.y+1)){
			//logic
			//right below is filled
			if(doesExist(block.x-1, block.y+1) && doesExist(block.x+1, block.y+1)){
				//3 below are filled
				//stop
				doneMoving(i);
				i--;
			}else if(!doesExist(block.x-1, block.y+1) && doesExist(block.x+1, block.y+1)){
				//slide left
				move(-1, 1, block);
			}else if(doesExist(block.x-1, block.y+1) && !doesExist(block.x+1, block.y+1)){
				//slide right
				move(1, 1, block);
			}else{
				//slide random
				var direction = Math.floor(Math.random() + .5);
				if(direction){
					move(-1, 1, block);
				}else{
					move(1, 1, block);
				}
			}
		}else{
			//fall down
			move(0, 1, block);
			
		}
	}
}

var isMouseDown = false;
var drawColor = 'red';
var mpos;
$("#playArea").mousedown(function(event){
    event.preventDefault();
});
canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mouseup', mouseUp);
canvas.addEventListener('mouseout', mouseUp);
function mouseDown(evt) {
	mpos = evt;
	isMouseDown = true;
}
function mouseUp(evt) {
	mpos = evt;
	isMouseDown = false;
}
canvas.onselectstart = function () { return false; }

canvas.addEventListener('mousemove', function(evt) {
	mpos = evt;
}, false);

function drop() {
	if (isMouseDown) {
		var rect = canvas.getBoundingClientRect();
		var x = ~~((mpos.pageX - rect.left)/blockSize);
		var y =  ~~((mpos.pageY - rect.top)/blockSize);
		if (!doesExist(x, y)) {
			createBlock(x, y, drawColor);
			//	TODO Notify	
		}
	}
}

setInterval(update, 20);
