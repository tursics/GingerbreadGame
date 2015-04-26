//--------------------------------
//---         MyField.js         ---
//--------------------------------

MyField = new function()
{
	//------------------------
	this.eventReady = function()
	{
		MyField.show( true);
	};

	//------------------------
	this.eventResize = function()
	{
		try {
			this.windowWidth_ = $( window).width();
			this.windowHeight_ = $( window).height();
			this.artY_ = 0;

			var offset = MyField.getPixelOffset();
			var size = MyField.mapToPixel( this.artWidth_, this.artHeight_);

			$( '#map').css({
				top: parseInt( offset.y),
				left: parseInt( offset.x),
				width: parseInt( size.x),
				height: parseInt( size.y)
			});
		} catch( e) { 
			if( CConfig.debug) { 
				alert( e);
			} 
		}
	};

	//------------------------
	this.show = function( display)
	{
		if( display) {
			if( !$( '#field').length) {
				this.create();
			}
			$( '#field').show();
		} else {
			$( '#field').hide();
		}
	};

	//------------------------
	this.create = function()
	{
		$( '#content').append( '<div id="field"></div>');
	};

	//------------------------
//	this.eventClick = function( event)
//	{
//		try {
//			// event.pageX, event.pageY, event.clientX, event.clientY
//			MyPlayer.moveTo( event.pageX, event.pageY);
//		} catch( e) { if( CConfig.debug) { alert( e); } }
//	};

	//------------------------
	this.mapToPixel = function( sourceX, sourceY)
	{
		var destX = this.windowWidth_;
		var destY = this.windowHeight_;
		var width = this.artWidth_ + this.artX_;
		var height = this.artHeight_ + this.artY_;

		if((destX * height) > (destY * width)) {
			destX = width * destY / height;
		} else {
			destY = height * destX / width;
		}

		return {
			x: destX * sourceX / width,
			y: destY * sourceY / height
		};
	}

	//------------------------
	this.getPixelOffset = function()
	{
		var size = this.mapToPixel( this.artX_, 0);
		size.y = this.artY_;
		return size;
	}
	//------------------------
	this.pointToMap = function( point)
	{
		return {
			x: this.mapPoints_[ point].x,
			y: this.mapPoints_[ point].y
		};
	}

	//------------------------
	this.getPossibleMoves = function( point)
	{
		if( CConfig.debug && (point >= this.mapPoints_.length)) {
			alert( 'Point ' + point + ' is not available');
		}

		return this.mapPoints_[ point].moves;
	}

	//------------------------
	this.getPossibleCrumbs = function( point)
	{
		if( CConfig.debug && (point >= this.mapPoints_.length)) {
			alert( 'Point ' + point + ' is not available');
		}

		return this.mapPoints_[ point].crumb;
	}

	//------------------------
	this.getStationName = function( point)
	{
		if( CConfig.debug && (point >= this.mapPoints_.length)) {
			alert( 'Point ' + point + ' is not available');
		}

		return this.mapPoints_[ point].name;
	}

	//------------------------
	this.windowWidth_ = 1;
	this.windowHeight_ = 1;
	this.artX_ = 60;
	this.artY_ = 60;
	this.artWidth_ = 1000;
	this.artHeight_ = 600;
	this.level_ = [
		{design:[
'xxxxxx',
'xxxxxx',
'xxxxxx',
'xxxxxx',
'xxxHxx',
		]},
	];

	//------------------------
};

//----------------------------
// eof
