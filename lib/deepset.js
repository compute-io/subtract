'use strict';

// MODULES //

var isArray = require( 'validate.io-array' ),
	deepSet = require( 'utils-deep-set' ).factory,
	deepGet = require( 'utils-deep-get' ).factory;


// SUBTRACT //

/**
* FUNCTION: subtract( arr, y, path[, sep] )
*	Computes an element-wise subtraction or each element and deep sets the input array.
*
* @param {Array} arr - input array
* @param {String} path - key path used when deep getting and setting
* @param {String} [sep] - key path separator
* @returns {Array} input array
*/
function subtract( x, y, path, sep ) {
	var len = x.length,
		opts = {},
		dget,
		dset,
		v, i,
		yNumeric;

	if ( arguments.length > 3 ) {
		opts.sep = sep;
	}
	if ( len ) {
		dget = deepGet( path, opts );
		dset = deepSet( path, opts );
		if ( isArray( y ) ) {
			for ( i = 0; i < len; i++ ) {
				v = dget( x[ i ] );
				if ( typeof v === 'number' ) {
					dset( x[ i ], v - y[ i ] );
				} else {
					dset( x[ i ], NaN );
				}
			}
		} else {
			yNumeric = ( typeof y === 'number' );
			for ( i = 0; i < len; i++ ) {
				v = dget( x[ i ] );
				if ( yNumeric && typeof v === 'number' ) {
					dset( x[ i ], v - y );
				} else {
					dset( x[ i ], NaN );
				}
			}
		}
	}
	return x;
} // end FUNCTION subtract()


// EXPORTS //

module.exports = subtract;
