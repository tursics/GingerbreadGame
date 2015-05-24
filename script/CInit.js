﻿//--------------------------------
//---         CInit.js         ---
//--------------------------------

CInit = new function()
{
	//------------------------
	this.eventReady = function()
	{
		try {
			this.game = new Phaser.Game( 800, 600, Phaser.AUTO, '', { preload: CInit.preload, create: CInit.create, update: CInit.update });
//			this.game = new Phaser.Game( 800, 600, Phaser.CANVAS, '', { preload: CInit.preload, create: CInit.create, update: CInit.update });

//			MyField.eventReady();
//			MyPlayer.eventReady();
		} catch( e) {
			if( CConfig.debug) {
				alert( e);
			}
		}
	};

	//------------------------
	this.eventResize = function()
	{
		try {
			MyField.eventResize();
//			MyPlayer.eventResize();
		} catch( e) {
			if( CConfig.debug) {
				alert( e);
			}
		}
	};

	//------------------------
	this.preload = function ()
	{
		try {
			this.game.load.image( 'sky', 'art/sky.png');
			this.game.load.image( 'ground', 'art/platform.png');
			this.game.load.image( 'star', 'art/star.png');
			this.game.load.spritesheet( 'dude', 'art/dude.png', 32, 48);

			this.GEM_SIZE = 64; // why?
			this.game.load.spritesheet( 'GEMS', 'art/items.png', this.GEM_SIZE, this.GEM_SIZE);
		} catch( e) {
			if( CConfig.debug) {
				alert( e);
			}
		}
	}

	//------------------------
	this.create = function ()
	{
		try {
			this.game.physics.startSystem( Phaser.Physics.ARCADE);

			this.game.add.sprite( 0, 0, 'sky');

/*			this.platforms = this.game.add.group();
			this.platforms.enableBody = true;

			var ground = this.platforms.create( 0, this.game.world.height - 64, 'ground');
			ground.scale.setTo( 2, 2);
			ground.body.immovable = true;

			var ledge = this.platforms.create( 400, 400, 'ground');
			ledge.body.immovable = true;
			ledge = this.platforms.create( -150, 250, 'ground');
			ledge.body.immovable = true;

			this.player = this.game.add.sprite( 32, this.game.world.height - 150, 'dude');
			this.game.physics.arcade.enable( this.player);
			this.player.body.bounce.y = 0.2;
			this.player.body.gravity.y = 300;
			this.player.body.collideWorldBounds = true;
			this.player.animations.add( 'left', [0, 1, 2, 3], 10, true);
			this.player.animations.add( 'right', [5, 6, 7, 8], 10, true);

			this.stars = this.game.add.group();
			this.stars.enableBody = true;

			for( var i = 0; i < 12; ++i) {
				var star = this.stars.create( i * 70, 0, 'star');
				star.body.gravity.y = 300;
				star.body.bounce.y = 0.7 + Math.random() * 0.2;
			}

			this.score = 0;
			this.scoreText = this.game.add.text( 16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

			this.cursors = this.game.input.keyboard.createCursorKeys();*/

spawnBoard();
// currently selected gem starting position. used to stop player form moving gems too far.
			CInit.selectedGemStartPos = { x: 0, y: 0 };
// used to disable input while gems are dropping down and respawning
			CInit.allowInput = true;
CInit.game.input.addMoveCallback( slideGem, this);

		} catch( e) {
			if( CConfig.debug) {
				alert( e);
			}
		}
	}

	//------------------------
	this.update = function() {
		try {
/*			this.game.physics.arcade.collide( this.player, this.platforms);
			this.game.physics.arcade.collide( this.stars, this.platforms);

			this.game.physics.arcade.overlap( this.player, this.stars, CInit.collectStar, null, this);

			this.player.body.velocity.x = 0;

			if( this.cursors.left.isDown) {
				this.player.body.velocity.x = -150;
				this.player.animations.play( 'left');
			} else if( this.cursors.right.isDown) {
				this.player.body.velocity.x = 150;
				this.player.animations.play( 'right');
			} else {
				this.player.animations.stop();
				this.player.frame = 4;
			}

			if( this.cursors.up.isDown && this.player.body.touching.down) {
				this.player.body.velocity.y = -350;
			}*/
		} catch( e) {
			if( CConfig.debug) {
				alert( e);
			}
		}
	}

	//------------------------
	this.collectStar = function( player, star) {
		star.kill();

		this.score += 10;
		this.scoreText.text = 'Score: ' + this.score;
	}

	//------------------------
	this.game = null;
	this.player = null;
	this.platforms = null;
	this.cursors = null;
	this.stars = null;
	this.score = 0;
	this.scoreText = null;
	this.GEM_SIZE = 64;
	this.GEM_SPACING = 2;
	this.GEM_SIZE_SPACED = this.GEM_SIZE + this.GEM_SPACING;
	this.BOARD_COLS = 9;
	this.BOARD_ROWS = 9;
	this.gems = null;
	this.selectedGem = null;
	this.selectedGemStartPos;
	this.selectedGemTween;
	this.tempShiftedGem = null;
	this.allowInput = false;

	//------------------------
};

