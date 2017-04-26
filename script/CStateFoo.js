// ---------------------------------------------------------------------------------------
// state to boot the system
// ---------------------------------------------------------------------------------------

function CStateBoot( inits, game)
{
	this.inits = inits;
	this.game = game;

	try {
	} catch(e) {
		console.error( 'CStateBoot not ready', e);
	}
}

// ---------------------------------------------------------------------------------------

CStateBoot.prototype.preload = function()
{
	try {
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateBoot preload error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateBoot.prototype.create = function()
{
	try {
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateBoot creation error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------

CStateBoot.prototype.update = function()
{
	try {
	} catch( e) {
		if( CConfig.debug) {
			console.error( 'CStateBoot update error', e);
		}
	}
}

// ---------------------------------------------------------------------------------------
// eof
