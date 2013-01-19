define( [ 'jquery', 'lodash', 'backbone', '$tore', 'game.collection' ], function( $, _, Backbone, $tore, collection )
	{
		var exports = this;

		var root = exports.app.root_game = document.createElement( 'div' );

		root.id = 'root_game';
		root.innerHTML = '<header><h1><span>League: </span>AMSU - 12</h1><h2><span>Tournament: </span>Threesome</h2></header><article><header><h3>Pool A - Score Updates - Boomsquad vs. Burning Snow</h3></header><div id="data"><nav class="actions"><button class="add_set" id="add_set">Add</button><label for="add_set"> a set</label>, <label for="sort">sort sets by</label> <div class="select"><select class="sort" id="sort"><option value="set">Set number</option><option value="team1Score">Score team 1</option><option value="team2Score">Score team 2</option></select></div><span> (</span><label for="sort_order">ascending</label> <div class="checkbox"><input type="checkbox" id="sort_order" checked /><span class="checker"></span></div><span>) or filter by score: </span><br /><label for="team1Type">Score team 1</label><span> is </span> <div class="select"><select class="team1Type filter_score" id="team1Type"><option value="gte" selected>more than or equal to</option><option value="gt">more than</option><option value="is">equal to</option><option value="lt">less than</option><option value="lte">less than or equal to</option></select></div> <input class="filter_score" type="number" id="team1Value" min="0" max="10" value="0" /><span>, </span><div class="select"><select class="filter_score" id="type"><option value="and" selected>and</option><option value="or">or</option></select></div> <label for="team2Type">Score team 2</label> <div class="select"><select class="team2Type filter_score" id="team2Type"><span> is </span><option value="gte" selected>more than or equal to</option><option value="gt">more than</option><option value="is">equal to</option><option value="lt">less than</option><option value="lte">less than or equal to</option></select></div> <input class="filter_score" type="number" id="team2Value" min="0" max="10" value="0"/></nav><table><thead><tr><th>Team</th><th>Result</th><th>Team</th></tr></thead><tbody class="result_list"></tbody></table><table><thead><th>Set</th><th>Team</th><th>Team 1 Result</th><th>Team 2 Result</th><th>Team</th><th>Remove</th></thead><tbody class="set_list"></tbody></table></div></article>';

		exports.app.root.appendChild( root );

		var filter = function filter( model )
		{
			var t1 = filter.functions[ filter.team1Type ]( model.get( 'team1Score' ), filter.team1Value )
			  , t2 = filter.functions[ filter.team2Type ]( model.get( 'team2Score' ), filter.team2Value )
			  ;

			return filter.type > 0? t1 && t2 : t1 || t2;
		}

		filter.functions = {
			  'gt'  : function gt( a, b ) { return a > b }
			, 'gte' : function gt( a, b ) { return a >= b }
			, 'lt'  : function lt( a, b ) { return a < b }
			, 'lte' : function lte( a, b ) { return a <= b }
			, 'is'  : function is( a, b ) { return a == b }
		}

		// Get comparator data from LocalStorage.
		filter.team1Type  = 'gte';
		filter.team1Value = 0;
		filter.team2Type  = 'gte';
		filter.team2Value = 0;
		filter.type       = 1;

		// Create new `View` view.
		var View = Backbone.View.extend(
			{
				  'el' : root
				, 'set_el' : document.querySelector( '.set_list' )
				, 'result_el' : document.querySelector( '.result_list' )
				, 'initialize' : function initialize()
				{
					// Set Select and Checkbox value based on comparator variables.
					document.querySelector( '#sort' ).value = app.$tore.comparator.type;
					document.querySelector( '#sort_order' ).checked = app.$tore.comparator.order > 0;

					// Set filter values based on comparator variables.
					document.querySelector( '#team1Type' ).value  = filter.team1Type;
					document.querySelector( '#team1Value' ).value = filter.team1Value;
					document.querySelector( '#team2Type' ).value  = filter.team2Type;
					document.querySelector( '#team2Value' ).value = filter.team2Value;
					document.querySelector( '#type' ).value = filter.type > 0? 'and' : 'or';

					// Initialize collection.
					this.collection = new collection( app.$tore.collection.models );

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

					// Render the View.
					this.render();
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
					// Create an overview object from all sets, and a node.
					var overview = this.overview = this.createOverview()
					  , el       = document.createElement( 'tr' )
					  ;

					// Fill element with the overview object.
					el.innerHTML   = '<td' + ( overview.winner === 'team1'?  ' class="winner"' : '' ) + '>' + overview.team1 + '</td><td>' + overview.team1Score + ' - ' + overview.team2Score + '</td><td' + ( overview.winner === 'team2'? ' class="winner"' : '' ) + '>' + overview.team2 + '</td>';

					// If rerender, clear results element.
					if ( rerender )
						this.result_el.innerHTML = '';

					// Append new node to results element.
					this.result_el.appendChild( el );
				}
				, 'show' : function show()
				{
					this.el.style.display = '';
				}
				, 'hide' : function hide()
				{
					this.el.style.display = 'none';
				}
				, 'renderSet' : function renderSet( model, prepend )
				{
					// Create object from model, and a node.
					var obj        = model.toJSON()
					  , el         = document.createElement( 'tr' )
					  ;

  					// Fill element with the model object, add the CID.
					el.dataset.cid = model.cid;
					el.innerHTML   = [ '<td data-id="set">', obj.set, '</td><td data-id="team1">', obj.team1, '</td><td data-id="team1Score">', obj.team1Score, '</td><td data-id="team2Score">', obj.team2Score, '</td><td data-id="team2">', obj.team2, '</td><td class="button_bar"><button class="edit_set">Edit</button><button class="remove_set">Remove</button></td>' ].join( '' );

					// Append or prepend new node to set element.
					this.set_el[ prepend? 'insertBefore' : 'appendChild' ]( el, this.set_el.firstChild );
				}
				, 'addSet' : function addSet( event )
				{
					// Prompt user for some JSON.
					var _this       = this
					  , _collection = this.collection
					  , _model      = _collection.models[ 0 ]
					  , _length     = _collection.length
					  , it          = {}
					  , val         = window.prompt( 'Gimme some scores.', '{ "team1Score": 0, "team2Score": 0 }' )
					  ;

  					// Return early if invalid JSON was passed.
					if ( !( it = util.from_json( val ) ) )
						return;

  					// Set defaults to input.
					it.set   || ( it.set   = this.overview.missingSet || _length + 1 );
					it.team1 || ( it.team1 = _model.get( 'team1' ) );
					it.team2 || ( it.team2 = _model.get( 'team2' ) );

  					// Add input to collection.
					_collection.add( it );

  					// Store models in LocalStorage.
					app.$tore.collection.models = _collection.models;
				}
				, 'removeSet' : function removeSet( event )
				{
  					// Get CID from parents parent.
					var p = event.target.parentElement.parentElement;

  					// Remove model (by CID) from collection.
					this.collection.remove( p.dataset.cid );

  					// Store models in LocalStorage.
					app.$tore.collection.models = this.collection.models;

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

						// Store models in localStorage.
						app.$tore.collection.models = _collection.models;
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
				, 'changeFilter'  : function changeFilter( event )
				{
					filter[ event.target.id ] = event.target.value;

					models = this.collection.filter( filter, this );

					this.set_el.classList.add( 'inserting' );
					this.set_el.innerHTML = '';

					// Render the sets.
					_.each( models, function callback( item )
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
				, 'createOverview' : function createOverview()
				{
  					// Create default overview object, store models.
					var attrs, overview = {
					  	    'winner'     : null
					  	  , 'team1'      : ''
					  	  , 'team2'      : ''
					  	  , 'team1Score' : 0
					  	  , 'team2Score' : 0
					  	  , 'missingSet' : null
					 }, models =  this.collection.models
					  ;

					// Iterate over models to add scores to overview object.
  					_.each( models, function callback( it, n, us )
  						{
							attrs = it.attributes;

							if ( !overview.missingSet && attrs.set !== n + 1 )
								overview.missingSet = n + 1;

							if ( attrs.team2Score !== attrs.team1Score )
								overview[ attrs.team2Score > attrs.team1Score? 'team2Score' : 'team1Score' ]++;
  						}
  					);
					overview.team1 = models[ 0 ].get( 'team1' );
					overview.team2 = models[ 0 ].get( 'team2' );

					if ( overview.team2Score !== overview.team1Score )
						overview[ 'winner' ] = overview.team1Score > overview.team2Score? 'team1' : 'team2';

					return overview;
				}
				, 'events' : {
					    'click .add_set' : 'addSet'
					  , 'click #sort_order' : 'changeOrder'
					  , 'change .sort' : 'changeSort'
					  , 'change .filter_score' : 'changeFilter'
					  , 'click .remove_set' : 'removeSet'
					  , 'click .edit_set' : 'editSet'
				},

			}
		);

		return View;
	}
);
