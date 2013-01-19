define( [ 'jquery' ], function anonymous( $ )
	{
		$.fn.showHide = function ( options )
		{
			var defaults = {
				  'speed'	   : 1000
				, 'easing'	   : ''
				, 'changeText' : 0
				, 'showText'   : 'Show'
				, 'hideText'   : 'Hide'
			};

			var options = $.extend( defaults, options );

			$( this ).click( function ()
				{
					 $( '.toggleDiv' ).slideUp( options.speed, options.easing );

					 var toggleClick = $( this );
					 var toggleDiv = $( this ).attr( 'rel' );

					 $( toggleDiv ).slideToggle( options.speed, options.easing, function()
						 {
							 if ( options.changeText == 1 )
							 {
								 $( toggleDiv ).is( ':visible' )
									 ? toggleClick.text( options.hideText )
									 : toggleClick.text( options.showText );
							 }
						 }
					 );

				  return false;
				}
			);
		};

		$( '.show_hide' ).showHide( {
			  'speed' : 1000
			, 'easing' : ''
			, 'changeText' : 1
			, 'showText' : 'Add new game'
			, 'hideText' : 'Stop editing'
		} );
		
		return $.fn.showHide;
	}
);