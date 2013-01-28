define(
	  [ 'jquery', 'lodash', 'backbone', 'ranking.view' ]
	, function anonymous( $, _, Backbone, view )
	{
		var exports    = this
		  , app        = exports.app
		  , util       = exports.util || ( exports.util = {} )
		  , ranking    = app.ranking || ( app.ranking = {} )
		  ;

		return view;
	}
);