/**
 * Netflix Cadmium Playercore - Module 53158
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 53158
// Parameters: t (module), b (exports), a (require)

var d, p;
d = a(22970);
p = a(93334);
t = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.parse = function(f) {
        var e, h, k, l, m, n;
        if ("nclx" === this.N.gC()) {
            k = this.N.sg();
            l = this.N.sg();
            m = this.N.sg();
            n = this.N.ib(1);
            this.N.ib(7);
            this.Oub = {
                idd: k,
                Mmd: l,
                Eid: m,
                Afd: n
            };
        }
        if (null === f || undefined === f ? 0 : f.yh) {

            for (l = this.parent; l; ) {
                k = null === (h = null === (e = l.wn("tkhd")) || undefined === e ? undefined : e.Uc) || undefined === h ? undefined : h.trackId;
                if (undefined !== k)
                    break;
                l = l.parent;
            }
            (0,
            p.assert)(undefined !== k, "Failed to find trackId in track hierarchy");
            f = f.yh[k];
            if (!f)
                return true;
            f.Oub = this.Oub;
        }
        return true;
    }
    ;
    g.Ae = "colr";
    return g;
}
)(a(72905).Kf);
export default t;
