define( [ 'jquery', 'lodash', 'backbone', '$tore', 'ranking.model' ], function( $, _, Backbone, $tore, model )
	{
		// Create new `Pool` collection.
		var Pool = Backbone.Collection.extend(
			{
				  'model' : model.team
				, 'comparator': function comparator( team )
				{
					return team.get( 'team' );
				}
			}
		);

		// Return Pool collection.
		return Pool;
	}
);