//--------------------------------
//---         CInit.js         ---
//--------------------------------

function CInit()
{
	// configurable
	this.GEM_SIZE = 64;
	this.GEM_SPACING = 2;
	this.GEM_SIZE_SPACED = this.GEM_SIZE + this.GEM_SPACING;

	// const
	this.VOID = 0;
	this.DEADEN = 1;
	this.BUSY = 2;

	// variable
	this.game = null;
	this.gems = null;
	this.board = null;
	this.touch = null;

	try {
	} catch(e) {
		console.error( 'CInit not ready', e);
	}
}

// ---------------------------------------------------------------------------------------

CInit.prototype.eventReady = function()
{
	try {
		this.game = new Phaser.Game( 800, 600, Phaser.AUTO, '');

		this.game.state.add( 'boot', new CStateBoot( this, this.game));
		this.game.state.add( 'board', new CStateBoard( this, this.game));
		this.game.state.add( 'load', new CStateLoad( this, this.game));

		this.game.state.start( 'boot');

//		MyField.eventReady();
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CInit could not start', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CInit.prototype.eventResize = function()
{
	try {
		MyField.eventResize();
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CInit resize error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------
// eof
