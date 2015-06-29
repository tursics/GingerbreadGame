// ---------------------------------------------------------------------------------------
// class for solving the gems
// ---------------------------------------------------------------------------------------

function CSolve( init, board, score)
{
	this.init = init;
	this.board = board;
	this.score = score;
	this.solveVec;

	try {
		this.solveVec = new Array();
		this.solveVec.push( this.solveStripedStriped);
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

CSolve.prototype.solveGemsAtPos = function( posX, posY, altX, altY)
{
	var solved = false;
	for( var s = 0; s < this.solveVec.length; ++s) {
		solved = this.solveVec[ s].apply( this, [posX, posY, altX, altY]) || solved;
	}

	return solved;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveStripedGems = function( startX, startY)
{
	var solved = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			if(( x == startX) && (y == startY)) {
				continue;
			}
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.DEADEN) {
				if(( this.board.OFFSET_STRIPES_H <= gemObj.frame) && (gemObj.frame < (this.board.OFFSET_STRIPES_H + this.board.MAX_COLOR))) {
					for( var posX = 0; posX < this.board.MAX_COL; ++posX) {
						if( this.board.getGemObj( posX, y).mark == this.init.VOID) {
							this.animateFadeout( posX, y, this.score.GEM);
							solved = true;
						}
					}
				} else if(( this.board.OFFSET_STRIPES_V <= gemObj.frame) && (gemObj.frame < (this.board.OFFSET_STRIPES_V + this.board.MAX_COLOR))) {
					for( var posY = 0; posY < this.board.MAX_ROW; ++posY) {
						if( this.board.getGemObj( x, posY).mark == this.init.VOID) {
							this.animateFadeout( x, posY, this.score.GEM);
							solved = true;
						}
					}
				}
			}
		}
	}

	if( solved) {
		this.solveStripedGems();
	}
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveSquare = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM_SQUARE);
					this.score.scoreGem( x, y + 1, this.score.GEM);
					this.score.scoreGem( x + 1, y, this.score.GEM);
					this.score.scoreGem( x + 1, y + 1, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveLTopLeft = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM_L);
					this.score.scoreGem( x, y + 1, this.score.GEM);
					this.score.scoreGem( x, y + 2, this.score.GEM);
					this.score.scoreGem( x + 1, y, this.score.GEM);
					this.score.scoreGem( x + 2, y, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveTTop = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM_T);
					this.score.scoreGem( x, y + 1, this.score.GEM);
					this.score.scoreGem( x, y + 2, this.score.GEM);
					this.score.scoreGem( x - 1, y, this.score.GEM);
					this.score.scoreGem( x + 1, y, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveTRight = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM_T);
					this.score.scoreGem( x, y - 1, this.score.GEM);
					this.score.scoreGem( x, y + 1, this.score.GEM);
					this.score.scoreGem( x - 1, y, this.score.GEM);
					this.score.scoreGem( x - 2, y, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveTBottom = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM_T);
					this.score.scoreGem( x, y - 1, this.score.GEM);
					this.score.scoreGem( x, y - 2, this.score.GEM);
					this.score.scoreGem( x - 1, y, this.score.GEM);
					this.score.scoreGem( x + 1, y, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveTLeft = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM_T);
					this.score.scoreGem( x, y - 1, this.score.GEM);
					this.score.scoreGem( x, y + 1, this.score.GEM);
					this.score.scoreGem( x + 1, y, this.score.GEM);
					this.score.scoreGem( x + 2, y, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveLTopRight = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM_L);
					this.score.scoreGem( x, y + 1, this.score.GEM);
					this.score.scoreGem( x, y + 2, this.score.GEM);
					this.score.scoreGem( x - 1, y, this.score.GEM);
					this.score.scoreGem( x - 1, y, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveLBottomLeft = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM_L);
					this.score.scoreGem( x, y - 1, this.score.GEM);
					this.score.scoreGem( x, y - 2, this.score.GEM);
					this.score.scoreGem( x + 1, y, this.score.GEM);
					this.score.scoreGem( x + 2, y, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveLBottomRight = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM_L);
					this.score.scoreGem( x, y - 1, this.score.GEM);
					this.score.scoreGem( x, y - 2, this.score.GEM);
					this.score.scoreGem( x - 1, y, this.score.GEM);
					this.score.scoreGem( x - 2, y, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve3row = function( posX, posY, altX, altY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				if( countRight == 2) {
					this.animateFadeout( x + 0, y, this.score.GEM);
					this.animateFadeout( x + 1, y, this.score.GEM);
					this.animateFadeout( x + 2, y, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve3col = function( posX, posY, altX, altY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				if( countDown == 2) {
					this.animateFadeout( x, y + 0, this.score.GEM);
					this.animateFadeout( x, y + 1, this.score.GEM);
					this.animateFadeout( x, y + 2, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve4row = function( posX, posY, altX, altY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countRight = this.countSameColorGems( gemObj, 1, 0);
				if( countRight == 3) {
					if(((( x + 2) == posX) && (y == posY)) || ((( x + 2) == altX) && (y == altY))) {
						if(( this.board.OFFSET_NORMAL <= this.board.getGemObj( x + 2, y).frame) && (this.board.getGemObj( x + 2, y).frame < (this.board.OFFSET_NORMAL + this.board.MAX_COLOR))) {
							this.animateMove( x + 0, y, x + 2, y, this.score.GEM);
							this.animateMove( x + 1, y, x + 2, y, this.score.GEM);
							this.animateFace( x + 2, y, this.board.OFFSET_STRIPES_V, this.score.GEM_FOUR);
							this.animateMove( x + 3, y, x + 2, y, this.score.GEM);
						} else {
							this.animateFadeout( x + 0, y, this.score.GEM);
							this.animateFadeout( x + 1, y, this.score.GEM);
							this.animateFadeout( x + 2, y, this.score.GEM);
							this.animateFadeout( x + 3, y, this.score.GEM);
						}
					} else {
						if(( this.board.OFFSET_NORMAL <= this.board.getGemObj( x + 1, y).frame) && (this.board.getGemObj( x + 1, y).frame < (this.board.OFFSET_NORMAL + this.board.MAX_COLOR))) {
							this.animateMove( x + 0, y, x + 1, y, this.score.GEM);
							this.animateFace( x + 1, y, this.board.OFFSET_STRIPES_V, this.score.GEM_FOUR);
							this.animateMove( x + 2, y, x + 1, y, this.score.GEM);
							this.animateMove( x + 3, y, x + 1, y, this.score.GEM);
						} else {
							this.animateFadeout( x + 0, y, this.score.GEM);
							this.animateFadeout( x + 1, y, this.score.GEM);
							this.animateFadeout( x + 2, y, this.score.GEM);
							this.animateFadeout( x + 3, y, this.score.GEM);
						}
					}

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve4col = function( posX, posY, altX, altY)
{
	var ret = false;

	for( var y = 0; y < this.board.MAX_ROW; ++y) {
		for( var x = 0; x < this.board.MAX_COL; ++x) {
			var gemObj = this.board.getGemObj( x, y);
			if( gemObj.mark == this.init.VOID) {
				var countDown = this.countSameColorGems( gemObj, 0, 1);
				if( countDown == 3) {
					if((( x == posX) && ((y + 2) == posY)) || (( x == altX) && ((y + 2) == altY))) {
						if(( this.board.OFFSET_NORMAL <= this.board.getGemObj( x, y + 2).frame) && (this.board.getGemObj( x, y + 2).frame < (this.board.OFFSET_NORMAL + this.board.MAX_COLOR))) {
							this.animateMove( x, y + 0, x, y + 2, this.score.GEM);
							this.animateMove( x, y + 1, x, y + 2, this.score.GEM);
							this.animateFace( x, y + 2, this.board.OFFSET_STRIPES_H, this.score.GEM_FOUR);
							this.animateMove( x, y + 3, x, y + 2, this.score.GEM);
						} else {
							this.animateFadeout( x, y + 0, this.score.GEM);
							this.animateFadeout( x, y + 1, this.score.GEM);
							this.animateFadeout( x, y + 2, this.score.GEM);
							this.animateFadeout( x, y + 3, this.score.GEM);
						}
					} else {
						if(( this.board.OFFSET_NORMAL <= this.board.getGemObj( x, y + 1).frame) && (this.board.getGemObj( x, y + 1).frame < (this.board.OFFSET_NORMAL + this.board.MAX_COLOR))) {
							this.animateMove( x, y + 0, x, y + 1, this.score.GEM);
							this.animateFace( x, y + 1, this.board.OFFSET_STRIPES_H, this.score.GEM_FOUR);
							this.animateMove( x, y + 2, x, y + 1, this.score.GEM);
							this.animateMove( x, y + 3, x, y + 1, this.score.GEM);
						} else {
							this.animateFadeout( x, y + 0, this.score.GEM);
							this.animateFadeout( x, y + 1, this.score.GEM);
							this.animateFadeout( x, y + 2, this.score.GEM);
							this.animateFadeout( x, y + 3, this.score.GEM);
						}
					}

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveCross = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM_CROSS);
					this.score.scoreGem( x, y - 1, this.score.GEM);
					this.score.scoreGem( x, y + 1, this.score.GEM);
					this.score.scoreGem( x - 1, y, this.score.GEM);
					this.score.scoreGem( x + 1, y, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve5row = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM);
					this.score.scoreGem( x + 1, y, this.score.GEM);
					this.score.scoreGem( x + 2, y, this.score.GEM_FIVE);
					this.score.scoreGem( x + 3, y, this.score.GEM);
					this.score.scoreGem( x + 4, y, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solve5col = function( posX, posY, altX, altY)
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
					this.score.scoreGem( x, y, this.score.GEM);
					this.score.scoreGem( x, y + 1, this.score.GEM);
					this.score.scoreGem( x, y + 2, this.score.GEM_FIVE);
					this.score.scoreGem( x, y + 3, this.score.GEM);
					this.score.scoreGem( x, y + 4, this.score.GEM);

					ret = true;
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.solveStripedStriped = function( posX, posY, altX, altY)
{
	var ret = false;

	if(( 0 <= posX) && (posX < this.board.MAX_COL) && (0 <= posY) && (posY < this.board.MAX_ROW)) {
		if(( 0 <= altX) && (altX < this.board.MAX_COL) && (0 <= altY) && (altY < this.board.MAX_ROW)) {
			if(( posX != altX) || (posY != altY)) {
				var gemObj = this.board.getGemObj( posX, posY);
				if((( this.board.OFFSET_STRIPES_H <= gemObj.frame) && (gemObj.frame < (this.board.OFFSET_STRIPES_H + this.board.MAX_COLOR))) || (( this.board.OFFSET_STRIPES_V <= gemObj.frame) && (gemObj.frame < (this.board.OFFSET_STRIPES_V + this.board.MAX_COLOR)))) {
					var altObj = this.board.getGemObj( altX, altY);
					if((( this.board.OFFSET_STRIPES_H <= altObj.frame) && (altObj.frame < (this.board.OFFSET_STRIPES_H + this.board.MAX_COLOR))) || (( this.board.OFFSET_STRIPES_V <= altObj.frame) && (altObj.frame < (this.board.OFFSET_STRIPES_V + this.board.MAX_COLOR)))) {
						if( this.board.getGemObj( altX, altY).mark == this.init.VOID) {
							this.animateFaceFadeout( altX, altY, this.board.OFFSET_NORMAL, this.score.GEM);
						}
						ret = true;
						for( var x = 0; x < this.board.MAX_COL; ++x) {
							if( this.board.getGemObj( x, posY).mark == this.init.VOID) {
								this.animateFadeout( x, posY, this.score.GEM);
							}
						}
						for( var y = 0; y < this.board.MAX_ROW; ++y) {
							if( this.board.getGemObj( posX, y).mark == this.init.VOID) {
								this.animateFadeout( posX, y, this.score.GEM);
							}
						}
					}
				}
			}
		}
	}

	return ret;
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.animateFadeout = function( posX, posY, score)
{
	var gemObj = this.board.getGemObj( posX, posY);

	this.board.fadeoutGem( gemObj, this.speedSwapGems);
	gemObj.mark = this.init.DEADEN;

	if( score > 0) {
		this.score.scoreGem( posX, posY, score);
	}
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.animateMove = function( posX, posY, endX, endY, score)
{
	var gemObj = this.board.getGemObj( posX, posY);

	if(( this.board.OFFSET_NORMAL <= gemObj.frame) && (gemObj.frame < (this.board.OFFSET_NORMAL + this.board.MAX_COLOR))) {
		this.board.tweenGemPos( gemObj, endX, endY, this.speedSwapGems);
		gemObj.mark = this.init.DEADEN;

		if( score > 0) {
			this.score.scoreGem( posX, posY, score);
		}
	} else {
		this.animateFadeout( posX, posY, score);
	}
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.animateFace = function( posX, posY, faceOffset, score)
{
	var gemObj = this.board.getGemObj( posX, posY);

	if(( faceOffset == this.board.OFFSET_STRIPES_H) || (faceOffset == this.board.OFFSET_STRIPES_V)) {
		gemObj.frame = faceOffset + (gemObj.frame % this.board.MAX_COLOR);
	}

	gemObj.bringToTop();
	gemObj.mark = this.init.BUSY;

	if( score > 0) {
		this.score.scoreGem( posX, posY, score);
	}
}

// ---------------------------------------------------------------------------------------

CSolve.prototype.animateFaceFadeout = function( posX, posY, faceOffset, score)
{
	var gemObj = this.board.getGemObj( posX, posY);

	if( faceOffset == this.board.OFFSET_NORMAL) {
		gemObj.frame = faceOffset + (gemObj.frame % this.board.MAX_COLOR);
	}

	gemObj.mark = this.init.DEADEN;

	if( score > 0) {
		this.score.scoreGem( posX, posY, score);
	}
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
	return gemObj.frame % this.board.MAX_COLOR;
}

// ---------------------------------------------------------------------------------------
// eof
