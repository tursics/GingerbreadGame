//--------------------------------
//---        CScore.js         ---
//--------------------------------

function CScore( game)
{
	// configurable
	this.GEM = 40;
	this.GEM_FOUR = 2000;
	this.GEM_T = 3000;
	this.GEM_L = 4000;
	this.GEM_SQUARE = 5000;
	this.GEM_CROSS = 6000;
	this.GEM_FIVE = 12000;

	// Three Honig: 100
	// Three Ei: 150
	// Three Wasser: 125
	// Three Nuss: 140
	// Three Mehl: 120

	// Four Honig: 1010
	// Four Ei: 1550
	// Four Wasser: 1225
	// Four Nuss: 1440
	// Four Mehl: 1220

	// Square Honig: 3030
	// Square Ei: 3550
	// Square Wasser: 3225
	// Square Nuss: 3440
	// Square Mehl: 3220

	// T and L Honig: 4040
	// T and L Ei: 4550
	// T and L Wasser: 4225
	// T and L Nuss: 4440
	// T and L Mehl: 4220

	// Cross Honig: 5050
	// Cross Ei: 5550
	// Cross Wasser: 5225
	// Cross Nuss: 5440
	// Cross Mehl: 5220

	// Five Honig: 10010
	// Five Ei: 10550
	// Five Wasser: 10225
	// Five Nuss: 10440
	// Five Mehl: 10220

	// Five-T Five-Cross Honig: 15010
	// Five-T Five-Cross Ei: 15550
	// Five-T Five-Cross Wasser: 15225
	// Five-T Five-Cross Nuss: 15440
	// Five-T Five-Cross Mehl: 15220

	// variable
	this.game = game;
	this.scoreText = null;
	this.score = 0;

	try {
		this.score = 0;
		this.create();
	} catch(e) {
		console.error( 'CScore not ready', e);
	}
}

// ---------------------------------------------------------------------------------------

CScore.prototype.create = function()
{
	this.scoreText = this.game.add.text( 60, 60, '');
	this.scoreGem( -1, -1, 0);

	var gradient = this.scoreText.context.createLinearGradient( 0, 0, 0, this.scoreText.canvas.height);
	gradient.addColorStop( 0, '#beff1f');   
	gradient.addColorStop( .49, '#beff1f');   
	gradient.addColorStop( .51, '#83ff1f');
	gradient.addColorStop( 1, '#83ff1f');

//	this.scoreText.anchor.setTo( 0.5);
	this.scoreText.font = 'Coaster';
	this.scoreText.fontSize = 20;
	this.scoreText.fill = gradient;
	this.scoreText.align = 'center';
	this.scoreText.stroke = '#64331c';
	this.scoreText.strokeThickness = 4;
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
// eof
