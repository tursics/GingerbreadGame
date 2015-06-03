// ---------------------------------------------------------------------------------------
// class for board full of gems
// ---------------------------------------------------------------------------------------

function CBoard( game)
{
	// configurable
	this.MAX_COL = 8;
	this.MAX_ROW = 8;

	this.game = game;
	this.solve;

	try {
		this.solve = new CSolve( this);
	} catch(e) {
		console.error( 'CBoard not ready');
	}
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.spawnBoard = function( touch)
{
	CInit.gems = CInit.game.add.group();

	for( var x = 0; x < this.MAX_COL; ++x) {
		for( var y = 0; y < this.MAX_ROW; ++y) {
			var gem = CInit.gems.create( x * CInit.GEM_SIZE_SPACED, y * CInit.GEM_SIZE_SPACED, 'GEMS');
			gem.name = 'gem' + x.toString() + 'x' + y.toString();
			gem.mark = CInit.VOID;
			gem.alpha = 1;
			gem.inputEnabled = true;
			touch.addGem( gem);
			this.randomizeGemColor( gem);
			this.setGemPos( gem, x, y);
		}
	}

	this.garbageCollection( touch, null, function() {
	});
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.garbageCollection = function( touch, gemObj, callback)
{
	var board = this;

	touch.freeze();

	board.solveBoard( touch, gemObj, function( dirty) {
		board.killGems();

		board.dropGems( function() {
			board.refillBoard( function() {
				touch.thaw();

				if( dirty) {
					board.garbageCollection( touch, null, callback);
				} else {
					try {
						callback.apply( this);
					} catch(e) {
						console.error( 'CBoard callback error', e);
					}
				}
			});
		});
	});
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.solveBoard = function( touch, gemObj, callback)
{
	var x = -1;
	var y = -1;
	if( gemObj !== null) {
		x = gemObj.posX;
		y = gemObj.posY;
	}

	var solved = this.solve.solveGemsAtPos( x, y);

	if( solved) {
		setTimeout( function() {
			try {
				callback.apply( this, [true]);
			} catch(e) {
				console.error( 'CBoard callback error', e);
			}
		}, 100 * touch.speedSwapGems + 100);
		return;
	}

	if( gemObj !== null) {
		var board = this;

		if( touch.selectedGemTween !== null) {
			this.game.tweens.remove( touch.selectedGemTween);
		}
		touch.selectedGemTween = this.tweenGemPos( gemObj, touch.selectedGemPos.x, touch.selectedGemPos.y, this.speedSwapGems);
		this.tweenGemPos( touch.swappedGemObj, gemObj.posX, gemObj.posY, this.speedSwapGems, function() {
			board.swapGemPosition( gemObj, touch.swappedGemObj);
			try {
				callback.apply( this, [false]);
			} catch(e) {
				console.error( 'CBoard callback error', e);
			}
		});

		return;
	}

	try {
		callback.apply( this, [false]);
	} catch(e) {
		console.error( 'CBoard callback error', e);
	}
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.killGems = function()
{
	var board = this;

	CInit.gems.forEach( function( gem) {
		if( gem.mark == CInit.DEADEN) {
			gem.kill();
			gem.alpha = 1;
			board.setGemPos( gem, -1, -1);
		}
		gem.mark = CInit.VOID;
	});
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.dropGems = function( callback)
{
	var dropRowCountMax = 0;

	for( var x = 0; x < this.MAX_COL; ++x) {
		var dropRowCount = 0;

		for( var y = this.MAX_ROW - 1; y >= 0; --y) {
			var gemObj = this.getGemObj( x, y);

			if( gemObj === null) {
				++dropRowCount;
			} else if( dropRowCount > 0) {
				this.setGemPos( gemObj, gemObj.posX, gemObj.posY + dropRowCount);
				this.tweenGemPos( gemObj, gemObj.posX, gemObj.posY, dropRowCount);
			}
		}

		dropRowCountMax = Math.max( dropRowCount, dropRowCountMax);
	}

	this.game.time.events.add( dropRowCountMax * 100, function() {

	try {
		callback.apply( this);
	} catch(e) {
		console.error( 'CBoard callback error', e);
	}
	});
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.refillBoard = function( callback)
{
	var maxGemsMissingFromCol = 0;

	for( var x = 0; x < this.MAX_COL; ++x) {
		var gemsMissingFromCol = 0;

		for( var y = this.MAX_ROW - 1; y >= 0; --y) {
			var gemObj = this.getGemObj( x, y);

			if( gemObj === null) {
				++gemsMissingFromCol;
				gemObj = CInit.gems.getFirstDead();
				gemObj.reset( x * CInit.GEM_SIZE_SPACED, -gemsMissingFromCol * CInit.GEM_SIZE_SPACED);
				gemObj.mark = CInit.VOID;
				gemObj.alpha = 1;
				this.randomizeGemColor( gemObj);
				this.setGemPos( gemObj, x, y);
				this.tweenGemPos( gemObj, gemObj.posX, gemObj.posY, gemsMissingFromCol * 2);
			}
		}

		maxGemsMissingFromCol = Math.max( maxGemsMissingFromCol, gemsMissingFromCol);
	}

	this.game.time.events.add( maxGemsMissingFromCol * 2 * 100, function() {
		try {
			callback.apply( this);
		} catch(e) {
			console.error( 'CBoard callback error', e);
		}
	});
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.swapGemPosition = function( gem1, gem2)
{
	var posX = gem1.posX;
	var posY = gem1.posY;
	this.setGemPos( gem1, gem2.posX, gem2.posY);
	this.setGemPos( gem2, posX, posY);
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.tweenGemPos = function( gemObj, newPosX, newPosY, durationMultiplier, callback)
{
	if( durationMultiplier === null || typeof durationMultiplier === 'undefined') {
		durationMultiplier = 1;
	}

	if( typeof callback !== 'undefined') {
		setTimeout( function() {
			try {
				callback.apply( this);
			} catch(e) {
				console.error( 'CBoard callback error', e);
			}
		}, 100 * durationMultiplier + 100);
	}

	return this.game.add.tween( gemObj).to({
		x: newPosX * CInit.GEM_SIZE_SPACED,
		y: newPosY * CInit.GEM_SIZE_SPACED},
		100 * durationMultiplier, Phaser.Easing.Linear.None, true);
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.fadeoutGem = function( gemObj, durationMultiplier, callback)
{
	if( durationMultiplier === null || typeof durationMultiplier === 'undefined') {
		durationMultiplier = 1;
	}

	if( typeof callback !== 'undefined') {
		setTimeout( function() {
			try {
				callback.apply( this);
			} catch(e) {
				console.error( 'CBoard callback error', e);
			}
		}, 100 * durationMultiplier + 100);
	}

	return this.game.add.tween( gemObj).to({
		alpha: 0},
		100 * durationMultiplier, Phaser.Easing.Linear.None, true);
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.getGemObj = function( posX, posY)
{
	return CInit.gems.iterate( "id", this.calcGemId( posX, posY), Phaser.Group.RETURN_CHILD);
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.setGemPos = function( gemObj, posX, posY)
{
	gemObj.posX = posX;
	gemObj.posY = posY;
	gemObj.id = this.calcGemId( posX, posY);
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.calcGemId = function( posX, posY)
{
	return posX + posY * this.MAX_COL;
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.randomizeGemColor = function( gemObj)
{
	gemObj.frame = CInit.game.rnd.integerInRange( 0, gemObj.animations.frameTotal - 1);
}

// ---------------------------------------------------------------------------------------
// eof
