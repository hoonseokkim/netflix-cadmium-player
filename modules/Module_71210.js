/**
 * Netflix Cadmium Playercore - Module 71210
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: Bsc
 */

// Webpack module 71210
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
export function Bsc() {
    var h, k, l, m;
    for (var f = [], e = 0; e < arguments.length; e++)
        f[e] = arguments[e];
    h = "string" === typeof f[0] ? {
        Dd: f[0],
        frame: f[1],
        dH: f[2],
        eic: f[3],
        wT: f[4]
    } : f[0];
    k = h.Dd;
    f = h.frame;
    e = h.dH;
    l = h.eic;
    m = h.wT;
    h = h.aV;
    h = undefined === h ? false : h;
    switch (k) {
    case "aac":
        undefined === c && (c = a(48387).w);
        k = 6;
        l && (l = new d.uja(l),
        k = (0,
        p.kOc)(l).yza);
        f = c(f, e, h, {
            yza: k
        }).H1a;
        break;
    case "ddp":
        undefined === g && (g = a(10543).w);
        f = g(f, e, {
            wT: m
        }).H1a;
        break;
    case "xheaac":
        f = f.length;
        break;
    default:
        throw Error("Unrecognized codec in fadeFrame: " + k);
    }
    return {
        ouc: f
    };
}
;
d = a(5641);  // import from Module_05641
p = a(5704

// Detected exports: Bsc
