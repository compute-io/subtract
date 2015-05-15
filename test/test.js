/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	subtract = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-subtract', function tests() {

	it( 'should export a function', function test() {
		expect( subtract ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided an array', function test() {
		var values = [
			'5',
			5,
			null,
			undefined,
			NaN,
			true,
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				subtract( value, 10 );
			};
		}
	});

	it( 'should throw an error if provided a second argument which is not an array or number primitive', function test() {
		var values = [
			new Number( 5 ),
			'5',
			null,
			undefined,
			NaN,
			true,
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				subtract( [1,2,3], value );
			};
		}
	});

	it( 'should throw an error if provided an options argument which is not an object', function test() {
		var values = [
			'5',
			5,
			null,
			undefined,
			NaN,
			true,
			[],
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				subtract( [1,2,3], 10, value );
			};
		}
	});

	it( 'should throw an error if provided a copy option which is not a boolean primitive', function test() {
		var values = [
			'5',
			5,
			null,
			undefined,
			NaN,
			new Boolean( true ),
			{},
			[],
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				subtract( [1,2,3], 10, {
					'copy': value
				});
			};
		}
	});

	it( 'should throw an error if provided an accessor option which is not a function', function test() {
		var values = [
			'5',
			5,
			null,
			undefined,
			NaN,
			{},
			[]
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				subtract( [1,2,3], 10, {
					'accessor': value
				});
			};
		}
	});

	it( 'should throw an error if provided an array as a second argument which is not of equal length to the input array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			subtract( [1,2], [1,2,3] );
		}
	});

	it( 'should not mutate an input array by default', function test() {
		var data, actual;

		data = [ 4, 5, 3, 6, 8 ];
		actual = subtract( data, 4 );

		assert.ok( data !== actual );
	});

	it( 'should perform element-wise subtract', function test() {
		var data, expected, actual;

		// Scalar:
		data = [ 5, 2, 4, 1, 2 ];

		actual = subtract( data, 4 );
		expected = [ 1, -2, 0, -3, -2 ];

		assert.deepEqual( actual, expected );

		// Array of numeric values:
		data = [ 5, 2, 4, 1, 2 ];

		actual = subtract( data, [ 5, 2, 4, 1, 1 ] );
		expected = [ 0, 0, 0, 0, 1 ];

		assert.deepEqual( actual, expected );
	});

	it( 'should mutate an input array if the `copy` option is `false`', function test() {
		var data, expected, actual;

		data = [ 4, 5, 3, 6, 8 ];

		actual = subtract( data, 4, {
			'copy': false
		});
		expected = [ 0, 1, -1, 2, 4 ];

		assert.ok( data === actual );
		assert.deepEqual( actual, expected );
	});

	it( 'should perform element-wise subtract using an accessor', function test() {
		var data, expected, actual;

		data = [
			{'x':5},
			{'x':2},
			{'x':4},
			{'x':1},
			{'x':2}
		];
		expected = [ 1, -2, 0, -3, -2 ];

		actual = subtract( data, 4, {
			'accessor': getValue
		});
		assert.deepEqual( actual, expected );

		function getValue( d ) {
			return d.x;
		}
	});

	it( 'should perform element-wise subtract when provided an array and using an accessor', function test() {
		var data, arr, expected, actual;

		data = [
			{'x':5},
			{'x':2},
			{'x':4},
			{'x':1},
			{'x':2}
		];

		// One array accessed...
		arr = [ 5, 2, 4, 1, 1 ];

		actual = subtract( data, arr, {
			'accessor': getValue1
		});
		expected = [ 0, 0, 0, 0, 1 ];

		assert.deepEqual( actual, expected );

		// Both arrays are accessed...
		arr = [
			[0,5],
			[1,2],
			[2,4],
			[3,1],
			[4,1]
		];

		actual = subtract( data, arr, {
			'accessor': getValue2
		});
		expected = [ 0, 0, 0, 0, 1 ];

		assert.deepEqual( actual, expected );

		function getValue1( d ) {
			return d.x;
		}
		function getValue2( d, i, j ) {
			if ( j === 0 ) {
				return d.x;
			}
			return d[ 1 ];
		}
	});

});
