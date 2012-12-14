(
	function ( $ )
	{

		// Raw data.
		var sets = [
			  { 'set': 1, 'team1' : 'Boomsquad', 'team1Score' : 4, 'team2' : 'Burning Snow', 'team2Score' : 1 }
			, { 'set': 2, 'team1' : 'Boomsquad', 'team1Score' : 3, 'team2' : 'Burning Snow', 'team2Score' : 4 }
			, { 'set': 3, 'team1' : 'Boomsquad', 'team1Score' : 0, 'team2' : 'Burning Snow', 'team2Score' : 4 }
			, { 'set': 4, 'team1' : 'Boomsquad', 'team1Score' : 2, 'team2' : 'Burning Snow', 'team2Score' : 4 }
			, { 'set': 5, 'team1' : 'Boomsquad', 'team1Score' : 4, 'team2' : 'Burning Snow', 'team2Score' : 3 }
		];

		// Create new `Set` model.
		var Set = Backbone.Model.extend( {} );

		// Create new `Game` collection.
		var Game = Backbone.Collection.extend(
			{
				'model' : Set
			}
		);

		// Create new `SetView` view.
		var SetView = Backbone.View.extend(
			{
				  'tagName' : 'tr'
				, 'template' : function template( obj )
				{
					return '<td>' + obj.set + '</td><td>' + obj.team1 + '</td><td>' + obj.team1Score + ' - ' + obj.team2Score + '</td><td>' + obj.team2 + '</td>';
				}
				, 'render' : function render()
				{
					this.el.innerHTML = this.template( this.model.toJSON() );

					return this;
				}
			}
		);

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
					this.collection = new Game( sets );
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
				, 'renderResults' : function renderSet()
				{
					var resultView = new ResultView(
						{
							'model' : this.cleanResults( this.collection.models )
						}
					);

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
				, 'renderSet' : function renderSet( item )
				{
					var setView = new SetView(
						{
							'model' : item
						}
					);

					this.set_el.appendChild( setView.render().el );
				}
			}
		);

		// Instanciate the `GameView` view.
		new GameView();

	}
( jQuery ) );