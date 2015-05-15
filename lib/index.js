'use strict';

// MODULES //

var isArray = require( 'validate.io-array' ),
	isObject = require( 'validate.io-object' ),
	isFunction = require( 'validate.io-function' ),
	isBoolean = require( 'validate.io-boolean-primitive' ),
	isNumber = require( 'validate.io-number-primitive' );


// SUBTRACT //

/**
* FUNCTION: subtract( arr, x[, opts] )
*	Computes an element-wise subtraction.
*
* @param {Number[]|Array} arr - input array
* @param {Number[]|Array|Number} x - either an array of equal length or a scalar
* @param {Object} [opts] - function options
* @param {Boolean} [opts.copy=true] - boolean indicating whether to return a new array
* @param {Function} [opts.accessor] - accessor function for accessing array values
* @returns {Number[]} output array
*/
function subtract( arr, x, opts ) {
	var isArr = isArray( x ),
		copy = true,
		arity,
		clbk,
		out,
		len,
		i;

	if ( !isArray( arr ) ) {
		throw new TypeError( 'subtract()::invalid input argument. Must provide an array. Value: `' + arr + '`.' );
	}
	if ( !isArr && !isNumber( x ) ) {
		throw new TypeError( 'subtract()::invalid input argument. Second argument must either be an array or number primitive. Value: `' + x + '`.' );
	}
	if ( arguments.length > 2 ) {
		if ( !isObject( opts ) ) {
			throw new TypeError( 'subtract()::invalid input argument. Options argument must be an object. Value: `' + opts + '`.' );
		}
		if ( opts.hasOwnProperty( 'copy' ) ) {
			copy = opts.copy;
			if ( !isBoolean( copy ) ) {
				throw new TypeError( 'subtract()::invalid option. Copy option must be a boolean primitive. Option: `' + copy + '`.' );
			}
		}
		if ( opts.hasOwnProperty( 'accessor' ) ) {
			clbk = opts.accessor;
			if ( !isFunction( clbk ) ) {
				throw new TypeError( 'subtract()::invalid option. Accessor must be a function. Option: `' + clbk + '`.' );
			}
			arity = clbk.length;
		}
	}
	len = arr.length;
	if ( copy ) {
		out = new Array( len );
	} else {
		out = arr;
	}
	// Case 1: x is an array
	if ( isArr ) {
		if ( len !== x.length ) {
			throw new Error( 'subtract()::invalid input argument. Array to be added must have a length equal to that of the input array.' );
		}
		if ( arity === 3 ) { // clbk implied
			for ( i = 0; i < len; i++ ) {
				out[ i ] = clbk( arr[i], i, 0 ) - clbk( x[i], i, 1 );
			}
		}
		else if ( clbk ) {
			for ( i = 0; i < len; i++ ) {
				out[ i ] = clbk( arr[i], i ) - x[ i ];
			}
		}
		else {
			for ( i = 0; i < len; i++ ) {
				out[ i ] = arr[ i ] - x[ i ];
			}
		}
	}
	// Case 2: accessor and scalar
	else if ( clbk ) {
		for ( i = 0; i < len; i++ ) {
			out[ i ] = clbk( arr[i], i ) - x;
		}
	}
	// Case 3: scalar
	else {
		for ( i = 0; i < len; i++ ) {
			out[ i ] = arr[ i ] - x;
		}
	}
	return out;
} // end FUNCTION subtract()


// EXPORTS //

module.exports = subtract;
