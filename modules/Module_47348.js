/**
 * Netflix Cadmium Playercore - Module 47348
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: aCc
 * Original signature: function(t, b)
 */

// Webpack module 47348
// Parameters: t (module), b (exports)
var a;
export function aCc(d) {
    var p, c;
    c = null !== (p = a[d]) && undefined !== p ? p : 1;
    a[d] = c + 1;
    return ("").concat(d, ":").concat(c);
}
;
a = {};
