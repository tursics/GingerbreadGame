//--------------------------------
//---         CInit.js         ---
//--------------------------------

// http://gameboxz.org/blog/posts/game-scaling-with-phaser-part-1
// http://www.melkybee.com/blog/2015/06/14/scuba-chibi-postmortem-1-the-technical-learnings/

// work with tiles              http://blog.hovercraft.ie/post/119437806421/creating-a-platformer-tilemap-for-phaser
// CC0: user interface from     http://opengameart.org/content/free-game-gui
// free tilemap editor          http://www.mapeditor.org/download.html
// ICE CLIMBER CHARACTER SPRITESHEET http://www.gameart2d.com/character-spritesheet-14.html
// CHRISTMAS GAME GUI PACK           http://www.gameart2d.com/christmas-game-gui.html
// FREE CASUAL GAME GUI              http://www.gameart2d.com/free-game-gui.html

function CInit()
{
	// configurable
	this.GEM_SIZE = 64;
	this.GEM_SPACING = 0;
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
	this.level = null;
	this.currentLevel = 0;

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

		this.game.state.add( 'board', new CStateBoard( this, this.game));
		this.game.state.add( 'boot', new CStateBoot( this, this.game));
		this.game.state.add( 'levels', new CStateLevels( this, this.game));
		this.game.state.add( 'load', new CStateLoad( this, this.game));
		this.game.state.add( 'welcome', new CStateWelcome( this, this.game));

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
