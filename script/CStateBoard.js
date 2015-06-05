// ---------------------------------------------------------------------------------------
// state to display game board
// ---------------------------------------------------------------------------------------

function CStateBoard( inits, game)
{
	// variable
	this.inits = inits;
	this.game = game;
	this.scoreText = null;

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
		this.game.add.sprite( 0, 0, 'sky');

		this.scoreText = this.game.add.text( 592, 16, _('board_score') + ' 0', { fontSize: '16px', fill: '#000' });

		this.inits.board = new CBoard( this.inits, this.game);
		this.inits.touch = new CTouchLevel( this.inits, this.game, this.inits.board);

		this.inits.board.spawnBoard( this.inits.touch, this.inits.level.levels[0]);
		this.inits.touch.thaw();
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateBoard creation error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------
// eof
