/**
 * Netflix Cadmium Playercore - Module 93562
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: AOc, Av, COc, O5b, Ola
 * Dependencies: 10558, 11475, 22970, 32260, 33863, 42486, 43088, 49140, 59786, 69351, 75316, 75948, 96837
 * Purpose: Encryption/Decryption, Error handling, Class definition
 */

// import dep_10558 from './Module_10558.js';
// import dep_11475 from './Module_11475.js';
// import dep_22970 from './Module_22970.js';
// import dep_32260 from './Module_32260.js';
// import dep_33863 from './Module_33863.js';
// import dep_42486 from './Module_42486.js';
// import dep_43088 from './Module_43088.js';
// import dep_49140 from './Module_49140.js';
// import dep_59786 from './Module_59786.js';
// import dep_69351 from './Module_69351.js';
// import dep_75316 from './Module_75316.js';
// import dep_75948 from './Module_75948.js';
// import dep_96837 from './Module_96837.js';

// Webpack module 93562
// Parameters: t (module), b (exports), a (require)

var g, f, e, h, k, l, m, n, q, r, u, v, w, x, y, A, z, B, C, D, E;
function d(G, F) {
    e.default(F, function() {
        var H, J, M;
        try {
            H = G.Be("keypairid");
            J = G.Be("mechanism");
            M = G.Ed("publickey");
            if (!b.Av[J])
                throw new k.default(n.default.M6b,J);
        } catch (K) {
            if (K instanceof l.default)
                throw new m.default(n.default.lf,"keydata " + G);
            throw K;
        }
        try {
            switch (J) {
            case b.Av.MX:
            case b.Av.Oeb:
            case b.Av.Neb:
            case b.Av.cGa:
                q.QXa(M, r.af.rG, u.BG.MLa, v.kl.qK, {
                    result: function(K) {
                        F.result(new D(H,J,K,null));
                    },
                    error: F.error
                });
                break;
            case b.Av.Peb:
                q.QXa(M, r.af.Kla, u.BG.MLa, v.kl.qK, {
                    result: function(K) {
                        F.result(new D(H,J,K,null));
                    },
                    error: F.error
                });
                break;
            default:
                throw new w.default(n.default.cnb,J);
            }
        } catch (K) {
            if (!C.Md(K))
                throw new w.default(n.default.zP,"keydata " + G,K);
            throw K;
        }
    });
}
function p(G, F) {
    var H, J, M;
    try {
        H = F.Be("keypairid");
        J = F.Ed("encryptionkey");
        M = F.Ed("hmackey");
    } catch (K) {
        if (K instanceof l.default)
            throw new m.default(n.default.lf,"keydata " + F);
        throw K;
    }
    return new E(G,H,J,M);
}
function c(G, F, H, J, M) {
    switch (H) {
    case b.Av.Oeb:
    case b.Av.Neb:
        return new y.Reb(G,y.Algorithm.rG,y.zcb.A128GCM,J,M);
    case b.Av.MX:
    case b.Av.cGa:
        return new A.Tla(G,F,J,M,A.mG.Hnb);
    case b.Av.Peb:
        return new A.Tla(G,F,J,M,A.mG.Inb);
    default:
        throw new w.default(n.default.cnb,H);
    }
}
b.D$a = export const COc = b.O5b = b.AOc =
g = a(22970);
t = a(59786);
f = a(75948);
e = g.__importDefault(a(42979));
h = g.__importDefault(a(14945));
k = g.__importDefault(a(35661));
l = g.__importDefault(a(6838));
m = g.__importDefault(a(88257));
n = g.__importDefault(a(36114));
q = a(42486);
r = a(96837);
u = a(10558);
v = a(11475);
w = g.__importDefault(a(42458));
x = a(49140);
y = a(69351);
A = a(33863);
z = g.__importDefault(a(10690));
a(58892);
g.__importDefault(a(80760));
B = a(43088);
C = a(32260);
a(55531);
a = a(75316);
export const Av = {
    MX: "RSA",
    q0b: "ECC",
    Oeb: "JWE_RSA",
    Neb: "JWEJS_RSA",
    cGa: "JWK_RSA",
    Peb: "JWK_RSAES"
};
D = (function(G) {
    class F extends G {
    constructor(H, J, M, K) {
        var L;
        L = G.call(this, f.Hka.dCa) || this;
        L.Uu = H;
        L.eN = J;
        L.publicKey = M;
        L.privateKey = K;
        return L;
    }
    KVa(H, J) {
        var M;
        M = this;
        e.default(J, function() {
            var K;
            K = H.zf();
            K.put("keypairid", M.Uu);
            K.put("mechanism", M.eN);
            K.put("publickey", M.publicKey.mE());
            return K;
        });
    }
    equals(H) {
        var J;
        if (H === this)
            return true;
        if (!(H instanceof F))
            return false;
        J = this.privateKey === H.privateKey || this.privateKey && H.privateKey && h.default.equal(this.privateKey.mE(), H.privateKey.mE());
        return G.prototype.equals.call(this, H) && this.Uu == H.Uu && this.eN == H.eN && h.default.equal(this.publicKey.mE(), H.publicKey.mE()) && J;
    }
    wi() {
        var H, J;
        H = this.publicKey.mE();
        J = this.privateKey && this.privateKey.mE();
        H = G.prototype.wi.call(this) + ":" + this.Uu + ":" + this.eN + ":" + h.default.mta(H);
        J && (H += ":" + h.default.mta(J));
        return H;
    }
    KVa(H, J) {
        var M;
        M = this;
        e.default(J, function() {
            var K;
            K = H.zf();
            K.put("keypairid", M.Uu);
            K.put("encryptionkey", M.uw);
            K.put("hmackey", M.jM);
            return K;
        });
    }
    equals(H) {
        return this === H ? true : H instanceof F ? G.prototype.equals.call(this, H) && this.Uu == H.Uu && h.default.equal(this.uw, H.uw) && h.default.equal(this.jM, H.jM) : false;
    }
    wi() {
        return G.prototype.wi.call(this) + ":" + this.Uu + ":" + h.default.mta(this.uw) + ":" + h.default.mta(this.jM);
    }
    lmc(H, J) {
        d(H, J);
    }
    nmc(H, J, M) {
        e.default(M, function() {
            return p(H, J);
        });
    }
    WA(H, J, M, K, L) {
        e.default(L, function() {
            var O, I, N;
            if (!(J instanceof D))
                throw new z.default("Key request data " + J + " was not created by this factory.");
            if (!(M instanceof E))
                throw new z.default("Key response data " + M + " was not created by this factory.");
            O = J.Uu;
            I = M.Uu;
            if (O != I)
                throw new k.default(n.default.Web,"request " + O + "; response " + I).qc(K);
            I = J.privateKey;
            if (!I)
                throw new k.default(n.default.$1b,"request Asymmetric private key").qc(K);
            N = c(H, O, J.eN, I, null);
            N.KO(M.uw, r.af.XO, u.BG.fka, {
                result: function(Q) {
                    N.KO(M.jM, r.af.fX, u.BG.QX, {
                        result: function(S) {
                            H.nsa({
                                result: function(T) {
                                    e.default(L, function() {
                                        return new B.f8(H,M.mc,T.nE(),Q,S);
                                    });
                                },
                                error: function(T) {
                                    e.default(L, function() {
                                        C.Md(T) && T.qc(K);
                                        throw T;
                                    });
                                }
                            });
                        },
                        error: function(S) {
                            e.default(L, function() {
                                C.Md(S) && S.qc(K);
                                throw S;
                            });
                        }
                    });
                },
                error: function(Q) {
                    e.default(L, function() {
                        C.Md(Q) && Q.qc(K);
                        throw Q;
                    });
                }
            });
        });
    }
}
g.return F;
}
)(t.efb);
export const Ola = D;
export const AOc = d;
E = (function(G) {
    function F(H, J, M, K) {
        H = G.call(this, H, f.Hka.dCa) || this;
        H.Uu = J;
        H.uw = M;
        H.jM = K;
        return H;
    }
    g.__extends(F, G);
    return F;
}
)(x.ffb);
export const O5b = E;
export const COc = p;
a = (function(G) {
    function F(H) {
        var J;
        J = G.call(this, f.Hka.dCa) || this;
        J.usb = H;
        return J;
    }
    g.__extends(F, G);
    return F;
}
)(a.cfb);
b.D$a = a;

// Detected exports: AOc, Av, COc, O5b, Ola
