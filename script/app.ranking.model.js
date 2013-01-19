define( [ 'jquery', 'lodash', 'backbone', '$tore' ], function( $, _, Backbone, $tore )
	{
		return {
			'team' : Backbone.Model.extend( {
				'defaults' : {
					  'team' : 'Team name unknown'
					, 'win' : 0
					, 'lost' : 0
					, 'sw' : 0
					, 'sl' : 0
					, 'pw' : 0
					, 'pl' : 0
				}
				, 'initialize' : function initialize()
				{
					this.set( 'Saldo', this.get( 'Pw' ) - this.get( 'Pl' ) );
				}
			} )
		};
	}
);