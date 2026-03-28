/**
 * Netflix Cadmium Playercore - Module 61738
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: mGa
 * Dependencies: 4203, 22674, 22970, 33258, 87386
 * Purpose: Encryption/Decryption, Logging, Configuration, Error handling
 */

// import dep_4203 from './Module_4203.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_33258 from './Module_33258.js';
// import dep_87386 from './Module_87386.js';

// Webpack module 61738
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
class d {
    constructor(e, h, k) {
    this.config = e;
    this.Qw = h;
    this.WPa = k;
    this.Cga = [];
    this.E4a = {};
    this.mza = {};
    this.log = this.Qw.zb("KeySystemRestrictor");
    this.lHc = this.config().Eyb ? this.WPa.load() : Promise.resolve([]);
}
    get() {
    var e;
    e = this;
    try {
        return this.config().Eyb ? this.lHc.then(function(h) {
            return e.otc(h);
        }) : Promise.resolve([]);
    } catch (h) {
        return (this.log.error("KeySystemRestrictor failed.", h),
        Promise.resolve([]));
    }
}
    otc(e) {
    var k;
    this.Cga = [];
    this.E4a = {};
    this.mza = {};
    e = e.reduce(function(l, m) {
        l[m.keySystem] || (l[m.keySystem] = []);
        l[m.keySystem].push(m);
        return l;
    }, {});
    this.log.debug("KeySystemErrorCounts: " + JSON.stringify(e));
    e = Fa(Object.entries(e));
    for (var h = e.next(); !h.done; h = e.next()) {
        k = Fa(h.value);
        h = k.next().value;
        k = k.next().value;
        if (k = this.uBc(k))
            (this.Cga.push(h),
            this.mza[h] = k);
    }
    this.Cga.some(function() {
        return true;
    }) && this.log.warn("Restricted KeySystems: " + this.mza);
    return this.Cga;
}
    uBc(e) {
    var h, k, l;
    h = this;
    l = e.reduce(function(m, n) {
        h.config().Trc.includes(n.code) && (n = h.mlc(n),
        m[n] || (m[n] = 0),
        m[n]++);
        return m;
    }, {});
    this.E4a[e[0].keySystem] = l;
    return null === (k = Object.entries(l).find(function(m) {
        m = Fa(m);
        m.next();
        return m.next().value >= h.config().Vrc;
    })) || undefined === k ? undefined : k[0];
}
    mlc(e) {
    return [e.code, e.subCode, e.extCode].filter(Boolean).join(".");
}
}
t = a(22970);
p = a(22674);
c = a(87386);
g = a(4203);
a = a(33258);
Ha.Object.defineProperties(d.prototype, {
    eHb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.Cga;
        }
    },
    fHb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.E4a;
        }
    },
    dHb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.mza;
        }
    }
});
f = d;
export const mGa = f;
export const mGa = f = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.Pc)), t.__param(1, (0,
p.v)(c.Bb)), t.__param(2, (0,
p.v)(a.yDa))], f);

// Detected exports: mGa
