'use strict';

var subtract = require( './../lib' );

// Simulate some data...
var data = new Array( 100 );

for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.round( Math.random()*100 );
}

subtract( data, 10 );

console.log( data.join( '\n' ) );
