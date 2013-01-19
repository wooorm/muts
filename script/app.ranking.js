define(
	  [ 'jquery', 'lodash', 'backbone', '$tore', 'ranking.view', 'ranking.data' ]
	, function anonymous( $, _, Backbone, $tore, view, data )
	{
		var exports    = this
		  , app        = exports.app
		  , util       = exports.util || ( exports.util = {} )
		  , ranking    = app.ranking || ( app.ranking = {} )
		  ;

		app.$tore.init( {
			  'key' : 'ranking.collection.models'
			, 'default' : data
		} );

		return view;
	}
);