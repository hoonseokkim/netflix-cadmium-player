/**
 * Netflix Cadmium Playercore - Module 48387
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: w; Dependencies: [5641, 67038]
 * Original signature: function(t, b, a)
 */

// Webpack module 48387
// Parameters: t (module), b (exports), a (require)
var d, p;
export function w(c, g, f, e) {
    var h;
    h = new d.uja(c);
    e = e && e.yza;
    g = (0,
    p.uRc)(h, {
        dH: g,
        aV: f
    }, e);
    h = h.offset;
    return {
        frame: c.subarray(0, h),
        H1a: h,
        gnd: g
    };
}
;
d = a(5641);
p = a(67038);
