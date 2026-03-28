/**
 * Netflix Cadmium Playercore - Module 15807
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Ylb
 * Dependencies: 22970
 * Purpose: Event handling, Configuration, Class definition, Enum definitions
 */

// import dep_22970 from './Module_22970.js';

// Webpack module 15807
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f) {
    var e, h;
    e = {};
    for (h in f)
        f.hasOwnProperty(h) && (e[h] = f[h]);
    return e;
}

p = a(22970);
t = (function(f) {
    class e extends f {
    constructor(h) {
        var k, l, m, n;
        k = h.model;
        l = h.N1a;
        l = undefined === l ? {} : l;
        m = h.jMb;
        h = h.dOb;
        n = undefined === h ? g : h;
        h = f.call(this) || this;
        h.gH = undefined;
        h.Xta = false;
        h.jta = false;
        h.cOb = {};
        h.Rea = 0;
        h.ihb = k;
        h.jMb = m || (function() {}
        );
        h.dOb = n;
        k = h.ssa();
        h.ke = d(k);
        h.mb = Object.assign(k, l);
        return h;
    }
    next(h) {
        var k;
        if (this.Xta)
            (this.jta = true,
            this.gH = this.gH || Object.assign(this.ssa(), this.value),
            Object.assign(this.gH, h));
        else {
            k = this.value;
            this.mb = h = Object.assign(this.ssa(), p.__assign(p.__assign({}, this.value), h));
            this.FSa({
                jz: k,
                next: h
            });
        }
    }
    reset(h) {
        var k;
        undefined === h && (h = {});
        h = Object.assign(this.ssa(), h);
        if (this.gH)
            (this.jta = true,
            this.gH = h);
        else {
            k = this.value;
            this.mb = h;
            this.FSa({
                jz: k,
                next: h
            });
        }
    }
    HZc() {
        this.Xta = true;
    }
    vrc() {
        var h;
        if (this.Xta && this.gH) {
            h = this.value;
            this.jta && (this.mb = this.gH,
            this.jta = false,
            this.FSa({
                jz: h,
                next: this.value
            }));
            this.gH = undefined;
        }
        this.Xta = false;
    }
    FSa(h) {
        this.jMb(h);
        this.emit("update", h);
    }
    ssa() {
        var h, k, l, m;
        if (!c)
            return new this.ihb();
        h = this.cOb[this.Rea];
        if (h) {
            k = h;
            l = this.ke;
            for (m in l)
                k[m] = l[m];
        } else
            h = this.cOb[this.Rea] = new this.ihb();
        this.Rea++;
        this.Rea === this.dOb && (this.Rea = 0);
        return h;
    }
}
p.Object.defineProperties(e.prototype, {
        value: {
            get: function() {
                return this.gH || this.mb;
            },
            enumerable: false,
            configurable: true
        }
    });
    return e;
}
)(a(90745).EventEmitter);
export const Ylb = t;
c = true;
g = 3;

// Detected exports: Ylb
