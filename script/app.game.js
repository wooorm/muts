define(
	  [ 'jquery', 'lodash', 'backbone', '$tore', 'game.view' ]
	, function anonymous( $, _, Backbone, $tore, view )
	{
		var exports = this
		  , app = exports.app
		  , util = exports.util || ( exports.util = {} )
		  , game = app.game || ( app.game = {} )
		  ;

		util.from_json = $tore.prototype.from_json

		app.$tore.init( {
				  'key' : 'comparator.order'
				, 'default' : 1
			}, {
				  'key' : 'comparator.type'
				, 'default' : 'set'
			}
		);

		// Instanciate the `view` view.
		return view;
	}
);
