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

		// Create new `GameView` view.
		var GameView = Backbone.View.extend(
			{
				  'el' : document.querySelectorAll( '.set_list' )
				, 'initialize' : function initialize()
				{
					this.collection = new Game( sets );
					this.render();
				}
				, 'render' : function render()
				{
					var _this = this;

					_.each( this.collection.models, function callback( item )
						{
							_this.renderSet.call( _this, item );
						}
						, this
					);
				}
				, 'renderSet' : function renderSet( item )
				{
					var setView = new SetView(
						{
							'model' : item
						}
					);

					this.el.appendChild( setView.render().el );
				}
			}
		);

		// Instanciate the `GameView` view.
		var directory = new GameView();

	}
( jQuery ) );