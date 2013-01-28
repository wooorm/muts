define(
	  [ 'jquery', 'lodash', 'backbone', '$tore' ]
	, function anonymous( $, _, Backbone, $tore )
	{
		var exports = this;

		var views = exports.app.views || {};

		var current_view = null;

		var _rjs_paths = requirejs && requirejs.s ? requirejs.s.contexts._.config.paths : {};

		exports.app.routes = {
			'not_found' : function not_found(){ console.log( 'not_found' ); }
		}

	    var Router = Backbone.Router.extend( {
				  'routes' : {
  					  '/*actions' : 'parse_splat'
					, '*actions'  : 'parse_splat'
				}
				, 'parse_splat': function parse_splat( actions )
				{
					actions    = actions.split( '/' );

					var action = actions[ 0 ] || 'schedule'

					return exports.app.router.view( action, actions.slice( 1 ) )
				}
			}
		);

		Router.prototype.select = function select( current_view, name )
		{
			var current_nav_element = document.querySelector( '[data-view="' + current_view + '"]' )
			  , new_nav_element = document.querySelector( '[data-view="' + name + '"]' )
			  ;

			if ( current_nav_element && current_nav_element.classList )
				current_nav_element.classList.remove( 'active' );

			if ( new_nav_element && new_nav_element.classList )
				new_nav_element.classList.add( 'active' );
		}

		Router.prototype.view = function _view( name, args )
		{
			if ( current_view && views[ current_view ] && views[ current_view ].hide )
			{
				console.log( 'render: hide', current_view, views[ current_view ].hide( args ) );
			}

			this.select( current_view, name );

			current_view = name;
			
			if ( views[ name ] && views[ name ].show )
			{
				return console.log( 'render: show', name, views[ name ].show( args ) );
			}

			if ( _rjs_paths[ name ] )
			{
				return require( [ name ], function callback( view )
					{
						return console.log( 'require', name, views[ name ] = new view( args ) );
					}
				);
			}

			if ( exports.app.routes[ name ] )
			{
				return exports.app.routes[ name ].call( this, args );
			}

			console.log( 'not found', name );
			return exports.app.routes.not_found();
		}

		exports.app.router = new Router();

	    Backbone.history.start();

		return exports.app.router;
	}
);