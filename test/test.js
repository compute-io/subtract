/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Validate if a value is NaN:
	isnan = require( 'validate.io-nan' ),

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

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				subtract( [1,2,3], 1, {
					'accessor': value
				});
			};
		}
	});

	it( 'should throw an error if provided an array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				subtract( [1,2,3], 1, {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a typed-array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				subtract( new Int8Array([1,2,3]), 1, {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a matrix and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				subtract( matrix( [2,2] ), 1, {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a number as the first argument and an not applicable option', function test() {
		var values = [
			{'accessor': function getValue( d ) { return d; } },
			{'copy': false},
			{'path': 'x'},
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				subtract( 10, [1,2,3], value );
			};
		}
	});

	it( 'should return NaN if the first argument is neither a number, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			NaN,
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( subtract( values[ i ], 1 ) ) );
		}
	});

	it( 'should return NaN if the first argument is a number and the second is neither numeric, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			NaN,
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( subtract( 10, values[ i ] ) ) );
		}
	});

	it( 'should subtract two numbers', function test() {
		assert.strictEqual( subtract( 0, 3 ), -3 );
		assert.strictEqual( subtract( 2, 2 ), 0 );
	});

	it( 'should accept a number as the first argument and an array as the second argument', function test() {
		var data, actual, expected;
		data = [ 1, 2 ];
		actual = subtract( 10, data );
		expected = [ 9, 8 ];
		assert.deepEqual( actual, expected );
	});

	it( 'should accept a number as the first argument and an array as the second argument and cast to a different dtype', function test() {
		var data, actual, expected;
		data = [ 1, 2 ];
		actual = subtract( 10, data, {
			'dtype':'int32'
		});
		expected = new Int32Array( [9,8] );
		assert.deepEqual( actual, expected );
	});


	it( 'should accept a number as the first argument and a matrix as the second argument', function test() {
		var data, actual, expected;
		data = matrix( new Int8Array( [ 1,2,3,4 ] ), [2,2] );
		actual = subtract( 4, data );
		expected = matrix( new Float64Array( [3,2,1,0] ), [2,2] );

		assert.deepEqual( actual.data, expected.data );
	});

	it( 'should subtract a matrix from a scalar and cast to a different dtype', function test() {
		var data, actual, expected;
		data = matrix( new Int8Array( [1,2,3,4] ), [2,2] );
		actual = subtract( 4, data, {
			'dtype': 'int32'
		});
		expected = matrix( new Int32Array( [3,2,1,0] ), [2,2] );

		assert.strictEqual( actual.dtype, 'int32' );
		assert.deepEqual( actual.data, expected.data );
	});

	it( 'should perform an element-wise subtraction when provided a plain array and a scalar', function test() {
		var data, actual, expected;

		data = [ 0, 1, 2, 3 ];
		expected = [
			-1,
			0,
			1,
			2
		];

		actual = subtract( data, 1 );
		assert.notEqual( actual, data );

		assert.deepEqual( actual, expected );

		// Mutate...
		actual = subtract( data, 1, {
			'copy': false
		});
		assert.strictEqual( actual, data );

		assert.deepEqual( data, expected );

	});

	it( 'should perform an element-wise subtraction when provided a plain array and another array', function test() {
		var data, actual, expected;

		data = [ 0, 1, 2, 3 ];
		expected = [
			0,
			0,
			0,
			0
		];

		actual = subtract( data, data );
		assert.notEqual( actual, data );

		assert.deepEqual( actual, expected );

		// Mutate...
		actual = subtract( data, data, {
			'copy': false
		});
		assert.strictEqual( actual, data );

		assert.deepEqual( data, expected );

	});

	it( 'should perform an element-wise subtraction when provided a typed array and a scalar', function test() {
		var data, actual, expected;

		data = new Int8Array( [ 0, 1, 2, 3 ] );

		expected = new Float64Array( [
			-1,
			0,
			1,
			2
		]);

		actual = subtract( data, 1 );
		assert.notEqual( actual, data );

		assert.deepEqual( actual, expected );

		// Mutate:
		actual = subtract( data, 1, {
			'copy': false
		});
		expected = new Int8Array( [ -1, 0, 1, 2 ] );
		assert.strictEqual( actual, data );

		assert.deepEqual( data, expected );
	});

	it( 'should perform an element-wise subtraction when provided a typed array and another typed array', function test() {
		var data, actual, expected;

		data = new Int8Array( [ 0, 1, 2, 3 ] );

		expected = new Float64Array( [
			0,
			0,
			0,
			0
		]);

		actual = subtract( data, data );
		assert.notEqual( actual, data );
		assert.deepEqual( actual, expected );

		// Mutate:

		actual = subtract( data, data, {
			'copy': false
		});
		expected = new Int8Array( [ 0, 0, 0, 0 ] );
		assert.strictEqual( actual, data );

		assert.deepEqual( data, expected );
	});

	it( 'should perform an element-wise subtraction and return an array of a specific type', function test() {
		var data, actual, expected;

		data = [ 0, 1, 2, 3 ];
		expected = new Int8Array( [ -1, 0, 1, 2 ] );

		actual = subtract( data, 1, {
			'dtype': 'int8'
		});
		assert.notEqual( actual, data );
		assert.strictEqual( actual.BYTES_PER_ELEMENT, 1 );
		assert.deepEqual( actual, expected );
	});

	it( 'should perform an element-wise subtraction of a scalar using an accessor', function test() {
		var data, actual, expected;

		data = [
			[3,0],
			[4,1],
			[5,2],
			[6,3]
		];

		expected = [
			-1,
			0,
			1,
			2
		];

		actual = subtract( data, 1, {
			'accessor': getValue
		});
		assert.notEqual( actual, data );
		assert.deepEqual( actual, expected );

		// Mutate:
		actual = subtract( data, 1, {
			'accessor': getValue,
			'copy': false
		});
		assert.strictEqual( actual, data );

		assert.deepEqual( data, expected );

		function getValue( d ) {
			return d[ 1 ];
		}
	});

	it( 'should perform an element-wise subtraction two object arrays using an accessor', function test() {
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

		actual = subtract( data, y, {
			'accessor': getValue
		});

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

	it( 'should perform an element-wise subtraction of a scalar and deep set', function test() {
		var data, actual, expected;

		data = [
			{'x':[3,0]},
			{'x':[4,1]},
			{'x':[5,2]},
			{'x':[6,3]}
		];
		expected = [
			{'x':[3,-1]},
			{'x':[4,0]},
			{'x':[5,1]},
			{'x':[6,2]}
		];

		actual = subtract( data, 1, {
			'path': 'x.1'
		});

		assert.strictEqual( actual, data );

		assert.deepEqual( actual, expected );

		// Specify a path with a custom separator...
		data = [
			{'x':[3,0]},
			{'x':[4,1]},
			{'x':[5,2]},
			{'x':[6,3]}
		];
		actual = subtract( data, 1, {
			'path': 'x/1',
			'sep': '/'
		});
		assert.strictEqual( actual, data );

		assert.deepEqual( actual, expected );
	});

	it( 'should perform an element-wise subtraction using an array and deep set', function test() {
		var data, actual, expected, y;

		data = [
			{'x':0},
			{'x':1},
			{'x':2},
			{'x':3}
		];

		y = [ 0, 1, 2, 3 ];

		actual = subtract( data, y, {
			path: 'x'
		});

		expected = [
			{'x':0},
			{'x':0},
			{'x':0},
			{'x':0}
		];

		assert.strictEqual( data, actual );
		assert.deepEqual( data, expected);

		// Custom separator...
		data = [
			{'x':[9,0]},
			{'x':[9,1]},
			{'x':[9,2]},
			{'x':[9,3]}
		];

		data = subtract( data, y, {
			'path': 'x/1',
			'sep': '/'
		});
		expected = [
			{'x':[9,0]},
			{'x':[9,0]},
			{'x':[9,0]},
			{'x':[9,0]}
		];

		assert.deepEqual( data, expected, 'custom separator' );
	});

	it( 'should perform an element-wise subtraction when provided a matrix', function test() {
		var mat,
			out,
			d1,
			d2,
			d3,
			i;

		d1 = new Int32Array( 100 );
		d2 = new Int32Array( 100 );
		d3 = new Int32Array( 100 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i;
			d2[ i ] = i - i;
			d3[ i ] = i - 1;
		}

		// Subtract scalar from matrix
		mat = matrix( d1, [10,10], 'int32' );
		out = subtract( mat, 1, {
			'dtype': 'int32'
		});

		assert.deepEqual( out.data, d3 );

		// Subtract two matrices
		mat = matrix( d1, [10,10], 'int32' );
		out = subtract( mat, mat, {
			'dtype': 'int32'
		});

		assert.deepEqual( out.data, d2 );

		// Add matrix and scalar and mutate...
		out = subtract( mat, 1, {
			'copy': false
		});

		assert.strictEqual( mat, out );
		assert.deepEqual( mat.data, d3 );
	});

	it( 'should perform an element-wise subtraction of a scalar and return a matrix of a specific type', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Int16Array( 100 );
		d2 = new Uint16Array( 100 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i + 1;
			d2[ i ] = i;
		}
		mat = matrix( d1, [10,10], 'int16' );
		out = subtract( mat, 1, {
			'dtype': 'uint16'
		});

		assert.strictEqual( out.dtype, 'uint16' );
		assert.deepEqual( out.data, d2 );
	});

	it( 'should return an empty data structure if provided an empty data structure', function test() {
		assert.deepEqual( subtract( [], 1 ), [] );
		assert.deepEqual( subtract( matrix( [0,0] ), 1 ).data, matrix( [0,0] ).data );
		assert.deepEqual( subtract( new Int8Array(), 1 ), new Float64Array() );
	});

});
