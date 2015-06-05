// ---------------------------------------------------------------------------------------
// class for solving the gems
// ---------------------------------------------------------------------------------------

function CSolve( init, board)
{
	this.init = init;
	this.board = board;
	this.solveVec;

	try {
		this.solveVec = new Array();
		this.solveVec.push( this.solve5row);
		this.solveVec.push( this.solve5col);
		this.solveVec.push( this.solveCross);
		this.solveVec.push( this.solveSquare);
		this.solveVec.push( this.solveLTopLeft);
		this.solveVec.push( this.solveLTopRight);
		this.solveVec.push( this.solveLBottomLeft);
		this.solveVec.push( this.solveLBottomRight);
		this.solveVec.push( this.solveTTop);
		this.solveVec.push( this.solveTRight);
		this.solveVec.push( this.solveTBottom);
		this.solveVec.push( this.solveTLeft);
		this.solveVec.push( this.solve4row);
		this.solveVec.push( this.solve4col);
		this.solveVec.push( this.solve3row);
		this.solveVec.push( this.solve3col);
	} catch(e) {
		console.error( 'CSolve not ready');
	}
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveGemsAtPos = function( x, y)
{
	var solved = false;
	for( var s = 0; s < this.solveVec.length; ++s) {
		solved = this.solveVec[ s].apply( this, [x, y]) || solved;
	}

	return solved;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveSquare = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				var countCross = this.countSameColorGems( gemObj, 1, 1);
				if(( countRight >= 1) && (countDown >= 1) && (countCross >= 1)) {
					this.board.tweenGemPos( this.board.getGemObj( x, y + 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 1, y), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 1, y + 1), x, y, this.speedSwapGems);
					this.board.getGemObj( x, y).mark = this.init.BUSY;
					this.board.getGemObj( x, y + 1).mark = this.init.DEADEN;
					this.board.getGemObj( x + 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 1, y + 1).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveLTopLeft = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				if(( countRight >= 2) && (countDown >= 2)) {
					this.board.tweenGemPos( this.board.getGemObj( x, y + 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y + 2), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 1, y), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 2, y), x, y, this.speedSwapGems);
					this.board.getGemObj( x, y).deaden = this.init.BUSY;
					this.board.getGemObj( x, y + 1).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 2).mark = this.init.DEADEN;
					this.board.getGemObj( x + 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 2, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveTTop = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				var countLeft = this.countSameColorGems( gemObj, -1, 0);
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				if(( countRight >= 1) && (countLeft >= 1) && (countDown >= 2)) {
					this.board.tweenGemPos( this.board.getGemObj( x, y + 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y + 2), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x - 1, y), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 1, y), x, y, this.speedSwapGems);
					this.board.getGemObj( x, y).deaden = this.init.BUSY;
					this.board.getGemObj( x, y + 1).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 2).mark = this.init.DEADEN;
					this.board.getGemObj( x - 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 1, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveTRight = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countLeft = this.countSameColorGems( gemObj, -1, 0);
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				var countTop = this.countSameColorGems( gemObj, 0, -1);
				if(( countTop >= 1) && (countDown >= 1) && (countLeft >= 2)) {
					this.board.tweenGemPos( this.board.getGemObj( x, y - 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y + 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x - 1, y), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x - 2, y), x, y, this.speedSwapGems);
					this.board.getGemObj( x, y).deaden = this.init.BUSY;
					this.board.getGemObj( x, y - 1).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 1).mark = this.init.DEADEN;
					this.board.getGemObj( x - 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x - 2, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveTBottom = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				var countLeft = this.countSameColorGems( gemObj, -1, 0);
				var countTop = this.countSameColorGems( gemObj, 0, -1);
				if(( countRight >= 1) && (countLeft >= 1) && (countTop >= 2)) {
					this.board.tweenGemPos( this.board.getGemObj( x, y - 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y - 2), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x - 1, y), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 1, y), x, y, this.speedSwapGems);
					this.board.getGemObj( x, y).deaden = this.init.BUSY;
					this.board.getGemObj( x, y - 1).mark = this.init.DEADEN;
					this.board.getGemObj( x, y - 2).mark = this.init.DEADEN;
					this.board.getGemObj( x - 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 1, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveTLeft = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				var countTop = this.countSameColorGems( gemObj, 0, -1);
				if(( countTop >= 1) && (countDown >= 1) && (countRight >= 2)) {
					this.board.tweenGemPos( this.board.getGemObj( x, y - 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y + 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 1, y), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 2, y), x, y, this.speedSwapGems);
					this.board.getGemObj( x, y).deaden = this.init.BUSY;
					this.board.getGemObj( x, y - 1).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 1).mark = this.init.DEADEN;
					this.board.getGemObj( x + 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 2, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveLTopRight = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countLeft = this.countSameColorGems( gemObj, -1, 0);
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				if(( countLeft >= 2) && (countDown >= 2)) {
					this.board.tweenGemPos( this.board.getGemObj( x, y + 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y + 2), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x - 1, y), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x - 2, y), x, y, this.speedSwapGems);
					this.board.getGemObj( x, y).deaden = this.init.BUSY;
					this.board.getGemObj( x, y + 1).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 2).mark = this.init.DEADEN;
					this.board.getGemObj( x - 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x - 2, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveLBottomLeft = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				var countTop = this.countSameColorGems( gemObj, 0, -1);
				if(( countRight >= 2) && (countTop >= 2)) {
					this.board.tweenGemPos( this.board.getGemObj( x, y - 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y - 2), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 1, y), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 2, y), x, y, this.speedSwapGems);
					this.board.getGemObj( x, y).deaden = this.init.BUSY;
					this.board.getGemObj( x, y - 1).mark = this.init.DEADEN;
					this.board.getGemObj( x, y - 2).mark = this.init.DEADEN;
					this.board.getGemObj( x + 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 2, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveLBottomRight = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countLeft = this.countSameColorGems( gemObj, -1, 0);
				var countTop = this.countSameColorGems( gemObj, 0, -1);
				if(( countLeft >= 2) && (countTop >= 2)) {
					this.board.tweenGemPos( this.board.getGemObj( x, y - 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y - 2), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x - 1, y), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x - 2, y), x, y, this.speedSwapGems);
					this.board.getGemObj( x, y).deaden = this.init.BUSY;
					this.board.getGemObj( x, y - 1).mark = this.init.DEADEN;
					this.board.getGemObj( x, y - 2).mark = this.init.DEADEN;
					this.board.getGemObj( x - 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x - 2, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve3row = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				if( countRight == 2) {
					this.board.fadeoutGem( this.board.getGemObj( x, y), this.speedSwapGems);
					this.board.fadeoutGem( this.board.getGemObj( x + 1, y), this.speedSwapGems);
					this.board.fadeoutGem( this.board.getGemObj( x + 2, y), this.speedSwapGems);
					this.board.getGemObj( x, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 2, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve3col = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				if( countDown == 2) {
					this.board.fadeoutGem( this.board.getGemObj( x, y), this.speedSwapGems);
					this.board.fadeoutGem( this.board.getGemObj( x, y + 1), this.speedSwapGems);
					this.board.fadeoutGem( this.board.getGemObj( x, y + 2), this.speedSwapGems);
					this.board.getGemObj( x, y).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 1).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 2).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve4row = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				if( countRight == 3) {
					this.board.tweenGemPos( this.board.getGemObj( x, y), x + 1, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 2, y), x + 1, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 3, y), x + 1, y, this.speedSwapGems);
					this.board.getGemObj( x, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 1, y).mark = this.init.BUSY;
					this.board.getGemObj( x + 2, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 3, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve4col = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				if( countDown == 3) {
					this.board.tweenGemPos( this.board.getGemObj( x, y), x, y + 1, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y + 2), x, y + 1, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y + 3), x, y + 1, this.speedSwapGems);
					this.board.getGemObj( x, y).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 1).mark = this.init.BUSY;
					this.board.getGemObj( x, y + 2).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 3).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveCross = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				var countLeft = this.countSameColorGems( gemObj, -1, 0);
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				var countTop = this.countSameColorGems( gemObj, 0, -1);
				if(( countRight >= 1) && (countLeft >= 1) && (countDown >= 1) && (countTop >= 1)) {
					this.board.tweenGemPos( this.board.getGemObj( x, y - 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y + 1), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x - 1, y), x, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 1, y), x, y, this.speedSwapGems);
					this.board.getGemObj( x, y).mark = this.init.BUSY;
					this.board.getGemObj( x, y - 1).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 1).mark = this.init.DEADEN;
					this.board.getGemObj( x - 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 1, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve5row = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				if( countRight == 4) {
					this.board.tweenGemPos( this.board.getGemObj( x, y), x + 2, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 1, y), x + 2, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 3, y), x + 2, y, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x + 4, y), x + 2, y, this.speedSwapGems);
					this.board.getGemObj( x, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 1, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 2, y).mark = this.init.BUSY;
					this.board.getGemObj( x + 3, y).mark = this.init.DEADEN;
					this.board.getGemObj( x + 4, y).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve5col = function( posX, posY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				if( countDown == 4) {
					this.board.tweenGemPos( this.board.getGemObj( x, y), x, y + 2, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y + 1), x, y + 2, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y + 3), x, y + 2, this.speedSwapGems);
					this.board.tweenGemPos( this.board.getGemObj( x, y + 4), x, y + 2, this.speedSwapGems);
					this.board.getGemObj( x, y).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 1).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 2).mark = this.init.BUSY;
					this.board.getGemObj( x, y + 3).mark = this.init.DEADEN;
					this.board.getGemObj( x, y + 4).mark = this.init.DEADEN;

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.countSameColorGems = function( gemObj, moveX, moveY)
{
	var x = gemObj.posX + moveX;
	var y = gemObj.posY + moveY;
	var count = 0;

	while(( x >= 0) && (y >= 0) && (x < this.board.MAX_COL) && (y < this.board.MAX_ROW) && (this.board.getGemObj( x, y).mark == this.init.VOID) && (this.getGemColor( this.board.getGemObj( x, y)) === this.getGemColor( gemObj))) {
		++count;
		x += moveX;
		y += moveY;
	}

	return count;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.getGemColor = function( gemObj)
{
	return gemObj.frame;
}

// ---------------------------------------------------------------------------------------
// eof
