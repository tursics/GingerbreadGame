﻿// ---------------------------------------------------------------------------------------
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
		this.game.stage.backgroundColor = '#4364ac';

		var label = this.game.add.text( this.game.world.centerX, this.game.world.centerY, _('load_loading'), {font: '30px Coaster', fill: '#ffffff'});
		label.anchor.set( .5);

		// needed buttons
		this.load.image( 'buttonHome', 'art/buttonHome.png');
		this.load.image( 'buttonLocked', 'art/buttonLocked.png');
		this.load.image( 'buttonNext', 'art/buttonNext.png');
		this.load.image( 'buttonPause', 'art/buttonPause.png');
		this.load.image( 'buttonPlay', 'art/buttonPlay.png');
		this.load.image( 'buttonPrevious', 'art/buttonPrevious.png');
		this.load.image( 'buttonRound', 'art/buttonRound.png');
		this.load.image( 'buttonRectangle', 'art/buttonRectangle.png');

		// needed in CStateWelcome
		this.load.image( 'bgWelcome', 'art/backgroundWelcome.png');
		this.load.image( 'titleWelcome', 'art/titleWelcome.png');

		// needed in CStateLevels
		this.load.image( 'bgLevels', 'art/backgroundWelcome.png');

		// needed in CStateBoard
		this.load.image( 'bgBoard', 'art/backgroundWelcome.png');

		// needed in CStateLevels
//		this.load.tilemap( 'sceneryMap', 'script/scenery.json', null, Phaser.Tilemap.TILED_JSON);
//		this.load.image( 'sceneryTiles', 'art/sceneryTiles.png');
//		this.load.image( 'sceneryBackground', 'art/sceneryBackground.png');
//		this.load.image( 'winterSet', 'art/winter.png');
//		this.load.tilemap( 'winterMap', 'art/winter.json', null, Phaser.Tilemap.TILED_JSON);

		this.load.spritesheet( 'GEMS', 'art/items.png', this.inits.GEM_SIZE, this.inits.GEM_SIZE);
		this.load.spritesheet( 'spriteBoard', 'art/spriteBoard.png', this.inits.GEM_SIZE, this.inits.GEM_SIZE);

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
