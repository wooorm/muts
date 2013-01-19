define(
	  [ 'jquery', 'lodash', 'backbone', '$tore', 'schedule.collection', 'showhide' ]
	, function anonymous( $, _, Backbone, $tore, collection )
	{
		var exports = this;

		var root = exports.app.root_game = document.createElement( 'div' );

		root.id = 'root_schedule';

		root.innerHTML = '<header><h1><span>League: </span>AMSU - 12</h1><h2><span>Tournament: </span>Threesome</h2></header><div id="data"><div id="contacts" class="actions"><header><form id="addContact" action="#"><div id="filter"><label>Select: </label><div class="select" id="filter_select"></div></div><label for="date">Date: </label><input type="text" id="date" /> <label for="team1">Team 1: </label><input type="text" id="team1" /><br/><label for="result">Result: </label><input type="text" id="result" /> <label for="team2">Team 2: </label><input type="text" id="team2" /> <input type="submit" value="Add"/></form><hr/></header></div><table><thead><th>Time</th><th>Team 1</th><th>Points</th><th>Team 2</th><th>Remove</th></thead><tbody class="game_list"></tbody></table><script id="contactTemplate" type="text/template"><td><%= date %></td><td><%= team1 %></td><td><%= result %></td><td><%= team2 %></td><td class="button_bar"><button class="edit">Edit</button><button class="delete">Remove</button></td></script></div>'

		



		exports.app.root.appendChild( root );
		
		var Contact = Backbone.View.extend( {
			  'tagName'  : 'tr'
			, 'className': 'contact-container'
			, 'template' : _.template( $( '#contactTemplate' ).html() )
			, 'events' : {
				  'click .delete': 'delete_contact'
			}
			, 'delete_contact' : function delete_contact( event )
			{
				this.model.destroy();
				this.remove();
			}
			, 'render' : function render()
			{
				this.el.dataset.cid = this.cid;
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			}
		} );

		var Directory = Backbone.View.extend( {
			  'el' : root
			, '$game_el' : $( '.game_list' )
			, 'initialize' : function initialize( data )
			{
				this.collection = new collection( app.$tore.schedule.collection.models );

				this.render();

				this.$el.find( '#filter' ).append( this.createSelect() );

				this.on( 'change:filterType', this.filterByType, this );
				this.collection.on( 'reset', this.render, this );
				this.collection.on( 'add', this.renderContact, this );
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
				  'change #filter select': 'setFilter'
				, 'submit #addContact': 'addContact'
				, 'click .delete': 'delete_contact'
			}
			, 'render' : function render()
			{
				this.$game_el.find( 'tr' ).remove();

				_.each( this.collection.models, function callback( item )
					{
						this.renderContact( item );
					}, this
				);
			}
			, 'renderContact' : function renderContact( item )
			{
				var contact = new Contact( {
					'model' : item
				} );

				this.$game_el.append( contact.render().el );
			}
			, 'getTypes' : function getTypes()
			{
				return _.uniq( this.collection.pluck( 'team1' ) );
			}
			, 'createSelect' : function createSelect()
			{
				var select = document.querySelector( '#filter_select' );
				g = document.createElement( 'select' );
				select.appendChild( g )
				g.innerHTML = '<option value="all">First Teams</option>';

				_.each( this.getTypes(), function callback( item )
					{
						g.innerHTML += [ '<option value="', item, '">', item, '</option>' ].join( '' )
					}
				);

				return select;
			}
			, 'delete_contact' : function delete_contact( event )
			{
				var p = event.target.parentElement.parentElement;

				this.collection.remove( p.dataset.cid );

				app.$tore.schedule.collection.models = this.collection.models;

				p.parentElement.removeChild( p );
			}
			, 'setFilter': function setFilter( e )
			{
				this.filterType = e.currentTarget.value;
				this.trigger( 'change:filterType' );
			}
			, 'filterByType': function filterByType()
			{
				if ( this.filterType === 'all' )
				{
					this.collection.reset( app.$tore.schedule.collection.models );
					// FED2.contactsRouter.navigate( 'filter/all' );
				}
				else
				{
					this.collection.reset( app.$tore.schedule.collection.models, {
						'silent' : true
					} );

					var filterType = this.filterType
					  , filtered = _.filter( this.collection.models, function callback( item )
							{
								return item.get( 'team1' ) === filterType;
							}
						);

					this.collection.reset( filtered );

					// FED2.contactsRouter.navigate( 'filter/' + filterType );
				}
			}
			, 'addContact' : function addContact( e )
			{
				e.preventDefault();
				var formData = {};

				$( '#addContact' ).find( 'input, select' ).each( function callback( i, el )
					{
						if ( el.id !== '' )
							formData[ el.id ] = el.value;
					}
				);

				this.collection.add( formData );

				app.$tore.schedule.collection.models = this.collection.models;
				console.log( 'a', app.$tore.schedule.collection.models.length );
			},
		} );

		return Directory;
	}
)