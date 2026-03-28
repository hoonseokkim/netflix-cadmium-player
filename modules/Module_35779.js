/**
 * Netflix Cadmium Playercore - Module 35779
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: R3a, VPa, cVa, pX, xBb
 * Dependencies: 22970, 52571, 66164, 69575
 * Purpose: Encryption/Decryption, Configuration, Caching/Storage, Enum definitions
 */

// import dep_22970 from './Module_22970.js';
// import dep_52571 from './Module_52571.js';
// import dep_66164 from './Module_66164.js';
// import dep_69575 from './Module_69575.js';

// Webpack module 35779
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
export const xBb = b.cVa = b.R3a =
d = a(22970);
p = a(66164);
c = a(52571);
g = a(69575);
t = (function() {
    class e {
    constructor(h, k, l) {
        undefined === l && (l = {});
        this.config = h;
        this.uTa = k;
        this.je = [];
        this.oZ = new g.jh();
        this.Zoa = new g.jh();
        this.options = d.__assign({
            Ig: 10
        }, l);
    }
    Dsa(h, k) {
        var l;
        if (!this.isEnabled)
            return k();
        l = this.Wra(h);
        if (l)
            return l.value;
        k = k();
        this.Qu(h, k);
        return k;
    }
    findIndex(h) {
        var k, l, m, n;
        k = Infinity;
        l = Infinity;
        if (this.options.$x || this.options.jx) {
            m = p.platform.time.fa();
            this.options.jx && (k = m - this.options.jx);
            this.options.$x && (l = m - this.options.$x);
        }
        for (m = 0; m < this.je.length; m++) {
            n = this.je[m];
            if (this.options.jx && n.Fda < k) {
                this.je.splice(m, this.je.length - m);
                break;
            }
            if (this.options.$x && n.pn < l)
                (this.je.splice(m, 1),
                m--);
            else if (this.uTa(n.key, h))
                return m;
        }
        return -1;
    }
    Wra(h) {
        var k;
        h = this.findIndex(h);
        if (-1 !== h) {
            k = this.je[h];
            this.je.splice(h, 1);
            this.je.unshift(k);
            this.options.jx && (k.Fda = p.platform.time.fa());
            this.Zoa.push(h);
            this.oZ.push(1);
            return k;
        }
        this.oZ.push(0);
    }
    Qu(h, k) {
        this.je.unshift({
            key: h,
            value: k
        });
        if (this.options.jx || this.options.$x)
            (h = p.platform.time.fa(),
            this.options.jx && (this.je[0].Fda = h),
            this.options.$x && (this.je[0].pn = h));
        this.qQa();
    }
    qQa() {
        this.je.length > this.options.Ig && this.je.pop();
    }
    clear() {
        this.je = [];
    }
}
Object.defineProperties(e.prototype, {
        isEnabled: {
            get: function() {
                return this.config.mqc;
            },
            enumerable: false,
            configurable: true
        }
    });
    return e;
}
)();
export const pX = t;
f = new WeakMap();
export function VPa(e) {
    undefined === e && (e = "default");
    return function(h, k, l) {
        var m;
        m = l.value;
        l.value = function(n) {
            var q, r, u;
            q = this;
            u = null === (r = f.get(this)) || undefined === r ? undefined : r[e];
            (0,
            c.assert)(u, "lruCache not defined");
            return u.Dsa(n, function() {
                return m.call(q, n);
            });
        }
        ;
    }
    ;
}
;
export function R3a(e, h, k) {
    f.has(e) || f.set(e, {});
    f.get(e)[h] = k;
}
;
export function cVa(e) {
    var h;
    if (!f.has(e))
        return [];
    h = f.get(e);
    return Object.keys(h).map(function(k) {
        return h[k];
    });
}
;
export function xBb(e) {
    return f.has(e) ? f.get(e) : {};
}
;

// Detected exports: R3a, VPa, cVa, pX, xBb
