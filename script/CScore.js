//--------------------------------
//---        CScore.js         ---
//--------------------------------

function CScore( inits, game)
{
	// configurable
	this.GEM = 40;
	this.GEM_FOUR = 2000;
	this.GEM_T = 3000;
	this.GEM_L = 4000;
	this.GEM_SQUARE = 5000;
	this.GEM_CROSS = 6000;
	this.GEM_FIVE = 12000;

	// Three honey: 100
	// Three egg: 150
	// Three sugar: 125
	// Three almond: 140
	// Three flour: 120

	// Four honey: 1010
	// Four egg: 1550
	// Four sugar: 1225
	// Four almond: 1440
	// Four flour: 1220

	// Square honey: 3030
	// Square egg: 3550
	// Square sugar: 3225
	// Square almond: 3440
	// Square flour: 3220

	// T and L honey: 4040
	// T and L egg: 4550
	// T and L sugar: 4225
	// T and L almond: 4440
	// T and L flour: 4220

	// Cross honey: 5050
	// Cross egg: 5550
	// Cross sugar: 5225
	// Cross almond: 5440
	// Cross flour: 5220

	// Five honey: 10010
	// Five egg: 10550
	// Five sugar: 10225
	// Five almond: 10440
	// Five flour: 10220

	// Five-T Five-Cross honey: 15010
	// Five-T Five-Cross egg: 15550
	// Five-T Five-Cross sugar: 15225
	// Five-T Five-Cross almond: 15440
	// Five-T Five-Cross flour: 15220

	// variable
	this.inits = inits;
	this.game = game;
	this.score = 0;
	this.scoreText = null;
	this.moves = 0;
	this.movesText = null;
	this.goal = 0;
	this.goalText = null;
	this.gems = [];

	try {
		this.create();
	} catch(e) {
		console.error( 'CScore not ready', e);
	}
}

// ---------------------------------------------------------------------------------------

CScore.prototype.create = function()
{
	var levelData = this.inits.level.levels[this.inits.currentLevel];

	this.score = 0;
	this.scoreText = this.addText( 60, 60, 20);
	this.scoreGem( -1, -1, 0);

	this.moves = levelData.moves + 1;
	this.movesText = this.addText( 60, 90, 20);
	this.scoreMove();

	this.goal = levelData.points;
	this.goalText = this.addText( 60, 120, 20);
	this.goalText.text = _('board_goal') + ' ' + this.goal;
}

// ---------------------------------------------------------------------------------------

CScore.prototype.addText = function( x, y, fontSize)
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

CScore.prototype.scoreGem = function( x, y, amount)
{
	this.score += amount;
	this.scoreText.text = _('board_score') + ' ' + this.score;

/*	if( durationMultiplier === null || typeof durationMultiplier === 'undefined') {
		durationMultiplier = 1;
	}

	if( typeof callback !== 'undefined') {
		setTimeout( function() {
			try {
				callback.apply( this);
			} catch(e) {
				console.error( 'CBoard callback error', e);
			}
		}, 100 * durationMultiplier + 100);
	}

	return this.game.add.tween( gemObj).to({
		alpha: 0},
		100 * durationMultiplier, Phaser.Easing.Linear.None, true);*/
}

// ---------------------------------------------------------------------------------------

CScore.prototype.scoreMove = function()
{
	--this.moves;
	this.movesText.text = _('board_moves') + ' ' + this.moves;
}

// ---------------------------------------------------------------------------------------

CScore.prototype.scoreGoalGem = function( color)
{
	for( var i = 0; i < this.gems.length; ++i) {
		var gem = this.gems[i];
		if( gem.color == color) {
			--gem.count;
			if( gem.count > 0) {
				gem.text.text = gem.count + 'x';
			} else {
				gem.text.text = '-';
			}
			break;
		}
	}
}

// ---------------------------------------------------------------------------------------
// eof
