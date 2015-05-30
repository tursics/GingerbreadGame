// ---------------------------------------------------------------------------------------
// class for touch input
// ---------------------------------------------------------------------------------------

function CTouchLevel( game)
{
	this.FOURDIRECTIONS = 4;
	this.EIGHTDIRECTIONS = 8;

	this.game = game;
	this.freezeCount = 0;
	this.selectedGemObj = null;
	this.selectedGemPos;
	this.selectedGemTween = null;
	this.swappedGemObj = null;
	this.solveVec;

	// configurable
	this.dragLength = .5;
	this.dragDirections = this.EIGHTDIRECTIONS;
	this.speedSwapGems = 1.2;

	try {
		this.freeze();
		this.game.input.addMoveCallback( this.OnDraging, this);

		this.selectedGemObj = null;
		this.selectedGemPos = { x: 0, y: 0, dragX: 0, dragY: 0 };
		this.swappedGemObj = null;

		this.solveVec = new Array();
		this.solveVec.push( this.solve5row);
		this.solveVec.push( this.solve5col);
		this.solveVec.push( this.solve4row);
		this.solveVec.push( this.solve4col);
		this.solveVec.push( this.solve3row);
		this.solveVec.push( this.solve3col);
	} catch(e) {
		console.error('CTouchLevel not ready');
	}
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.addGem = function( gem)
{
	gem.events.onInputDown.add( this.OnTouchDownGem, this);
	gem.events.onInputUp.add( this.OnTouchUpGem, this);
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.freeze = function()
{
	++this.freezeCount;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.thaw = function()
{
	if( this.freezeCount > 0) {
		--this.freezeCount;
	} else {
		console.log( 'Thaw touch support too often!');
	}
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.OnTouchDownGem = function( gem, pointer)
{
	if( this.freezeCount > 0) {
		return;
	}

	this.selectedGemObj = gem;
	this.selectedGemPos.x = gem.posX;
	this.selectedGemPos.y = gem.posY;
	this.selectedGemPos.dragX = pointer.x;
	this.selectedGemPos.dragY = pointer.y;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.OnTouchUpGem = function( gem)
{
	if( this.freezeCount > 0) {
		return;
	}

	this.swappedGemObj = null;
	this.selectedGemObj = null;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.finishDraw = function( gemObj, callback)
{
	var touch = this;

	touch.freeze();

	touch.checkAndKillGemMatches( gemObj, function( dirty) {
		touch.removeKilledGems();

		touch.dropGems( function() {
			touch.refillBoard( function() {
				touch.thaw();

				if( dirty) {
					touch.finishDraw( null, callback);
				} else {
					callback();
				}
			});
		});
	});
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.OnDraging = function( pointer, x, y, fromClick)
{
	if( this.selectedGemObj && pointer.isDown) {
		var posX = this.selectedGemPos.x;
		var posY = this.selectedGemPos.y;

		var block = this.getMove( this.selectedGemPos.dragX, this.selectedGemPos.dragY, x, y);
		if(( 0 <= block) && (block <= 2)) {
			--posY;
		}
		if(( 2 <= block) && (block <= 4)) {
			++posX;
		}
		if(( 4 <= block) && (block <= 6)) {
			++posY;
		}
		if(( 0 == block) || (6 == block) || (7 == block)) {
			--posX;
		}

		if( this.canMove( this.selectedGemPos.x, this.selectedGemPos.y, posX, posY)) {
			var touch = this;
			var gemObj = this.selectedGemObj;
			this.selectedGemObj = null;
			this.swappedGemObj = getGem( posX, posY);

			this.freeze();

			CInit.gems.bringToTop( gemObj);

			if( this.selectedGemTween !== null) {
				this.game.tweens.remove( this.selectedGemTween);
			}
			this.selectedGemTween = this.tweenGemPos( gemObj, posX, posY, this.speedSwapGems);
			this.tweenGemPos( this.swappedGemObj, gemObj.posX, gemObj.posY, this.speedSwapGems, function() {
				touch.swapGemPosition( gemObj, touch.swappedGemObj);

				touch.finishDraw( gemObj, function() {
					touch.thaw();
				});
			});
		}
	}
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.checkAndKillGemMatches = function( gemObj, callback)
{
	var x = -1;
	var y = -1;
	if( gemObj !== null) {
		x = gemObj.posX;
		y = gemObj.posY;
	}

	var solved = false;
	for( var s = 0; s < this.solveVec.length; ++s) {
		solved = this.solveVec[ s].apply( this, [x, y]) || solved;
	}

	if( solved) {
		setTimeout( function() {
			callback.apply( this, [true]);
		}, 100 * this.speedSwapGems + 100);
		return;
	}

	if( gemObj !== null) {
		var touch = this;

		if( this.selectedGemTween !== null) {
			this.game.tweens.remove( this.selectedGemTween);
		}
		this.selectedGemTween = this.tweenGemPos( gemObj, this.selectedGemPos.x, this.selectedGemPos.y, this.speedSwapGems);
		this.tweenGemPos( this.swappedGemObj, gemObj.posX, gemObj.posY, this.speedSwapGems, function() {
			touch.swapGemPosition( gemObj, touch.swappedGemObj);
			callback.apply( this, [false]);
		});

		return;
	}

	callback.apply( this, [false]);
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.solve3row = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < CInit.BOARD_ROWS; ++y) {
		for( var x = 0; x < CInit.BOARD_COLS; ++x) {
			var gemObj = getGem( x, y);
			if( !gemObj.deaden) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				if( countRight == 2) {
					this.fadeoutGem( getGem( x, y), this.speedSwapGems);
					this.fadeoutGem( getGem( x + 1, y), this.speedSwapGems);
					this.fadeoutGem( getGem( x + 2, y), this.speedSwapGems);
					getGem( x, y).deaden = true;
					getGem( x + 1, y).deaden = true;
					getGem( x + 2, y).deaden = true;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.solve3col = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < CInit.BOARD_ROWS; ++y) {
		for( var x = 0; x < CInit.BOARD_COLS; ++x) {
			var gemObj = getGem( x, y);
			if( !gemObj.deaden) {
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				if( countDown == 2) {
					this.fadeoutGem( getGem( x, y), this.speedSwapGems);
					this.fadeoutGem( getGem( x, y + 1), this.speedSwapGems);
					this.fadeoutGem( getGem( x, y + 2), this.speedSwapGems);
					getGem( x, y).deaden = true;
					getGem( x, y + 1).deaden = true;
					getGem( x, y + 2).deaden = true;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.solve4row = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < CInit.BOARD_ROWS; ++y) {
		for( var x = 0; x < CInit.BOARD_COLS; ++x) {
			var gemObj = getGem( x, y);
			if( !gemObj.deaden) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				if( countRight == 3) {
					this.tweenGemPos( getGem( x, y), x + 1, y, this.speedSwapGems);
					this.tweenGemPos( getGem( x + 2, y), x + 1, y, this.speedSwapGems);
					this.tweenGemPos( getGem( x + 3, y), x + 1, y, this.speedSwapGems);
					getGem( x, y).deaden = true;
					getGem( x + 2, y).deaden = true;
					getGem( x + 3, y).deaden = true;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.solve4col = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < CInit.BOARD_ROWS; ++y) {
		for( var x = 0; x < CInit.BOARD_COLS; ++x) {
			var gemObj = getGem( x, y);
			if( !gemObj.deaden) {
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				if( countDown == 3) {
					this.tweenGemPos( getGem( x, y), x, y + 1, this.speedSwapGems);
					this.tweenGemPos( getGem( x, y + 2), x, y + 1, this.speedSwapGems);
					this.tweenGemPos( getGem( x, y + 3), x, y + 1, this.speedSwapGems);
					getGem( x, y).deaden = true;
					getGem( x, y + 2).deaden = true;
					getGem( x, y + 3).deaden = true;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.solve5row = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < CInit.BOARD_ROWS; ++y) {
		for( var x = 0; x < CInit.BOARD_COLS; ++x) {
			var gemObj = getGem( x, y);
			if( !gemObj.deaden) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				if( countRight == 4) {
					this.tweenGemPos( getGem( x, y), x + 2, y, this.speedSwapGems);
					this.tweenGemPos( getGem( x + 1, y), x + 2, y, this.speedSwapGems);
					this.tweenGemPos( getGem( x + 3, y), x + 2, y, this.speedSwapGems);
					this.tweenGemPos( getGem( x + 4, y), x + 2, y, this.speedSwapGems);
					getGem( x, y).deaden = true;
					getGem( x + 1, y).deaden = true;
					getGem( x + 3, y).deaden = true;
					getGem( x + 4, y).deaden = true;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.solve5col = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < CInit.BOARD_ROWS; ++y) {
		for( var x = 0; x < CInit.BOARD_COLS; ++x) {
			var gemObj = getGem( x, y);
			if( !gemObj.deaden) {
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				if( countDown == 4) {
					this.tweenGemPos( getGem( x, y), x, y + 2, this.speedSwapGems);
					this.tweenGemPos( getGem( x, y + 1), x, y + 2, this.speedSwapGems);
					this.tweenGemPos( getGem( x, y + 3), x, y + 2, this.speedSwapGems);
					this.tweenGemPos( getGem( x, y + 4), x, y + 2, this.speedSwapGems);
					getGem( x, y).deaden = true;
					getGem( x, y + 1).deaden = true;
					getGem( x, y + 3).deaden = true;
					getGem( x, y + 4).deaden = true;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.swapGemPosition = function( gem1, gem2)
{
	var posX = gem1.posX;
	var posY = gem1.posY;
	setGemPos( gem1, gem2.posX, gem2.posY);
	setGemPos( gem2, posX, posY);
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.canMove = function( fromX, fromY, toX, toY)
{
	if(( toX < 0) || (toX >= CInit.BOARD_COLS) || (toY < 0) || (toY >= CInit.BOARD_ROWS)) {
		return false;
	}

	if(( fromX == toX) && (fromY == toY)) {
		return false;
	}

	return true;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.getMove = function( fromX, fromY, toX, toY)
{
	var x = fromX - toX;
	var y = fromY - toY;
	var length = Math.sqrt( x*x + y*y);
	var angle = Math.acos( x / length) * 180 / Math.PI;
	length /= CInit.GEM_SIZE_SPACED;

	if( length < this.dragLength) {
		return -1;
	}

	if( y < 0) {
		angle = 360 - angle;
	}

	if( this.FOURDIRECTIONS == this.dragDirections) {
		angle -= 45;

		if( angle < 0) {
			angle += 360;
		}

		return 1 + 2 * Math.floor( angle / 90);
	} else if( this.EIGHTDIRECTIONS == this.dragDirections) {
		angle -= 22.5;

		if( angle < 0) {
			angle += 360;
		}

		return Math.floor( angle / 45);
	}

	return -1;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.countSameColorGems = function( gemObj, moveX, moveY)
{
	var x = gemObj.posX + moveX;
	var y = gemObj.posY + moveY;
	var count = 0;

	while(( x >= 0) && (y >= 0) && (x < CInit.BOARD_COLS) && (y < CInit.BOARD_ROWS) && (!getGem( x, y).deaden) && (this.getGemColor( getGem( x, y)) === this.getGemColor( gemObj))) {
		++count;
		x += moveX;
		y += moveY;
	}

	return count;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.getGemColor = function( gemObj)
{
	return gemObj.frame;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.removeKilledGems = function()
{
	CInit.gems.forEach( function( gem) {
		if( gem.deaden) {
			gem.kill();
			gem.deaden = false;
			gem.alpha = 1;
			setGemPos( gem, -1, -1);
		}
	});
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.dropGems = function( callback)
{
	var dropRowCountMax = 0;

	for( var x = 0; x < CInit.BOARD_COLS; ++x) {
		var dropRowCount = 0;

		for( var y = CInit.BOARD_ROWS - 1; y >= 0; --y) {
			var gemObj = getGem( x, y);

			if( gemObj === null) {
				++dropRowCount;
			} else if( dropRowCount > 0) {
				setGemPos( gemObj, gemObj.posX, gemObj.posY + dropRowCount);
				this.tweenGemPos( gemObj, gemObj.posX, gemObj.posY, dropRowCount);
			}
		}

		dropRowCountMax = Math.max( dropRowCount, dropRowCountMax);
	}

	this.game.time.events.add( dropRowCountMax * 100, function() {
		callback.apply( this);
	});
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.refillBoard = function( callback)
{
	var maxGemsMissingFromCol = 0;

	for( var x = 0; x < CInit.BOARD_COLS; ++x) {
		var gemsMissingFromCol = 0;

		for( var y = CInit.BOARD_ROWS - 1; y >= 0; --y) {
			var gem = getGem( x, y);

			if( gem === null) {
				++gemsMissingFromCol;
				gem = CInit.gems.getFirstDead();
				gem.reset( x * CInit.GEM_SIZE_SPACED, -gemsMissingFromCol * CInit.GEM_SIZE_SPACED);
				gem.deaden = false;
				gem.alpha = 1;
				randomizeGemColor( gem);
				setGemPos( gem, x, y);
				this.tweenGemPos( gem, gem.posX, gem.posY, gemsMissingFromCol * 2);
			}
		}

		maxGemsMissingFromCol = Math.max( maxGemsMissingFromCol, gemsMissingFromCol);
	}

	this.game.time.events.add( maxGemsMissingFromCol * 2 * 100, function() {
		callback.apply( this);
	});
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.tweenGemPos = function( gem, newPosX, newPosY, durationMultiplier, callback)
{
	if( durationMultiplier === null || typeof durationMultiplier === 'undefined') {
		durationMultiplier = 1;
	}

	if( typeof callback !== 'undefined') {
		setTimeout( function() {
			callback();
		}, 100 * durationMultiplier + 100);
	}

	return this.game.add.tween( gem).to({
		x: newPosX * CInit.GEM_SIZE_SPACED,
		y: newPosY * CInit.GEM_SIZE_SPACED},
		100 * durationMultiplier, Phaser.Easing.Linear.None, true);
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.fadeoutGem = function( gem, durationMultiplier, callback)
{
	if( durationMultiplier === null || typeof durationMultiplier === 'undefined') {
		durationMultiplier = 1;
	}

	if( typeof callback !== 'undefined') {
		setTimeout( function() {
			callback();
		}, 100 * durationMultiplier + 100);
	}

	return this.game.add.tween( gem).to({
		alpha: 0},
		100 * durationMultiplier, Phaser.Easing.Linear.None, true);
}

// ---------------------------------------------------------------------------------------
// eof
