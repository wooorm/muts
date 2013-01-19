(
	function anonymous( root, factory )
	{
		if ( typeof exports !== 'undefined' )
		{
			root.$tore = factory( root, {} );
		}
		else if ( typeof define === 'function' && define.amd )
		{
			define( [ 'exports' ], function( exports )
				{
					return root.$tore = factory( root, exports );
				}
			);
		}
		else
		{
			root.$tore = factory( root, {} );
		}
	}( this, function( root, exports )
		{
			var isArray = Array.isArray || function( value )
			{
				return Object.prototype.toString.call( value ) === '[object Array]'
			};

			var $tore = exports.$tore = function $tore()
			{
				this.__bound__ = {};

				return this.init.apply( this, isArray( arguments[ 0 ] )? arguments[ 0 ] : arguments );
			};

			$tore.prototype = {
				'init' : function init()
				{
					var _this = this, _func = function(){};

					Array.prototype.forEach.call( arguments, function callback( it )
						{
							var _def = it.default || undefined
							  , key  = it.key || it
							  , _ns  = key
							  , ns   = _ns.split( '.' )
							  , key  = ns[ ns.length - 1 ]
							  , ns   = _this.namespace( ns.slice( 0, ns.length - 1 ).join( '.' ) )
							  ;

							_this.on( _ns + ':all', it.onall )
							_this.on( _ns + ':get', it.onget )
							_this.on( _ns + ':set', it.onset )

							Object.defineProperty( ns, key, {
						          'get' : function get()
								{
									var val = _this._get( _ns ) || _def;
									_this.call( _ns, 'get', val );
									return val;
								}
						        , 'set' : function set( value )
								{
									_this.call( _ns, 'set', value );
									return _this._set( _ns, value );
								}
								, 'enumerable' : true
								, 'configurable' : false
							} );
						}
					);

					return this;
				}
				, 'namespace' : function namespace( ns )
				{
					if ( typeof ns !== 'string' )
						return this;

					var props = ns.split( '.' ).reverse()
					  , prop
					  , ns = this
					  ;

					while ( prop = props.pop() )
						ns = ns[ prop ] || ( ns[ prop ] = {} );

					return ns;
				}
				, 'call' : function call( nsBind, type, val )
				{
					if ( !nsBind || !this.__bound__[ nsBind ] )
						return;

					var b = this.__bound__[ nsBind ];

					if ( b.all )
						b.all.call( this, type, val );

					if ( b.get )
						b.get.call( this, val );

					if ( b.set )
						b.set.call( this, val );
				}
				, 'on' : function on( type, callback )
				{
					if ( !callback )
						return;

					var b = this.__bound__;
					type = type.split( ':' );
					var nsBind = this.__bound__[ type[ 0 ] ] || ( this.__bound__[ type[ 0 ] ] = {} )

					nsBind[ type[ 1 ] || 'all' ] = callback;
				}
				, '_get' : function get( key ) { return this.from_json( localStorage.getItem( key ) ); }
				, '_set' : function set( key, value ) { return localStorage.setItem( key, this.to_json( value ) ); }
				, 'clear' : function clear()
				{
					var _this = this;

					Array.prototype.forEach.call( arguments.length < 1? Object.keys( this ) : arguments, function callback( it )
						{
							_this[ it ] = '';
						}
					);

					return this;
				}
				, 'from_json' : function from_json( value )
				{
					try
					{
						return JSON.parse( value );
					}
					catch ( e ) { return };
				}
				, 'to_json' : function to_json( value )
				{
					try
					{
						return JSON.stringify( value );
					}
					catch ( e ) { return value };
				}
			};

			return exports.$tore;
		}
	)
);