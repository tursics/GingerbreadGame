// ---------------------------------------------------------------------------------------
// class for touch input
// ---------------------------------------------------------------------------------------

function CTouchLevel( game)
{
	this.game = game;
	this.freezeCount = 0;
	this.selectedGemObj;
	this.selectedGemPos;
	this.selectedGemTween = null;

	try {
		this.freeze();
		this.game.input.addMoveCallback( this.OnDraging, this);

		this.selectedGemObj = null;
		this.selectedGemPos = { x: 0, y: 0 };
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

	console.log( 'Down gem ' + gem.frame + ' at ' + (gem.posX + 1) + 'x' + (gem.posY + 1));
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.OnTouchUpGem = function( gem)
{
	if( this.freezeCount > 0) {
		return;
	}

	console.log( 'Up   gem ' + gem.frame + ' at ' + (gem.posX + 1) + 'x' + (gem.posY + 1));

	// when the mouse is released with a gem selected
	// 1) check for matches
	// 2) remove matched gems
	// 3) drop down gems above removed gems
	// 4) refill the board

	this.checkAndKillGemMatches( gem);

	if( CInit.tempShiftedGem !== null) {
		this.checkAndKillGemMatches( CInit.tempShiftedGem);
	}

	removeKilledGems();

	var dropGemDuration = dropGems();

	// delay board refilling until all existing gems have dropped down
	this.game.time.events.add( dropGemDuration * 100, refillBoard);

	this.freeze();

	this.selectedGemObj = null;
	CInit.tempShiftedGem = null;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.OnDraging = function( pointer, x, y, fromClick)
{
	if( this.selectedGemObj && pointer.isDown) {
		var posX = this.convertCoord2Pos( x);
		var posY = this.convertCoord2Pos( y);

		if( this.canMove( this.selectedGemPos.x, this.selectedGemPos.y, posX, posY)) {
			if( this.selectedGemTween !== null) {
				this.game.tweens.remove( this.selectedGemTween);
			}
			this.selectedGemTween = tweenGemPos( this.selectedGemObj, posX, posY);

console.log( 'Drag gem   to ' + (posX + 1) + 'x' + (posY + 1));
			CInit.gems.bringToTop( this.selectedGemObj);

			// if we moved a gem to make way for the selected gem earlier, move it back into its starting position
			if( CInit.tempShiftedGem !== null) {
				tweenGemPos( CInit.tempShiftedGem, this.selectedGemObj.posX , this.selectedGemObj.posY);
				swapGemPosition( this.selectedGemObj, CInit.tempShiftedGem);
			}

			// when the player moves the selected gem, we need to swap the position of the selected gem with the gem currently in that position 
			CInit.tempShiftedGem = getGem( posX, posY);

			if( CInit.tempShiftedGem === this.selectedGemObj) {
				CInit.tempShiftedGem = null;
			} else {
				tweenGemPos( CInit.tempShiftedGem, this.selectedGemObj.posX, this.selectedGemObj.posY);
				swapGemPosition( this.selectedGemObj, CInit.tempShiftedGem);
			}
		}
	}
}

// ---------------------------------------------------------------------------------------
// count how many gems of the same color are above, below, to the left and right
// if there are more than 3 matched horizontally or vertically, kill those gems
// if no match was made, move the gems back into their starting positions
CTouchLevel.prototype.checkAndKillGemMatches = function( gem, matchedGems)
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
			if( gem.posX !== CInit.touch.selectedGemPos.x || gem.posY !== CInit.touch.selectedGemPos.y) {
				if( this.selectedGemTween !== null) {
					this.game.tweens.remove( this.selectedGemTween);
				}
				this.selectedGemTween = tweenGemPos( gem, CInit.touch.selectedGemPos.x, CInit.touch.selectedGemPos.y);

				if( CInit.tempShiftedGem !== null) {
					tweenGemPos( CInit.tempShiftedGem, gem.posX, gem.posY);
				}

				swapGemPosition( gem, CInit.tempShiftedGem);
			}
		}
	}
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.convertCoord2Pos = function( coordinate)
{
	return Phaser.Math.floor( coordinate / CInit.GEM_SIZE_SPACED);
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

	if(( fromX === toX) && (fromY >= toY - 1) && (fromY <= toY + 1)) {
		return true;
	}

	if(( fromY === toY) && (fromX >= toX - 1) && (fromX <= toX + 1)) {
		return true;
	}

	return false;
}

// ---------------------------------------------------------------------------------------
// eof
