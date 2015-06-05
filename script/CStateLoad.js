// ---------------------------------------------------------------------------------------
// state to load all needed assets
// ---------------------------------------------------------------------------------------

function CStateLoad( inits, game)
{
	// variable
	this.inits = inits;
	this.game = game;

	try {
	} catch(e) {
		console.error( 'CStateLoad not ready', e);
	}
}

// ---------------------------------------------------------------------------------------

CStateLoad.prototype.preload = function()
{
	try {
		var label = this.game.add.text( 80, 150, _('load_loading'), {font: '30px Courier', fill: '#ffffff'});

		this.game.load.image( 'sky', 'art/sky.png');
		this.game.load.spritesheet( 'GEMS', 'art/items.png', this.inits.GEM_SIZE, this.inits.GEM_SIZE);
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateLoad preload error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateLoad.prototype.create = function()
{
	try {
		this.game.state.start( 'board');
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateLoad creation error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------
// eof
