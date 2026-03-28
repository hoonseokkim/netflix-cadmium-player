/**
 * Netflix Cadmium Playercore - Module 76122
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 */

// Webpack module 76122
// Parameters: t (module), b (exports), a (require)

var p;
function d(c) {
    for (var g = "", f = 0; f < c.length; f++)
        g += c[f].J + "|";
    return g;
}
p = a(45578);  // import from Module_45578
t.exports = {
    assert: function(c, g) {
        if (!c)
            throw Error("PlayPredictionModel assertion failed" + (g ? " : " + g : ""));
    },
    Wgd: function(c, g, f) {
        Array.prototype.splice.apply(c, [g, 0].concat(f));
    },
    Vvc: function(c) {
        for (var g = [], f = 0; f < c.length; f++)
            if (c[f].context === p.q7.l_b) {
                g = c[f].list;
                break;
            }
        return g;
    },
    uvc: function(c) {
        for (var g = [], f = 0; f < c.length; f++)
            if (c[f].context === p.q7.fZb) {
                g = c[f].list;
                break;
            }
        return g;
    },
    soc: function(c, g) {
        for (var f = 0, e, h, k, l = 0, m = c.length - 1; l < m; l++) {
            e = d(c[l].list || []);
            k = false;
            for (var n = 0, q = g.length; n < q; n++)
                if ((h = d(g[n].list || []),
                h == e)) {
                    k = true;
                    break;
                }
            if (false === k) {
                f = l;
                break;
            }
        }
        return f;
    },
    HLc: function(c, g, f) {
        for (var e = [], h, k = 0; k < Math.min(g, c.length); k++)
            (h = c[k].list || [],
            e = e.concat(h.slice(0, f)));
        return e;
    },
    GLc: function(c, g) {
        for (var f = [], e, h = 0; h < c.length && (e = c[h].list || [],
        e = e.slice(0, Math.min(e.length, g)),
        g -= e.length,
        f = f.concat(e),
        0 !== g); h++)
            ;
        return f;
    },
    FLc: function(c, g, f) {
        var e;
        g < c.length && 0 <= g && (c = c[g].list || [],
        f < c.length && (e = c[f]));
        return e;
    },
    iAb: function(c) {
        for (var g = {}, f = c.length, e, h = 0; h < f; h++) {
            e = c[h].list || [];
            for (var k = 0; k < e.length; k++)
                if (e[k].property === p.hX.P7 || e[k].property === p.hX.nbb) {
                    g.Tn = h;
                    g.Mq = k;
                    break;
                }
        }
        undefined === g.Tn && undefined === g.Mq && (g.Tn = 0,
        g.Mq = 0);
        return g;
    }

