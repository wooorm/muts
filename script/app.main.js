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

				app.$tore = new $tore();

				app.version = '0.0.1';

				app.view = {};

				app.root = document.querySelector( '#root' );

				require( [ 'router' ] );
			}
		);
	}()
);