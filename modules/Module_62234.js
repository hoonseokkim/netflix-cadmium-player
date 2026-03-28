/**
 * Netflix Cadmium Playercore - Module 62234
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: dkb
 * Dependencies: 19250, 22970, 23093, 48170, 66164, 91176, 97685
 * Purpose: Logging, Event handling, Configuration, Caching/Storage
 */

// import dep_19250 from './Module_19250.js';
// import dep_22970 from './Module_22970.js';
// import dep_23093 from './Module_23093.js';
// import dep_48170 from './Module_48170.js';
// import dep_66164 from './Module_66164.js';
// import dep_91176 from './Module_91176.js';
// import dep_97685 from './Module_97685.js';

// Webpack module 62234
// Parameters: t (module), b (exports), a (require)

var r, u, v, w, x, y, A;
function d(z, B) {
    return B.aua;
}
function p(z, B) {
    return (0,
    v.elc)({
        Dic: k,
        bnc: z,
        cDc: h,
        tc: B
    });
}
function c(z, B) {
    B = B.sXa;
    return z.sXa && !B;
}
function g(z, B, C) {
    var D;
    z = B.vu;
    D = B.Yn;
    C = C.Qha;
    return B.Ho && z < D - C;
}
function f(z, B, C) {
    var D;
    z = B.vu;
    D = B.Yn;
    C = C.Qha;
    return B.Ho && z > D + C;
}
function e(z, B, C) {
    var D, E;
    z = B.vu;
    D = B.aH;
    E = B.Yn;
    C = C.Qha;
    return B.Ho ? "DECREASING" === D && z <= E || "INCREASING" === D && z >= E || "NONE" === D && Math.abs(z - E) <= C ? true : false : false;
}
function h(z, B) {
    z = z.q3;
    B = B.q3;
    return 0 < z && z < B;
}
function k(z, B) {
    B = B.tda;
    return z.tda && !B;
}
function l(z, B) {
    B = B.tda;
    return !z.tda && B;
}
function m(z, B) {
    B = B.Ky;
    return !z.Ky && B;
}
function n(z, B) {
    B = B.Ku;
    return z.Ku && !B;
}
function q(z, B) {
    B = B.Ku;
    return !z.Ku && B;
}

