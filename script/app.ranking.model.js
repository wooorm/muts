define(
	  [ 'jquery', 'lodash', 'backbone' ]
	, function anonymous( $, _, Backbone )
	{
		return {
			'team' : Backbone.Model.extend( {
				'defaults' : {
					  'team'        : 'Team name unknown'
					, 'gamesPlayed' : 0
					, 'w'           : 0
					, 'l'           : 0
					, 'saldo'       : 0
				}
		    } )
		};
	}
);