define(
	  [ 'jquery', 'lodash', 'backbone', '$tore', 'schedule.model' ]
	, function( $, _, Backbone, $tore, model )
	{
		// Create new `Game` collection.
		var Directory = Backbone.Collection.extend(
			{
				'model' : model.contact
			}
		);

		return Directory;
	}
);