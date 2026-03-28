/**
 * Netflix Cadmium Playercore - Module 62442
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Afc
 */

// Webpack module 62442
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function Afc(p, c, g, f) {
    var e, h;
    p = c.iRa(p).G;
    e = p - g.Lp - g.Wu;
    h = e;
    undefined !== f && (h = Math.min(e, p - f));
    g = Math.floor((0,
    d.ohc)(g.xGc) * g.Lp);
    f = h + g;
    return {
        QZc: p,
        oPc: c.Yga(f),
        WIb: f,
        M4c: h,
        delay: g,
        GF: c.Wf
    };
}
;
d = a(249

// Detected exports: Afc
