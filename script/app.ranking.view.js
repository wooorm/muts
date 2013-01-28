define(
	  [ 'jquery', 'lodash', 'backbone', 'ranking.collection' ]
	, function anonymous( $, _, Backbone, collection )
	{
		var exports = this;

		var root = exports.app.root_ranking = document.createElement( 'div' );

		root.id = 'root_ranking';

		root.innerHTML = '<header><h1><span>League:</span>AMSU - 12</h1><h1><span>Tournament:</span>Threesome</h1></header><article id="pool"><nav class="actions"><div id="filter">\n<label>Show:</label>\n</div></nav><table>\n<thead>\n<tr>\n<th>Team</th><th>Games Played</th><th>Wins</th><th>Loses</th><th>Saldo</th><th>Actions</th></tr>\n</thead>\n<tbody></tbody>\n</table>\n</article>\n\n<script id="rankingTemplate" type="text/template">\n<td><%= name %></td>\n<td><%= gamesPlayed %></td>\n<td><%= wins %></td>\n<td><%= losses %></td>\n<td><%= saldo %></td>\n<td><button class="delete_ranking">Remove</button></td>\n</script>'

		exports.app.root.appendChild( root );

		// Define individual tournament view.
		Team = Backbone.View.extend({
			  'tagName' : 'tr'
			, 'template' : $( '#rankingTemplate' ).html()
			, 'initialize' : function initialize()
			{
			}
			, 'events' : {
				'click .delete_ranking': 'deleteTeam'
			}
			, 'deleteTeam' : function deleteTeam( e )
			{
				// Prevent default behaviour.
				e.preventDefault();
				this.model.destroy();
				this.remove();
			}
			, 'render' : function render()
			{
				// Store template in variable.
				var tmpl = _.template( this.template );

				// Inject the rendered tempate into the views element.
				$( this.el ).html( tmpl( this.model.toJSON() ) );

				return this;
			}
		} );

		var Pool = Backbone.View.extend( {
			  'el' : $('#pool')
			, 'initialize' : function initialize()
			{
				var self = this;

				// Load the data for this collection.
				this.collection = new collection();
						

				this.collection.fetch( {
					'success' : function success( data )
					{
						// Show the collection on screen.
						self.render();

						// Show the filter.
						self.buildSelect();
					}
				} );

				// Listen for `change:filterType`.
				this.on( 'change:filterType', this.filterByType, this );

				// Listen for `reset` on collection.
		        this.collection.on( 'reset', this.render, this );

				// Listen for `remove` on collection.
				this.collection.on( 'remove', this.deleteTeam, this );
			}
			, 'events' : {
				'change #filter select': 'setFilter'
			}
			, 'render' : function render()
			{
				this.$el.find( 'tbody' ).html( '' );

				_.each( this.collection.models, function callback( model )
					{
						this.renderTeam( model );
					}, this
				);
			}
			, 'renderTeam': function renderTeam( it )
			{
				// Render team

				// Create new instance of Team.
				var team = new Team( {
					'model' : it
				} );

				// Append the rendered HTML to the views element.
				this.$el.find( 'tbody' ).append( team.render().el );
		    }
			, 'getTypes' : function getTypes()
			{
				// Get names for team select box.

				return _.uniq( this.collection.pluck( 'name' ), false
					, function callback( type )
					{
						return type.toLowerCase();
					}
				);
			}
			, 'buildSelect': function buildSelect()
			{
				// Create team select box.

				var filter = this.$el.find('#filter')
				  , select, div
				  ;

				select = $( '<select/>', {
					'html' : '<option value="all">All</option>'
				} );

				// Empty #filter.
				filter.html( '<label>Show:</label>' );

				_.each( this.getTypes(), function callback( it )
					{
						$( '<option/>', {
							  'value' : it.toLowerCase()
							, 'text'  : it
						} ).appendTo( select );
					}
				);
				
				div = $( '<div class="select"/>' ).append( select )

			    this.$el.find( '#filter' ).append( div ); 
			}
			, 'setFilter' : function setFilter( e )
			{
				// Set filter.
				this.filterType = e.currentTarget.value;

				console.log( 'set:filterType', this.filterType );

				// Trigger custom event handler.
				this.trigger( 'change:filterType' );
			}
			, 'filterByType' : function filterByType()
			{

				if ( this.filterType === 'all' )
				{
					this.collection.reset( this.collection._cache );
				}
				else
				{
					this.collection.reset( this.collection._cache, {
						'silent' : true
					} );

					var filterType = this.filterType
					  , filtered
					  ;

					filtered = _.filter( this.collection.models, function callback( it )
						{
							return it.get( 'name' ).toLowerCase() === filterType;
						}
					);

					this.collection.reset( filtered );
			    }
			}
			, 'deleteTeam' : function deleteTeam()
			{
				// At this point Backbone has already removed the model from
				// the collection. So just set the data to the collection
				this.persist();

				this.buildSelect();
			}
			, 'persist' : function persist()
			{
				// Save current collection to data
				this.collection._cache = this.collection.models;
			}
			, 'show' : function show( args )
			{
				root.style.display = '';
				return 'show:ranking:works';
			}
			, 'hide' : function hide()
			{
				root.style.display = 'none';
				return 'hide:ranking:works';
			}
		} );

		return Pool;
	}
)