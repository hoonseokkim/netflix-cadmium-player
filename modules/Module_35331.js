/**
 * Netflix Cadmium Playercore - Module 35331
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: UI / rendering
 * Exports: N9a
 */

// Webpack module 35331
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const N9a = undefined;
d = a(79048);  // import from Module_79048
p = a(14103);  // import from Module_14103
c = a(91967);  // import from Module_91967
t = (function() {
    function g(f) {
        var e;
        e = this;
        this.context = f;
        this.dn = undefined;
        this.ic = "ad-playgraph";
        this.enabled = true;
        f.rd.events.on("playgraphUpdating", function() {
            return e.GWb();
        });
        f.rd.events.on("segmentNormalized", function() {
            return e.GWb();
        });
    }
    g.prototype.GWb = function() {
        this.dn = this.context.rd.dn || this.dn;
    }
    ;
    g.prototype.Ph = function(f) {
        var e, h, k, l, m, n;
        h = f.Ui;
        f = f.Xs;
        if (h === c.Sc.Gm || h === c.Sc.Mr || h === c.Sc.Wj || f === c.Od.mv || undefined === h && undefined === f) {
            f = this.context;
            h = f.za;
            if (null === (e = f.rd.Dc) || undefined === e ? 0 : e.od.Gw()) {
                e = h.player;
                f = e.Sd ? e.Wg : h.Ay ? h.Fm : undefined;
                k = this.dn;
                l = undefined;
                e = undefined;
                if (f) {
                    m = h.Z.ba[f.M];
                    n = h.Ib.$M(f.M);
                    n && (h = h.Ib.QI.Z.ba[n],
                    h.J != m.J && (l = m.J),
                    "content" !== m.type && (e = this.Wuc(f.M, h.J)));
                }
                h = {
                    adPlaygraph: k ? d.yJa.decode(k) : undefined,
                    adMid: l,
                    manifestHasAds: true
                };
                undefined !== e && (h.adBreakLocationMs = e);
                return h;
            }
            return {
                manifestHasAds: false
            };
        }
    }
    ;
    g.prototype.Wuc = function(f, e) {
        var h, k, l;
        if (f = (0,
        p.WL)(f))
            l = null === (k = null === (h = this.context.rd.Dc) || undefined === h ? undefined : h.od.QUa(e, f)) || undefined === k ? undefined : k.kj;
        return l;
    }
    ;
    return g;
}
)();
b.N9a =

// Detected exports: N9a
