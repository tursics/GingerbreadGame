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
		if( !this.game.device.desktop) {
			this.game.scale.startFullScreen( false);
		}

		this.game.stage.backgroundColor = '#4b0049';

		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL; //EXACT_FIT;
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
