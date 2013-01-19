define( [ 'jquery', 'lodash', 'backbone', '$tore', 'game.model' ], function( $, _, Backbone, $tore, model )
	{
		// Create new `Game` collection.
		var Collection = Backbone.Collection.extend(
			{
				  'model' : model.set
				, 'comparator' : function comparator( it )
				{
					return it.get( app.$tore.comparator.type ) * app.$tore.comparator.order;
				}
			}
		);

		return Collection;
	}
);