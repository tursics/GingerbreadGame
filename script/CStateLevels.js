// ---------------------------------------------------------------------------------------
// state to show a level chooser
// ---------------------------------------------------------------------------------------

function CStateLevels( inits, game)
{
	this.inits = inits;
	this.game = game;
	this.dragX = null;

	try {
	} catch(e) {
		console.error( 'CStateLevels not ready', e);
	}
}

// ---------------------------------------------------------------------------------------

CStateLevels.prototype.create = function()
{
	try {
		this.game.stage.backgroundColor = '#4364ac';
		this.game.add.sprite( 0, 0, 'bgLevels');

		this.title = this.game.add.text( this.game.world.centerX, 100, _('levels_select').toUpperCase());

		var gradient = this.title.context.createLinearGradient( 0, 0, 0, this.title.canvas.height);
		gradient.addColorStop( 0, '#beff1f');   
		gradient.addColorStop( .49, '#beff1f');   
		gradient.addColorStop( .51, '#83ff1f');
		gradient.addColorStop( 1, '#83ff1f');

		this.title.anchor.setTo( .5);
		this.title.font = 'Coaster';
		this.title.fontSize = 24;
		this.title.fill = gradient;
		this.title.align = 'center';
		this.title.stroke = '#64331c';
		this.title.strokeThickness = 4;

		var level = 1;
		var max = this.inits.level.levels.length;
		for( var i = 0; i < 12; ++i) {
			if( i < max) {
				this.addLevelButton( i, this.inits.level.levels[i].label);
			} else {
				this.addLevelButton( i, '');
			}
		}

		var buttonPrevious = this.game.add.button( this.game.world.centerX / 2 - 50, this.game.world.height / 2, 'buttonPrevious', this.eventButtonPrevious, this, 3, 3, 3);
		buttonPrevious.anchor.setTo( .5);
		buttonPrevious.height *= .75;
		buttonPrevious.width *= .75;

		var buttonNext = this.game.add.button( this.game.world.centerX / 2 * 3 + 50, this.game.world.height / 2, 'buttonNext', this.eventButtonNext, this, 3, 3, 3);
		buttonNext.anchor.setTo( .5);
		buttonNext.height *= .75;
		buttonNext.width *= .75;

		var buttonHome = this.game.add.button( this.game.world.centerX, this.game.world.height - 80, 'buttonHome', this.eventButtonHome, this, 1, 0, 2);
		buttonHome.anchor.setTo( .5);
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateLevels creation error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateLevels.prototype.update = function()
{
	try {
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateLevels update error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateLevels.prototype.addLevelButton = function( pos, level)
{
	var x = this.game.world.centerX + (pos % 4) * 100 - 150;
	var y = this.game.world.centerY + parseInt( pos / 4) * 100 - 120;

	var button;
	if( '' == level) {
		button = this.game.add.button( x, y, 'buttonLocked', this.eventButtonLevelLocked, this, 3, 3, 3);
	} else {
		button = this.game.add.button( x, y, 'buttonRound', this.eventButtonLevel, this, 1, 0, 2);

		var text = this.game.add.text( 0, 0, level);

		var gradient = text.context.createLinearGradient( 0, 0, 0, text.canvas.height);
		gradient.addColorStop( 0, '#beff1f');
		gradient.addColorStop( .49, '#beff1f');
		gradient.addColorStop( .51, '#83ff1f');
		gradient.addColorStop( 1, '#83ff1f');

		button.addChild( text);
		text.anchor.setTo( .5);
		text.font = 'Coaster';
		text.fontSize = 30;
		text.fill = gradient;
		text.align = 'center';
		text.stroke = '#64331c';
		text.strokeThickness = 6;
		text.levelID = pos;
	}

	button.anchor.setTo( .5);
}

// ---------------------------------------------------------------------------------------

CStateLevels.prototype.eventButtonHome = function( item)
{
	this.game.state.start( 'welcome');
}

// ---------------------------------------------------------------------------------------

CStateLevels.prototype.eventButtonNext = function( item)
{
}

// ---------------------------------------------------------------------------------------

CStateLevels.prototype.eventButtonPrevious = function( item)
{
}

// ---------------------------------------------------------------------------------------

CStateLevels.prototype.eventButtonLevel = function( item)
{
	this.inits.currentLevel = parseInt(item.children[0].levelID);
	this.game.state.start( 'board');
}

// ---------------------------------------------------------------------------------------

CStateLevels.prototype.eventButtonLevelLocked = function( item)
{
}

// ---------------------------------------------------------------------------------------
// eof
