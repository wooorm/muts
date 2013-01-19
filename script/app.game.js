define(
	  [ 'jquery', 'lodash', 'backbone', '$tore', 'game.view', 'game.data' ]
	, function anonymous( $, _, Backbone, $tore, view, data )
	{
		var exports = this
		  , app = exports.app
		  , util = exports.util || ( exports.util = {} )
		  , game = app.game || ( app.game = {} )
		  ;

		util.from_json = $tore.prototype.from_json

		app.$tore.init( {
				  'key' : 'collection.models'
				, 'default' : data
			}, {
				  'key' : 'comparator.order'
				, 'default' : 1
			}, {
				  'key' : 'comparator.type'
				, 'default' : 'set'
			}, {
				  'key' : 'filter.team1Type'
				, 'default' : 'gte'
			}, {
				  'key' : 'filter.team1Value'
				, 'default' : 0
			}, {
				  'key' : 'filter.team2Type'
				, 'default' : 'gte'
			}, {
				  'key' : 'filter.team2Value'
				, 'default' : 0
			}, {
				  'key' : 'filter.type'
				, 'default' : 1
			}
		);

		// Instanciate the `view` view.
		return view;
	}
);
