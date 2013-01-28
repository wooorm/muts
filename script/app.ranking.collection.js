define(
	  [ 'jquery', 'lodash', 'backbone', 'ranking.model' ]
	, function anonymous( $, _, Backbone, model )
	{
		// Create new collection.
		var Collection = Backbone.Collection.extend( {
			  'model' : model.team
			, 'comparator' : function comparator( model )
			{
				return model.get( 'saldo' ) * -1;
			}
			, 'url' : function url()
			{
				return app.api.config.api_url + 'pools/' + app.api.config.poolID + '/';
			}
			, 'parse' : function parse( data )
			{
				var _data = [];

				var newTeam;

				_.each( data.standings, function callback( standing )
					{
						newTeam = {};
						newTeam.name = standing.team.name;
						newTeam.gamesPlayed = standing.games_played;
						newTeam.wins = standing.wins;
						newTeam.losses = standing.losses;
						newTeam.saldo = standing.plus_minus;

						_data.push( newTeam );
					}
				);

				// Store result.
				this._cache = _data;

				return _data;
			}
		} );

		return Collection;
	}
);