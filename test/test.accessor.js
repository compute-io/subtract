/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	subtract = require( './../lib/accessor.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'accessor subtract', function tests() {

	it( 'should export a function', function test() {
		expect( subtract ).to.be.a( 'function' );
	});

	it( 'should perform an element-wise subtraction of a scalar using an accessor', function test() {
		var data, actual, expected;

		data = [
			{'x':0},
			{'x':1},
			{'x':2},
			{'x':3}
		];
		actual = new Array( data.length );
		actual = subtract( actual, data, 1, getValue );

		expected = [
			-1,
			0,
			1,
			2
		];

		assert.deepEqual( actual, expected );

		function getValue( d ) {
			return d.x;
		}

	});

	it( 'should perform an element-wise subtraction of an array using an accessor', function test() {
		var data, actual, expected, y;

		data = [
			{'x':0},
			{'x':1},
			{'x':2},
			{'x':3}
		];

		y = [
			0,
			1,
			2,
			3
		];

		actual = new Array( data.length );
		actual = subtract( actual, data, y, getValue );

		expected = [
			0,
			0,
			0,
			0
		];

		assert.deepEqual( actual, expected );

		function getValue( d, i ) {
			return d.x;
		}

	});

	it( 'should perform an element-wise subtraction of another object array using an accessor', function test() {
		var data, actual, expected, y;

		data = [
			{'x':0},
			{'x':1},
			{'x':2},
			{'x':3}
		];

		y = [
			{'y':0},
			{'y':1},
			{'y':2},
			{'y':3}
		];

		actual = new Array( data.length );
		actual = subtract( actual, data, y, getValue );

		expected = [
			0,
			0,
			0,
			0
		];

		assert.deepEqual( actual, expected );

		function getValue( d, i, j ) {
			if ( j === 0 ) {
				return d.x;
			} else {
				return d.y;
			}
		}

	});

	it( 'should return empty array if provided an empty array', function test() {
		assert.deepEqual( subtract( [], [], 1, getValue ), [] );
		function getValue( d ) {
			return d.x;
		}
	});

	it( 'should handle non-numeric values by setting the element to NaN', function test() {
		var data, actual, expected, y;

		// numeric value
		data = [
			{'x':1},
			{'x':null},
			{'x':3}
		];
		actual = new Array( data.length );
		actual = subtract( actual, data, 1, getValue );

		expected = [ 0, NaN, 2 ];

		assert.deepEqual( actual, expected );

		// single non-numeric value
		y = false;
		actual = new Array( data.length );
		actual = subtract( actual, data, y, getValue );
		expected = [ NaN, NaN, NaN ];

		assert.deepEqual( actual, expected );

		// numeric array
		y = [ 1, 2, 3 ];
		actual = new Array( data.length );
		actual = subtract( actual, data, y, getValue );
		expected = [ 0, NaN, 0 ];

		assert.deepEqual( actual, expected );

		// typed array
		y = new Int32Array( [1,2,3] );
		actual = new Array( data.length );
		actual = subtract( actual, data, y, getValue );
		expected = [ 0, NaN, 0 ];

		assert.deepEqual( actual, expected );

		// object array
		y = [
			{'y':1},
			{'y':2},
			{'y':3}
		];
		actual = new Array( data.length );
		actual = subtract( actual, data, y, getValue2 );
		expected = [ 0, NaN, 0 ];

		assert.deepEqual( actual, expected );

		function getValue( d, i ) {
			return d.x;
		}

		function getValue2( d, i, j ) {
			if ( j === 0 ) {
				return d.x;
			} else {
				return d.y;
			}
		}

	});

	it( 'should throw an error if provided an array to be subtracted which is not of equal length to the input array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			subtract( [], [1,2], [1,2,3], getValue );
		}
		function getValue( d ) {
			return d;
		}
	});

	it( 'should throw an error if provided a typed array to be subtracted which is not of equal length to the input array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			subtract( [], [1,2], new Int32Array( [1,2,3] ), getValue );
		}
		function getValue( d ) {
			return d;
		}
	});

});
