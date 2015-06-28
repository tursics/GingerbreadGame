// ---------------------------------------------------------------------------------------
// state to show the welcome screen
// ---------------------------------------------------------------------------------------

function CStateWelcome( inits, game)
{
//	this.inits = inits;
	this.game = game;

	try {
	} catch(e) {
		console.error( 'CStateWelcome not ready', e);
	}
}

// ---------------------------------------------------------------------------------------

CStateWelcome.prototype.create = function()
{
	try {
		this.game.stage.backgroundColor = '#4364ac';
		this.game.add.sprite( 0, 0, 'bgWelcome');

		var title = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY / 2, 'titleWelcome');
		title.anchor.set( .5);

		var button = this.game.add.button( this.game.world.centerX, this.game.world.centerY / 2 * 3, 'buttonPlay', this.eventButtonPlay, this, 2, 1, 0);
		button.anchor.setTo( .5);

//		var test = this.game.input.keyboard.addKey( Phaser.Keyboard.T);
//		test.onDown.addOnce( this.test, this);
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateWelcome creation error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateWelcome.prototype.eventButtonPlay = function( item)
{
	this.game.state.start( 'levels');
}

// ---------------------------------------------------------------------------------------

CStateWelcome.prototype.test = function()
{
	this.game.state.start( 'levels');
}

// ---------------------------------------------------------------------------------------
// eof
