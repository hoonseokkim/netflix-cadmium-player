/**
 * Netflix Cadmium Playercore - Module 69351
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Algorithm, Reb, zcb
 * Dependencies: 22970, 36911, 42486, 50441, 60426, 96837
 * Purpose: Encryption/Decryption, Error handling, UI components
 */

// import dep_22970 from './Module_22970.js';
// import dep_36911 from './Module_36911.js';
// import dep_42486 from './Module_42486.js';
// import dep_50441 from './Module_50441.js';
// import dep_60426 from './Module_60426.js';
// import dep_96837 from './Module_96837.js';

// Webpack module 69351
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l;
export const Reb = t = a(22970);
d = a(96837);
p = t.__importDefault(a(10690));
c = t.__importDefault(a(42458));
g = t.__importDefault(a(36114));
f = a(50441);
e = a(36911);
h = a(42486);
k = a(60426);
l = t.__importDefault(a(42979));
export const Algorithm = {
    rG: d.af.rG.name,
    bja: d.af.bja.name
};
export const zcb = {
    A128GCM: "A128GCM",
    J5c: "A256GCM"
};
a = (function() {
    class m {
    constructor(n, q, r, u, v) {
        switch (q) {
        case b.Algorithm.rG:
            q = d.af.rG;
            v = v && (v.gx || v);
            u = u && (u.gx || u);
            break;
        case b.Algorithm.bja:
            q = d.af.bja;
            v = u = u && (u.gx || u);
            break;
        default:
            throw new p.default("Unsupported algorithm: " + q);
        }
        this.Ak = n;
        this.cqb = q;
        this.N$b = v;
        this.B$b = u;
    }
    encrypt(n, q, r, u) {
        u.error(new c.default(g.default.EEa));
    }
    decrypt(n, q, r) {
        r.error(new c.default(g.default.QDa));
    }
    QF(n, q, r, u) {
        l.default(u, function() {
            f.hh.wrapKey("jwe+jwk", n.gx, this.N$b, this.cqb).then(function(v) {
                u.result(new Uint8Array(v));
            }, function(v) {
                u.error(new c.default(g.default.NLa,null,v));
            });
        }, this);
    }
    KO(n, q, r, u) {
        function v(w) {
            l.default(u, function() {
                switch (w.type) {
                case "secret":
                    k.XZ(w, u);
                    break;
                case "public":
                    h.VZ(w, u);
                    break;
                case "private":
                    e.UZ(w, u);
                    break;
                default:
                    throw new c.default(g.default.rLa,"type: " + w.type);
                }
            });
        }
        l.default(u, function() {
            f.hh.unwrapKey("jwe+jwk", n, this.B$b, this.cqb, q, false, r).then(function(w) {
                v(w);
            }, function(w) {
                u.error(new c.default(g.default.tLa,null,w));
            });
        }, this);
    }
    sign(n, q, r, u) {
        u.error(new c.default(g.default.nKa));
    }
    verify(n, q, r, u) {
        u.error(new c.default(g.default.DLa));
    }
}
return m;
}
)();
export const Reb = a;

// Detected exports: Algorithm, Reb, zcb
