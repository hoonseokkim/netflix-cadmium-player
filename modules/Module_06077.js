/**
 * Netflix Cadmium Playercore - Module 6077
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: pX
 * Dependencies: 4069, 22970, 43529, 66164
 * Purpose: Encryption/Decryption, Configuration, Enum definitions
 */

// import dep_4069 from './Module_4069.js';
// import dep_22970 from './Module_22970.js';
// import dep_43529 from './Module_43529.js';
// import dep_66164 from './Module_66164.js';

// Webpack module 6077
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(66164);
c = a(4069);
g = a(43529);
t = (function() {
    class f {
    constructor(e, h, k) {
        undefined === h && (h = function(l, m) {
            return l === m;
        }
        );
        undefined === k && (k = {});
        this.config = e;
        this.uTa = h;
        this.je = [];
        this.oZ = new c.jh();
        this.Zoa = new c.jh();
        this.options = d.__assign({
            Ig: 10
        }, k);
    }
    get(e) {
        if (e = this.Wra(e))
            return e.value;
    }
    delete(e) {
        e = this.findIndex(e);
        -1 !== e && this.je.splice(e, 1);
    }
    Dsa(e, h) {
        var k;
        if (!this.isEnabled)
            return h();
        k = this.Wra(e);
        if (k)
            return k.value;
        h = h();
        this.Qu(e, h);
        return h;
    }
    findIndex(e) {
        var h, k, l, m;
        h = Infinity;
        k = Infinity;
        if (this.options.$x || this.options.jx) {
            l = p.platform.time.fa();
            this.options.jx && (h = l - this.options.jx);
            this.options.$x && (k = l - this.options.$x);
        }
        for (l = 0; l < this.je.length; l++) {
            m = this.je[l];
            if (this.options.jx && m.Fda < h) {
                this.je.splice(l, this.je.length - l);
                break;
            }
            if (this.options.$x && m.pn < k)
                (this.je.splice(l, 1),
                l--);
            else if (this.uTa(m.key, e))
                return l;
        }
        return -1;
    }
    Wra(e) {
        var h;
        e = this.findIndex(e);
        if (-1 !== e) {
            h = this.je[e];
            this.je.splice(e, 1);
            this.je.unshift(h);
            this.options.jx && (h.Fda = p.platform.time.fa());
            this.Zoa.push(e);
            this.oZ.push(1);
            return h;
        }
        this.oZ.push(0);
    }
    has(e, h) {
        e = this.findIndex(e);
        return -1 !== e ? h ? this.je[e].value === h : true : false;
    }
    zFb(e, h, k) {
        if (this.isEnabled) {
            (0,
            g.assert)(!this.has(e), "key already found");
            this.je.unshift({
                key: e,
                value: h
            });
            e = d.__assign(d.__assign({}, this.options), k);
            if (e.jx || e.$x)
                (h = p.platform.time.fa(),
                e.jx && (this.je[0].Fda = h),
                e.$x && (this.je[0].pn = h));
            this.qQa();
        }
    }
    Qu(e, h) {
        this.zFb(e, h, this.options);
    }
    qQa() {
        var e;
        if (this.je.length > this.options.Ig) {
            e = this.je.pop();
            e && this.options.sua && this.options.sua(e.key, e.value);
        }
    }
    clear() {
        for (var e = this.je.pop(); e; )
            (this.options.sua && this.options.sua(e.key, e.value),
            e = this.je.pop());
        this.je = [];
    }
}
Object.defineProperties(f.prototype, {
        isEnabled: {
            get: function() {
                return this.config.enabled;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        size: {
            get: function() {
                return this.je.length;
            },
            enumerable: false,
            configurable: true
        }
    });
    return f;
}
)();
export const pX = t;

// Detected exports: pX
