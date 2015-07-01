﻿// ---------------------------------------------------------------------------------------
// state to display game board
// ---------------------------------------------------------------------------------------

function CStateBoard( inits, game)
{
	// variable
	this.inits = inits;
	this.game = game;
	this.score = null;
	this.moves = 0;
	this.movesText = null;
	this.goal = 0;
	this.goalText = null;

	try {
	} catch(e) {
		console.error( 'CStateBoard not ready', e);
	}
}

// ---------------------------------------------------------------------------------------

CStateBoard.prototype.preload = function()
{
	try {
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateBoard preload error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateBoard.prototype.create = function()
{
	try {
		this.game.add.sprite( 0, 0, 'bgBoard');

		this.score = new CScore( this.game);
		this.inits.board = new CBoard( this.inits, this.game, this.score);
		this.inits.touch = new CTouchLevel( this.inits, this.game, this.inits.board);

		this.moves = 40;
		this.movesText = this.addText( 60, 90, 20);
		this.movesText.text = _('board_moves') + ' ' + this.moves;

		this.goal = 12000;
		this.goalText = this.addText( 60, 120, 20);
		this.goalText.text = _('board_goal') + ' ' + this.goal;

		var buttonPause = this.game.add.button( this.inits.board.x / 2, this.game.world.height - 86, 'buttonPause', this.eventButtonPause, this, 1, 0, 2);
		buttonPause.anchor.setTo( .5);

		this.inits.board.spawnBoard( this.inits.touch, this.inits.level.levels[this.inits.currentLevel]);
		this.inits.touch.thaw();
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateBoard creation error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateBoard.prototype.addText = function( x, y, fontSize)
{
	var text = this.game.add.text( x, y, '');

	var gradient = text.context.createLinearGradient( 0, 0, 0, text.canvas.height);
	gradient.addColorStop( 0, '#beff1f');   
	gradient.addColorStop( .49, '#beff1f');   
	gradient.addColorStop( .51, '#83ff1f');
	gradient.addColorStop( 1, '#83ff1f');

//	text.anchor.setTo( 0.5);
	text.font = 'Coaster';
	text.fontSize = fontSize;
	text.fill = gradient;
	text.align = 'center';
	text.stroke = '#64331c';
	text.strokeThickness = fontSize / 5;

	return text;
}

// ---------------------------------------------------------------------------------------

CStateBoard.prototype.eventButtonPause = function( item)
{
	this.game.state.start( 'levels');
}

// ---------------------------------------------------------------------------------------
// eof
