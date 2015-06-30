// ---------------------------------------------------------------------------------------
// class for board full of gems
// ---------------------------------------------------------------------------------------

function CBoard( init, game, score)
{
	// configurable
	this.MAX_COL = 8;
	this.MAX_ROW = 8;
	this.MAX_COLOR = 5;
	this.OFFSET_NORMAL = this.MAX_COLOR * 0;
	this.OFFSET_STRIPES_H = this.MAX_COLOR * 1;
	this.OFFSET_STRIPES_V = this.MAX_COLOR * 2;

	this.init = init;
	this.game = game;
	this.score = score;
	this.solve = null;
	this.bgTiles = null;
	this.x = 0;
	this.y = 0;

	try {
		this.solve = new CSolve( this.init, this, this.score);

		var width = this.MAX_COL * this.init.GEM_SIZE_SPACED - this.init.GEM_SPACING;
		var height = this.MAX_ROW * this.init.GEM_SIZE_SPACED - this.init.GEM_SPACING;
		this.x = this.game.world.width - width - this.init.GEM_SIZE / 2;
		this.y = (this.game.world.height - height) / 2;

		this.create();
	} catch(e) {
		console.error( 'CBoard not ready');
	}
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.create = function()
{
	this.bgTiles = this.game.add.group();
	var tile = null;

	for( var x = 0; x < this.MAX_COL; ++x) {
		for( var y = 0; y < this.MAX_ROW; ++y) {
			tile = this.bgTiles.create( this.x + x * this.init.GEM_SIZE_SPACED, this.y + y * this.init.GEM_SIZE_SPACED, 'spriteBoard');
			tile.frame = 0;
		}

		tile = this.bgTiles.create( this.x + x * this.init.GEM_SIZE_SPACED, this.y - this.init.GEM_SIZE_SPACED, 'spriteBoard');
		tile.frame = 7;

		tile = this.bgTiles.create( this.x + x * this.init.GEM_SIZE_SPACED, this.y + this.MAX_ROW * this.init.GEM_SIZE_SPACED, 'spriteBoard');
		tile.frame = 4;
	}

	for( var y = 0; y < this.MAX_ROW; ++y) {
		tile = this.bgTiles.create( this.x - this.init.GEM_SIZE_SPACED, this.y + y * this.init.GEM_SIZE_SPACED, 'spriteBoard');
		tile.frame = 1;

		tile = this.bgTiles.create( this.x + this.MAX_COL * this.init.GEM_SIZE_SPACED, this.y + y * this.init.GEM_SIZE_SPACED, 'spriteBoard');
		tile.frame = 2;
	}

	tile = this.bgTiles.create( this.x - this.init.GEM_SIZE_SPACED, this.y - this.init.GEM_SIZE_SPACED, 'spriteBoard');
	tile.frame = 6;

	tile = this.bgTiles.create( this.x + this.MAX_COL * this.init.GEM_SIZE_SPACED, this.y - this.init.GEM_SIZE_SPACED, 'spriteBoard');
	tile.frame = 8;

	tile = this.bgTiles.create( this.x - this.init.GEM_SIZE_SPACED, this.y + this.MAX_ROW * this.init.GEM_SIZE_SPACED, 'spriteBoard');
	tile.frame = 3;

	tile = this.bgTiles.create( this.x + this.MAX_COL * this.init.GEM_SIZE_SPACED, this.y + this.MAX_ROW * this.init.GEM_SIZE_SPACED, 'spriteBoard');
	tile.frame = 5;
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.spawnBoard = function( touch, level)
{
	this.init.gems = this.init.game.add.group();

	if( level.design.length != this.MAX_ROW) {
		console.error( 'Level design error', level);
		return;
	}
	for( var y = 0; y < this.MAX_ROW; ++y) {
		if( level.design[y].length != this.MAX_COL) {
			console.error( 'Level design error', level);
			return;
		}
	}

	for( var x = 0; x < this.MAX_COL; ++x) {
		for( var y = 0; y < this.MAX_ROW; ++y) {
			var gem = this.init.gems.create( this.x + x * this.init.GEM_SIZE_SPACED, this.y + y * this.init.GEM_SIZE_SPACED, 'GEMS');
			gem.name = 'gem' + x.toString() + 'x' + y.toString();
			gem.mark = this.init.VOID;
			gem.alpha = 1;
			gem.inputEnabled = true;
			touch.addGem( gem);
			this.setGemColor( gem, level.design[y][x]);
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
	var altX = -1;
	var altY = -1;
	if( gemObj !== null) {
		x = gemObj.posX;
		y = gemObj.posY;

		if( touch.swappedGemObj != null) {
			altX = touch.swappedGemObj.posX;
			altY = touch.swappedGemObj.posY;
		}
	}

	var solved = this.solve.solveGemsAtPos( x, y, altX, altY);

	if( solved) {
		this.solve.solveStripedGems( x, y);
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

	this.init.gems.forEach( function( gem) {
		if( gem.mark == board.init.DEADEN) {
			gem.kill();
			gem.alpha = 1;
			board.setGemPos( gem, -1, -1);
		}
		gem.mark = board.init.VOID;
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
				gemObj = this.init.gems.getFirstDead();
				gemObj.reset( this.x + x * this.init.GEM_SIZE_SPACED, this.y - gemsMissingFromCol * this.init.GEM_SIZE_SPACED);
				gemObj.mark = this.init.VOID;
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
		x: this.x + newPosX * this.init.GEM_SIZE_SPACED,
		y: this.y + newPosY * this.init.GEM_SIZE_SPACED},
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
	return this.init.gems.iterate( "id", this.calcGemId( posX, posY), Phaser.Group.RETURN_CHILD);
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
	gemObj.frame = this.game.rnd.integerInRange( 0, this.MAX_COLOR - 1);
}

// ---------------------------------------------------------------------------------------

CBoard.prototype.setGemColor = function( gemObj, item)
{
	if( 'A' == item) {
		gemObj.frame = 0;
	} else if( 'B' == item) {
		gemObj.frame = 1;
	} else if( 'C' == item) {
		gemObj.frame = 2;
	} else if( 'D' == item) {
		gemObj.frame = 3;
	} else if( 'E' == item) {
		gemObj.frame = 4;
	} else {
		this.randomizeGemColor( gemObj);
	}
}

// ---------------------------------------------------------------------------------------
// eof
