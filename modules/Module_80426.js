/**
 * Netflix Cadmium Playercore - Module 80426
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: D2a, Yb
 */

// Webpack module 80426
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Yb = undefined;
export function D2a(c) {
    return c === d.Yd.Xf ? p.Xf : c === d.Yd.Qm ? p.Qm : c === d.Yd.jma ? p.Xf : c === d.Yd.uq ? p.Bg : p.Ul;
}
;
d = a(11528);  // import from Module_11528
(function(c) {
    c[c.Ul = 0] = "STARTING";
    c[c.Xf = 1] = "BUFFERING";
    c[c.Qm = 2] = "REBUFFERING";
    c[c.Bg = 3] = "PLAYING";
    c[c.Xla = 4] = "STOPPING";
    c[c.Wt = 5] = "STOPPED";
    c[c.aj = 6] = "PAUSED";
}
)(p || (b.Yb = p = {}

// Detected exports: D2a, Yb
