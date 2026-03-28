/**
 * Netflix Cadmium Playercore - Module 24757
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 * Exports: M_a
 */

// Webpack module 24757
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function M_a(c, g, f, e) {
    var h, k, l;
    h = false;
    k = (null === g || undefined === g ? undefined : g.buffer).Ta;
    l = k.length;
    (g = 0 < l && g.state !== d.Yb.Ul ? k[l - 1].stream : e) ? -1 === f.indexOf(g) && (g = (0,
    p.wDb)(f, g.bitrate, g.Wb),
    h = true,
    c && e && -1 !== f.indexOf(e) && (h = false)) : h = true;
    return {
        rn: g,
        h0: h
    };
}
;
d = a(65161);  // import from Module_65161
p = a(4428

// Detected exports: M_a
