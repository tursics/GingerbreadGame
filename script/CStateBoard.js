// ---------------------------------------------------------------------------------------
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

		this.movesText = this.game.add.text( 60, 90, '');

		var gradient = this.movesText.context.createLinearGradient( 0, 0, 0, this.movesText.canvas.height);
		gradient.addColorStop( 0, '#beff1f');   
		gradient.addColorStop( .49, '#beff1f');   
		gradient.addColorStop( .51, '#83ff1f');
		gradient.addColorStop( 1, '#83ff1f');

//		this.movesText.anchor.setTo( 0.5);
		this.movesText.font = 'Coaster';
		this.movesText.fontSize = 20;
		this.movesText.fill = gradient;
		this.movesText.align = 'center';
		this.movesText.stroke = '#64331c';
		this.movesText.strokeThickness = 4;
		this.moves = 40;
		this.movesText.text = _('board_moves') + ' ' + this.moves;

		this.goalText = this.game.add.text( 60, 120, '');

		var gradient = this.goalText.context.createLinearGradient( 0, 0, 0, this.goalText.canvas.height);
		gradient.addColorStop( 0, '#beff1f');   
		gradient.addColorStop( .49, '#beff1f');   
		gradient.addColorStop( .51, '#83ff1f');
		gradient.addColorStop( 1, '#83ff1f');

//		this.goalText.anchor.setTo( 0.5);
		this.goalText.font = 'Coaster';
		this.goalText.fontSize = 20;
		this.goalText.fill = gradient;
		this.goalText.align = 'center';
		this.goalText.stroke = '#64331c';
		this.goalText.strokeThickness = 4;
		this.goal = 12000;
		this.goalText.text = _('board_goal') + ' ' + this.goal;

		var buttonPause = this.game.add.button( this.inits.board.x / 2, this.game.world.height - 86, 'buttonPause', this.eventButtonPause, this, 2, 1, 0);
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

CStateBoard.prototype.eventButtonPause = function( item)
{
	this.game.state.start( 'levels');
}

// ---------------------------------------------------------------------------------------
// eof
