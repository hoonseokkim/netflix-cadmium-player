/**
 * Netflix Cadmium Playercore - Module 71773
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Exports function: tRa; Dependencies: [30962, 65149]
 * Original signature: function(t, b, a)
 */

// Webpack module 71773
// Parameters: t (module), b (exports), a (require)
var d, p, c;
export function tRa(g) {
    var f, e;
    if (!p.isEnabled)
        return Math.random;
    e = null !== (f = p.Zca.get(g)) && undefined !== f ? f : 0;
    p.Zca.set(g, e + 1);
    return (0,
    d.omc)(("").concat(c, "-").concat(g, "-").concat(e));
}
;
d = a(30962);
p = a(65149);
c = "MONTAGE";
