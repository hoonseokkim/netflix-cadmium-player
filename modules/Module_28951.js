/**
 * Netflix Cadmium Playercore - Module 28951
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: BHa
 * Dependencies: 22970, 62411, 91176, 97936
 * Purpose: Event handling, Parsing/Serialization, Error handling, Class definition
 */

// import dep_22970 from './Module_22970.js';
// import dep_62411 from './Module_62411.js';
// import dep_91176 from './Module_91176.js';
// import dep_97936 from './Module_97936.js';

// Webpack module 28951
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(91176);
c = a(97936);
g = a(62411);
t = (function(f) {
    class e extends f {
    constructor(h, k) {
        var l, m;
        l = f.call(this) || this;
        l.Wd = h;
        if (h.open) {
            m = k ? k.reduce(function(n, q) {
                n[q] = true;
                return n;
            }, {}) : undefined;
            h.closed.then(function() {
                return l.removeAllListeners();
            });
            h.on("message", function(n) {
                var q, r;
                q = n.Wd;
                n = n.message;
                if (m && m[n])
                    return l.emit("ignored", {
                        Wd: q,
                        message: n
                    });
                try {
                    r = JSON.parse(n);
                    if (r && "object" === typeof r)
                        return l.emit("message", {
                            Wd: q,
                            message: r
                        });
                    throw Error("Not an object");
                } catch (u) {
                    l.emit("invalid", {
                        Wd: q,
                        message: n,
                        error: u
                    });
                }
            });
        }
        return l;
    }
    T8a(h, k, l) {
        return d.__awaiter(this, undefined, undefined, function() {
            var m, n, q, r;
            return d.__generator(this, function(u) {
                switch (u.label) {
                case 0:
                    (m = new p.Zo(),
                    null === l || undefined === l ? undefined : l.then(undefined, function(v) {
                        return m.reject(v);
                    }),
                    n = new c.xG(function() {
                        return m.reject((0,
                        g.F6b)(h, "Timed out waiting for message"));
                    }
                    ,h),
                    q = this.Wd.closed,
                    q.then(function() {
                        return m.reject((0,
                        g.$Fa)("Socket closed while waiting for a message"));
                    }),
                    r = this.listener("message", function(v) {
                        var w;
                        v = v.message;
                        try {
                            w = k(v);
                            w && m.resolve(w);
                        } catch (x) {
                            m.reject((0,
                            g.EO)(x));
                        }
                    }),
                    u.label = 1);
                case 1:
                    return (u.ac.push([1, , 3, 4]),
                    [4, m]);
                case 2:
                    return [2, u.T()];
                case 3:
                    return (q.clear(),
                    n.clear(),
                    r.clear(),
                    [7]);
                case 4:
                    return [2];
                }
            });
        });
    }
}
d.return e;
}
)(a(70402).EventEmitter);
export const BHa = t;

// Detected exports: BHa
