/**
 * Netflix Cadmium Playercore - Module 14739
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: ula
 * Dependencies: 22970, 29254, 36414, 48170, 51308, 52571, 54366, 61996, 64281, 65161, 66164, 79048, 91176, 94152
 * Purpose: Logging, Event handling, Configuration, Error handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_29254 from './Module_29254.js';
// import dep_36414 from './Module_36414.js';
// import dep_48170 from './Module_48170.js';
// import dep_51308 from './Module_51308.js';
// import dep_52571 from './Module_52571.js';
// import dep_54366 from './Module_54366.js';
// import dep_61996 from './Module_61996.js';
// import dep_64281 from './Module_64281.js';
// import dep_65161 from './Module_65161.js';
// import dep_66164 from './Module_66164.js';
// import dep_79048 from './Module_79048.js';
// import dep_91176 from './Module_91176.js';
// import dep_94152 from './Module_94152.js';

// Webpack module 14739
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r, u;

d = a(22970);
p = a(79048);
c = a(91176);
g = a(66164);
f = a(51308);
e = a(54366);
h = a(61996);
k = a(65161);
l = a(52571);
m = a(48170);
n = a(29254);
q = a(36414);
r = a(64281);
u = a(94152);
t = (function() {
    class v {
    constructor(w, x, y, A) {
        var z;
        undefined === A && (A = "CphAsePlaygraph");
        z = this;
        this.Wp = w;
        this.L4a = y;
        this.rVb = A;
        this.vBc = new n.RJa();
        this.aqb = new Map();
        x(function(B) {
            return d.__awaiter(z, [B], undefined, function(C) {
                var D, E;
                E = C.mq;
                return d.__generator(this, function(G) {
                    switch (G.label) {
                    case 0:
                        return [4, E];
                    case 1:
                        return (D = G.T(),
                        this.dC(D),
                        [2]);
                    }
                });
            });
        });
    }
    Gb() {
        var w, x;
        w = this.Wp;
        this.rRa = new h.Tm({
            Ig: 10,
            Ej: this,
            source: this.rVb,
            console: this.ub
        });
        this.events = (0,
        r.xRa)(function() {
            return w;
        }, w.za.events, this.L4a, u.WNb);
        this.ys = w.za.Ib;
        x = w.yj;
        x.Gb();
        w.za.Xc(new e.ko(this.rRa));
        w.za.Xc(new e.ko(w.yj.ve));
        w.za.Xc(new q.Gab(("").concat(w.MZa, "::gls"),x));
        w.za.parent = w.rd;
    }
    zA(w) {
        var x, y;
        x = this.player || this.za.player;
        this.player = w;
        w.E5a && w.E5a(this.Wp);
        y = this.Wp.za.zA(w.Xca || w);
        y ? (this.player = w,
        x !== w && x.GQa && x.GQa()) : this.player = x;
        return y;
    }
    GMc(w, x, y, A) {
        var z, B, C, D, E, G, F;
        z = w.Z;
        B = this.Wp.rd;
        C = B.player;
        E = B.Z;
        (D = y ? y : B.En && C.Sd ? C.Wg : B.Ay ? B.Fm : undefined) && this.za.Ib.get(D.M) && (D = this.yj.JJ(D));
        B.config.A4c && x && C.pO(true);
        x = B.MVa();
        m.u && this.ub.log(("onNewInnerPlaygraph: outer: ").concat(JSON.stringify(E)), {
            gYb: w.identifier
        });
        m.u && this.ub.log(("onNewInnerPlaygraph: combined: ").concat(JSON.stringify(z)));
        this.vBc.set(z, true);
        E = this.za.eW(w);
        try {
            if (!E.success || D && !C.Sd && !B.Ay || y && A) {
                C.Qa.zj && (this.ub.error(("Playgraph update failed: ").concat(JSON.stringify(E))),
                (0,
                l.assert)(false, "Update failed but player is not paused:" + k.Px[E.reason]));
                B.Tg(f.iP.VGb);
                E = this.za.eW(w);
                if (D) {
                    G = this.yj.CH(D);
                    F = z.ba[G.M];
                    (null === F || undefined === F ? undefined : F.type) === p.ed.padding && (G = {
                        M: F.Oc,
                        offset: c.I.ia
                    });
                    this.I5a(D);
                    this.za.Hza(G, A);
                    C.resume();
                }
                m.u && this.ub.log("onNewInnerPlaygraph: result", {
                    AKc: w.identifier,
                    result: k.Px[E.reason],
                    success: E.success,
                    gYb: this.Ib.identifier,
                    gac: this.za.Ib.identifier
                });
            } else
                m.u && this.ub.log("onNewInnerPlaygraph: result (in-flight)", {
                    AKc: w.identifier,
                    result: k.Px[E.reason],
                    success: E.success,
                    gYb: this.Ib.identifier,
                    gac: this.za.Ib.identifier
                });
        } catch (H) {
            this.ub.error(("onNewInnerPlaygraph: error: ").concat(H));
        } finally {
            x.release();
        }
    }
    eW(w) {
        var y, A;
        function x() {
            var z;
            z = w.OY(y.ys);
            m.u && y.ub.trace("updateWorkingPlaygraph:successHandler", {
                Rwa: y.ys.identifier,
                owa: z.identifier
            });
            y.ys = z;
        }
        y = this;
        A = this.KA(w) || w;
        try {
            return (this.za.events.sOb("playgraphUpdating", x),
            m.u && this.ub.trace("updateWorkingPlaygraph:Starting update", {
                Rwa: this.ys.identifier,
                Kjd: w.identifier,
                Fjd: A.identifier
            }),
            this.za.eW(A));
        } finally {
            this.za.events.removeListener("playgraphUpdating", x);
        }
    }
    MO(w) {
        w = p.fA.update(this.Ib, w);
        m.u && this.ub.log("updatePlaygraphMap:Attempt to update playgraph", {
            owa: w.identifier
        });
        return this.eW(w);
    }
    dC(w) {
        var x;
        x = this.Eb.cba || [];
        if (w.S.RD && x.some(function(y) {
            return y == w.R;
        }))
            return (x = ("").concat(w.R, " was excluded from content playgraph"),
            this.rRa.Eg(x),
            m.u && this.ub.trace(x),
            false);
        w.S.Kb && this.aqb.set(w.J, w.S.Kb);
        return true;
    }
    Tg(w) {
        this.za.Tg(w);
    }
    mvc(w) {
        return this.aqb.get(w);
    }
    I5a() {}
}
Object.defineProperties(v.prototype, {
        za: {
            get: function() {
                return this.Wp.za;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(v.prototype, {
        ei: {
            get: function() {
                return this.za;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(v.prototype, {
        Z: {
            get: function() {
                return this.ys.Z;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(v.prototype, {
        Ib: {
            get: function() {
                return this.ys;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(v.prototype, {
        parent: {
            get: function() {
                return this.pD;
            },
            set: function(w) {
                this.pD = w;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(v.prototype, {
        yj: {
            get: function() {
                return this.Wp.yj;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(v.prototype, {
        ub: {
            get: function() {
                undefined === this.Unb && (this.Unb = (0,
                c.Nf)(g.platform, this.za.TS.console, this.rVb));
                return this.Unb;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(v.prototype, {
        Eb: {
            get: function() {
                return this.za.config;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(v.prototype, {
        pEb: {
            get: function() {
                return false;
            },
            enumerable: false,
            configurable: true
        }
    });
    v.prototype.$fa = function(w, x, y, A) {
        (w = w || this.KA(x || this.Ib)) && this.GMc(w, this.pEb, y, A);
    }
    ;
    d.__decorate([(0,
    h.kb)({
        methodName: "attachPlayer"
    })], v.prototype, "zA", null);
    d.__decorate([(0,
    h.kb)({
        methodName: "reevaluateInnerPlaygraph"
    })], v.prototype, "$fa", null);
    d.__decorate([(0,
    h.kb)({
        methodName: "processViewableResponse"
    })], v.prototype, "dC", null);
    d.__decorate([(0,
    h.kb)({
        methodName: "cancelStreaming"
    })], v.prototype, "Tg", null);
    return v;
}
)();
export const ula = t;

// Detected exports: ula
