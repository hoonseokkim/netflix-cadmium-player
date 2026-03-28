/**
 * Netflix Cadmium Playercore - Module 70058
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: AsyncIterator, Hra, Jja, OTa, lja, map
 * Dependencies: 22970, 32910
 * Purpose: Logging, Configuration, Class definition, Enum definitions
 */

// import dep_22970 from './Module_22970.js';
// import dep_32910 from './Module_32910.js';

// Webpack module 70058
// Parameters: t (module), b (exports), a (require)

var c, g, f, e, h, k, l;
function d(m) {
    return m && "function" === typeof m.rh ? true : false;
}
function p(m) {
    return d(m) && (m = typeof m.e1,
    "boolean" === m || "undefined" === m) ? true : false;
}
export const Jja = b.xYa = d;
export const OTa = p;
export function map(m, n, q) {
    return new l(m,n,q);
}
;
export function Hra(m, n, q) {
    return new k(m,n,q);
}
;
c = a(22970);
g = a(32910);
e = (function() {
    class m {
    constructor(n) {
        var q;
        q = this;
        this.E8b = n;
        this.I8 = false;
        this.Y9b = function(r) {
            return q.yRc(r);
        }
        ;
        this.Avb();
    }
    rh() {
        this.cancel();
    }
    cancel() {
        this.b3();
        this.fd = true;
        return this.gQa;
    }
    next() {
        return this.fd ? this.gQa : Promise.race([this.gQa, this.E8b()]).then(this.Y9b);
    }
    yRc(n) {
        n.done && (this.I8 = true,
        this.rh());
        this.d1 || (this.b3(),
        this.Avb());
        return n;
    }
    Avb() {
        var n;
        n = this;
        this.gQa = new Promise(function(q) {
            n.b3 = function() {
                return q({
                    done: true
                });
            }
            ;
        }
        );
    }
}
m.tua = function(n, q) {
        function r() {
            var u;
            u = n.next();
            u.then(function(v) {
                p(n) && n.e1 || q(v);
            });
            u.then(function(v) {
                return !v.done && r();
            });
        }
        r();
    }
    ;
    Object.defineProperties(m.prototype, {
        mI: {
            get: function() {
                return this.I8;
            },
            enumerable: false,
            configurable: true
        }
    });
    m.LWa = function() {
        f || (f = Promise.resolve({
            done: true
        }));
        return f;
    }
    ;
    Object.defineProperties(m.prototype, {
        d1: {
            get: function() {
                return this.fd || false;
            },
            enumerable: false,
            configurable: true
        }
    });
    return m;
}
)();
export const AsyncIterator = e;
h = (function(m) {
    class n extends m {
    constructor(q) {
        var r;
        r = m.call(this, function() {
            return r.Uxc();
        }) || this;
        r.xA = q;
        r.index = 0;
        return r;
    }
    rh() {
        d(this.xA) && this.xA.rh();
        m.prototype.rh.call(this);
    }
    Uxc() {
        return this.xA.length > this.index ? Promise.resolve({
            value: this.xA[this.index++],
            done: false
        }) : Promise.resolve({
            done: true
        });
    }
    ARc(q) {
        var r;
        this.k3a = false;
        r = this.console;
        g.u && r && r.trace("CompoundIterator: processNextOuterIterator");
        if (q.done)
            return q;
        q = q.value;
        if (this.e1)
            return (d(q) && q.rh(),
            e.LWa());
        Array.isArray(q) ? this.Dp = new h(q) : this.Dp = q;
        return this.r0a();
    }
    zRc(q) {
        var r;
        r = this.console;
        g.u && r && r.trace("CompoundIterator: processNextInnerResult", this.e1, q.done);
        if (!q.done || this.e1)
            return q;
        this.Dp = undefined;
        return this.r0a();
    }
    rh() {
        var q;
        q = this.console;
        g.u && q && q.trace("CompoundIterator: dispose");
        this.e1 = true;
        m.prototype.rh.call(this);
        d(this.gfa) && this.gfa.rh();
        d(this.Dp) && this.Dp.rh();
    }
    toString() {
        return ("CompoundIterator ").concat(this.e1, " ").concat(this.gfa, " ").concat(this.Dp);
    }
    r0a() {
        var q, r;
        q = this;
        r = this.console;
        g.u && r && r.trace("CompoundIterator: nextImpl");
        if (this.Dp)
            return (g.u && r && r.trace("CompoundIterator: getNextInner"),
            this.Dp.next().then(function(u) {
                return q.zRc(u);
            }));
        this.k3a = true;
        g.u && r && r.trace("CompoundIterator: getNextOuter");
        return this.gfa.next().then(function(u) {
            return q.ARc(u);
        });
    }
    rh() {
        d(this.source) && this.source.rh();
        m.prototype.rh.call(this);
    }
    x8b() {
        var q, r, u;
        q = this.YQa;
        r = this.A_a;
        u = this.source;
        g.u && q && q.trace("MappedIterator: Requesting next");
        return u.next().then(function(v) {
            return v.done ? v : r(v.value);
        });
    }
}
c.return n;
}
)(e);
export const lja = h;
k = (function(m) {
    function n(q, r, u) {
        var v;
        v = m.call(this, function() {
            return v.r0a();
        }) || this;
        v.console = r;
        v.Dp = u;
        v.k3a = false;
        Array.isArray(q) ? v.gfa = new h(q) : v.gfa = q;
        return v;
    }
    c.__extends(n, m);
    return n;
}
)(e);
export const Jja = k;
l = (function(m) {
    function n(q, r, u) {
        var v;
        v = m.call(this, function() {
            return v.x8b();
        }) || this;
        v.source = q;
        v.A_a = r;
        v.YQa = u;
        return v;
    }
    c.__extends(n, m);
    return n;
}
)(e);

// Detected exports: AsyncIterator, Hra, Jja, OTa, lja, map
