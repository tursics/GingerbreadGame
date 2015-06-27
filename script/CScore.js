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
	this.scoreText = this.game.add.text( 600, 60, '');
	this.scoreGem( -1, -1, 0);

	var gradient = this.scoreText.context.createLinearGradient( 0, 0, 0, this.scoreText.canvas.height);
	gradient.addColorStop( 0, '#aEe6FF');   
	gradient.addColorStop( 1, '#004CB3');

//	this.scoreText.anchor.setTo( 0.5);
	this.scoreText.font = 'Coaster';
	this.scoreText.fontSize = 20;
	this.scoreText.fill = gradient;
	this.scoreText.align = 'center';
	this.scoreText.stroke = '#000000';
	this.scoreText.strokeThickness = 1;
//	this.scoreText.setShadow( 5, 5, 'rgba(0,0,0,0.5)', 5);
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
