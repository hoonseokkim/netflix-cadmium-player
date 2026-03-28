/**
 * Netflix Cadmium Playercore - Module 89768
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Fka
 * Dependencies: 22970, 32260, 44127, 48235, 65630, 69193, 72536, 77633
 * Purpose: MSL protocol, Parsing/Serialization, Error handling, UI components
 */

// import dep_22970 from './Module_22970.js';
// import dep_32260 from './Module_32260.js';
// import dep_44127 from './Module_44127.js';
// import dep_48235 from './Module_48235.js';
// import dep_65630 from './Module_65630.js';
// import dep_69193 from './Module_69193.js';
// import dep_72536 from './Module_72536.js';
// import dep_77633 from './Module_77633.js';

// Webpack module 89768
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n;

d = a(22970);
p = a(77633);
c = a(9E3);
g = a(48235);
f = a(65630);
e = a(69193);
h = d.__importDefault(a(6838));
k = a(44127);
l = d.__importDefault(a(42979));
m = a(72536);
n = a(32260);
t = (function(q) {
    class r extends q {
    constructor(u, v) {
        var w, y;
        w = q.call(this, null) || this;
        w.VR = u;
        u = [];
        if (v instanceof Array)
            u = v;
        else if (v instanceof p.ml)
            for (var x = 0; x < v.size(); ++x)
                u.push(v.Hf(x));
        else if (v instanceof Uint8Array)
            try {
                x = e.eD.Be(v, e.TC.yG);
                y = JSON.parse(x);
                if (!(y instanceof Array))
                    throw new h.default("Invalid JSON array encoding.");
                u = y;
            } catch (A) {
                if (!n.Md(A))
                    throw new h.default("Invalid JSON array encoding.",A);
                throw A;
            }
        try {
            for (v = 0; v < u.length; ++v)
                w.put(-1, u[v]);
        } catch (A) {
            if (A instanceof TypeError)
                throw new h.default("Invalid MSL array encoding.",A);
            throw A;
        }
        return w;
    }
    put(u, v) {
        var w;
        try {
            w = v instanceof Object && v.constructor === Object ? new m.DP(this.VR,v) : v instanceof Array ? new r(this.VR,v) : v;
        } catch (x) {
            if (x instanceof h.default)
                throw new TypeError("Unsupported JSON object or array representation.");
            throw x;
        }
        return q.prototype.put.call(this, u, w);
    }
    Ed(u) {
        var v;
        v = this.get(u);
        if (v instanceof Uint8Array)
            return v;
        try {
            if (v instanceof String)
                return k.Fk(v.valueOf(), false);
            if ("string" === typeof v)
                return k.Fk(v, false);
        } catch (w) {}
        throw new h.default("MslArray[" + u + "] is not binary data.");
    }
    dBa(u, v) {
        var x;
        function w(y, A, z) {
            l.default(v, function() {
                var B;
                if (z >= A)
                    return y;
                B = x.Hf(z);
                B instanceof Uint8Array ? (y.push(k.Ji(B)),
                w(y, A, z + 1)) : B instanceof m.DP ? B.RV(u, {
                    result: function(C) {
                        l.default(v, function() {
                            y.push(C);
                            w(y, A, z + 1);
                        });
                    },
                    error: v.error
                }) : B instanceof r ? B.dBa(u, {
                    result: function(C) {
                        l.default(v, function() {
                            y.push(C);
                            w(y, A, z + 1);
                        });
                    },
                    error: v.error
                }) : B instanceof c.nj ? new m.DP(u,B).RV(u, {
                    result: function(C) {
                        l.default(v, function() {
                            y.push(C);
                            w(y, A, z + 1);
                        });
                    },
                    error: v.error
                }) : B instanceof p.ml ? new r(u,B).dBa(u, {
                    result: function(C) {
                        l.default(v, function() {
                            y.push(C);
                            w(y, A, z + 1);
                        });
                    },
                    error: v.error
                }) : B instanceof g.fp ? B.bo(u, f.YC.JSON, {
                    result: function(C) {
                        l.default(v, function() {
                            new m.DP(u,C).RV(u, {
                                result: function(D) {
                                    l.default(v, function() {
                                        y.push(D);
                                        w(y, A, z + 1);
                                    });
                                },
                                error: v.error
                            });
                        });
                    },
                    error: v.error
                }) : (y.push(B),
                w(y, A, z + 1));
            });
        }
        x = this;
        l.default(v, function() {
            var y;
            y = x.size();
            w([], y, 0);
        });
    }
}
d.return r;
}
)(p.ml);
export const Fka = t;

// Detected exports: Fka
