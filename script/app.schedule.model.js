define(
	  [ 'jquery', 'lodash', 'backbone', '$tore' ]
	, function( $, _, Backbone, $tore )
	{
		return {
			'contact' : Backbone.Model.extend( {
		        'defaults' : {
					  'date'   : ''
					, 'team1'  : ''
					, 'result' : ''
					, 'team2'  : ''
				}
		    } )
		};
	}
);