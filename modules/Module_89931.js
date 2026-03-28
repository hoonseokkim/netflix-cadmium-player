/**
 * Netflix Cadmium Playercore - Module 89931
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: concat
 */

// Webpack module 89931
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function concat() {
    var p;
    for (var a = [], d = 0; d < arguments.length; d++)
        a[d] = arguments[d];
    a = Array.prototype.concat.apply([], a);
    d = a.reduce(function(c, g) {
        return c + g.byteLength;
    }, 0);
    p = new Uint8Array(d);
    a.reduce(function(c, g) {
        p.set(new Uint8Array(g), c);
        return c + g.byteLength;
    }, 0);
    return p.buffer;
}
;

// Detected exports: concat
