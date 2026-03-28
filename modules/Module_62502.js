/**
 * Netflix Cadmium Playercore - Module 62502
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: mFa
 * Dependencies: 5021, 14318, 22674, 22970, 53085, 69484, 75447, 87386
 * Purpose: Configuration, Parsing/Serialization, Error handling, Dependency injection
 */

// import dep_5021 from './Module_5021.js';
// import dep_14318 from './Module_14318.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_53085 from './Module_53085.js';
// import dep_69484 from './Module_69484.js';
// import dep_75447 from './Module_75447.js';
// import dep_87386 from './Module_87386.js';

// Webpack module 62502
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l;
class d {
    constructor(m, n, q, r, u, v, w) {
    this.config = m;
    this.OEb = n;
    this.Kd = q;
    this.We = r;
    this.mUc = u;
    this.gQb = v;
    this.hFc = 0;
    this.va = w.zb("FTL");
}
    start() {
    this.config.enabled && !this.oz && (this.oz = this.Kd.zr(this.config.BTb, this.cO.bind(this)));
}
    stop() {
    this.oz && (this.oz.cancel(),
    this.oz = undefined);
}
    cO() {
    var m, n;
    m = this;
    n = "" + this.config.endpoint + (-1 === this.config.endpoint.indexOf("?") ? "?" : "&") + "iter=" + this.hFc++;
    this.Mzc(n).then(function(q) {
        return Promise.all(q.urls.map(function(r) {
            return m.XAc(q, r.name, r.method, r.url);
        })).then(function(r) {
            0 < r.length && m.mUc.Zya({
                data: r,
                context: q.context,
                l_a: q.l_a
            });
        }).then(function() {
            return q;
        });
    }).then(function(q) {
        m.oz && (q.SGb ? m.oz = m.Kd.zr(q.SGb, m.cO.bind(m)) : m.stop());
    }).catch(function(q) {
        return m.va.error("FTL run failed", q);
    });
}
    Mzc(m) {
    var n;
    n = this;
    return this.OEb.get(m, false).then(function(q) {
        if (200 != q.status || null == q.body)
            return (n.gQb.Zya({
                url: m,
                status: q.status,
                zNb: "FTL API request failed",
                Of: q.Of
            }),
            Promise.reject(Error("FTL API request failed: " + q.status)));
        q = n.We.parse(q.body);
        return Promise.resolve(q);
    }).catch(function(q) {
        q instanceof Error && (n.gQb.Zya({
            url: m,
            status: 0,
            zNb: q.message
        }),
        n.va.error("FTL API call failed", q.message));
        return Promise.reject(q);
    });
}
    XAc(m, n, q, r) {
    var u;
    u = this;
    return new Promise(function(v, w) {
        var G;
        for (var x, y, A, z, B, C = [], D = {}, E = 0; E < m.dSc; (D = {
            YBa: D.YBa,
            ZBa: D.ZBa
        },
        ++E)) {
            D.YBa = E < m.VOb.length ? m.VOb[E] : g.ia;
            D.ZBa = "" + r + (-1 === r.indexOf("?") ? "?" : "&") + "pulse=" + (E + 1);
            G = (function(F) {
                return function() {
                    return new Promise(function(H, J) {
                        u.Kd.zr(F.YBa, function() {
                            p.pRc(u.OEb, F.ZBa, m.cSc).then(function(M) {
                                function K(L, O, I) {
                                    L || (L = I.headers[O]);
                                    return L;
                                }
                                x = K(x, "via", M);
                                y = K(y, "x-ftl-probe-data", M);
                                A = K(A, "x-ftl-error", M);
                                z = K(z, "x-ftl-probe-recv-ts", M);
                                B = K(B, "latency-trace", M);
                                M = {
                                    method: q,
                                    status: M.status,
                                    Of: M.Of,
                                    d4c: x || "",
                                    rhc: y || "",
                                    Waa: A || "",
                                    SWc: z || "",
                                    PFc: u.DOc(B)
                                };
                                H(M);
                            }).catch(function(M) {
                                J(M);
                            });
                        });
                    }
                    );
                }
                ;
            }
            )(D);
            C.push(0 < E ? C[E - 1].then(G) : G());
        }
        Promise.all(C).then(function(F) {
            v({
                name: n,
                method: q,
                url: r,
                data: F
            });
        }).catch(function(F) {
            w(F);
        });
    }
    );
}
    DOc(m) {
    var n;
    if (m) {
        n = {};
        m = Fa(m.split(";"));
        for (var q = m.next(); !q.done; q = m.next())
            if ((q = q.value.trim().split("=")) && 2 == q.length)
                try {
                    n[q[0].trim()] = Number.parseInt(q[1]);
                } catch (r) {}
        return n;
    }
}
}
t = a(22970);
c = a(22674);
g = a(5021);
f = a(53085);
e = a(87386);
h = a(14318);
k = a(75447);
a = a(69484);
d.pRc = function(m, n, q) {
    return m.get(n, false, q).then(function(r) {
        return Object.assign({}, r);
    });
}
;
l = p = d;
export const mFa = l;
export const mFa = l = p = t.__decorate([(0,
c.aa)(), t.__param(0, (0,
c.v)(a.Zcb)), t.__param(1, (0,
c.v)(k.Zdb)), t.__param(2, (0,
c.v)(f.Vl)), t.__param(3, (0,
c.v)(h.Ycb)), t.__param(4, (0,
c.v)(a.Dkb)), t.__param(5, (0,
c.v)(a.Ckb)), t.__param(6, (0,
c.v)(e.Bb))], l);

// Detected exports: mFa
