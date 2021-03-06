
var animLoop;
//requestAnimationFrame fallbacks
requestAnimationFrame = requestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.msRequestAnimationFrame
	|| function (f) { return setTimeout(f, 1000 / 60) }

cancelAnimationFrame = cancelAnimationFrame
	|| window.mozCancelAnimationFrame
	|| function (animLoop) { clearTimeout(animLoop) }

soundtrack.addEventListener('ended', function () {
	this.currentTime = 0;
	this.play();
}, false);

function updateGameLoop() {
	animLoop = requestAnimationFrame(gameLoop);
}

function gameLoop() {
	updateGameLoop();
	movePaddle();
	drawGameBox();
	setLvl();
	Balls.forEach(function(element){
		element.moveBall();
		element.drawBall();
	});
	Powerups.forEach(function(element){
		element.movePowerup();
		element.drawPowerup();
	});
	drawPaddle();
	updateCounters();
}
gameLoop();