/**
 * Netflix Cadmium Playercore - Module 35202
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: UVb
 * Original signature: function(t, b)
 */

// Webpack module 35202
// Parameters: t (module), b (exports)
export function UVb(a, d, p, c) {
    var g, f;
    if (null !== a && undefined !== a && a.slice)
        return a.slice(p, c);
    g = Math.min(a.length, c);
    f = Math.min(a.length, p);
    for (d = new d(Math.max(c - p, 0)); f < g; f++)
        d[f - p] = a[f];
    return d;
}
;