//----------------------------

function wpGotoPage( pageName)
{
	$.mobile.changePage( "#" + pageName);
}

//----------------------------
//----------------------------
//----------------------------

// fill the screen with as many gems as possible
function spawnBoard()
{
	CInit.gems = CInit.game.add.group();

	for( var x = 0; x < CInit.BOARD_COLS; ++x) {
		for( var y = 0; y < CInit.BOARD_ROWS; ++y) {
			var gem = CInit.gems.create( x * CInit.GEM_SIZE_SPACED, y * CInit.GEM_SIZE_SPACED, 'GEMS');
			gem.name = 'gem' + x.toString() + 'x' + y.toString();
			gem.inputEnabled = true;
			gem.events.onInputDown.add( selectGem, this);
			gem.events.onInputUp.add( releaseGem, this);
			randomizeGemColor( gem);
			setGemPos( gem, x, y);
		}
	}
}

// select a gem and remember its starting position
function selectGem( gem, pointer)
{
	if( !CInit.allowInput) {
		return;
	}

//	console.log( 'select gem', gem);
	CInit.selectedGem = gem;
	CInit.selectedGemStartPos.x = gem.posX;
	CInit.selectedGemStartPos.y = gem.posY;
}

function releaseGem( gem)
{
	if( !CInit.allowInput) {
		return;
	}

//	console.log( 'release gem', gem);

	// when the mouse is released with a gem selected
	// 1) check for matches
	// 2) remove matched gems
	// 3) drop down gems above removed gems
	// 4) refill the board

	checkAndKillGemMatches( gem);

	if( CInit.tempShiftedGem !== null) {
		checkAndKillGemMatches( CInit.tempShiftedGem);
	}

	removeKilledGems();

	var dropGemDuration = dropGems();

	// delay board refilling until all existing gems have dropped down
	CInit.game.time.events.add( dropGemDuration * 100, refillBoard);

	CInit.allowInput = false;

	CInit.selectedGem = null;
	CInit.tempShiftedGem = null;
}

// count how many gems of the same color are above, below, to the left and right
// if there are more than 3 matched horizontally or vertically, kill those gems
// if no match was made, move the gems back into their starting positions
function checkAndKillGemMatches( gem, matchedGems)
{
	if( gem !== null) {
		var countUp = countSameColorGems( gem, 0, -1);
		var countDown = countSameColorGems( gem, 0, 1);
		var countLeft = countSameColorGems( gem, -1, 0);
		var countRight = countSameColorGems( gem, 1, 0);

		var countHoriz = countLeft + countRight + 1;
		var countVert = countUp + countDown + 1;

		if( countVert >= 3) {
			killGemRange( gem.posX, gem.posY - countUp, gem.posX, gem.posY + countDown);
		}

		if( countHoriz >= 3) {
			killGemRange( gem.posX - countLeft, gem.posY, gem.posX + countRight, gem.posY);
		}

		if( countVert < 3 && countHoriz < 3) {
			if( gem.posX !== CInit.selectedGemStartPos.x || gem.posY !== CInit.selectedGemStartPos.y) {
				if( CInit.selectedGemTween !== null) {
					CInit.game.tweens.remove( CInit.selectedGemTween);
				}

				CInit.selectedGemTween = tweenGemPos( gem, CInit.selectedGemStartPos.x, CInit.selectedGemStartPos.y);

				if( CInit.tempShiftedGem !== null) {
					tweenGemPos( CInit.tempShiftedGem, gem.posX, gem.posY);
				}

				swapGemPosition( gem, CInit.tempShiftedGem);
			}
		}
	}
}

