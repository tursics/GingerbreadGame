// ---------------------------------------------------------------------------------------
// state to load all needed assets
// ---------------------------------------------------------------------------------------

function CStateLoad( inits, game)
{
	// variable
	this.inits = inits;
	this.game = game;
	this.load;

	try {
		this.load = this.game.load;
	} catch(e) {
		console.error( 'CStateLoad not ready', e);
	}
}

// ---------------------------------------------------------------------------------------

CStateLoad.prototype.preload = function()
{
	try {
		this.game.stage.backgroundColor = '#4b0049';

		var label = this.game.add.text( this.game.world.centerX, this.game.world.centerY, _('load_loading'), {font: '30px Courier', fill: '#ffffff'});
		label.anchor.set( .5);

		this.load.image( 'sky', 'art/sky.png');

		this.load.spritesheet( 'GEMS', 'art/items.png', this.inits.GEM_SIZE, this.inits.GEM_SIZE);

		this.load.text( 'level', 'script/level.json');
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
		this.inits.level = JSON.parse( this.game.cache.getText( 'level'));

		this.game.state.start( 'welcome');
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateLoad creation error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------
// eof
