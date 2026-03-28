/**
 * Netflix Cadmium Playercore - Module 99662
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: oEa
 * Dependencies: 17892, 22674, 22970, 36129, 42207, 58393, 66085, 70285, 87386
 * Purpose: Logging, Configuration, Caching/Storage, Error handling
 */

// import dep_17892 from './Module_17892.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_36129 from './Module_36129.js';
// import dep_42207 from './Module_42207.js';
// import dep_58393 from './Module_58393.js';
// import dep_66085 from './Module_66085.js';
// import dep_70285 from './Module_70285.js';
// import dep_87386 from './Module_87386.js';

// Webpack module 99662
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l;
class d {
    constructor(m, n, q, r, u) {
    this.woc = m;
    this.Ht = n;
    this.oc = r;
    this.QOc = u;
    this.jcb = /^(SDK-|SLW32-|SLW64-|SLMAC-|WWW-BROWSE-|.{10})([A-Z0-9-=]{4,})$/;
    this.log = q.zb("Device");
}
    tzb(m) {
    try {
        return m.match(this.jcb)[2];
    } catch (n) {}
}
    Asc(m) {
    try {
        return m.match(this.jcb)[1];
    } catch (n) {}
}
    create(m) {
    var n;
    n = this;
    return new Promise(function(q, r) {
        n.Ht.create().then(function(u) {
            var w, x, y, A, z, B;
            function v(C) {
                n.oc.Zx(C) && n.oc.Zx(w) ? (x = new g.Fbb(C,w,undefined,y,m.Aaa || "cadmium"),
                q(x)) : r({
                    Ya: p.Y.obb
                });
            }
            w = m.zu;
            if (m.jVa) {
                y = "bind_device";
                n.QOc.ef({
                    log: n.log
                }, {}).then(function(C) {
                    v(C.esn);
                }).catch(function(C) {
                    r(C);
                });
            } else if (m.p0) {
                z = m.wj;
                if (n.oc.Zx(z)) {
                    B = n.Asc(z);
                    B != m.zu && n.log.error("esn prefix from ui is different", {
                        ui: B,
                        cad: m.zu,
                        ua: m.userAgent
                    });
                } else
                    m.d_a && n.log.error("esn from ui is missing");
                !m.OO && n.oc.Zx(z) ? (y = "config",
                v(z)) : u.load(m.Axb).then(function(C) {
                    A = C.value;
                    n.oc.Zx(A) && (false,
                    n.oc.Zx(z) ? (C = n.tzb(z),
                    y = C === A ? "storage_matched_esn_in_config" : "storage_did_not_match_esn_in_config") : y = "storage_esn_not_in_config",
                    v(w + A));
                }).catch(function(C) {
                    var G;
                    function D() {
                        u.save(m.Axb, G, false).then(function() {
                            v(w + G);
                        }).catch(function(F) {
                            r(F);
                        });
                    }
                    function E() {
                        G = n.woc.Guc();
                        false;
                        D();
                    }
                    if (C.Ya === p.Y.tG) {
                        if (n.oc.Zx(m.wj)) {
                            G = n.tzb(m.wj);
                            n.oc.Zx(G) ? (y = "config_since_not_in_storage",
                            D()) : (y = "generated_since_invalid_in_config_and_not_in_storage",
                            n.log.error("invalid esn passed from UI", m.wj),
                            E());
                        } else
                            (y = "generated_since_not_in_config_and_storage",
                            E());
                    } else
                        r(C);
                });
            } else
                v();
        }).catch(function(u) {
            r(u);
        });
    }
    );
}
}
t = a(22970);
p = a(36129);
c = a(42207);
g = a(66085);
f = a(87386);
e = a(58393);
h = a(22674);
k = a(17892);
a = a(70285);
l = d;
export const oEa = l;
export const oEa = l = t.__decorate([(0,
h.aa)(), t.__param(0, (0,
h.v)(e.Ebb)), t.__param(1, (0,
h.v)(k.PJ)), t.__param(2, (0,
h.v)(f.Bb)), t.__param(3, (0,
h.v)(c.Zi)), t.__param(4, (0,
h.v)(a.Lib))], l);

// Detected exports: oEa
