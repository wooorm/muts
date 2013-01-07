	(
	function ( $ )
	{
		// Helper function. Returns undefined if something's wrong with the 
		// JSON, returns the parsed JSON if the string is JSON.
		JSON.isJSON = function isJSON( string )
		{
			try
			{
				return JSON.parse( string );
			}
			catch (e) { return };
		}

		// Raw data.
		var sets = JSON.isJSON( localStorage.getItem( 'collection.models' ) ) || [
			  { 'set': 1, 'team1' : 'Boomsquad', 'team1Score' : 4, 'team2' : 'Burning Snow', 'team2Score' : 1 }
			, { 'set': 2, 'team1' : 'Boomsquad', 'team1Score' : 3, 'team2' : 'Burning Snow', 'team2Score' : 4 }
			, { 'set': 3, 'team1' : 'Boomsquad', 'team1Score' : 0, 'team2' : 'Burning Snow', 'team2Score' : 4 }
			, { 'set': 4, 'team1' : 'Boomsquad', 'team1Score' : 2, 'team2' : 'Burning Snow', 'team2Score' : 4 }
			, { 'set': 5, 'team1' : 'Boomsquad', 'team1Score' : 4, 'team2' : 'Burning Snow', 'team2Score' : 3 }
		];

		// Create new `Set` model.
		var Set = Backbone.Model.extend( {} );

		// Create a comparator function.
		var comparator = function comparator( it )
		{
			return it.get( comparator.type ) * comparator.order;
		};

		// Get comparator data from LocalStorage (typecast `comparator.order`).
		comparator.order = +localStorage.getItem( 'comparator.order' ) || 1;
		comparator.type = localStorage.getItem( 'comparator.type' ) || 'set';

		// Set Select and Checkbox value based on comparator variables.
		document.querySelector( '#sort' ).value = comparator.type;
		document.querySelector( '#sort_order' ).checked = comparator.order > 0;

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

		// Get comparator data from LocalStorage (typecast `comparator.order`).
		filter.team1Type  = 'gte';
		filter.team1Value = 0;
		filter.team2Type  = 'gte';
		filter.team2Value = 0;
		filter.type       = 1;

		// Set filter values based on comparator variables.
		document.querySelector( '#team1Type' ).value  = filter.team1Type;
		document.querySelector( '#team1Value' ).value = filter.team1Value;
		document.querySelector( '#team2Type' ).value  = filter.team2Type;
		document.querySelector( '#team2Value' ).value = filter.team2Value;
		document.querySelector( '#type' ).value = filter.type > 0? 'and' : 'or';

		// Create new `Game` collection.
		var Game = Backbone.Collection.extend(
			{
				  'model' : Set
				, 'comparator' : comparator
			}
		);

		// Create new `GameView` view.
		var GameView = Backbone.View.extend(
			{
				  'el' : document.querySelector( '#data' )
				, 'set_el' : document.querySelector( '.set_list' )
				, 'result_el' : document.querySelector( '.result_list' )
				, 'initialize' : function initialize()
				{
					// Initialize collection.
					this.collection = new Game( sets );

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

					// Render the GameView.
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
				, 'renderSet' : function renderSet( model, prepend )
				{
					// Create object from model, and a node.
					var obj        = model.toJSON()
					  , el         = document.createElement( 'tr' )
					  ;

  					// Fill element with the model object, add the CID.
					el.dataset.cid = model.cid;
					el.innerHTML   = [ '<td>', obj.set, '</td><td>', obj.team1, '</td><td>', obj.team1Score, ' - ', obj.team2Score, '</td><td>', obj.team2, '</td><td><button class="remove_set">Remove</button></td>' ].join( '' );

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
					if ( !( it = JSON.isJSON( val ) ) )
						return

  					// Set defaults to input.
					it.set   || ( it.set   = this.overview.missingSet || _length + 1 );
					it.team1 || ( it.team1 = _model.get( 'team1' ) );
					it.team2 || ( it.team2 = _model.get( 'team2' ) );

  					// Add input to collection.
					_collection.add( it );

  					// Store models in LocalStorage.
					localStorage.setItem( 'collection.models', JSON.stringify( _collection.models ) );
				}
				, 'removeSet' : function removeSet( event )
				{
  					// Get CID from parents parent.
					var p = event.target.parentElement.parentElement;

  					// Remove model (by CID) from collection.
					this.collection.remove( p.dataset.cid );

  					// Store models in LocalStorage.
					localStorage.setItem( 'collection.models', JSON.stringify( this.collection.models ) );

					// Remove node from HTML.
					p.parentElement.removeChild( p );
				}
				, 'changeOrder' : function changeOrder( event )
				{
  					// Set new order to comparator.
					comparator.order = event.target.checked? 1 : -1;

  					// Store order in LocalStorage.
					localStorage.setItem( 'comparator.order', comparator.order );

  					// Sort and rerender collection.
					this.collection.sort();
					this.render( true );
				}
				, 'changeSort' : function changeSort( event )
				{
					comparator.type = event.target.value || comparator.type;
					localStorage.setItem( 'comparator.type', comparator.type );

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
				},

			}
		);

		// Instanciate the `GameView` view.
		new GameView();
	}
( jQuery ) );