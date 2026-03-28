/**
 * Netflix Cadmium Playercore - Module 61342
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: Exc; Dependencies: [65161, 8149]
 * Original signature: function(t, b, a)
 */

// Webpack module 61342
// Parameters: t (module), b (exports), a (require)
var d, p;
export function Exc(c, g, f, e) {
    var h;
    h = f.sb.Fa;
    f = f.Cl;
    g = g.fj(d.l.U);
    if ((0,
    p.dk)(g) && (g = g.track.Tj.G,
    undefined !== g))
        return (e = Math.min(e, g) - c.OFc * f.Fa,
        undefined !== f.xg && (e -= c.Mua * Math.sqrt(f.xg)),
        e = Math.max(0, e),
        h * e / g);
}
;
d = a(65161);
p = a(8149);
