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

		var buttonPause = this.game.add.sprite( 650, 480, 'buttonPause');
//		buttonPause.anchor.set( .5);
		buttonPause.inputEnabled = true;
		buttonPause.events.onInputDown.add( this.eventPauseDown, this);
		buttonPause.events.onInputUp.add( this.eventPauseUp, this);

		this.inits.board.spawnBoard( this.inits.touch, this.inits.level.levels[1]);
		this.inits.touch.thaw();
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateBoard creation error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateBoard.prototype.eventPauseDown = function( item)
{
//	item.fill = '#ffff44';
}

// ---------------------------------------------------------------------------------------

CStateBoard.prototype.eventPauseUp = function( item)
{
//	item.fill = '#ffffff';

	this.game.state.start( 'welcome');
}

// ---------------------------------------------------------------------------------------
// eof
