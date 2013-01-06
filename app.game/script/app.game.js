	(
	function ( $ )
	{
		window.exports || ( window.exports = {} );

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

		var comparator = function set( it )
		{
			return it.get( comparator.type ) * comparator.order;
		};

		// Get comparator data from LocalStorage.
		comparator.order = +localStorage.getItem( 'comparator.order' ) || 1;
		comparator.type = localStorage.getItem( 'comparator.type' ) || 'set';

		// Set Select and Checkbox value based on comparator variables.
		document.querySelector( '#sort' ).value = comparator.type;
		document.querySelector( '#sort_order' ).checked = comparator.order > 0;


		// Create new `Game` collection.
		var Game = Backbone.Collection.extend(
			{
				  'model' : Set
				, 'comparator' : comparator
			}
		);

		// Create new `SetView` view.
		var SetView = Backbone.View.extend();

		var ResultView = Backbone.View.extend(
			{
				  'tagName' : 'tr'
				, 'template' : function template( obj )
				{
					return '<td' + ( obj.winner === 'team1'?  ' class="winner"' : '' ) + '>' + obj.team1 + '</td><td>' + obj.team1Score + ' - ' + obj.team2Score + '</td><td' + ( obj.winner === 'team2'? ' class="winner"' : '' ) + '>' + obj.team2 + '</td>';
				}
				, 'render' : function render()
				{
					this.el.innerHTML = this.template( this.model );
					this.el.dataset.cid = this.cid;
					return this;
				}
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
					var _this = this;
					this.collection = new Game( sets );

					this.collection.bind( 'add', function callback( model, models )
						{
							_this.renderResults( true );
							_this.renderSet( model, true );
						}
					);

					this.collection.bind( 'remove', function callback( model, models )
						{
							_this.renderResults( true );
						}
					);

					this.render();
				}
				, 'render' : function render()
				{
					var _this = this;

					this.renderResults();

					_.each( this.collection.models, function callback( item )
						{
							_this.renderSet.call( _this, item );
						}
						, this
					);
				}
				, 'rerender' : function rerender()
				{
					var _this = this;
				
					this.set_el.innerHTML = '';

					_.each( this.collection.models, function callback( item )
						{
							_this.renderSet( item );
						}
						, this
					);
				}
				, 'renderResults' : function renderResults( rerender )
				{
					var resultView = new ResultView(
						{
							'model' : this.cleanResults( this.collection.models )
						}
					);

					if ( rerender )
						this.result_el.innerHTML = '';

					this.result_el.appendChild( resultView.render().el );
				}
				, 'cleanResults' : function cleanResults( _model )
				{
					var attrs, model = {
					  	    'winner'     : null
					  	  , 'team1'      : ''
					  	  , 'team2'      : ''
					  	  , 'team1Score' : 0
					  	  , 'team2Score' : 0
					  };

					_model.forEach( function callback( it, n, us )
						{
							attrs = it.attributes;

							if ( attrs.team2Score !== attrs.team1Score )
								model[ attrs.team2Score > attrs.team1Score? 'team2Score' : 'team1Score' ]++;
						}
					);

					model.team1 = _model[ 0 ].attributes.team1;
					model.team2 = _model[ 0 ].attributes.team2;

					if ( model.team2Score !== model.team1Score )
						model[ 'winner' ] = attrs.team2Score > attrs.team1Score? 'team2' : 'team1';

					return model;
				}
				, 'setViews' : []
				, 'renderSet' : function render( model, prepend )
				{
					var obj = model.toJSON();
					el = document.createElement( 'tr' );
					el.dataset.cid = model.cid;
					el.innerHTML = [ '<td>', obj.set, '</td><td>', obj.team1, '</td><td>', obj.team1Score, ' - ', obj.team2Score, '</td><td>', obj.team2, '</td><td><button class="remove_set">Remove</button></td>' ].join( '' );

					if ( prepend )
					{
						this.set_el.insertBefore( el, this.set_el.firstChild );
					}
					else
					{
						this.set_el.appendChild( el );
					}

					return el
				}
				, 'addSet' : function addSet( event )
				{
					var _collection = this.collection
					  , _model = _collection.models[ 0 ]
					  , _length = _collection.length
					  ;


					var it = {}
					  , _this = this
					  , val = window.prompt( 'Gimme some scores.', '{\n    "team1Score": 0\n  , "team2Score": 0\n}' );

					if ( !( it = JSON.isJSON( val ) ) )
						return

					it.set = _length + 1;
					it.team1 = 	_model.get( 'team1' );
					it.team2 = 	_model.get( 'team2' );


					_collection.add( [ it ] );
					localStorage.setItem( 'collection.models', JSON.stringify( _collection.models ) );
				}
				, 'removeSet' : function removeSet( event )
				{
					var p = event.target.parentElement.parentElement;

					this.collection.remove( p.dataset.cid );
					localStorage.setItem( 'collection.models', JSON.stringify( this.collection.models ) );

					p.parentElement.removeChild( p );
				}
				, 'changeOrder' : function changeOrder( event )
				{
					comparator.order = event.target.checked? 1 : -1;
					localStorage.setItem( 'comparator.order', comparator.order );
					this.collection.sort();
					this.rerender();
				}
				, 'changeSort' : function changeOrder( event )
				{
					comparator.type = event.target.value || comparator.type;
					localStorage.setItem( 'comparator.type', comparator.type );

					this.collection.sort();
					this.rerender();
				}
				, 'events' : {
					    'click .add_set' : 'addSet'
					  , 'click #sort_order' : 'changeOrder'
					  , 'change .sort' : 'changeSort'
					  , 'click .remove_set' : 'removeSet'
				},

			}
		);

		// Instanciate the `GameView` view.
		exports.gameView = new GameView();
		exports.comparator = comparator;
	}
( jQuery ) );