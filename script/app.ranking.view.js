define(
	  [ 'jquery', 'lodash', 'backbone', '$tore', 'ranking.collection' ]
	, function anonymous( $, _, Backbone, $tore, collection )
	{
		var exports = this;

		var root = exports.app.root_game = document.createElement( 'div' );

		root.id = 'root_ranking';

		root.innerHTML = '<header><h1><span>League: </span>AMSU - 12</h1><h2><span>Tournament: </span>Threesome</h2></header><div id="data"><nav class="actions"><form id="addTeam">Add new team: <label for=teamname>Team name:</label> <input type="text" name="teamname" id="teamname" />, <label for=wins>Wins</label>: <input type="text" name="wins" id="wins" />, <label for=losses>Losses</label>: <input type="text" name="losses" id="losses" />, <label for=setswon>Sets won</label>: <input type="text" name="setswon" id="setswon" />, <label for="setslost">Sets lost</label>: <input type="text" name="setslost" id="setslost">, <label for=pointswon>Points won</label>: <input type="text" name="pointswon" id="pointswon" />, <label for=pointslost>Points lost</label>: <input type="text" name="pointslost" id="pointslost" />, <input type="submit" value="Submit" class="submit" />.</form></nav><article id="pool"><header><h3>Pool A - Ranking</h3></header><label>Select: </label><div class="select" id="filter"></div><table><thead><tr><th>Team</th><th>W</th><th>L</th><th>Sets won</th><th>Sets lost</th><th>Points won</th><th>Points lost</th><th>+/-</th><th>Change</th></tr></thead><tbody></tbody></table></article><script id="rankingTemplate" type="text/template"><td><%= team %></td><td><%= Win %></td><td><%= Lost %></td><td><%= Sw %></td><td><%= Sl %></td><td><%= Pw %></td><td><%= Pl %></td><td><%= Saldo %></td><td class="button_bar"><button class="edit">Edit</button><button class="delete">Remove</button></td></script>';

		exports.app.root.appendChild( root );

		// Define individual tournament view.
		var TeamView = Backbone.View.extend( {
			  'tagName' : 'tr'
			, 'template' : $( '#rankingTemplate' ).html()
			, 'events' : {
				'click .delete': 'deleteTeam'
			}
			, 'deleteTeam' : function deleteTeam()
			{
				this.model.destroy();
				this.remove();
			}
			, 'render' : function render()
			{
					// Store template in variable
					var tmpl = _.template( this.template );

					// Inject the rendered tempate into the views element
					$( this.el ).html( tmpl( this.model.toJSON() ) );

					return this;
			}
		} );

		// Define pool view
		var PoolView = Backbone.View.extend( {
			  'el' : root
			, 'initialize' : function initialize()
			{
				// Run this function whenever this collection is created

				// Load the data for this collection
				this.collection = new collection( app.$tore.ranking.collection.models );
				
				// Show the collection on screen
				this.render();

				// Show the select on screen
				this.buildSelect();

				// Listen for 'change:filterType'
				this.on( 'change:filterType', this.filterByType, this );

				// Listen for 'reset' on collection
				this.collection.on( 'reset', this.render, this );

				// Listen for 'remove' on collection
				this.collection.on( 'remove', this.deleteTeam, this );
			}
			, 'show' : function show()
			{
				this.el.style.display = '';
			}
			, 'hide' : function hide()
			{
				this.el.style.display = 'none';
			}
			, 'events' : {
				// Listen for DOM events
				'change #filter select': 'setFilter',
				'submit #addTeam' : 'addTeam'
			}
			, 'render' : function render()
			{
				// Show collection on screen
				this.$el.find( 'tbody' ).html( '' );

				_.each( this.collection.models, function callback( it )
				{
					this.renderTeam( it );
				}, this );
			}
			, 'renderTeam' : function renderTeam( it )
			{
				// Render schedule

				// Create new instance of TeamView
				var teamView = new TeamView(
					{
						'model' : it
					}
				);

				// Append the rendered HTML to the views element
				this.$el.find( 'tbody' ).append( teamView.render().el );
			}
			, 'getTypes' : function getTypes()
			{
				// Get names for team select box
				return _.uniq( this.collection.pluck( 'team' ), false, function callback( it )
					{
						return it.toLowerCase();
					}
				);
			}
			, 'buildSelect' : function buildSelect()
			{
				// Create team select box
				var filter = this.$el.find('#filter')
				  , select = $('<select/>', {
						'html' : '<option value="all">all</option>'
					}
				);

				//Empty #filter
				filter.html( '' );

				_.each( this.getTypes(), function callback( it )
					{
						var option = $( '<option/>', {
								'value' : it.toLowerCase(),
								'text' : it.toLowerCase()
							}
						).appendTo( select );
					}
				);

				this.$el.find( '#filter' ).append( select );
			}
			, 'setFilter'  : function setFilter( e )
			{
				// Set filter
				this.filterType = e.currentTarget.value;

				// Trigger custom event handler
				this.trigger('change:filterType');
			}
			, 'filterByType' : function filterByType()
			{
				// Filter the collection
				if ( this.filterType === 'all' )
				{
					this.collection.reset( app.$tore.ranking.collection.models );
				}
				else
				{
					this.collection.reset( app.$tore.ranking.collection.models, { 'silent' : true } );

					var filterType = this.filterType
					  , filtered
					  ;

					filtered = _.filter( this.collection.models, function callback( it )
						{
							return it.get( 'team' ).toLowerCase() === filterType;
						}
					);

					this.collection.reset( filtered );
				}
			}
			, 'deleteTeam' : function deleteTeam()
			{
				// At this point backbone already deleted the model from the collection.
				// So just set the data to the collection

				this.persist();
				this.buildSelect();
			}
			, 'addTeam' : function addTeam( event )
			{
				event.preventDefault();

				var form = $( '#addTeam' );

				//Use the object team and get the values out of the input fields
				var team = {
					  'team' : form.find( 'input[name=teamname]' ).val()
					, 'Win' :  +form.find( 'input[name=wins]' ).val()
					, 'Lost' : +form.find( 'input[name=losses]' ).val()
					, 'Sw' : +form.find( 'input[name=setswon]' ).val()
					, 'Sl' : +form.find( 'input[name=setslost]' ).val()
					, 'Pw' : +form.find( 'input[name=pointswon]' ).val()
					, 'Pl' : +form.find( 'input[name=pointslost]' ).val()
				};

				this.collection.add( team );

				this.render();

				this.persist();

				this.buildSelect();
			}
			,
			'persist' : function persist()
			{
				//Save current collection to data.
				app.$tore.ranking.collection.models = this.collection.models;
			}
		} );

		return PoolView;
	}
)