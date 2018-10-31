var c = canvas.getContext('2d');
		c.canvas.height = window.innerHeight;
		c.canvas.width = c.canvas.height / 1.6;
		var W = c.canvas.width;
        var H = c.canvas.height;
        
		var top_line = H / 19;
		var bot_line = H / 5.5;

		var lineW = 5;
		var lineW2 = 1.6;
		// audio sources
		var soundtrack = new Audio("golucky.mp3");
		var edge_s = new Audio("edges.wav");
		var edge_top_s = new Audio("edge_top.wav");
		var brick_s = new Audio("brick.wav");
		var paddle_s = new Audio("paddle.wav");
		var delbrick_s = new Audio("delbrick.wav");
		var liveloss_s = new Audio("liveloss.wav");
		var nextLevel_s = new Audio("newLevel.wav");
        var win_s = new Audio("win.wav");
        
        //********Setting up game initial setings*********	

        var gameLoop;
		var ballStartPsn = true;
		var PaddleMove;

		//********Counters*********	 
		var score = 0;
		var lives = 7;
		function Counters() {
			c.save();
			c.stroke();
			c.beginPath();
			c.fillStyle = "rgb(10, 10, 10)";
			c.fillRect(W / 3.8, H / 160, W * 0.33, H / 27);
			c.fillRect(W * 0.83, H / 160, W * 0.13, H / 27);

			//Set the text font and colour 
			c.font = W / 13 + "px Pipe Dream";
			c.fillStyle = "rgb(0, 102, 204)";
			c.strokeStyle = "rgb(0, 0, 0)";
			c.fillText("Score: ", W / 30, H / 24);
			c.fillText("Lives: ", W * 0.62, H / 24);
			c.lineWidth = 1;
			c.strokeText("Score: ", W / 30, H / 24);
			c.strokeText("Lives: ", W * 0.62, H / 24);
			c.fillStyle = "rgb(255, 128, 0)";
			c.font = H / 27 + "px LCDPHONE";
			c.fillText(+score, W * 0.27, H / 25);
			c.fillText(+lives, W / 1.19, H / 25);

			// starting conditions
			if (score == 0) {
				c.font = W / 9.6 + "px LCDPHONE";
				c.fillStyle = "rgb(255, 128, 0)";
				c.fillText("TAP TO START", W / 10, H * 0.94);
			}
			c.restore();
		}

		function endGame() {
			clearInterval(gameLoop);
			c.fillStyle = "rgb(255, 128, 0)";
			c.font = W / 9.6 + "px LCDPHONE";
			c.fillText("GAME OVER", W * 0.2, H * 0.94);
			// stop playing music
			soundtrack.pause();
		}

		function passGame() {
			clearInterval(gameLoop);
			c.fillStyle = "rgb(255, 128, 0)";
			c.font = W / 9.6 + "px LCDPHONE";
			c.fillText("YOU WIN", W * 0.27, H * 0.94);
			soundtrack.pause();
			play_sound(win_s);
		}

		function Info() {
			c.font = "25px Calibri";
			c.fillStyle = "rgb(0, 68, 255)";
		}

		//*******Paddle*******     
		var PaddleW = H / 6;
		var PaddleH = H / 47;
		var PaddleDeltaX = 0;
		var PaddleDeltaY = 0;
		var PaddleX = W / 2 - PaddleW / 2;
		var PaddleY = H - PaddleH - bot_line - W / 60;

		function drawPaddle() {
			c.save();
			c.beginPath();
			c.moveTo(PaddleX, PaddleY + PaddleH);
			c.lineTo(PaddleX, PaddleY);
			c.lineTo(PaddleX + PaddleW, PaddleY);
			c.lineTo(PaddleX + PaddleW, PaddleY + PaddleH);
			c.fillStyle = "rgb(0, 64, 98)";
			c.fill();
			c.lineWidth = 3;
			c.strokeStyle = "rgb(0, 0, 0)";
			c.stroke();
			c.beginPath();
			c.moveTo(PaddleX - 1, PaddleY - 1);
			c.lineTo(PaddleX + 14, PaddleY - 7);
			c.lineTo(PaddleX + PaddleW - 14, PaddleY - 7);
			c.lineTo(PaddleX + PaddleW + 1, PaddleY - 1);
			c.fillStyle = "rgb(0, 128, 196)";
			c.fill();
			c.lineWidth = 2;
			c.strokeStyle = "rgb(0, 0, 0)";
			c.stroke();
			c.restore();
		}

		var PaddleDeltaX;
		var PaddleSpeedX = W / 37;

		function movePaddle() {
			if (window.DeviceOrientationEvent && (window.innerHeight / window.innerWidth > 1)) {

				document.addEventListener("touchmove", function (e) {
					if (document.getElementById("touch").checked) {
						PaddleX = event.targetTouches[0].clientX;
					}
					else{  // ??? maybe not necessary
						e.preventDefault();
					}
				}, false);

				window.addEventListener('deviceorientation', function (e) {
					if (document.getElementById("gyro").checked) {
						PaddleDeltaX = event.gamma * 4;
					}else{  // ??? maybe not necessary
						e.preventDefault();
					}
				});
			}
			else {
				document.addEventListener("mousemove", function (e) {
					if (document.getElementById("mouse").checked) {
						var mouseX = e.clientX - (window.innerWidth / 2);
						if (mouseX > 20 && mouseX < 430) {
							PaddleX = mouseX;
						} else if (mouseX <= 20) {
							PaddleX = 20;
						}
						else if (mouseX >= 430) {
							PaddleX = 430;
						}
					}
				}, false);

				// Start Tracking Keystokes
				document.addEventListener('keydown', function (e) {
					if (document.getElementById("keybord").checked) {
						if (e.keyCode == 39) {
							PaddleDeltaX = PaddleSpeedX;
						} else if (e.keyCode == 37) {
							PaddleDeltaX = -PaddleSpeedX;
						}
					}else{  // ??? maybe not necessary
						e.preventDefault();
					}
				});

				document.addEventListener('keyup', function (e) {
					if (document.getElementById("keybord").checked) {
						if (e.keyCode == 39 || e.keyCode == 37) {
							PaddleDeltaX = 0;
						}
					}else{  // ??? maybe not necessary
						e.preventDefault();
					}
				});

				document.addEventListener('keyup', function (e) {
					if (document.getElementById("keybord").checked) {
						if (e.keyCode == 32 && ballStartPsn) {
							BallDeltaY = 4;
							BallDeltaX = 0;
							ballStartPsn = false;
						}
					}else{  // ??? maybe not necessary
						e.preventDefault();
					}
				});

			}
			document.addEventListener("click", function (e) {
				if (!document.getElementById("keybord").checked) {
					if (ballStartPsn) {
						BallDeltaY = 4;
						BallDeltaX = 0;
						ballStartPsn = false;
					}
				}
			});
			// If paddle reaches the ends of ball, then don't let it move 
			if (BallDeltaY == 0) {
				if (PaddleX + PaddleDeltaX < W / 2 - PaddleW || PaddleX + PaddleDeltaX + PaddleW > W / 2 + PaddleW) {
					PaddleDeltaX = 0;
				}
			}
			// If paddle reaches the ends, then don't let it move 
			if (PaddleX + PaddleDeltaX < 0 || PaddleX + PaddleDeltaX + PaddleW > W) {
				PaddleDeltaX = 0;
			}
			PaddleX = PaddleX + PaddleDeltaX;
		}

		//********Ball************
		var BallSpeed = W / 200;
		var BallX = W / 2 + (W / 800 * Math.random());
		var BallY = H - bot_line - W / 8;
		var BallR = W / 48;
		var BallDeltaX;
		var BallDeltaY;

		function drawBall() {
			c.save();
			c.beginPath();
			c.arc(BallX, BallY, BallR, 0, Math.PI * 2);
			c.fillStyle = "rgb(0,68,255)";
			c.fill();
			c.strokeStyle = "rgb(0,0,0)";
			c.lineWidth = 3;
			c.stroke();
			c.beginPath();
			c.arc(BallX - 2, BallY - 2, BallR - 5, 0, Math.PI * 2);
			c.strokeStyle = "rgb(0,128,255)";
			c.fillStyle = "rgb(0,128,255)";
			c.fill();
			c.restore();
		}

		function moveBall() {
			c.save();
			c.fillStyle = "rgb(0, 192, 192)";
			c.strokeStyle = "rgb(0, 0, 0)";

			if (BallY + BallDeltaY - BallR < top_line || collisionYWithBricks()) {
				BallDeltaY = -BallDeltaY;
				play_sound(brick_s);
			}

			// top bouncing effect
			if (BallY + BallDeltaY - BallR < top_line + 12) {
				c.beginPath();
				c.moveTo(per + bord / 2, top_line - bord);
				c.lineTo(W - per - bord / 2, top_line - bord);
				c.lineTo(W - borderX, top_line + borderYT);
				c.lineTo(borderX, top_line + borderYT);
				c.lineTo(per + bord / 2, top_line - bord);
				c.closePath();
				c.fill();
				c.lineWidth = 1.3 * bord;
				c.stroke();
				play_sound(edge_top_s);
			}
			// If the bottom of the Ball touches the bottom of the screen then end the game
			if (BallY + BallDeltaY + BallR > H - bot_line - 14) {
				if (lives > 0) {
					lives--;
					c.beginPath();
					c.moveTo(bord, H - bot_line);
					c.lineTo(W - bord, H - bot_line);
					c.lineTo(W - borderX, H - bot_line - borderYB);
					c.lineTo(borderX, H - bot_line - borderYB);
					c.closePath();
					c.fillStyle = "rgb(148, 0, 255)";
					c.fill();
					c.lineWidth = 2 * bord;
					c.stroke();
					play_sound(liveloss_s);
					startBall();
					// BallDeltaY = -BallDeltaY;		
				}
				else {
					endGame();
				}
			}
			// If side of Ball touches either side of the wall then reverse X direction
			//left of Ball moves too far left
			if ((BallX + BallDeltaX - BallR - 18 <= 0) ||
				//or right side of Ball moves too far right
				(BallX + BallDeltaX + BallR + 18 >= W) || collisionXWithBricks()) {
				BallDeltaX = -BallDeltaX;
				play_sound(edge_s);
			}
			//left side bounce effect
			if (BallX + BallDeltaX - BallR - per <= 10) {
				c.beginPath();
				c.moveTo(per, top_line);
				c.lineTo(bord, H - bot_line);
				c.lineTo(borderX, H - bot_line - borderYB);
				c.lineTo(borderX, top_line + borderYT);
				c.lineTo(per, top_line);
				c.closePath();
				c.fill();
				c.lineWidth = 1.5 * bord;
				c.strokeStyle = "rgb(0, 0, 0)";
				c.stroke();
			}

			//right	side bounce effect
			if (BallX + BallDeltaX + BallR + per >= W - 10) {
				c.beginPath();
				c.moveTo(W - per, top_line);
				c.lineTo(W - bord, H - bot_line);
				c.lineTo(W - borderX, H - bot_line - borderYB);
				c.lineTo(W - borderX, top_line + borderYT);
				c.lineTo(W - per, top_line);
				c.closePath();
				c.fillStyle = "rgb(0, 192, 192)";
				c.fill();
				c.lineWidth = 1.5 * bord;
				c.strokeStyle = "rgb(0, 0, 0)";
				c.stroke();

			}

			// if bottom of Ball reaches the top of paddle,
			if (BallY + BallDeltaY + BallR >= PaddleY) {
				// and it is positioned between the two ends of the paddle (is on top)
				if (BallX + BallDeltaX + BallR >= PaddleX &&
					BallX + BallDeltaX - BallR <= PaddleX + PaddleW) {
					BallDeltaX = BallDeltaX / 2.5 + ((BallX + BallDeltaX) - (PaddleX + PaddleW / 2)) / (PaddleW / 4.4)
					BallDeltaY = - BallDeltaY
					play_sound(paddle_s);
				}
			}
			c.restore();

			// Move the Ball
			BallX = BallX + BallDeltaX * BallSpeed;
			BallY = BallY + BallDeltaY * BallSpeed;

		}
		//**********Levels******************
		var bricksRow = 18;
		var brickHeight = H / 50;
		var brickWidth = W / bricksRow;
		//Lvl1
		var bricks = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
			[0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
			[0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
			[0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
			[0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];
		//Lvl2
		var bricks1 = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 2, 0, 0, 0, 2, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0],
			[0, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0],
			[0, 0, 2, 0, 2, 0, 2, 0, 0, 2, 2, 0, 0, 2, 0, 0, 0, 0],
			[0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0],
			[0, 0, 2, 0, 0, 0, 2, 0, 2, 2, 2, 0, 0, 0, 2, 2, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];
		//Lvl3
		var bricks2 = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 3, 3, 3, 3, 0, 3, 0, 0, 0, 3, 0, 3, 3, 3, 3, 0, 0],
			[0, 3, 0, 0, 0, 0, 3, 3, 0, 0, 3, 0, 3, 0, 0, 0, 3, 0],
			[0, 3, 3, 3, 0, 0, 3, 0, 3, 0, 3, 0, 3, 3, 3, 3, 0, 0],
			[0, 3, 0, 0, 0, 0, 3, 0, 0, 3, 3, 0, 3, 0, 0, 3, 0, 0],
			[0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 3, 0, 0, 0, 3, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];
		//Lvl4
		var bricks3 = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0],
			[0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0],
			[0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0],
			[0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0],
			[0, 3, 0, 0, 0, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0],
			[0, 0, 3, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 2, 0, 0],
			[0, 0, 3, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 2, 0, 0],
			[0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
			[0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
			[0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
			[0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
			[0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 2, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 2, 0, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
			[0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

		/* Plain LVL
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		*/

		// iterate through the bricks array and draw each brick using drawBrick()
		function createBricks() {
			for (var i = 0; i < bricks.length; i++) {
				for (var j = 0; j < bricks[i].length; j++) {
					drawBrick(j, i, bricks[i][j]);
				}
			}
		}

		// set starting ball position
		function startBall() {
			ballStartPsn = true;
			BallDeltaY = 0;
			BallDeltaX = 0;
			PaddleDeltaX = 0;
			BallX = W / 2 + PaddleDeltaX;
			BallY = H - bot_line - W / 8;
			PaddleX = W / 2 - PaddleW / 2;
		}

		function newLevel() {
			startBall();
			score = score + 10;
			lives = lives + 2;
			PaddleW = H / 6 - PaddleW / 9;
			BallSpeed = BallSpeed + PaddleW / 1000;
			play_sound(nextLevel_s);
		}
		// draw a single brick
		function drawBrick(x, y, type) {
			if (score == 64) {
				bricks = bricks1;
				newLevel();
			}
			else if (score == 161) {
				bricks = bricks2;
				newLevel();
			}
			else if (score == 319) {
				bricks = bricks3;
				newLevel();
			}
			else if (score == 520) {
				passGame();
			}
			switch (type) { // if brick is still visible; three colours for three types of bricks
				case 0:
					c.fillStyle = "rgb(0,0,0)";
					break;
				case 1:
					c.fillStyle = "rgba(64,172,0,0.8)";
					break;
				case 2:
					c.fillStyle = "rgba(0,176,148,0.8)";
					break;
				case 3:
					c.fillStyle = "rgba(255,128,0,0.8)";
					break;
				case 4:
					c.fillStyle = "rgba(196,32,0,0.8)";
					break;
				default:
					c.translate(50, 0);
					c.fillRect(x * brickWidth, y * brickHeight, brickWidth, brickHeight);
					break;

			}
			if (type) {
				//Draw rectangle with fillStyle color selected earlier
				c.strokeStyle = "rgb(0, 0, 0)";
				c.strokeRect(x * brickWidth, y * brickHeight, brickWidth, brickHeight);
				// Also draw blackish border around the brick
				c.fillRect(x * brickWidth + 2, y * brickHeight + 2, brickWidth - 4, brickHeight - 4);
			}
		}

		function collisionXWithBricks() {
			var bumpedX = false;
			for (var i = 0; i < bricks.length; i++) {
				for (var j = 0; j < bricks[i].length; j++) {
					if (bricks[i][j]) { // if brick is still visible
						var brickX = j * brickWidth;
						var brickY = i * brickHeight;
						if (
							// barely touching from left
							((BallX + BallDeltaX * BallSpeed + BallR >= brickX) &&
								(BallX + BallR <= brickX))
							||
							// barely touching from right
							((BallX + BallDeltaX * BallSpeed - BallR <= brickX + brickWidth) &&
								(BallX - BallR >= brickX + brickWidth))
						) {
							if ((BallY + BallDeltaY * BallSpeed - BallR <= brickY + brickHeight) &&
								(BallY + BallDeltaY * BallSpeed + BallR >= brickY)) {
								// weaken brick and increase score
								explodeBrick(i, j);

								bumpedX = true;
							}
						}
					}
				}
			}
			return bumpedX;
		}

		function collisionYWithBricks() {

			var bumpedY = false;
			for (var i = 0; i < bricks.length; i++) {
				for (var j = 0; j < bricks[i].length; j++) {
					if (bricks[i][j]) { // if brick is still visible
						var brickX = j * brickWidth;
						var brickY = i * brickHeight;
						if (
							// barely touching from below
							((BallY + BallDeltaY * BallSpeed - BallR <= brickY + brickHeight) &&
								(BallY - BallR >= brickY + brickHeight))
							||
							// barely touching from above
							((BallY + BallDeltaY * BallSpeed + BallR >= brickY) &&
								(BallY + BallR <= brickY))) {
							if (BallX + BallDeltaX * BallSpeed + BallR >= brickX &&
								BallX + BallDeltaX * BallSpeed - BallR <= brickX + brickWidth) {
								// weaken brick and increase score
								explodeBrick(i, j);
								bumpedY = true;
							}
						}
					}
				}
			}
			return bumpedY;
		} function explodeBrick(i, j) {
			// First weaken the brick (0 means brick has gone)
			bricks[i][j]--;

			if (bricks[i][j] > 0) {
				// The brick is weakened but still around. Give a single point.
				score++;
			} else {
				// give player an extra point when the brick disappears
				score += 2;
				play_sound(delbrick_s);
			}
		}


		function startGame() {
			soundtrack.addEventListener('ended', function () {
				this.currentTime = 0;
				/********************************************** CHECK IT *********************************************************************************/
				this.play();
			}, false);

			BallDeltaY = 0;
			BallDeltaX = 0;
			PaddleDeltaX = 0;

			// call the update() function every 20ms until clearInterval(gameLoop) is called
			gameLoop = setInterval(update, 20);
		}

		var bord = H / 533;
		var borderX = W / 20;
		var borderYT = H / 80;
		var borderYB = 2 * borderYT;
		var per = 11;

		function update() {
			//clear screen    
			c.fillStyle = "rgb(75, 0, 130)";
			c.fillRect(0, 0, W, H);
			//bottom screen
			c.save();
			c.beginPath();
			c.fillStyle = "rgb(10, 10, 10)";
			c.fillRect(W / 40, H * 0.84, W * 0.95, H * 0.14);
			c.lineWidth = 4;
			c.strokeStyle = "rgb(0, 0, 0)";
			c.strokeRect(W / 40, H * 0.84, W * 0.95, H * 0.14);
			c.restore();
			//**********border fill***********
			c.save();
			c.beginPath();
			c.moveTo(W - borderX, top_line + borderYT);
			c.lineTo(borderX, top_line + borderYT);
			c.lineTo(borderX, H - bot_line - borderYB);
			c.lineTo(W - borderX, H - bot_line - borderYB);
			c.lineTo(W - borderX, top_line + borderYT);
			c.closePath();
			c.fillStyle = "rgb(6, 3, 24)";
			c.fill();
			//CRT effect
			var radius = H / 25;
			c.lineJoin = "round";
			c.beginPath();
			c.moveTo(W - borderX - radius, top_line + borderYT + radius);
			c.lineTo(borderX + radius, top_line + borderYT + radius);
			c.lineTo(borderX + radius, H - bot_line - borderYB - radius);
			c.lineTo(W - borderX - radius, H - bot_line - borderYB - radius);
			c.lineTo(W - borderX - radius, top_line + borderYT + radius);
			c.closePath();
			c.lineWidth = 1.84 * radius;
			c.strokeStyle = "rgb(196, 196, 255)";
			c.fillStyle = "rgb(196, 196, 255)";
			c.fill();
			c.stroke();
			//borders	 
			//top
			c.fillStyle = "rgb(75, 0, 130)";
			c.strokeStyle = "rgb(0, 0, 0)";
			c.beginPath();
			c.moveTo(per + bord / 2, top_line - bord);
			c.lineTo(W - per - bord / 2, top_line - bord);
			c.lineTo(W - borderX, top_line + borderYT);
			c.lineTo(borderX, top_line + borderYT);
			c.lineTo(per + bord / 2, top_line - bord);
			c.closePath();
			c.fill();
			c.lineWidth = 1.3 * bord;
			c.stroke();

			c.save();
			c.beginPath();
			c.moveTo(bord, H - bot_line);
			c.lineTo(W - bord, H - bot_line);
			c.lineTo(W - borderX, H - bot_line - borderYB);
			c.lineTo(borderX, H - bot_line - borderYB);
			c.closePath();
			c.fillStyle = "rgb(24, 0, 57)";
			c.fill();
			c.strokeStyle = "rgb(0, 0,0)";
			c.lineWidth = 4 * bord;
			c.stroke();
			c.restore();

			c.fillStyle = "rgb(148, 0, 255)";
			c.strokeStyle = "rgb(0, 0, 0)";
			//right
			c.beginPath();
			c.moveTo(W - per, top_line);
			c.lineTo(W - bord, H - bot_line);
			c.lineTo(W - borderX, H - bot_line - borderYB);
			c.lineTo(W - borderX, top_line + borderYT);
			c.lineTo(W - per, top_line);
			c.closePath();
			//left
			c.moveTo(per, top_line);
			c.lineTo(bord, H - bot_line);
			c.lineTo(borderX, H - bot_line - borderYB);
			c.lineTo(borderX, top_line + borderYT);
			c.lineTo(per, top_line);
			c.closePath();
			c.fill();
			c.lineWidth = 1.5 * bord;
			c.stroke();
			c.restore();

			if (startBool) {
				moveBall();
				movePaddle();
				drawPaddle();
				drawBall();
				createBricks();
			}
			Counters();
			//Info();
		}
		startGame();