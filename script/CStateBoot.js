// ---------------------------------------------------------------------------------------
// state to boot the system
// ---------------------------------------------------------------------------------------

function CStateBoot( inits, game)
{
	// variable
//	this.inits = inits;
	this.game = game;

	try {
	} catch(e) {
		console.error( 'CStateBoot not ready', e);
	}
}

// ---------------------------------------------------------------------------------------

CStateBoot.prototype.create = function()
{
	try {
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.setScreenSize();

		this.game.world.setBounds( 0, 0, 800, 600);

		this.game.physics.startSystem( Phaser.Physics.ARCADE);

		this.game.state.start( 'load');
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateBoot creation error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------
// eof
