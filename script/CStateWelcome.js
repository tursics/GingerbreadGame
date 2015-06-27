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

		var buttonPlay = this.game.add.sprite( this.game.world.centerX, this.game.world.centerY / 2 * 3, 'buttonPlay');
		buttonPlay.anchor.set( .5);
		buttonPlay.inputEnabled = true;
		buttonPlay.events.onInputDown.add( this.eventStartDown, this);
		buttonPlay.events.onInputUp.add( this.eventStartUp, this);

//		var test = this.game.input.keyboard.addKey( Phaser.Keyboard.T);
//		test.onDown.addOnce( this.test, this);
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateWelcome creation error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateWelcome.prototype.eventStartDown = function( item)
{
//	item.fill = '#ffff44';
}

// ---------------------------------------------------------------------------------------

CStateWelcome.prototype.eventStartUp = function( item)
{
//	item.fill = '#ffffff';

	this.game.state.start( 'board');
}

// ---------------------------------------------------------------------------------------

CStateWelcome.prototype.test = function()
{
	this.game.state.start( 'levels');
}

// ---------------------------------------------------------------------------------------
// eof
