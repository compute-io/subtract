'use strict';

var subtract = require( './../lib' );

var data = new Array( 100 );
for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.round( Math.random()*100 );
}
var out = subtract( data, 10 );

console.log( out.join( '\n' ) );
