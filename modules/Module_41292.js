/**
 * Netflix Cadmium Playercore - Module 41292
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 1966, 5988, 14348, 14945, 36114, 42979, 51411, 70390, 94971
 * Purpose: MSL protocol, Logging, Caching/Storage, Timing/Scheduling
 */

// import dep_1966 from './Module_1966.js';
// import dep_5988 from './Module_5988.js';
// import dep_14348 from './Module_14348.js';
// import dep_14945 from './Module_14945.js';
// import dep_36114 from './Module_36114.js';
// import dep_42979 from './Module_42979.js';
// import dep_51411 from './Module_51411.js';
// import dep_70390 from './Module_70390.js';
// import dep_94971 from './Module_94971.js';

// Webpack module 41292
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m;
class d {
    constructor(n, q, r, u, v) {
    this.log = n;
    this.iKc = q;
    this.kN = r;
    this.dt = u;
    this.Y = v;
    this.aTb = [];
}
    xac(n) {
    this.aTb.push(n);
}
    send(n) {
    var q;
    q = this;
    return new Promise(function(r, u) {
        var v, w, x;
        v = n.timeout;
        w = new m.default.D3b(q.log,q.kN,n,q.dt.yS());
        x = new l.inb(n.url);
        q.log.trace("Sending MSL request");
        q.iKc.request(q.kN, w, x, v, {
            result: function(y) {
                var A;
                q.log.trace("Received MSL response", {
                    Method: n.method
                });
                if (y) {
                    n.allowTokenRefresh && q.Qxa();
                    A = y.input.z0();
                    A ? (q.xTa(A, n.profileGuid || n.userId),
                    u({
                        error: A
                    })) : q.sSc(y, v, {
                        result: function(z) {
                            r({
                                headers: y.input.Vba(),
                                body: new f.lma().Be(z)
                            });
                        },
                        timeout: function() {
                            u({
                                subCode: this.Y.qgb
                            });
                        },
                        error: function(z) {
                            u({
                                headers: y.input.Vba(),
                                error: z
                            });
                        }
                    });
                } else
                    u({
                        success: false,
                        error: new c.default(g.default.WC,"Null response stream"),
                        description: "Null response stream"
                    });
            },
            timeout: function() {
                u({
                    success: false,
                    subCode: this.Y.rgb
                });
            },
            error: function(y) {
                u({
                    success: false,
                    error: y
                });
            }
        });
    }
    );
}
    xTa(n, q) {
    n.errorCode === p.default.P.zg || n.errorCode === p.default.P.zi ? (this.dt.Ghc(),
    this.Qxa()) : n.errorCode !== p.default.P.$e && n.errorCode !== p.default.P.ud || this.fga(q);
}
    WWa() {
    return this.dt.WWa();
}
    fga(n) {
    if (n = this.dt.yy(n))
        (this.dt.fga(n),
        this.Qxa());
}
    NDc(n) {
    return n && n.errorCode == p.default.P.ud;
}
    MDc(n) {
    return n instanceof k.o6;
}
    Sba(n) {
    return n && n.errorCode;
}
    xzc(n) {
    var q, r;
    q = this.dt.oE();
    n = this.dt.yy(n);
    r = q ? this.dt.WA(q) : null;
    return {
        mc: q,
        vg: n,
        qp: r
    };
}
    sSc(n, q, r) {
    var u;
    u = [];
    (function w() {
        n.input.read(-1, q, {
            result: function(x) {
                (0,
                e.default)(r, function() {
                    if (x)
                        (u.push(x),
                        w());
                    else
                        switch (u.length) {
                        case 0:
                            return new Uint8Array(0);
                        case 1:
                            return u[0];
                        default:
                            return h.default.concat(u);
                        }
                }, null);
            },
            timeout: function() {
                r.timeout();
            },
            error: function(x) {
                r.error(x);
            }
        });
    }
    )();
}
    Qxa() {
    var n;
    n = this;
    this.dt.Czc({
        result: function(q) {
            for (var r = n.aTb.slice(), u = 0; u < r.length; u++)
                r[u]({
                    w_c: q
                });
        },
        timeout: function() {
            n.log.error("Timeout getting store state", "");
        },
        error: function(q) {
            n.log.error("Error getting store state", "" + q);
        }
    });
}
    dM(n) {
    var q;
    q = this.dt.oE();
    (n = this.dt.yy(n)) && !n.Qh(q) && (n = null);
    return this.dt.dM(q, n);
}
    YPb() {
    var n;
    n = this.dt.oE();
    this.dt.dM(n, null).find(function(q) {
        return "cad" === q.name;
    }) && (this.dt.Uya("cad", n, null),
    this.Qxa());
}
}
p = a(51411);
c = a(1966);
g = a(36114);
f = a(14348);
e = a(42979);
h = a(14945);
k = a(70390);
l = a(94971);
m = a(5988);
b["default"] = d;

