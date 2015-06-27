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

		var labelStart = this.game.add.text( this.game.world.centerX, this.game.world.centerY / 2 * 3, _('welcome_play'), {font: '50px Coaster', fill: '#ffffff', align: 'center', backgroundColor: '#900090'});
		labelStart.anchor.set( .5);
		labelStart.inputEnabled = true;
		labelStart.events.onInputDown.add( this.eventStartDown, this);
		labelStart.events.onInputUp.add( this.eventStartUp, this);

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
	item.fill = '#ffff44';
}

// ---------------------------------------------------------------------------------------

CStateWelcome.prototype.eventStartUp = function( item)
{
	item.fill = '#ffffff';

	this.game.state.start( 'board');
}

// ---------------------------------------------------------------------------------------

CStateWelcome.prototype.test = function()
{
	this.game.state.start( 'levels');
}

// ---------------------------------------------------------------------------------------
// eof
