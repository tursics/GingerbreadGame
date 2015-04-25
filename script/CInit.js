//--------------------------------
//---         CInit.js         ---
//--------------------------------

CInit = new function()
{
	//------------------------
	this.eventReady = function()
	{
		try {
			MyMap.eventReady();
			MyPlayer.eventReady();
		} catch( e) { if( CConfig.debug) { alert( e); } }
	};

	//------------------------
	this.eventResize = function()
	{
		try {
			MyMap.eventResize();
			MyPlayer.eventResize();
		} catch( e) { if( CConfig.debug) { alert( e); } }
	};

	//------------------------
};

//----------------------------

function wpGotoPage( pageName)
{
	$.mobile.changePage( "#" + pageName);
}

//----------------------------
// eof