// kill all gems from a starting position to an end position
function killGemRange( fromX, fromY, toX, toY)
{
	fromX = Phaser.Math.clamp( fromX, 0, CInit.BOARD_COLS - 1);
	fromY = Phaser.Math.clamp( fromY , 0, CInit.BOARD_ROWS - 1);
	toX = Phaser.Math.clamp( toX, 0, CInit.BOARD_COLS - 1);
	toY = Phaser.Math.clamp( toY, 0, CInit.BOARD_ROWS - 1);

	for( var i = fromX; i <= toX; ++i) {
		for( var j = fromY; j <= toY; ++j) {
			var gem = getGem( i, j);
			gem.kill();
		}
	}
}

// move gems that have been killed off the board
function removeKilledGems()
{
	CInit.gems.forEach( function( gem) {
		if( !gem.alive) {
			setGemPos( gem, -1, -1);
		}
	});
}

// look for gems with empty space beneath them and move them down
function dropGems()
{
	var dropRowCountMax = 0;

	for( var i = 0; i < CInit.BOARD_COLS; ++i) {
		var dropRowCount = 0;

		for( var j = CInit.BOARD_ROWS - 1; j >= 0; --j) {
			var gem = getGem( i, j);

			if( gem === null) {
				++dropRowCount;
			} else if( dropRowCount > 0) {
				setGemPos( gem, gem.posX, gem.posY + dropRowCount);
				tweenGemPos( gem, gem.posX, gem.posY, dropRowCount);
			}
		}

		dropRowCountMax = Math.max( dropRowCount, dropRowCountMax);
	}

	return dropRowCountMax;
}

// look for any empty spots on the board and spawn new gems in their place that fall down from above
function refillBoard()
{
	var maxGemsMissingFromCol = 0;

	for( var i = 0; i < CInit.BOARD_COLS; ++i) {
		var gemsMissingFromCol = 0;

		for( var j = CInit.BOARD_ROWS - 1; j >= 0; --j) {
			var gem = getGem( i, j);

			if( gem === null) {
				++gemsMissingFromCol;
				gem = CInit.gems.getFirstDead();
				gem.reset( i * CInit.GEM_SIZE_SPACED, -gemsMissingFromCol * CInit.GEM_SIZE_SPACED);
				randomizeGemColor( gem);
				setGemPos( gem, i, j);
				tweenGemPos( gem, gem.posX, gem.posY, gemsMissingFromCol * 2);
			}
		}

		maxGemsMissingFromCol = Math.max( maxGemsMissingFromCol, gemsMissingFromCol);
	}

	CInit.game.time.events.add( maxGemsMissingFromCol * 2 * 100, boardRefilled);
}

// when the board has finished refilling, re-enable player input
function boardRefilled()
{
	CInit.allowInput = true;
}

// count how many gems of the same color lie in a given direction
// eg if moveX=1 and moveY=0, it will count how many gems of the same color lie to the right of the gem
// stops counting as soon as a gem of a different color or the board end is encountered
function countSameColorGems( startGem, moveX, moveY)
{
	var curX = startGem.posX + moveX;
	var curY = startGem.posY + moveY;
	var count = 0;

	while(( curX >= 0) && (curY >= 0) && (curX < CInit.BOARD_COLS) && (curY < CInit.BOARD_ROWS) && (getGemColor( getGem( curX, curY)) === getGemColor( startGem))) {
		count++;
		curX += moveX;
		curY += moveY;
	}

	return count;
}

// since the gems are a spritesheet, their color is the same as the current frame number
function getGemColor( gem)
{
	return gem.frame;
}

