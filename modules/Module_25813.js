/**
 * Netflix Cadmium Playercore - Module 25813
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Cib, U5
 * Dependencies: 3033, 22970, 27259, 27977, 52571, 58049, 65161, 66164, 69575, 71808, 85254, 89645, 91176
 * Purpose: Audio handling, Video handling, Buffer/Segment management, Logging
 */

// import dep_3033 from './Module_3033.js';
// import dep_22970 from './Module_22970.js';
// import dep_27259 from './Module_27259.js';
// import dep_27977 from './Module_27977.js';
// import dep_52571 from './Module_52571.js';
// import dep_58049 from './Module_58049.js';
// import dep_65161 from './Module_65161.js';
// import dep_66164 from './Module_66164.js';
// import dep_69575 from './Module_69575.js';
// import dep_71808 from './Module_71808.js';
// import dep_85254 from './Module_85254.js';
// import dep_89645 from './Module_89645.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 25813
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q;

d = a(22970);
p = a(91176);
c = a(66164);
g = a(65161);
t = a(71808);
f = a(85254);
e = a(89645);
h = a(52571);
k = a(69575);
l = a(3033);
m = a(27977);
n = a(27259);
a = a(58049);
(function(r) {
    r[r.OC = 0] = "CREATED";
    r[r.V5 = 1] = "CANCELLED";
}
)(q || (export const U5 = q = {}));
a = (function(r) {
    class u extends r {
    constructor(v, w, x, y, A, z) {
        v = r.call(this, w, y, x, p.I.ia, (0,
        k.Nf)(c.platform, v, "AsePadding")) || this;
        v.L = A;
        v.config = z;
        v.mW = new e.RJ(v.console);
        v.jL = new e.RJ(v.console);
        v.Ln = new p.Zo();
        v.eU = new n.Dib(z).create();
        v.console.trace(("PaddingBranch {").concat(w.id, "}: created"));
        return v;
    }
    Qkc(v) {
        return d.__awaiter(this, undefined, undefined, function() {
            var w, x, y, A, z, B, C, D;
            D = this;
            return d.__generator(this, function(E) {
                switch (E.label) {
                case 0:
                    return [4, this.VQc()];
                case 1:
                    return (w = E.T(),
                    x = w.Ge,
                    y = w.Dd,
                    A = w.bitrate,
                    z = w.cv,
                    B = (0,
                    k.Nf)(c.platform, this.console, "[0]"),
                    this.jL = new e.RJ(B),
                    C = l.kP.instance().yha.POb(this.L, x, y, A, z, v, this.K, this.tBb.bind(this), this.config, B),
                    C.forEach(function(G) {
                        return D.jL.enqueue(G);
                    }),
                    this.jL.XR(),
                    [2]);
                }
            });
        });
    }
    Dmc(v) {
        return d.__awaiter(this, undefined, undefined, function() {
            var w, x, y, A, z, B, C, D, E, G, F, H, J, M, K, L;
            J = this;
            return d.__generator(this, function(O) {
                switch (O.label) {
                case 0:
                    return [4, this.WQc()];
                case 1:
                    return (w = O.T(),
                    x = w.profile,
                    y = w.zD,
                    A = w.cv,
                    z = null === (L = null === (K = null === (M = this.parent) || undefined === M ? undefined : M.$d(g.l.U)) || undefined === K ? undefined : K.track.Ha) || undefined === L ? undefined : L.K3a(),
                    (0,
                    h.assert)(z, "padding branches should always have a frameRate"),
                    B = (0,
                    k.Nf)(c.platform, this.console, "[0]"),
                    C = this.eU.MRb({
                        profile: x,
                        frameRate: z
                    }),
                    D = C.profile,
                    E = C.frameRate,
                    G = l.kP.instance().yha.QOb(this.L, this.L.m4c, D, E, y, A, v, this.K, this.tBb.bind(this), B),
                    F = G.duration,
                    H = G.Ta,
                    this.K.CSb([]),
                    H.forEach(function(I) {
                        return J.mW.enqueue(I);
                    }),
                    this.mW.XR(),
                    this.VMa = F,
                    this.L.lS = F.G,
                    [2]);
                }
            });
        });
    }
    Gb() {
        return d.__awaiter(this, undefined, undefined, function() {
            var v;
            return d.__generator(this, function(w) {
                switch (w.label) {
                case 0:
                    return [4, r.prototype.Gb.call(this)];
                case 1:
                    (w.T(),
                    w.label = 2);
                case 2:
                    return (w.ac.push([2, 6, , 7]),
                    this.parent ? [4, this.parent.UO] : [3, 4]);
                case 3:
                    (w.T(),
                    w.label = 4);
                case 4:
                    return (this.console.trace(("PaddingBranch {").concat(this.K.id, "}: init")),
                    this.VMa = this.K.$b.da(this.K.nb),
                    [4, this.fwb([g.l.V, g.l.U])]);
                case 5:
                    return (w.T(),
                    this.Ln.resolve(),
                    [3, 7]);
                case 6:
                    v = w.T();
                    if (!this.fd)
                        throw v;
                    return [3, 7];
                case 7:
                    return [2];
                }
            });
        });
    }
    cM(v) {
        return d.__awaiter(this, undefined, undefined, function() {
            return d.__generator(this, function() {
                this.console.trace(("PaddingBranch {").concat(this.K.id, "}: getRequestIterator(").concat(v, ")"));
                return v === g.l.V ? [2, this.jL.Yra()] : v === g.l.U ? [2, this.mW.Yra()] : [2, this.NCb(v)];
            });
        });
    }
    reset() {}
    Tg(v) {
        undefined === v && (v = "other");
        r.prototype.Tg.call(this, v);
        this.gb = q.V5;
        this.VMa = undefined;
        this.events.emit("branchDestroyed", {
            type: "branchDestroyed",
            reason: v
        });
        this.events.removeAllListeners();
    }
    qR() {
        return true;
    }
    gta(v) {
        return [g.l.V, g.l.U].some(function(w) {
            return w === v;
        });
    }
    Lk(v) {
        var w;
        return null === (w = this.parent) || undefined === w ? undefined : w.Lk(v);
    }
    ysa() {
        return [];
    }
    aI() {}
    zn() {
        return this.BT.G;
    }
    sS() {
        return {};
    }
    t0() {
        return this.K.$b.G;
    }
    zt(v, w, x, y) {
        return d.__awaiter(this, undefined, undefined, function() {
            return d.__generator(this, function(A) {
                switch (A.label) {
                case 0:
                    return [4, this.Ln.promise];
                case 1:
                    return (A.T(),
                    this.parent ? [4, this.parent.UO] : [3, 3]);
                case 2:
                    (A.T(),
                    A.label = 3);
                case 3:
                    return [4, this.fwb(y)];
                case 4:
                    return (A.T(),
                    [2]);
                }
            });
        });
    }
    fwb(v) {
        return d.__awaiter(this, undefined, undefined, function() {
            return d.__generator(this, function(w) {
                switch (w.label) {
                case 0:
                    if (-1 === v.indexOf(g.l.U))
                        return [3, 2];
                    this.mW.clear();
                    return [4, this.Dmc(this.BT)];
                case 1:
                    (w.T(),
                    w.label = 2);
                case 2:
                    if (-1 === v.indexOf(g.l.V))
                        return [3, 4];
                    this.jL.clear();
                    this.console.trace(("AsePaddingBranch {").concat(this.K.id, "}: video duration ").concat(this.BT.ca()));
                    return [4, this.Qkc(this.BT)];
                case 3:
                    (w.T(),
                    w.label = 4);
                case 4:
                    return [2];
                }
            });
        });
    }
    Ot() {
        return [];
    }
    NZ(v) {
        var w, x;
        return !!((null === (w = this.Sb) || undefined === w ? 0 : w.greaterThan(v)) && (null === (x = this.Vb) || undefined === x ? 0 : x.lessThan(v)));
    }
    hsa() {
        return this.BT;
    }
    kBa() {
        return false;
    }
    toJSON() {
        var v, w;
        return {
            segment: this.K.id,
            viewableId: this.rD.J,
            contentStartPts: null === (v = this.qa) || undefined === v ? undefined : v.G,
            contentEndPts: null === (w = this.wa) || undefined === w ? undefined : w.G
        };
    }
    WQc() {
        return d.__awaiter(this, undefined, undefined, function() {
            var v, w, x, y, A, z, B, C, D, E, G;
            return d.__generator(this, function(F) {
                switch (F.label) {
                case 0:
                    return (v = null === (z = null === (A = this.parent) || undefined === A ? undefined : A.$d(g.l.U)) || undefined === z ? undefined : z.Ro.El) ? [3, 2] : [4, null === (C = null === (B = this.parent) || undefined === B ? undefined : B.$d(g.l.U)) || undefined === C ? undefined : C.Ro.MXb];
                case 1:
                    F.T();
                    if (this.fd)
                        return [2, Promise.reject()];
                    F.label = 2;
                case 2:
                    return (v = null === (E = null === (D = this.parent) || undefined === D ? undefined : D.$d(g.l.U)) || undefined === E ? undefined : E.Ro.El,
                    (0,
                    h.assert)(v, "Parent of padding branch must have last selected video stream"),
                    w = null === (G = v.track.Oo) || undefined === G ? undefined : G.zD,
                    x = v.track.cv,
                    y = v.Zc,
                    [2, {
                        profile: y,
                        zD: w,
                        cv: x
                    }]);
                }
            });
        });
    }
    VQc() {
        return d.__awaiter(this, undefined, undefined, function() {
            var v, w, x, y, A, z, B, C, D, E, G;
            return d.__generator(this, function(F) {
                switch (F.label) {
                case 0:
                    return (v = null === (B = null === (z = this.parent) || undefined === z ? undefined : z.$d(g.l.V)) || undefined === B ? undefined : B.Ro.El) ? [3, 2] : [4, null === (D = null === (C = this.parent) || undefined === C ? undefined : C.$d(g.l.V)) || undefined === D ? undefined : D.Ro.MXb];
                case 1:
                    F.T();
                    if (this.fd)
                        return [2, Promise.reject()];
                    F.label = 2;
                case 2:
                    return (v = null === (G = null === (E = this.parent) || undefined === E ? undefined : E.$d(g.l.V)) || undefined === G ? undefined : G.Ro.El,
                    (0,
                    h.assert)(v, "Parent of padding branch must have last selected audio stream"),
                    w = v.Ge || p.I.ia,
                    x = (0,
                    m.CBb)(v.profile),
                    y = v.bitrate,
                    A = v.track.cv,
                    [2, {
                        Ge: w,
                        Dd: x,
                        bitrate: y,
                        cv: A
                    }]);
                }
            });
        });
    }
    tBb(v, w) {
        return this.gD.add(w).Rc(v).$;
    }
    GS() {
        return [];
    }
    fDb() {
        return Infinity;
    }
    Psa() {
        return Infinity;
    }
    lH() {
        return {
            lU: true,
            reason: undefined
        };
    }
    vZ(v) {
        return v.Va === this.K.Va && v.eb === this.K.eb;
    }
}
d.Object.defineProperties(u.prototype, {
        Pk: {
            get: function() {
                return true;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        Dk: {
            get: function() {
                return true;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        bL: {
            get: function() {
                return 0;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        ag: {
            get: function() {
                return this.Ln.aO;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        UO: {
            get: function() {
                return this.Ln.promise;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        PBa: {
            get: function() {
                return Promise.resolve();
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        om: {
            get: function() {
                return true;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        O: {
            get: function() {
                return this.BT.O;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        Cb: {
            get: function() {
                return this.K.nb.Rc(this.O).$;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        Pb: {
            get: function() {
                return this.Cb + this.BT.$;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        Xp: {
            get: function() {
                return this.Qd.Rc(this.O).$;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        lI: {
            get: function() {
                return this.K.nb.add(this.Qd);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        f0: {
            get: function() {
                (0,
                h.assert)(!this.K.km, "exit zone not supported for padding segments");
                return p.I.ia;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        TY: {
            get: function() {
                return this.jL && this.mW ? this.jL.mI && this.mW.mI : false;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        XOa: {
            get: function() {
                return !(!this.jL && !this.mW);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        bx: {
            get: function() {
                return this.K.nb.add(this.Qd);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        tU: {
            get: function() {
                return this.K.$b.add(this.Qd);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        Nua: {
            get: function() {
                return this.Sb;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        Hk: {
            get: function() {
                return this.Sb;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        Qd: {
            get: function() {
                return this.gD;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        BT: {
            get: function() {
                return this.VMa || this.K.$b.da(this.K.nb);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(u.prototype, {
        Gz: {
            get: function() {
                return p.I.ia;
            },
            enumerable: false,
            configurable: true
        }
    });
    u.prototype.$d = function() {}
    ;
    u.prototype.$A = function() {
        return [];
    }
    ;
    return u;
}
)(a.fDa);
export const Cib = a;
(0,
f.Ol)(t.Pz, a);

// Detected exports: Cib, U5