r = a(22970);
u = a(66164);
v = a(91176);
w = a(97685);
x = a(48170);
y = a(23093);
A = a(19250);
t = (function() {
    class z {
    constructor(B, C) {
        var D;
        D = this;
        this.Xa = B;
        this.config = C;
        this.console = new u.platform.Console("ASEJS_PRESENTATION_DELAY_CONTROLLER","asejs");
        this.state = new v.Ylb({
            model: y.ekb
        });
        this.vCc = function(E, G) {
            var F, H;
            F = E.Yn;
            E = E.vu;
            if (!D.state.value.YDc) {
                H = D.Xa.qga({
                    type: "INCREASE",
                    Yn: F
                });
                x.u && D.g_a({
                    reason: G,
                    request: "INCREASE",
                    Yn: F,
                    vu: E,
                    response: H
                });
                G = D.Kfa(H);
                return {
                    Yy: D.bWa(G ? "INCREASE" : "DISABLE")
                };
            }
        }
        ;
        this.tnc = function(E, G) {
            var F, H;
            F = E.Yn;
            E = E.vu;
            if (!D.state.value.ZFb && D.state.value.tda) {
                H = D.Xa.qga({
                    type: "DECREASE",
                    Yn: F
                });
                x.u && D.g_a({
                    reason: G,
                    request: "DECREASE",
                    Yn: F,
                    vu: E,
                    response: H
                });
                G = D.Kfa(H);
                return {
                    Yy: D.bWa(G ? "DECREASE" : "DISABLE")
                };
            }
        }
        ;
        this.JIb = function(E, G) {
            var F, H;
            F = E.Yn;
            E = E.vu;
            if (!D.state.value.HEc) {
                H = D.Xa.qga({
                    type: "MAINTAIN",
                    Yn: F
                });
                x.u && D.g_a({
                    reason: G,
                    request: "MAINTAIN",
                    Yn: F,
                    vu: E,
                    response: H
                });
                G = D.Kfa(H);
                return {
                    Yy: D.bWa(G ? "MAINTAIN" : "DISABLE")
                };
            }
        }
        ;
        this.Kfa = function(E) {
            if ("APPROVED" === E.ng)
                return (x.u && D.console.log("The platform approved the request"),
                true);
            x.u && D.console.log(('The platform rejected the request with reason "').concat(E.reason, '"'));
            switch (E.reason) {
            case "NOT_SUPPORTED":
                return false;
            case "TARGET_ACHIEVED":
                return true;
            case "NO_LIVE_INTENT":
                return (x.u && D.state.value.Ku && D.console.warn("Request requested due to NO_LIVE_INTENT, but ASE has intent"),
                true);
            default:
                if (x.u)
                    throw Error(("Unexpected rejection: ").concat(E.reason));
                return false;
            }
        }
        ;
        this.HSb = function(E, G) {
            if (D.state.value.Yn !== D.config.Tk)
                return (x.u && D.console.log(("Setting target to configured minimum at ").concat(D.config.Tk, 'ms due to "').concat(G, '"')),
                {
                    Yy: {
                        Yn: D.config.Tk
                    }
                });
        }
        ;
        this.u2c = function(E, G) {
            x.u && D.console.log(('Unsetting target due to "').concat(G, '"'));
            return {
                Yy: {
                    Yn: -1
                }
            };
        }
        ;
        this.xAc = function(E, G) {
            if (D.state.value.ZFb)
                return (x.u && D.console.log(("Halting decrease to ").concat(D.state.value.Yn, 'ms due to "').concat(G, '". ') + ("Setting new target to ").concat(D.state.value.vu, "ms.")),
                {
                    Yy: {
                        Yn: D.state.value.vu
                    }
                });
        }
        ;
        this.XWc = function(E, G) {
            x.u && D.console.log(("No negative QoE signals have been received for ").concat(D.config.mya, "ms, ") + ('setting QoE to "acceptable" due to "').concat(G, '"'));
            return {
                Yy: {
                    q3: 0
                }
            };
        }
        ;
        this.fha = this.fha.bind(this);
        this.$za = this.$za.bind(this);
        this.Xza = this.Xza.bind(this);
        this.h4a = this.h4a.bind(this);
        this.reset = this.reset.bind(this);
        this.algorithm = new v.Algorithm([[d, function() {
            return {
                uec: true
            };
        }
        ], [(0,
        v.Dvb)([q, m], n), this.HSb], [(0,
        v.Dvb)([n, m], q), this.u2c], [p(this.config.mya, this.Xa.tc), this.XWc], [l, this.HSb], [k, this.xAc], [c, this.JIb], [e, this.JIb], [f, this.tnc], [g, this.vCc]],{
            store: this.state,
            gWa: function() {
                return [D.config];
            }
        });
    }
    fha(B) {
        this.rBa({
            Ku: B
        });
    }
    h4a() {
        this.rBa({
            q3: this.state.value.q3 + 1
        });
    }
    Xza(B) {
        this.rBa({
            Ky: B
        });
    }
    reset() {
        this.algorithm.reset();
        this.state.value.aua || this.state.reset();
    }
    bWa(B) {
        B = (0,
        v.J1c)(A.JQc, this.state.value.aH, B);
        x.u && B.Lq && this.console.log(('Transitioned from "').concat(B.UQc, '" to "').concat(B.Yy, '" due to ') + ('event "').concat(B.event, '"'));
        return {
            aH: B.Yy
        };
    }
    rBa(B) {
        this.state.next(r.__assign({}, B));
    }
    g_a(B) {
        var C, D, E, G, F;
        D = B.reason;
        E = B.request;
        G = B.Yn;
        F = B.vu;
        B = B.response;
        F = "MAINTAIN" === E ? ("Requesting ").concat(E).concat(-1 !== G ? (" at ").concat(G, "ms") : "") : ("Requesting ").concat(E, " from ").concat(F, "ms to ").concat(G, "ms");
        F += (' due to "').concat(D, '"');
        w.jb.isEnabled && w.jb.log((C = {},
        C.playgraphId = this.Xa.txc(),
        C.type = "PRESENTATION_DELAY_CHANGE_REQUEST",
        C.actioned = "APPROVED" === B.ng,
        C.reason = D,
        C.action = E,
        C.source = "AUTOMATIC",
        C.targetPresentationDelayMs = G,
        C));
        this.console.log(F);
    }
}
z.prototype.$za = function(B) {
        this.rBa({
            vu: B
        });
    }
    ;
    return z;
}
)();
export const dkb = t;

// Detected exports: dkb
