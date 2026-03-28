/**
 * Netflix Cadmium Playercore - Module 79305
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: C_a
 */

// Webpack module 79305
// Parameters: t, b

function a(d) {
    d.qx = !d.Ta || !d.Ta.length;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function C_a(d, p, c, g, f, e) {
    if (g)
        d.forEach(function(h) {
            return a(h);
        });
    else if (f && c > e && !p.Da && d.every(function(h) {
        return !h.qx;
    }))
        for (c = d.length - 1; 0 <= c; --c) {
            g = d[c];
            if (d[c - 1] === p) {
                a(g);
                break;
            }
            if (d[c + 1] === p) {
                a(g);
                break;
            }
        }
}
;

// Detected exports: C_a
