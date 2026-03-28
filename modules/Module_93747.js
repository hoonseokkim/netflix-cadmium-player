/**
 * Netflix Cadmium Playercore - Module 93747
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: chb
 * Dependencies: 22970, 48170, 61996, 62629, 65161
 * Purpose: Buffer/Segment management, Logging, Configuration, Error handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_48170 from './Module_48170.js';
// import dep_61996 from './Module_61996.js';
// import dep_62629 from './Module_62629.js';
// import dep_65161 from './Module_65161.js';

// Webpack module 93747
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

d = a(22970);
p = a(48170);
c = a(62629);
g = a(65161);
f = a(61996);
t = (function() {
    class e {
    constructor(h, k, l) {
        this.xVa = h;
        this.Nwc = k;
        this.console = l;
        this.ve = new f.Tm({
            Ej: this,
            console: l,
            source: "MemoryDeadlockProtector",
            Ig: 5
        });
    }
    quc(h) {
        var k, l, m, n;
        m = h.config;
        n = m.Pp + (null !== (l = null === (k = m.tC) || undefined === k ? undefined : k.G) && undefined !== l ? l : 0);
        k = this.dBc(n, h);
        p.u && this.console.debug(("MDP: has prebuf: ").concat(k));
        return k ? {
            zqa: true
        } : (l = this.Lfc(m),
        k = l.NNc,
        l = l.L3c,
        k && l ? (p.u && this.console.debug(("MDP: utilizing ").concat(Math.round(100 * l), "%")),
        l >= m.hJc ? this.yQb(h, k) : {
            zqa: true
        }) : {
            zqa: false
        });
    }
    yQb(h, k) {
        var l, m, n, q, r, v, y, A;
        this.ve.Eg({
            o: k
        });
        q = h.player;
        h = h.bb;
        r = q.bb;
        q = q.Ok;
        for (var u = 0; u < r.length; u++)
            if (!r[u].Dk) {
                q = r[u];
                r = r.slice(0, u + 1);
                break;
            }
        u = false;
        v = [{
            mediaType: g.l.V,
            kH: 0
        }, {
            mediaType: g.l.U,
            kH: 0
        }, {
            mediaType: g.l.Ea,
            kH: 0
        }];
        if (null === q || undefined === q || !q.Dk) {
            h = h.map(function(B) {
                return B;
            }).filter(function(B) {
                return -1 === r.indexOf(B);
            }).sort(function(B, C) {
                return (0,
                c.wtb)(B) - (0,
                c.wtb)(C);
            });
            try {
                for (var w = d.__values(h), x = w.next(); !x.done; x = w.next()) {
                    y = x.value;
                    A = y.sS();
                    v[g.l.V].kH += null !== (m = A.TK) && undefined !== m ? m : 0;
                    v[g.l.U].kH += null !== (n = A.PO) && undefined !== n ? n : 0;
                    p.u && this.console.debug(("Resetting discontiguous branch ").concat(y.K.id), A);
                    y.reset();
                    if (u = v.every(function(B) {
                        return B.kH >= k[B.mediaType].kH;
                    }))
                        break;
                }
            } catch (B) {
                var z;
                z = {
                    error: B
                };
            } finally {
                try {
                    x && !x.done && (l = w.return) && l.call(w);
                } finally {
                    if (z)
                        throw z.error;
                }
            }
        }
        return {
            zqa: u,
            vfd: v
        };
    }
    Lfc(h) {
        var k, l, m, n, q;
        k = [g.l.V, g.l.U, g.l.Ea];
        if (!h.iJc)
            return {};
        l = this.Nwc();
        m = this.xVa().total;
        n = h.gJc;
        q = 0;
        h = k.map(function(r) {
            var u;
            u = l[r] - m[r] * n;
            q = Math.max(0 < m[r] ? l[r] / m[r] : 0, q);
            return {
                kH: Math.max(0, u),
                mediaType: r
            };
        });
        return {
            L3c: q,
            NNc: h
        };
    }
    dBc(h, k) {
        var l, m, n;
        l = this;
        m = false;
        k = k.En ? k.player : undefined;
        if (null === k || undefined === k ? 0 : k.KCc) {
            m = k.bC.$A().map(function(q) {
                return q.mediaType;
            });
            n = k.Uvc();
            m = m.every(function(q) {
                var r, u;
                if (q === g.l.V)
                    q = null !== (r = n.MQ) && undefined !== r ? r : 0;
                else if (q === g.l.U)
                    q = null !== (u = n.jW) && undefined !== u ? u : 0;
                else
                    return (p.u && l.console.trace("hasEnoughBuffer ignoring mediaType:", q),
                    true);
                return q >= h;
            });
        }
        return m;
    }
}
d.__decorate([(0,
    f.kb)({
        methodName: "resetDiscontiguousBranches",
        return: true,
        df: true
    })], e.prototype, "yQb", null);
    return e;
}
)();
export const chb = t;

// Detected exports: chb
