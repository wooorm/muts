define(
	  [ 'jquery', 'lodash', 'backbone', '$tore', 'schedule.view' ]
	, function anonymous( $, _, Backbone, $tore, view )
	{
		var exports    = this
		  , app        = exports.app
		  , util       = exports.util || ( exports.util = {} )
		  , schedule   = app.schedule || ( app.schedule = {} )
		  ;

		app.$tore.init( {
			'key' : 'schedule.collection.models'
		} );

		return view;
	}
);