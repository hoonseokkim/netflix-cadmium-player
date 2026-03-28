/**
 * Netflix Cadmium Playercore - Module 94933
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Zab
 * Dependencies: 22970, 28020, 62411, 91072
 * Purpose: Configuration, Error handling, Class definition, Enum definitions
 */

// import dep_22970 from './Module_22970.js';
// import dep_28020 from './Module_28020.js';
// import dep_62411 from './Module_62411.js';
// import dep_91072 from './Module_91072.js';

// Webpack module 94933
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(91072);
c = a(28020);
g = a(62411);
t = (function(f) {
    class e extends f {
    constructor(h) {
        var k;
        k = f.call(this, "CON", h.trace) || this;
        k.zz = (0,
        c.fa)();
        k.timing = new p.hLa();
        k.attempt = 0;
        k.options = d.__assign({}, h);
        return k;
    }
    finish(h, k) {
        var l;
        l = this;
        k.open ? (h.end(),
        this.set(k),
        k.closed.then(function() {
            return l.close();
        })) : (k = g.Meb("Factory returned a closed socket"),
        this.failure = {
            type: "connection-failed",
            types: g.Fzb(k),
            RA: [k]
        },
        h.end(this.failure),
        this.close());
    }
    Ttb(h, k) {
        k = g.EO(k);
        if ("connection-disabled" === k.type)
            throw (h.end(k),
            this.failure = k,
            k);
    }
    connect() {
        return d.__awaiter(this, undefined, undefined, function() {
            var h, k, l, m, n, q, r, u, v, w;
            return d.__generator(this, function(x) {
                switch (x.label) {
                case 0:
                    (h = this.options,
                    k = h.Au,
                    l = h.retry,
                    m = this.timing.AAa("connect"),
                    x.label = 1);
                case 1:
                    return (x.ac.push([1, 3, , 8]),
                    this.attempt++,
                    n = this.finish,
                    q = [m],
                    [4, k(m.details())]);
                case 2:
                    return [2, n.apply(this, q.concat([x.T()]))];
                case 3:
                    r = x.T();
                    this.Ttb(m, r);
                    m.end(null !== r && undefined !== r ? r : g.Meb("Factory failed with no error"));
                    if (!l)
                        throw r;
                    u = this.timing.AAa("retry");
                    x.label = 4;
                case 4:
                    return (x.ac.push([4, 6, , 7]),
                    [4, l(this.attempt, this.uy)]);
                case 5:
                    if (v = x.T())
                        return [2, this.finish(u, v)];
                    u.end();
                    return [2, this.connect()];
                case 6:
                    throw (w = x.T(),
                    this.Ttb(u, w),
                    u.end(null !== w && undefined !== w ? w : g.Sla(this.attempt)),
                    w);
                case 7:
                    return [3, 8];
                case 8:
                    return [2];
                }
            });
        });
    }
}
d.e.open = function(h) {
        return d.__awaiter(this, undefined, undefined, function() {
            var k;
            return d.__generator(this, function(l) {
                switch (l.label) {
                case 0:
                    (k = new e(h),
                    l.label = 1);
                case 1:
                    return (l.ac.push([1, 3, , 4]),
                    [4, k.connect()]);
                case 2:
                    return (l.T(),
                    [3, 4]);
                case 3:
                    return (l.T(),
                    k.close(),
                    [3, 4]);
                case 4:
                    return (k.pd && !k.failure && (k.failure = {
                        type: "connection-failed",
                        types: g.Fzb(k.uy),
                        RA: k.uy
                    }),
                    [2, k]);
                }
            });
        });
    }
    ;
    Object.defineProperties(e.prototype, {
        pd: {
            get: function() {
                return !this.connected;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        duration: {
            get: function() {
                return this.timing.duration;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        ZUb: {
            get: function() {
                return (0,
                c.fa)() - this.zz;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        H4a: {
            get: function() {
                return this.timing.Ss.reduce(function(h, k) {
                    var l;
                    l = k.error;
                    return "retry" !== k.type || l ? h : h + 1;
                }, 0);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        i1c: {
            get: function() {
                return (0,
                c.fa)() - this.timing.end;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        uy: {
            get: function() {
                return this.timing.Ss.filter(function(h) {
                    return h.error;
                }).map(function(h) {
                    return g.EO(h.error);
                });
            },
            enumerable: false,
            configurable: true
        }
    });
    return e;
}
)(a(64743).LDa);
export const Zab = t;

// Detected exports: Zab
