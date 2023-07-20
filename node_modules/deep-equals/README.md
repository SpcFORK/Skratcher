deep-equals
===========

Node.js module that compares objects
------------------------------------

*This does exactly what it says on the tin. It deep-compares objects, and returns what a javascript beginner would expect objectA === objectB to return*

##INSTALL

In your repository, run:

```
    npm install --save deep-equals
```

##USE

In your code:

```
    const deepEquals = require ( 'deep-equals' );

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
```

Do note that deep-equals treats array order as insignificant, as demonstrated in the example above.