// find a gem on the board according to its position on the board
function getGem( posX, posY)
{
	return CInit.gems.iterate( "id", calcGemId( posX, posY), Phaser.Group.RETURN_CHILD);
}

// convert world coordinates to board position
function getGemPos( coordinate)
{
	return Phaser.Math.floor( coordinate / CInit.GEM_SIZE_SPACED);
}

// set the position on the board for a gem
function setGemPos( gem, posX, posY)
{
	gem.posX = posX;
	gem.posY = posY;
	gem.id = calcGemId( posX, posY);
}

// animated gem movement
function tweenGemPos( gem, newPosX, newPosY, durationMultiplier)
{
	if( durationMultiplier === null || typeof durationMultiplier === 'undefined') {
		durationMultiplier = 1;
	}

	return CInit.game.add.tween( gem).to({
		x: newPosX * CInit.GEM_SIZE_SPACED,
		y: newPosY * CInit.GEM_SIZE_SPACED},
		100 * durationMultiplier, Phaser.Easing.Linear.None, true);
}

// swap the position of 2 gems when the player drags the selected gem into a new location
function swapGemPosition( gem1, gem2)
{
	var tempPosX = gem1.posX;
	var tempPosY = gem1.posY;
	setGemPos( gem1, gem2.posX, gem2.posY);
	setGemPos( gem2, tempPosX, tempPosY);
}

// the gem id is used by getGem() to find specific gems in the group
// each position on the board has a unique id
function calcGemId( posX, posY)
{
	return posX + posY * CInit.BOARD_COLS;
}

// set the gem spritesheet to a random frame
function randomizeGemColor( gem)
{
	gem.frame = CInit.game.rnd.integerInRange( 0, gem.animations.frameTotal - 1);
}

function slideGem( pointer, x, y, fromClick)
{
	// check if a selected gem should be moved and do it
	if( CInit.selectedGem && pointer.isDown) {
		var cursorGemPosX = getGemPos( x);
		var cursorGemPosY = getGemPos( y);

		if( checkIfGemCanBeMovedHere( CInit.selectedGemStartPos.x, CInit.selectedGemStartPos.y, cursorGemPosX, cursorGemPosY)) {
			if( cursorGemPosX !== CInit.selectedGem.posX || cursorGemPosY !== CInit.selectedGem.posY) {
				// move currently selected gem
				if( CInit.selectedGemTween !== null) {
					CInit.game.tweens.remove( CInit.selectedGemTween);
				}

				CInit.selectedGemTween = tweenGemPos( CInit.selectedGem, cursorGemPosX, cursorGemPosY);

				CInit.gems.bringToTop( CInit.selectedGem);

				// if we moved a gem to make way for the selected gem earlier, move it back into its starting position
				if( CInit.tempShiftedGem !== null) {
					tweenGemPos( CInit.tempShiftedGem, CInit.selectedGem.posX , CInit.selectedGem.posY);
					swapGemPosition( CInit.selectedGem, CInit.tempShiftedGem);
				}

				// when the player moves the selected gem, we need to swap the position of the selected gem with the gem currently in that position 
				CInit.tempShiftedGem = getGem( cursorGemPosX, cursorGemPosY);

				if( CInit.tempShiftedGem === CInit.selectedGem) {
					CInit.tempShiftedGem = null;
				} else {
					tweenGemPos( CInit.tempShiftedGem, CInit.selectedGem.posX, CInit.selectedGem.posY);
					swapGemPosition( CInit.selectedGem, CInit.tempShiftedGem);
				}
			}
		}
	}
}

// gems can only be moved 1 square up/down or left/right
function checkIfGemCanBeMovedHere( fromPosX, fromPosY, toPosX, toPosY)
{
	if( toPosX < 0 || toPosX >= CInit.BOARD_COLS || toPosY < 0 || toPosY >= CInit.BOARD_ROWS) {
		return false;
	}

	if( fromPosX === toPosX && fromPosY >= toPosY - 1 && fromPosY <= toPosY + 1) {
		return true;
	}

	if( fromPosY === toPosY && fromPosX >= toPosX - 1 && fromPosX <= toPosX + 1) {
		return true;
	}

	return false;
}

//----------------------------
// eof
