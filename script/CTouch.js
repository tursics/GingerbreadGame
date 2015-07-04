// ---------------------------------------------------------------------------------------
// class for touch input
// ---------------------------------------------------------------------------------------

function CTouchLevel( init, game, board, score)
{
	this.FOURDIRECTIONS = 4;
	this.EIGHTDIRECTIONS = 8;

	this.init = init;
	this.game = game;
	this.board = board;
	this.score = score;
	this.freezeCount = 0;
	this.selectedGemObj = null;
	this.selectedGemPos;
	this.selectedGemTween = null;
	this.swappedGemObj = null;

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
	} catch(e) {
		console.error( 'CTouchLevel not ready', e);
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
			this.swappedGemObj = this.board.getGemObj( posX, posY);

			this.freeze();

			this.init.gems.bringToTop( gemObj);

			if( this.selectedGemTween !== null) {
				this.game.tweens.remove( this.selectedGemTween);
			}
			this.selectedGemTween = this.board.tweenGemPos( gemObj, posX, posY, this.speedSwapGems);
			this.board.tweenGemPos( this.swappedGemObj, gemObj.posX, gemObj.posY, this.speedSwapGems, function() {
				touch.board.swapGemPosition( gemObj, touch.swappedGemObj);

				touch.board.garbageCollection( touch, gemObj, function() {
					touch.thaw();

					if( 0 == touch.score.moves) {
						touch.game.state.start( 'levels');
					}
				});
			});
		}
	}
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.canMove = function( fromX, fromY, toX, toY)
{
	if(( toX < 0) || (toX >= this.board.MAX_COL) || (toY < 0) || (toY >= this.board.MAX_ROW)) {
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
	length /= this.init.GEM_SIZE_SPACED;

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
// eof
