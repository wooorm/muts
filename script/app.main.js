(
	function anonymous()
	{
		var exports = this;

		require.config( {
			'paths' :
			{
				  'game'                : 'app.game'
				, 'game.collection'     : 'app.game.collection'
				, 'game.data'           : 'app.game.data'
				, 'game.model'          : 'app.game.model'
				, 'game.view'           : 'app.game.view'

				, 'ranking'            : 'app.ranking'
				, 'ranking.collection' : 'app.ranking.collection'
				, 'ranking.data'       : 'app.ranking.data'
				, 'ranking.model'      : 'app.ranking.model'
				, 'ranking.view'       : 'app.ranking.view'

				, 'schedule'            : 'app.schedule'
				, 'schedule.collection' : 'app.schedule.collection'
				, 'schedule.data'       : 'app.schedule.data'
				, 'schedule.model'      : 'app.schedule.model'
				, 'schedule.view'       : 'app.schedule.view'

				, 'add'                 : 'app.add'

				, 'router'              : 'app.router'

			  	, 'jquery'              : 'lib.jquery'
				, 'lodash'              : 'lib.lodash'
				, 'backbone'            : 'lib.backbone'
				, '$tore'               : 'lib.store'
				, 'showhide'            : 'lib.showhide'
			}
			, 'urlArgs' : 'bust=' + new Date().getTime()
			, 'baseUrl' : 'script'
		} );

		require( [ 'jquery', 'lodash', 'backbone', '$tore' ]
			, function( $, _, Backbone, $tore )
			{
				var app = exports.app = {};

				app.api = {};

				app.api.config = {
				      'tournamentID' : 18519
				    , 'poolID'       : 18739
				    , 'access_token' : 'e08a55d872'
				    , 'api_url'      : 'https://api.leaguevine.com/v1/'
				    , 'season_id'    : 20167
					, 'game_id'      : 88453 // "Boomsquad" vs "Beast Amsterdam"
				}

				app.$tore = new $tore();

				app.version = '0.0.1';

				app.view = {};

				app.root = document.querySelector( '#root' );

				require( [ 'add' ], function callback( view )
					{
						app.add = new view;
					}
				);

				require( [ 'router' ] );
			}
		);
	}()
);