define(
	  [ 'jquery', 'lodash', 'backbone', '$tore', 'schedule.model' ]
	, function( $, _, Backbone, $tore, model )
	{
		// Create new `Game` collection.
		var Directory = Backbone.Collection.extend(
			{
				'model' : model.contact,

				url: function() {
        			return app.api.config.api_url + 'games/' + '?tournament_id=' + app.api.config.tournamentID + '&pool_id=' + app.api.config.poolID + '&access_token=' + app.api.config.access_token + '/';
    			},

    			parse: function(data) {
			        // what do we get from the API?    
			        // we could log data, right? Let's!
			        // console.log("data to parse: ", data);

			        var poolData = [];

			        var newGame;

			        _.each(data.objects, function(object){
			            // console.log("Objects",object.id);

			            newGame = {};

			            newGame.datum = object.start_time;
			            newGame.team1_naam = object.team_1.name;
			            newGame.team1_score = object.team_1_score;
			            newGame.team2_score = object.team_2_score;
			            newGame.team2_naam = object.team_2.name;
			            newGame.id = object.id;

			            poolData.push(newGame);

			        });

			        // console.log("De poolData array:", poolData);
			        
			        return poolData;
			    }	


			}
		);

		return Directory;
	}
);