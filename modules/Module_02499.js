/**
 * Netflix Cadmium Playercore - Module 2499
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: ohc
 */

// Webpack module 2499
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function ohc(a, d) {
    var p;
    undefined === d && (d = Math.random);
    if ("number" !== typeof a || !isFinite(a))
        throw new TypeError("alpha must be a finite number");
    if (0 > a || 1 < a)
        throw new RangeError("alpha must be in [0, 1]");
    d = d();
    if (!(0 <= d && 1 > d)) {
        if (1 === d)
            return 1;
        throw new RangeError("rng() must return a value in [0, 1)");
    }
    p = 1 - a / 2;
    if (d < a / (2 * p))
        return (a = Math.sqrt(2 * a * d * p),
        1 >= a ? a : 1);
    a = a / 2 + d * p;
    return 1 >= a ? a : 1;
}
;

// Detected exports: ohc
