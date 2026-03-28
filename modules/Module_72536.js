/**
 * Netflix Cadmium Playercore - Module 72536
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: DP, Nyb
 * Dependencies: 21399, 22970, 32260, 44127, 48235, 65630, 69193, 77633, 89768
 * Purpose: MSL protocol, Parsing/Serialization, Error handling, UI components
 */

// import dep_21399 from './Module_21399.js';
// import dep_22970 from './Module_22970.js';
// import dep_32260 from './Module_32260.js';
// import dep_44127 from './Module_44127.js';
// import dep_48235 from './Module_48235.js';
// import dep_65630 from './Module_65630.js';
// import dep_69193 from './Module_69193.js';
// import dep_77633 from './Module_77633.js';
// import dep_89768 from './Module_89768.js';

// Webpack module 72536
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q, r;

d = a(22970);
p = a(77633);
c = a(9E3);
g = a(69193);
f = a(48235);
e = a(65630);
h = d.__importDefault(a(6838));
k = a(44127);
l = d.__importDefault(a(42979));
m = a(21399);
n = a(89768);
q = a(32260);
export function Nyb(u, v, w) {
    l.default(w, function() {
        (v instanceof r ? v : new r(u,v)).x1c(u, {
            result: function(x) {
                l.default(w, function() {
                    return g.eD.Ed(x, g.TC.yG);
                });
            },
            error: w.error
        });
    });
}
;
r = (function(u) {
    class v extends u {
    constructor(w, x) {
        var y, B;
        undefined === x && (x = null);
        y = u.call(this) || this;
        y.VR = w;
        try {
            if ((w = undefined,
            x instanceof c.nj))
                for (var A = x.Xba(), z = 0; z < A.length; ++z)
                    (w = A[z],
                    y.put(w, x.Hf(w)));
            else if (x instanceof Object && x.constructor === Object)
                for (w in x) {
                    if (!(w instanceof String) && "string" !== typeof w)
                        throw new h.default("Invalid JSON object encoding.");
                    y.put(w, x[w]);
                }
            else if (x instanceof Uint8Array) {
                z = g.eD.Be(x, g.TC.yG);
                B = JSON.parse(z);
                if (!(B instanceof Object) || B.constructor !== Object)
                    throw new h.default("Invalid JSON object encoding.");
                for (w in B) {
                    if (!(w instanceof String) && "string" !== typeof w)
                        throw new h.default("Invalid JSON object encoding.");
                    y.put(w, B[w]);
                }
            }
        } catch (C) {
            if (C instanceof TypeError)
                throw new h.default("Invalid MSL object encoding.",C);
            if (!q.Md(C))
                throw new h.default("Invalid JSON object encoding.",C);
            throw C;
        }
        return y;
    }
    put(w, x) {
        var y;
        try {
            y = x instanceof Object && x.constructor === Object ? new v(this.VR,x) : x instanceof Array ? new n.Fka(this.VR,x) : x;
        } catch (A) {
            if (A instanceof h.default)
                throw new TypeError("Unsupported JSON object or array representation.");
            throw A;
        }
        return u.prototype.put.call(this, w, y);
    }
    Ed(w) {
        var x;
        x = this.get(w);
        if (x instanceof Uint8Array)
            return x;
        try {
            if (x instanceof String)
                return k.Fk(x.valueOf(), false);
            if ("string" === typeof x)
                return k.Fk(x, false);
        } catch (y) {}
        throw new h.default("MslObject[" + m.quote(w) + "] is not binary data.");
    }
    RV(w, x) {
        var A;
        function y(z, B, C) {
            l.default(x, function() {
                var D, E;
                if (C >= B.length)
                    return z;
                D = B[C];
                E = A.Hf(D);
                E instanceof Uint8Array ? (z[D] = k.Ji(E),
                y(z, B, C + 1)) : E instanceof v ? E.RV(w, {
                    result: function(G) {
                        l.default(x, function() {
                            z[D] = G;
                            y(z, B, C + 1);
                        });
                    },
                    error: x.error
                }) : E instanceof n.Fka ? E.dBa(w, {
                    result: function(G) {
                        l.default(x, function() {
                            z[D] = G;
                            y(z, B, C + 1);
                        });
                    },
                    error: x.error
                }) : E instanceof c.nj ? new v(w,E).RV(w, {
                    result: function(G) {
                        l.default(x, function() {
                            z[D] = G;
                            y(z, B, C + 1);
                        });
                    },
                    error: x.error
                }) : E instanceof p.ml ? new n.Fka(w,E).dBa(w, {
                    result: function(G) {
                        l.default(x, function() {
                            z[D] = G;
                            y(z, B, C + 1);
                        });
                    },
                    error: x.error
                }) : E instanceof f.fp ? E.bo(w, e.YC.JSON, {
                    result: function(G) {
                        l.default(x, function() {
                            new v(w,G).RV(w, {
                                result: function(F) {
                                    l.default(x, function() {
                                        z[D] = F;
                                        y(z, B, C + 1);
                                    });
                                },
                                error: x.error
                            });
                        });
                    },
                    error: x.error
                }) : (z[D] = E,
                y(z, B, C + 1));
            });
        }
        A = this;
        l.default(x, function() {
            var z;
            z = A.Xba();
            y({}, z, 0);
        });
    }
    x1c(w, x) {
        this.RV(w, {
            result: function(y) {
                l.default(x, function() {
                    return JSON.stringify(y);
                });
            },
            error: x.error
        });
    }
}
d.return v;
}
)(c.nj);
export const DP = r;

// Detected exports: DP, Nyb
