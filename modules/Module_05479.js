/**
 * Netflix Cadmium Playercore - Module 5479
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: UI / rendering
 * Exports: ebb
 */

// Webpack module 5479
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g, f) {
    return f.Q2 ? (g = f.z_a(g)) && d(g, f.Q2) : g;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const ebb = undefined;
p = a(79048);  // import from Module_79048
c = a(91967);  // import from Module_91967
t = (function() {
    function g(f) {
        this.RD = f;
        this.ic = "content-playgraph";
        this.enabled = true;
    }
    g.prototype.Ph = function(f) {
        var e, h, k, l, m, n, q, r;
        k = f.Ui;
        f = f.Xs;
        if (k === c.Sc.Gm || k === c.Sc.Mr || k === c.Sc.Wj || f === c.Od.mv || f === c.Od.uI || undefined === k && undefined === f) {
            k = this.RD;
            l = k.za.TS || k.za;
            k = l.player.Sd ? l.player.Wg : l.Ay ? l.Fm : undefined;
            m = f = undefined;
            n = undefined;
            if (k) {
                q = d(k, l.Ib);
                r = l.Z.ba[k.M];
                l = q ? l.Ib.QI.Z.ba[q.M] : r;
                m = null !== (e = l.type) && undefined !== e ? e : p.ed.content;
                l && l.Mp && l.J !== l.Mp && (f = l.J,
                m = l.type || "content",
                n = q.offset.G + l.Va);
                l && (null === l || undefined === l ? undefined : l.J) != r.J && (f = r.J,
                m = null !== (h = r.type) && undefined !== h ? h : m,
                n = k.offset.G + r.Va);
                "adBreak" === r.type && (m = r.type);
            }
            return {
                contentPlaygraph: this.RD.RD,
                auxMid: f,
                auxMidType: m,
                auxOffsetms: n
            };
        }
    }
    ;
    return g;
}
)();
b.ebb =

// Detected exports: ebb
