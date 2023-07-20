const R = require ( 'ramda' );

const deepEquals = ( a, b ) => {
    if ( R.type ( a ) !== R.type ( b ) ) {
        return false;
    }
    
    if ( R.type ( a ) === 'Null' ) {
        return true;
    }

    if ( R.type ( a ) === 'Object' ) {
        const A = R.clone ( a ), B = R.clone ( b );

        R.keys ( A ).forEach ( ( key ) => {
            if ( typeof A[key] === 'undefined' ) {
                delete A[key];
            }
        } );

        R.keys ( B ).forEach ( ( key ) => {
            if ( typeof B[key] === 'undefined' ) {
                delete B[key];
            }
        } );

        if ( R.keys ( A ).length !== R.keys ( B ).length ) {
            return false;
        }

        if ( R.find ( ( key ) => {
            return ! R.has ( key, B );
        }, R.keys ( A ) ) ) {
            return false;
        }

        return R.reduce ( ( equals, key ) => {
            if ( ! equals ) {
                return false;
            }

            if ( deepEquals ( A[key], B[key] ) ) {
                return equals;
            }

            return false;
        }, true, R.keys ( A ) );
    }

    if ( R.type ( a ) === 'Array' ) {
        if ( a.length !== b.length ) {
            return false;
        }

        return R.reduce ( ( equals, aItem ) => {
            if ( ! equals ) {
                return false;
            }

            if ( R.find ( ( bItem ) => {
                return deepEquals ( aItem, bItem );
            }, b ) ) {
                return true;
            }

            return false;
        }, true, a );
    }

    if ( R.type ( a ) === 'Date' ) {
        return a.valueOf () === b.valueOf ();
    }

    return a === b;
};

module.exports = deepEquals;

if ( ! module.parent ) {
    const objectA = {
        a: 'b',
        c: {
            d: 'e',
            f: {
                g: [ 1, 2, 3, 4, 5 ],
                h: new Date ( 0 ),
                i: 3
            }
        }
    };

    const objectB = {
        a: 'b',
        c: {
            d: 'e',
            f: {
                g: [ 1, 2, 3, 5, 4 ],
                h: new Date ( 0 ),
                i: 3
            }
        }
    };

    if ( deepEquals ( objectA, objectB ) ) {
        console.log ( 'They are the same' );
    } else {
        console.log ( 'They are not the same' );
    }
};
