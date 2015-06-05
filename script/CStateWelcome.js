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
		this.game.stage.backgroundColor = '#4b0049';

		var labelTitle = this.game.add.text( this.game.world.centerX, 80, _('appTitle'), {font: '40px Arial', fill: '#ffffff', align: 'center'});
		labelTitle.anchor.set( .5);

		var labelStart = this.game.add.text( this.game.world.centerX, this.game.world.centerY, _('welcome_play'), {font: '50px Arial', fill: '#ffffff', align: 'center', backgroundColor: '#900090'});
		labelStart.anchor.set( .5);
		labelStart.inputEnabled = true;
		labelStart.events.onInputDown.add( this.eventStartDown, this);
		labelStart.events.onInputUp.add( this.eventStartUp, this);
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
// eof
