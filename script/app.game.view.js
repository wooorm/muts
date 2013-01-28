define( [ 'jquery', 'lodash', 'backbone', '$tore', 'game.collection' ], function( $, _, Backbone, $tore, collection )
	{
		var exports = this;

		var root = exports.app.root_game = document.createElement( 'div' );

		root.id = 'root_game';
		root.innerHTML = '<header><h1><span>League: </span>AMSU - 12</h1><h2><span>Tournament: </span>Threesome</h2></header><article><header></header><div id="data"><nav class="actions"><button class="add_set" id="add_set">Add</button><label for="add_set"> a set</label>, <label for="sort">sort sets by</label> <div class="select"><select class="sort" id="sort"><option value="set">Set number</option><option value="team1Score">Score team 1</option><option value="team2Score">Score team 2</option></select></div><span> (</span><label for="sort_order">ascending</label> <div class="checkbox"><input type="checkbox" id="sort_order" checked /><span class="checker"></span></div><span>).</nav><table><thead><tr><th>Team 1</th><th>Result</th><th>Team 2</th></tr></thead><tbody class="result_list"></tbody></table><table><thead><th>Set</th><th>Team 1 Result</th><th>Team 2 Result</th><th>Remove</th></thead><tbody class="set_list"></tbody></table></div></article>';

		exports.app.root.appendChild( root );

		// Create new `View` view.
		var View = Backbone.View.extend(
			{
				  'el' : root
				, 'set_el' : document.querySelector( '.set_list' )
				, 'result_el' : document.querySelector( '.result_list' )
				, 'initialize' : function initialize( id )
				{
					// Set Select and Checkbox value based on comparator variables.
					document.querySelector( '#sort' ).value = app.$tore.comparator.type;
					document.querySelector( '#sort_order' ).checked = app.$tore.comparator.order > 0;

					// Initialize collection.
					this.collection = new collection();

					var _this = this;

					if ( id )
					{
						app.api.config.game_id = +id;

						this.collection.fetch( {
							'success' : function success( data )
							{
								// Render the View.
								_this.render();
							}
						} );
					}

					// Bind `onadd`, add the set and rerender the results.
					this.collection.on( 'add', function callback( model, models )
						{
							this.renderSet( model, true );
							this.renderResults( true );
						}, this
					);

					// Bind `onremove`, and rerender the results.
					this.collection.on( 'remove', function callback( model, models )
						{
							this.renderResults( true );
						}, this
					);
				}
				, 'render' : function render( rerender )
				{
					// Render results, pass rerender through.
					this.renderResults( rerender );

					this.set_el.classList.add( 'inserting' );

					// If rerender, clear set element.
					if ( rerender )
						this.set_el.innerHTML = '';

					// Render the sets.
					_.each( this.collection.models, function callback( item )
						{
							this.renderSet( item );
						}
						, this
					);
					
					var el = this.set_el;
					window.setTimeout(
						function(){
							el.classList.remove( 'inserting' )
						}, 250
					);
				}
				, 'renderResults' : function renderResults( rerender )
				{
					var _this = this
					  , url = this.collection._url( {
							'fields' : '[team_2,team_1,winner,team_1_score,team_2_score]'
						}, 'games', true )
					;

					$.ajax( {
						  'dataType' : 'json'
						, 'url' : url
						, 'success': function success( data )
						{
							var overview = _this.overview
							  , el       = document.createElement( 'tr' )
							  ;
							
							overview = {
  							  	    'winner'     : data.winner_id? data.team_1_id === data.winner_id ? 1 : -1 : 0
  							  	  , 'team1'      : data.team_1.name
  							  	  , 'team2'      : data.team_2.name
  							  	  , 'team1Score' : data.team_1_score
  							  	  , 'team2Score' : data.team_2_score
  							}

							// Fill element with the overview object.
							el.innerHTML   = '<td' + ( overview.winner > 0 ?  ' class="winner"' : '' ) + '>' + overview.team1 + '</td><td>' + overview.team1Score + ' - ' + overview.team2Score + '</td><td' + ( overview.winner < 0? ' class="winner"' : '' ) + '>' + overview.team2 + '</td>';

							// If rerender, clear results element.
							if ( rerender )
								_this.result_el.innerHTML = '';

							// Append new node to results element.
							_this.result_el.appendChild( el );
						}
					} );
				}
				, 'show' : function show( args )
				{
					this.el.style.display = '';

					var _val = +args[ 0 ];

					// Only if NaN.
					if ( _val !== _val )
						return alert( 'debug:show:"incorrect value was given"', val, args[ 0 ] );

					var config = app.api.config, _this = this;

					if ( _val !== config.game_id )
					{
						config.game_id = _val;

						this.collection.fetch( {
							'success' : function success( data )
							{
								console.log( 'show:id', data );
								_this.render( true );
							}
						} );
					}
				}
				, 'hide' : function hide()
				{
					this.el.style.display = 'none';
					return 'hide:game:works';
				}
				, 'renderSet' : function renderSet( model, prepend )
				{
					// Create object from model, and a node.
					var obj        = model.toJSON()
					  , el         = document.createElement( 'tr' )
					  ;

  					// Fill element with the model object, add the CID.
					el.dataset.cid = model.cid;
					el.innerHTML   = [ '<td data-id="set">', obj.set, '</td><td data-id="team1Score">', obj.team1Score, '</td><td data-id="team2Score">', obj.team2Score, '</td><td class="button_bar"><button class="edit_set">Edit</button><button class="remove_set">Remove</button></td>' ].join( '' );

					// Append or prepend new node to set element.
					this.set_el[ prepend? 'insertBefore' : 'appendChild' ]( el, this.set_el.firstChild );
				}
				, 'addSet' : function addSet( event )
				{
					var _this = this, it, _collection = this.collection;

					app.add.request( {
						  'id' : _collection.id
						, 'onsuccess' : function onsuccess( response )
						{
							it = {
								  'set' : _this.collection.models.length
								, 'team1Score' : response.team_1_score
								, 'team2Score' : response.team_2_score
							}

		  					// Add input to collection.
							_collection.add( it );

							console.log( 'success', response );
						}
						, 'onerror' : function onerror( user, error )
						{
							console.log( 'error', user, error );
						}
					} );
				}
				, 'removeSet' : function removeSet( event )
				{
					// Get CID from parents parent.
					var p = event.target.parentElement.parentElement;

					// Remove model (by CID) from collection.
					this.collection.remove( p.dataset.cid );

					// Remove node from HTML.
					p.parentElement.removeChild( p );
				}
				, 'editSet' : function editSet( event )
				{
					var _collection = this.collection
					  , p = event.target.parentElement.parentElement
					  , _model = _collection.get( p.dataset.cid )
					  , children = p.children
					  , vals = {}
					  , buttons = null
					  , val, onclick
					  ;

					onclick = function onclick()
					{
						Array.prototype.forEach.call( children, function( it, i )
							{
								// Restore edit and remove buttons.
								if ( i === children.length - 1 )
									return it.innerHTML = buttons;

								// Get changed value from input. Store in `vals` and as new innerText.
								it.innerText = vals[ it.dataset.id ] = it.children[ 0 ].value;
							}
						);

						// Set new values to model and collection.
						_model.set( vals );
					};

					Array.prototype.forEach.call( children, function( it, i )
						{
							// Store the edit/and remove buttons, change them for a store button.
							if ( i === children.length - 1 )
							{
								buttons = it.innerHTML;
								it.innerHTML = '<button class="store_set">Store</button>';
								it.children[ 0 ].addEventListener( 'click', onclick );
								return;
							}

							// Store the value in `val`, and in the `vals` object.
							val = vals[ it.dataset.id ] = it.innerText;

							// Check for `NaN`.
							var isNumber = +val, isNumber = isNumber === isNumber;

							// Create input field.
							it.innerHTML = '<input type="' + ( isNumber? 'number' : 'text' ) + '" value="' + val + '" />';
						}
					);
				}
				, 'changeOrder' : function changeOrder( event )
				{
  					// Set new order to comparator.
					app.$tore.comparator.order = event.target.checked? 1 : -1;

  					// Sort and rerender collection.
					this.collection.sort();
					this.render( true );
				}
				, 'changeSort' : function changeSort( event )
				{
					if ( event.target.value )
						app.$tore.comparator.type = event.target.value;

					this.collection.sort();
					this.render( true );
				}
				, 'events' : {
					    'click .add_set' : 'addSet'
					  , 'click #sort_order' : 'changeOrder'
					  , 'change .sort' : 'changeSort'
					  , 'click .remove_set' : 'removeSet'
					  , 'click .edit_set' : 'editSet'
				},

			}
		);

		return View;
	}
);
