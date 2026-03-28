/**
 * Netflix Cadmium Playercore - Module 63375
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Q0a, NI
 */

// Webpack module 63375
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const NI = b.Q0a = undefined;
d = a(22970);  // import from Module_22970
p = a(22970);  // import from Module_22970
export function Q0a(c) {
    var g, f;
    g = [];
    for (f in c)
        g.push(c[f]);
    return g;
}
;
export function NI(c) {
    for (var g = [], f = 1; f < arguments.length; f++)
        g[f - 1] = arguments[f];
    return p.__assign.apply(undefined, d.__spreadArray([c], d.__read(g), false));
}

// Detected exports: Q0a, NI
