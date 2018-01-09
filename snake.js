//"Snake" like game by Nathen St. Germain
//First javascript project
//
//August 22, 2017

var canvas;
var context;
var width;
var height;
var key = 38;

var snake = [];
var blockSize = 10;
var gameSpeed = 90;
var direction = "up", oldDirection = "";
var currFoodX, currFoodY;
var gameRunning;
var returnInterval;

//Main game loop
function gameLoop() {
	if (gameRunning === 1) {//Game running
	    updateDirection();

	    //Update the position of the snake based on the direction
	    updateSnakeBlocks();
	    if (direction === "up") { snake[0].y -= 10; }
	    else if (direction === "down") { snake[0].y += 10; }
	    else if (direction === "left") { snake[0].x -= 10; }
	    else if (direction === "right") { snake[0].x += 10; }


	    if (checkGameOver()) {
	    	gameRunning = 0;
			return;
		}

		if (checkCollisionFood()) {
			addSnakeBlock(currFoodX, currFoodY);
			drawFood();
		}

		refresh();
	    drawSnake();
	}
	else {//Game not running
		clearInterval(returnInterval);
		window.alert("Game over, press start to play again");
	}
}

//Update the positionn of the trailing blocks of the snake
function updateSnakeBlocks () {
	for (i = snake.length - 1; i >= 1; i--) {
		snake[i].x = snake[i - 1].x;
		snake[i].y = snake[i - 1].y;
	}
}

//Check for collision of snake with walls or itself
function checkGameOver () {
	if (snake[0].x < 0 || snake[0].x > 490 || snake[0].y < 0 || snake[0].y > 490 || checkSnakeTrailing(snake[0].x, snake[0].y))
		return true;
	else
		return false;
}

//Check for a collision of the snake with food
function checkCollisionFood () {
	if (snake[0].x === currFoodX && snake[0].y === currFoodY)
		return true;
	else
		return false;
}

//Update the direction based on key pressed
function updateDirection () {
	oldDirection = direction;
	if (key.keyCode === 38 && (snake.length == 1 || oldDirection != "down")) direction = "up";
	else if (key.keyCode === 40 && (snake.length == 1 || oldDirection != "up")) direction = "down";
	else if (key.keyCode === 37 && (snake.length == 1 || oldDirection != "right")) direction = "left";
	else if (key.keyCode === 39 && (snake.length == 1 || oldDirection != "left")) direction = "right";
}

//Refresh the canvas to remove any old food and snakes
function refresh () {
	//Clear old
	context.clearRect(0, 0, width, height);
	//Add new background colour
	context.fillStyle = "LightCyan";
	context.fillRect(0, 0, width, height);
	//Add redraw the food
	context.fillStyle = "Green";
	context.fillRect(currFoodX, currFoodY, blockSize - 1, blockSize - 1);
}

//Add a new block (x and y pos.) to the snake
function addSnakeBlock (newX, newY) {
	snake.push({x: newX, y: newY});
}

//Draw the current snake
function drawSnake () {
	var i = 0;
	for (let block of snake) {
		if (i == 0) {
			context.fillStyle = "Red";
			context.fillRect(block.x, block.y, blockSize - 1, blockSize - 1);
		}
		else {
			context.fillStyle = "LightCoral";
			context.fillRect(block.x, block.y, blockSize - 1, blockSize - 1);
		}
		i++;
	}
}

//Draw a piece of food in a random position
function drawFood () {
	var newX, newY;

	newX = getRandInt();
	newY = getRandInt();

	while (checkSnake(newX, newY)) {
		newX = getRandInt();
		newY = getRandInt();
	}

	context.fillStyle = "Green";
	context.fillRect(newX, newY, blockSize - 1, blockSize - 1);
	currFoodX = newX;
	currFoodY = newY;
}

//Check if snake is found at a position
function checkSnake (x, y) {
	for (let block of snake) {
		if (x == block.x && y == block.y)
			return true;
	}
	return false;
}

//Check if snake (other than the head) is found at a position
function checkSnakeTrailing (x, y) {
	var i = 0;
	for (let block of snake) {
		if (i != 0 && x == block.x && y == block.y)
			return true;
		i++
	}
	return false;
}

//Change canvas properties
function initCanvas () {
	canvas = document.getElementById("gameCanvas");
    context = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;

	context.fillStyle = "LightCyan";
	context.fillRect(0, 0, width, height);
}

//Get a random integer
function getRandInt () {
	return Math.floor(Math.random() * (49 - 0 + 1)) * 10;
}

//Window loading
window.onload = function() {
    initCanvas();
}

//Game start button clicked
document.getElementById("gameStartButton").onclick = function()
{
	gameRunning = 1;
	clearInterval(returnInterval);
	returnInterval = setInterval(gameLoop, gameSpeed);
	initCanvas();
	drawFood();
	snake = [];
	addSnakeBlock(240, 240);
}

//Key presses
document.onkeydown = function (e) {
    key = e;
};