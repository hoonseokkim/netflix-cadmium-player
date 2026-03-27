/**
 * Netflix Cadmium Playercore - Module 72672
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 72672
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f, e, h, k, l, m, n, q, r;
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.$Ka = void 0;
t = a(22970);
d = t.__importDefault(a(42979));
p = t.__importDefault(a(42458));
c = t.__importDefault(a(36114));
g = a(25881);
f = t.__importDefault(a(6838));
e = a(50441);
h = a(96837);
k = t.__importDefault(a(88257));
l = a(60426);
m = a(42486);
n = a(36911);
q = a(75007);
r = a(32260);
a = (function() {
    function u(v, w, x, y, A) {
        this.Ik = v;
        this.id = w;
        this.uw = null === x || void 0 === x ? void 0 : x.gx;
        this.pJ = null === y || void 0 === y ? void 0 : y.gx;
        this.wrapKey = null === A || void 0 === A ? void 0 : A.gx;
    }
    u.prototype.encrypt = function(v, w, x, y) {
        var A;
        A = this;
        d.default(y, function() {
            var z;
            if (!A.uw)
                throw new p.default(c.default.EEa,"no encryption/decryption key");
            if (0 == v.length)
                return v;
            z = new Uint8Array(16);
            A.Ik.jDb().GKc(z);
            e.hh.encrypt({
                name: h.af.XO.name,
                iv: z
            }, A.uw, v).then(function(B) {
                g.ARa(A.id, z, new Uint8Array(B), {
                    result: function(C) {
                        C.bo(w, x, {
                            result: y.result,
                            error: function(D) {
                                D instanceof f.default && (D = new p.default(c.default.Dja,null,D));
                                y.error(D);
                            }
                        });
                    },
                    error: function(C) {
                        r.Md(C) || (C = new p.default(c.default.gka,null,C));
                        y.error(C);
                    }
                });
            }, function(B) {
                y.error(new p.default(c.default.gka,null,B));
            });
        });
    }
    ;
    u.prototype.decrypt = function(v, w, x) {
        var y;
        y = this;
        d.default(x, function() {
            var A;
            if (!y.uw)
                throw new p.default(c.default.QDa,"no encryption/decryption key");
            if (0 == v.length)
                return v;
            try {
                A = w.Qp(v);
            } catch (z) {
                if (z instanceof f.default)
                    throw new p.default(c.default.vab,null,z);
                throw new p.default(c.default.VJ,null,z);
            }
            g.Z1a(A, g.uf.Wl, {
                result: function(z) {
                    try {
                        e.hh.decrypt({
                            name: h.af.XO.name,
                            iv: z.iv
                        }, y.uw, z.rH).then(function(B) {
                            x.result(new Uint8Array(B));
                        }, function(B) {
                            x.error(new p.default(c.default.VJ,null,B));
                        });
                    } catch (B) {
                        r.Md(B) ? x.error(B) : x.error(new p.default(c.default.VJ,null,B));
                    }
                },
                error: function(z) {
                    z instanceof k.default && (z = new p.default(c.default.Dja,null,z));
                    r.Md(z) || (z = new p.default(c.default.VJ,null,z));
                    x.error(z);
                }
            });
        });
    }
    ;
    u.prototype.QF = function(v, w, x, y) {
        var A;
        A = this;
        d.default(y, function() {
            if (!A.wrapKey)
                throw new p.default(c.default.Gnb,"no wrap/unwrap key");
            e.hh.wrapKey("raw", v.gx, A.wrapKey, A.wrapKey.algorithm).then(function(z) {
                y.result(new Uint8Array(z));
            }, function(z) {
                y.error(new p.default(c.default.NLa,null,z));
            });
        });
    }
    ;
    u.prototype.KO = function(v, w, x, y) {
        var z;
        function A(B) {
            d.default(y, function() {
                switch (B.type) {
                case "secret":
                    l.XZ(B, y);
                    break;
                case "public":
                    m.VZ(B, y);
                    break;
                case "private":
                    n.UZ(B, y);
                    break;
                default:
                    throw new p.default(c.default.rLa,"type: " + B.type);
                }
            });
        }
        z = this;
        d.default(y, function() {
            if (!z.wrapKey)
                throw new p.default(c.default.dnb,"no wrap/unwrap key");
            e.hh.unwrapKey("raw", v, z.wrapKey, z.wrapKey.algorithm, w, !1, x).then(function(B) {
                A(B);
            }, function(B) {
                y.error(new p.default(c.default.tLa,null,B));
            });
        }, this);
    }
    ;
    u.prototype.sign = function(v, w, x, y) {
        var A;
        A = this;
        d.default(y, function() {
            if (!A.pJ)
                throw new p.default(c.default.nKa,"no signature key.");
            e.hh.sign(A.pJ.algorithm, A.pJ, v).then(function(z) {
                d.default(y, function() {
                    q.BRa(new Uint8Array(z), {
                        result: function(B) {
                            B.Ed(w, x, {
                                result: y.result,
                                error: function(C) {
                                    d.default(y, function() {
                                        C instanceof f.default && (C = new p.default(c.default.alb,void 0,C));
                                        y.error(C);
                                    });
                                }
                            });
                        },
                        error: y.error
                    });
                });
            }, function(z) {
                y.error(new p.default(c.default.tka,null,z));
            });
        });
    }
    ;
    u.prototype.verify = function(v, w, x, y) {
        var A;
        A = this;
        d.default(y, function() {
            if (!A.pJ)
                throw new p.default(c.default.DLa,"no signature key.");
            q.$1a(w, q.uf.Wl, x, {
                result: function(z) {
                    d.default(y, function() {
                        var B;
                        B = y.result;
                        e.hh.verify(A.pJ.algorithm, A.pJ, z.mha, v).then(B, function(C) {
                            y.error(new p.default(c.default.tka,void 0,C));
                        });
                    });
                },
                error: y.error
            });
        });
    }
    ;
    return u;
}
)();
b.$Ka = a;
