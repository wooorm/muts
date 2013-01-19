define(
	  [ 'jquery', 'lodash', 'backbone', '$tore', 'schedule.view', 'schedule.data' ]
	, function anonymous( $, _, Backbone, $tore, view, data )
	{
		var exports    = this
		  , app        = exports.app
		  , util       = exports.util || ( exports.util = {} )
		  , schedule   = app.schedule || ( app.schedule = {} )
		  ;

		app.$tore.init( {
			  'key' : 'schedule.collection.models'
			, 'default' : data
		} );

		return view;
	}
);