/**
 * Netflix Cadmium Playercore - Module 33863
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Tla, mG
 * Dependencies: 22970, 25881, 32260, 36911, 42486, 50441, 60426, 75007, 96837
 * Purpose: Encryption/Decryption, Error handling, UI components
 */

// import dep_22970 from './Module_22970.js';
// import dep_25881 from './Module_25881.js';
// import dep_32260 from './Module_32260.js';
// import dep_36911 from './Module_36911.js';
// import dep_42486 from './Module_42486.js';
// import dep_50441 from './Module_50441.js';
// import dep_60426 from './Module_60426.js';
// import dep_75007 from './Module_75007.js';
// import dep_96837 from './Module_96837.js';

// Webpack module 33863
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r;

t = a(22970);
d = a(96837);
p = t.__importDefault(a(42979));
c = t.__importDefault(a(42458));
g = t.__importDefault(a(6838));
f = t.__importDefault(a(36114));
e = a(50441);
h = a(75007);
k = a(60426);
l = a(42486);
m = a(36911);
n = t.__importDefault(a(88257));
q = a(25881);
r = a(32260);
export const mG = {
    B0b: 1,
    C0b: 2,
    Hnb: 3,
    Inb: 4,
    QX: 5
};
a = (function() {
    class u {
    constructor(v, w, x, y, A) {
        var z;
        x && (x = x.gx);
        y && (y = y.gx);
        v = A == b.mG.C0b ? d.af.Kla : A == b.mG.B0b ? d.af.rG : "nullOp";
        z = A == b.mG.Inb ? d.af.Kla : A == b.mG.Hnb ? d.af.rG : "nullOp";
        A = A == b.mG.QX ? d.af.X7 : "nullOp";
        this.id = w;
        this.privateKey = x;
        this.publicKey = y;
        this.transform = v;
        this.VBa = z;
        this.eoa = A;
    }
    encrypt(v, w, x, y) {
        var A;
        A = this;
        p.default(y, function() {
            if ("nullOp" == A.transform)
                return v;
            if (!A.publicKey)
                throw new c.default(f.default.EEa,"no public key");
            if (0 == v.length)
                return v;
            e.hh.encrypt(A.transform, A.publicKey, v).then(function(z) {
                q.ARa(A.id, null, new Uint8Array(z), {
                    result: function(B) {
                        B.bo(w, x, {
                            result: y.result,
                            error: function(C) {
                                C instanceof g.default && (C = new c.default(f.default.Dja,null,C));
                                y.error(C);
                            }
                        });
                    },
                    error: function(B) {
                        r.Md(B) || (B = new c.default(f.default.gka,null,B));
                        y.error(B);
                    }
                });
            }, function(z) {
                y.error(new c.default(f.default.gka,null,z));
            });
        });
    }
    decrypt(v, w, x) {
        var y;
        y = this;
        p.default(x, function() {
            var A;
            if ("nullOp" == y.transform)
                return v;
            if (!y.privateKey)
                throw new c.default(f.default.QDa,"no private key");
            if (0 == v.length)
                return v;
            try {
                A = w.Qp(v);
            } catch (z) {
                if (z instanceof g.default)
                    throw new c.default(f.default.vab,null,z);
                throw new c.default(f.default.VJ,null,z);
            }
            q.Z1a(A, h.uf.Wl, {
                result: function(z) {
                    try {
                        e.hh.decrypt(y.transform, y.privateKey, z.rH).then(function(B) {
                            x.result(new Uint8Array(B));
                        }, function(B) {
                            x.error(new c.default(f.default.VJ,null,B));
                        });
                    } catch (B) {
                        r.Md(B) ? x.error(B) : x.error(new c.default(f.default.VJ,null,B));
                    }
                },
                error: function(z) {
                    z instanceof n.default && (z = new c.default(f.default.Dja,null,z));
                    r.Md(z) || (z = new c.default(f.default.VJ,null,z));
                    x.error(z);
                }
            });
        });
    }
    QF(v, w, x, y) {
        var A;
        A = this;
        p.default(y, function() {
            if ("nullOp" == A.VBa || !A.publicKey)
                throw new c.default(f.default.Gnb,"no public key");
            e.hh.wrapKey("jwk", v.gx, A.publicKey, A.VBa).then(function(z) {
                y.result(new Uint8Array(z));
            }, function(z) {
                y.error(new c.default(f.default.NLa,null,z));
            });
        });
    }
    KO(v, w, x, y) {
        var z;
        function A(B) {
            p.default(y, function() {
                switch (B.type) {
                case "secret":
                    k.XZ(B, y);
                    break;
                case "public":
                    l.VZ(B, y);
                    break;
                case "private":
                    m.UZ(B, y);
                    break;
                default:
                    throw new c.default(f.default.rLa,"type: " + B.type);
                }
            });
        }
        z = this;
        p.default(y, function() {
            if ("nullOp" == z.VBa || !z.privateKey)
                throw new c.default(f.default.dnb,"no private key");
            e.hh.unwrapKey("jwk", v, z.privateKey, z.VBa, w, false, x).then(A, function(B) {
                y.error(new c.default(f.default.tLa,null,B));
            });
        });
    }
    sign(v, w, x, y) {
        var A;
        A = this;
        p.default(y, function() {
            if ("nullOp" == A.eoa)
                return new Uint8Array(0);
            if (!A.privateKey)
                throw new c.default(f.default.nKa,"no private key");
            e.hh.sign(A.eoa, A.privateKey, v).then(function(z) {
                h.BRa(new Uint8Array(z), {
                    result: function(B) {
                        B.Ed(w, x, {
                            result: y.result,
                            error: function(C) {
                                C instanceof g.default && (C = new c.default(f.default.alb,undefined,C));
                                y.error(C);
                            }
                        });
                    },
                    error: y.error
                });
            }, function(z) {
                y.error(new c.default(f.default.blb,undefined,z));
            });
        });
    }
    verify(v, w, x, y) {
        var A;
        A = this;
        p.default(y, function() {
            if ("nullOp" == A.eoa)
                return true;
            if (!A.publicKey)
                throw new c.default(f.default.DLa,"no public key");
            h.$1a(w, h.uf.Wl, x, {
                result: function(z) {
                    p.default(y, function() {
                        var B;
                        B = y.result;
                        e.hh.verify(A.eoa, A.publicKey, z.mha, v).then(B, function(C) {
                            y.error(new c.default(f.default.blb,undefined,C));
                        });
                    });
                },
                error: y.error
            });
        });
    }
}
return u;
}
)();
export const Tla = a;

// Detected exports: Tla, mG
