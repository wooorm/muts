define( [ 'jquery', 'lodash', 'backbone', '$tore', 'game.model' ], function( $, _, Backbone, $tore, model )
	{
		var config = app.api.config;

		config.game_type = 'game_scores';

		// Create new `Game` collection.
		var Collection = Backbone.Collection.extend(
			{
				  'model'      : model.set
				, 'url' : function url()
				{
					return this._url( {
						  'limit' : 1
						, 'fields' : '[game_sets,id]'
					}, 'game_scores' );
				}
				, '_url' : function _url( params, type, id_as_path )
				{
					var root = config.api_url;

					params || ( params = {} );
					params.access_token = config.access_token;
					params.access_token = config.tournamentID;

					if ( type )
						root += type + '/';

					if ( id_as_path )
						root += config.game_id + '/';
					else
						params.game_id = config.game_id;

					return root += this.parameters( params );
				}
				, 'parameters' : function parameters( params )
				{
					var arr = [];

					Object.keys( params ).forEach( function( it, n )
						{
							arr[ n ] = [ it, params[ it ] ].join( '=' );
						}
					);

					return '?' + arr.join( '&' );
				}
				, 'comparator' : function comparator( it )
				{
					return it.get( app.$tore.comparator.type ) * app.$tore.comparator.order;
				}
			    , 'parse' : function parse( data )
				{
					var _data = [];

					this.id = data.objects[ 0 ].id;

					data = data.objects[ 0 ].game_sets;

					data.forEach( function callback( it, n )
						{
							_data[ n ] = {
								  'set' : it.number
								, 'team1Score' : it.team_1_score
								, 'team2Score' : it.team_2_score
							}
						}
					);

			        return _data;
			    }
			}
		);

		return Collection;
	}
);