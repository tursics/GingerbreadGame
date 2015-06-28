// ---------------------------------------------------------------------------------------
// state to display game board
// ---------------------------------------------------------------------------------------

function CStateBoard( inits, game)
{
	// variable
	this.inits = inits;
	this.game = game;
	this.score = null;

	try {
	} catch(e) {
		console.error( 'CStateBoard not ready', e);
	}
}

// ---------------------------------------------------------------------------------------

CStateBoard.prototype.preload = function()
{
	try {
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateBoard preload error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateBoard.prototype.create = function()
{
	try {
		this.game.add.sprite( 0, 0, 'bgBoard');

		this.score = new CScore( this.game);
		this.inits.board = new CBoard( this.inits, this.game, this.score);
		this.inits.touch = new CTouchLevel( this.inits, this.game, this.inits.board);

		this.game.add.button( 650, 480, 'buttonPause', this.eventButtonPause, this, 2, 1, 0);

		this.inits.board.spawnBoard( this.inits.touch, this.inits.level.levels[this.inits.currentLevel]);
		this.inits.touch.thaw();
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateBoard creation error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateBoard.prototype.eventButtonPause = function( item)
{
	this.game.state.start( 'levels');
}

// ---------------------------------------------------------------------------------------
// eof
