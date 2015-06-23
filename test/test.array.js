/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	subtract = require( './../lib/array.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'array subtract', function tests() {

	it( 'should export a function', function test() {
		expect( subtract ).to.be.a( 'function' );
	});

	it( 'should subtract a scalar from an array', function test() {
		var data, actual, expected;

		data = [
			1,
			2,
			3,
			4,
			5
		];
		actual = new Array( data.length );

		actual = subtract( actual, data, 1 );

		expected = [
			0,
			1,
			2,
			3,
			4
		];

		assert.deepEqual( actual, expected );

		// Typed arrays...
		data = new Int32Array( data );
		actual = new Int32Array( data.length );

		actual = subtract( actual, data, 1 );
		expected = new Int32Array( expected );

		assert.deepEqual( actual, expected );
	});

	it( 'should subtract an array from an array', function test() {
		var data, actual, expected, y;

		data = [
			1,
			2,
			3,
			4,
			5
		];

	 	y = [
			1,
			2,
			3,
			4,
			5
		];
		actual = new Array( data.length );

		actual = subtract( actual, data, y );

		expected = [
			0,
			0,
			0,
			0,
			0
		];

		assert.deepEqual( actual, expected );

		// Typed arrays...
		data = new Int32Array( data );
		actual = new Int32Array( data.length );

		actual = subtract( actual, data, y );
		expected = new Int32Array( expected );

		assert.deepEqual( actual, expected );
	});

	it( 'should return an empty array if provided an empty array', function test() {
		assert.deepEqual( subtract( [], [], 1 ), [] );
		assert.deepEqual( subtract( new Int8Array(), new Int8Array(), 1 ), new Int8Array() );
	});

	it( 'should handle non-numeric values by setting the element to NaN', function test() {
		var data, actual, expected, y;

		data = [ true, null, [], {} ];
		actual = new Array( data.length );
		actual = subtract( actual, data, 1 );

		expected = [ NaN, NaN, NaN, NaN ];

		assert.deepEqual( actual, expected );

		actual = new Array( data.length );
		y = [ 1, 2, 3, 4 ];
		actual = subtract( actual, data, y );

		expected = [ NaN, NaN, NaN, NaN ];

		assert.deepEqual( actual, expected );
	});

	it( 'should throw an error if provided an array to be added which is not of equal length to the input array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			subtract( [], [1,2], [1,2,3] );
		}
	});

});
