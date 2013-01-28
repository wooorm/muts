define(
	  [ 'jquery', 'lodash', 'backbone', '$tore', 'schedule.collection' ]
	, function anonymous( $, _, Backbone, $tore, collection )
	{
		var exports = this;

		var root = exports.app.root_game = document.createElement( 'div' );

		root.id = 'root_schedule';

		root.innerHTML = '<header><h1><span>League: </span>AMSU - 12</h1><h2><span>Tournament: </span>Threesome</h2></header><div id="data"><div id="contacts" class="actions"><header><form id="addContact" action="#"><div id="filter"><label>Select: </label><div class="select" id="filter_select"></div></div><label for="date">Date: </label><input type="text" id="date" /> <label for="team1">Team 1: </label><input type="text" id="team1" /><br/><label for="result">Result: </label><input type="text" id="result" /> <label for="team2">Team 2: </label><input type="text" id="team2" /> <input type="submit" value="Add"/></form><hr/></header></div><table><thead><th>Date</th><th>Team 1</th><th>Points</th><th>Team 2</th><th>Remove</th></thead><tbody class="game_list"></tbody></table><script id="contactTemplate" type="text/template"><td><%= datum %></td><td><a href="#/game/<%= id %>"><%= team1_naam %></a></td><td><%= team1_score %> - <%= team2_score %></td><td><%= team2_naam %></td><td class="button_bar"><button class="edit">Edit</button><button class="delete">Remove</button></td></script></div><script id="contactEditTemplate" type="text/template"><td><%= datum %></td><td><a href="#/game/<%= id %>"><%= team1_naam %></a></td><td><form action="#"><input style="display: none;" class="id" value="<%= id %>" /><input class="team1_score" value="<%= team1_score %>" /><input class="team2_score" value="<%= team2_score %>" /><button class="save">Save</button><button class="cancel">Cancel</button></form></td><td><%= team2_naam %></td></script>'

		exports.app.root.appendChild( root );
		
		var Contact = Backbone.View.extend( {
			  'tagName'  		: 'tr'
			, 'className'		: 'contact-container'
			, 'template' 		: _.template( $( '#contactTemplate' ).html() )
			, 'editTemplate'	: _.template($("#contactEditTemplate").html())
			, 'events' : {
				  'click .delete'	: 'delete_contact'
				, 'click .edit'		: 'editContact'
				, 'click .save'		: 'saveEdits'
				, 'click .cancel'	: 'cancelEdit'  
			}
			, 'delete_contact' : function delete_contact( event )
			{
				this.model.destroy();
				this.remove();
			}
			, editContact: function ()
			{
            	// console.log('test');
            	// console.log("edit model data:", this.model.toJSON());
            	this.$el.html(this.editTemplate(this.model.toJSON()));
	            this.$el.find("input[type='hidden']").remove();
	        }
	        , saveEdits: function (e)
	        {
            	e.preventDefault();
            	// console.log("Test new game: ",formData);
            	var formData = {},
                prev = this.model.previousAttributes();
                // console.log("Prev", this.model.previousAttributes());
                // console.log("helemaal:", $(e.target).closest("form"));
            	
            	//get form data
            	$(e.target).closest("form").find(":input").not("button").each(function ()
            	{
	                var el = $(this);
	                formData[el.attr("class")] = el.val();
	                // console.log("Get Form data:", formData);
            	});

            	//update model
            	this.model.set(formData);
            	// console.log("update model with formdata:", formData);
            	//render view
            	this.render();

            	//update contacts array
            	_.each(FED2.poolData, function (contact)
            	{
	                if (_.isEqual(contact, prev))
	                {
	                    FED2.poolData.splice(_.indexOf(FED2.poolData, contact), 1, formData);
                	}
            	});
        	}
        	, cancelEdit: function () 
        	{
            	this.render();
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
				var self = this;
				this.collection = new collection( app.$tore.schedule.collection.models );

				this.collection.fetch({
	            	'success' : function success( data )
	            	{
	                	// console.log(self.collection.toJSON());
	                
		                _.each(self.collection.models, function(model){
		                    //set a resource uri on the model
		                    // console.log("model data: ", model.toJSON());
		                    // console.log("model: ", model);
		                    model.url = model.get('resource_uri');
		                    // console.log(model.url);
		                } );

		                app.$tore.schedule.collection.models = data;

		                self.render();
						self.$el.find( '#filter' ).append( self.createSelect() );
		            }
		        } );

				

				this.on( 'change:filterType', this.filterByType, this );
				this.collection.on( 'reset', this.render, this );
				this.collection.on( 'add', this.renderContact, this );
			}
			, 'show' : function show( args )
			{
				root.style.display = '';
				return 'show:schedule:works';
			}
			, 'hide' : function hide()
			{
				root.style.display = 'none';
				return 'hide:schedule:works';
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
				return _.uniq( this.collection.pluck( 'team1_naam' ) );
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
								return item.get( 'team1_naam' ) === filterType;
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
				// console.log( 'a', app.$tore.schedule.collection.models.length );
			},
		} );

		return Directory;
	}
)