// ---------------------------------------------------------------------------------------
// class for touch input
// ---------------------------------------------------------------------------------------

function CTouchLevel( game)
{
	this.game = game;
	this.freezeCount = 0;

	try {
		this.freeze();
		this.game.input.addMoveCallback( this.OnDraging, this);
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

//	console.log( 'select gem', gem);
	CInit.selectedGem = gem;
	CInit.selectedGemStartPos.x = gem.posX;
	CInit.selectedGemStartPos.y = gem.posY;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.OnTouchUpGem = function( gem)
{
	if( this.freezeCount > 0) {
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

	this.freeze();

	CInit.selectedGem = null;
	CInit.tempShiftedGem = null;
}

// ---------------------------------------------------------------------------------------

CTouchLevel.prototype.OnDraging = function( pointer, x, y, fromClick)
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

// ---------------------------------------------------------------------------------------
// eof
