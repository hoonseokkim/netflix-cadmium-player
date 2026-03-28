/**
 * Netflix Cadmium Playercore - Module 14314
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: y9a
 */

// Webpack module 14314
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const y9a = undefined;
d = a(91176);  // import from Module_91176
t = (function() {
    function p(c, g) {
        this.console = c;
        this.config = g;
    }
    p.prototype.Taa = function(c, g) {
        var f, e;
        f = this;
        return c.Ab && null !== (e = c.wd) && undefined !== e && e.Uj ? g.map(function(h, k) {
            var l, m, n, q, r;
            if (!h.xa.yb)
                return h;
            n = null === (l = h.xa.Zk) || undefined === l ? undefined : l.add(d.I.Ca(f.config.ubc));
            l = 0 < h.xa.yb.length ? h.xa.yb.reduce(function(u, v) {
                return u.add(d.I.Ca(v.eb - v.Va));
            }, d.I.ia) : h.xa.duration;
            if (n && n.lessThan(l)) {
                h.state.L4 = true;
                q = n.G;
                r = false;
                null === (m = h.xa.yb) || undefined === m ? undefined : m.forEach(function(u) {
                    var v, w, x;
                    w = u.qo;
                    if (r)
                        u.qo = true;
                    else {
                        x = u.eb - u.Va;
                        q >= x ? q -= x : r = u.qo = true;
                    }
                    w !== u.qo && f.console.log("Ad skipped due to early termination", {
                        Cqb: u.id,
                        Ub: k,
                        hb: h.xa.hb,
                        Zk: null === (v = h.xa.Zk) || undefined === v ? undefined : v.ca()
                    });
                });
            }
            return h;
        }) : g;
    }
    ;
    return p;
}
)();
b.y9a =

// Detected exports: y9a
