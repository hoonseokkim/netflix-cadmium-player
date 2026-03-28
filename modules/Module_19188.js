/**
 * Netflix Cadmium Playercore - Module 19188
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 * Exports: tDb
 */

// Webpack module 19188
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function tDb(g, f) {
    var e, h;
    g = null === (e = g[g.length - 1]) || undefined === e ? undefined : e.fj(p.l.U);
    if (!g)
        return Infinity;
    (0,
    d.assert)((0,
    c.dk)(g), "Max rate stream must be a live stream");
    e = null !== (h = g.bitrate) && undefined !== h ? h : Infinity;
    return Math.max(e / (f.Tk / g.track.Tj.G), f.YGc);
}
;
d = a(91176);  // import from Module_91176
p = a(65161);  // import from Module_65161
c = a(814

// Detected exports: tDb
