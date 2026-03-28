/**
 * Netflix Cadmium Playercore - Module 91072
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Imb, hLa, y6b
 * Dependencies: 22970, 28020
 * Purpose: Encryption/Decryption, Configuration, Timing/Scheduling, Error handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_28020 from './Module_28020.js';

// Webpack module 91072
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
function d(e) {
    return e.filter(function(h) {
        return h.start !== h.end;
    }).map(function(h) {
        var k, l, m, n, q;
        k = h.sxb;
        l = h.start;
        m = h.end;
        n = h.error;
        q = h.details;
        h = ("").concat(h.type).concat(k ? (" (").concat(k, "):") : ":", " ").concat(m - l, " ms").concat(n ? " (failed)" : "");
        return q ? [h, d(q)] : h;
    });
}
export const Imb = p = a(22970);
c = a(28020);
g = (function() {
    class e {
    constructor(h, k) {
        h = "string" === typeof h ? [h, undefined] : h;
        this.interval = {
            type: h[0],
            sxb: h[1],
            start: (0,
            c.fa)(),
            end: NaN
        };
        this.ended = k;
    }
    end(h) {
        isNaN(this.interval.end) && (this.interval.end = (0,
        c.fa)(),
        this.interval.error = h,
        this.ended(this.interval));
    }
    details() {
        return new f(this.interval);
    }
    push(h, k, l, m) {
        h = "string" === typeof h ? [h, undefined] : h;
        this.Ss.push({
            type: h[0],
            sxb: h[1],
            start: k,
            end: l,
            error: m
        });
    }
    AAa(h) {
        var k;
        k = this;
        return new g(h,function(l) {
            k.Ss.push(l);
        }
        );
    }
    noa(h, k) {
        return p.__awaiter(this, undefined, undefined, function() {
            var l, m, n;
            return p.__generator(this, function(q) {
                switch (q.label) {
                case 0:
                    (l = this.AAa(h),
                    q.label = 1);
                case 1:
                    return (q.ac.push([1, 3, , 4]),
                    [4, k(l)]);
                case 2:
                    return (m = q.T(),
                    l.end(),
                    [2, m]);
                case 3:
                    throw (n = q.T(),
                    l.end(n),
                    n);
                case 4:
                    return [2];
                }
            });
        });
    }
    uvb(h) {
        return this.Ss.reduce(function(k, l) {
            return l.type === h ? k + 1 : k;
        }, 0);
    }
    summary() {
        return d(this.Ss);
    }
    C1c() {
        var h;
        return (this.iia.open || 0) + ("open" === (null === (h = this.H4) || undefined === h ? undefined : h.type) ? this.H4.duration : 0);
    }
}
Object.defineProperties(e.prototype, {
        type: {
            get: function() {
                return this.interval.type;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        yr: {
            get: function() {
                return isNaN(this.interval.end);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        duration: {
            get: function() {
                var h, k;
                h = this.interval;
                k = h.start;
                h = h.end;
                return (isNaN(h) ? (0,
                c.fa)() : h) - k;
            },
            enumerable: false,
            configurable: true
        }
    });
    return e;
}
)();
export const y6b = g;
f = (function() {
    function e(h) {
        this.Ss = [];
        (null === h || undefined === h ? 0 : h.details) ? this.Ss = h.details : h && (h.details = this.Ss);
    }
    Object.defineProperties(e.prototype, {
        duration: {
            get: function() {
                return this.end - this.start;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        first: {
            get: function() {
                return this.Ss[0];
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        Ud: {
            get: function() {
                return this.Ss[this.Ss.length - 1];
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        start: {
            get: function() {
                var h, k;
                return null !== (k = null === (h = this.first) || undefined === h ? undefined : h.start) && undefined !== k ? k : NaN;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        end: {
            get: function() {
                var h, k;
                return null !== (k = null === (h = this.Ud) || undefined === h ? undefined : h.end) && undefined !== k ? k : NaN;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        count: {
            get: function() {
                return this.Ss.length;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        vTa: {
            get: function() {
                return this.Ss.reduce(function(h, k) {
                    return k.error ? h + 1 : h;
                }, 0);
            },
            enumerable: false,
            configurable: true
        }
    });
    return e;
}
)();
export const hLa = f;
t = (function() {
    function e() {
        this.iia = {};
    }
    e.prototype.$6a = function(h) {
        var k, l, m;
        k = this;
        (null === (l = this.H4) || undefined === l ? undefined : l.type) !== h && (null === (m = this.H4) || undefined === m ? undefined : m.end(),
        this.H4 = new g(h,function(n) {
            k.iia[h] = (k.iia[h] || 0) + n.end - n.start;
        }
        ));
    }
    ;
    Object.defineProperties(e.prototype, {
        type: {
            get: function() {
                var h;
                return null === (h = this.H4) || undefined === h ? undefined : h.type;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        duration: {
            get: function() {
                var h, k;
                return null !== (k = null === (h = this.H4) || undefined === h ? undefined : h.duration) && undefined !== k ? k : 0;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        total: {
            get: function() {
                var h;
                h = this;
                return Object.keys(this.iia).reduce(function(k, l) {
                    return k + h.iia[l];
                }, this.duration);
            },
            enumerable: false,
            configurable: true
        }
    });
    return e;
}
)();
export const Imb = t;

// Detected exports: Imb, hLa, y6b
