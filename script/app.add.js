define(
	  [ 'jquery', 'lodash', 'backbone', '$tore' ]
	, function anonymous( $, _, Backbone, $tore )
	{
		var exports = this;

		// Create new `View` view.
		var view = Backbone.View.extend(
			{
				  'el' : document.querySelector( '.main_nav' )
				, '$form' : document.querySelector( '.action_add_form > form' )
				// , '_button' : document.querySelector( '#add_set' )
				, '$modal' : document.querySelector( '.action_add_form' )
				, '$id' : document.querySelector( '[name=game_id]' )
				, '$submit' : document.querySelector( '[name=add_form_submit]' )
				, '$cancel' : document.querySelector( '[name=add_form_cancel]' )
				, 'initialize' : function initialize()
				{
					this.collection = new ( Backbone.Collection.extend( {
						  'url' : app.api.config.api_url + 'game_scores/'
					} ) );
				}
				, 'render' : function render( rerender )
				{
				}
				, 'show' : function show( args )
				{
					this.$modal.style.display = '';
					return 'show:add:works';
				}
				, 'hide' : function hide()
				{
					this.$modal.style.display = 'none';
					return 'hide:add:works';
				}
				, 'toggle' : function toggle()
				{
					this[ this.$modal.style.display === 'none' ? 'show' : 'hide' ]();
				}
				, 'request' : function request( options )
				{
					if ( !options.onsuccess )
						return;

					var _this = this, ons, onc;

					ons = function ons( e )
					{
						e.preventDefault();

						_this.onsubmit( e, options.onsuccess, options.onerror );
					}

					onc = function onc( e )
					{
						e.preventDefault();

						_this.hide();

						options.onerror.call( _this, true, {} );
						_this.$id.value = '';
						_this.$form.removeEventListener( 'submit', ons );
					}

					this.$form.addEventListener( 'submit', ons );
					this.$cancel.addEventListener( 'click', onc );

					this.$id.value = options.id;
					this.show();
				}
				, 'onsubmit' : function onsubmit( event, onsuccess, onerror )
				{
					event.preventDefault();

					var name, val, vals = {}, _this = this;

					Array.prototype.forEach.call( event.target, function callback( it, n )
						{
							if ( it.nodeName !== 'INPUT' )
								return;

							var name = it.name, val = it.value;

							vals[ name ] = val;
						}
					);
					
					vals.is_final = 'False';

					console.log( vals );

					this.collection.create( vals, {
						'headers' : {
							'Authorization' : 'bearer ' + app.api.config.access_token
						}
						, 'success' : function success( collection, response, instance )
						{
							onsuccess.call( _this, response )
						}
						, 'error' : function error( collection, error, instance )
						{
							if ( onerror )
								onerror.call( _this, false, error );

							console.log( 'error:' + error.status, error.responseText );
						}
					} );
				}
			}
		);

		return view;
	}
);
