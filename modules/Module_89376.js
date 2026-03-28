/**
 * Netflix Cadmium Playercore - Module 89376
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: enumerable
 * Original signature: function(t, b)
 */

// Webpack module 89376
// Parameters: t (module), b (exports)
export function enumerable(a) {
    return function(d, p) {
        var c;
        c = Object.getOwnPropertyDescriptor(d, p) || ({});
        c.enumerable !== a && (c.enumerable = a,
        c.writable = true,
        Object.defineProperty(d, p, c));
    }
    ;
}
;
