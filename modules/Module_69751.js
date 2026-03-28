/**
 * Netflix Cadmium Playercore - Module 69751
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Qjb
 * Dependencies: 79048
 * Purpose: Buffer/Segment management, Encryption/Decryption, Configuration, Error handling
 */

// import dep_79048 from './Module_79048.js';

// Webpack module 69751
// Parameters: t (module), b (exports), a (require)

var p, c;
class d {
    constructor(g, f, e, h) {
    this.eya = f;
    this.lB = e;
    this.Hl = h;
    this.sna = {};
    this.wWb = [];
    this.nTb = [];
    this.XKb = [];
    this.S_a = {};
    this.gPa = new WeakMap();
    this.reset(g);
}
    reset(g) {
    var f;
    f = 1 < Object.keys(g.ba).length && 1 === new Set(Object.values(g.ba).map(function(e) {
        return e.J;
    })).size;
    this.E$b = this.Hl.hXb || f;
    this.xSb(g);
    this.Li = g.Ef;
    this.oNa = this.lB.wH();
    this.n6a = new Map();
}
    BS(g) {
    if (this.D8a)
        return this.Qn;
    this.gPa.has(g) || this.gPa.set(g, (0,
    p.k6a)(g.R, g.M));
    return this.gPa.get(g);
}
    xSb(g) {
    this.jp = g;
    this.sna = {};
    g = Object.keys(g.ba);
    this.dsb(g);
    this.eya.f3c(this.jp);
    this.oLc();
}
    Wn(g) {
    var h;
    for (var f = [], e = 0; e < arguments.length; ++e)
        f[e - 0] = arguments[e];
    h = this;
    f.filter(function(k) {
        return h.hO(k.M);
    }).filter(function(k) {
        k = k.s2;
        return !k || h.hO(k);
    }).forEach(function(k) {
        var l;
        l = k.M;
        h.sna[l] = h.qLb(k.s2);
        h.iLc(l);
    });
}
    dsb(g) {
    var f;
    f = this;
    g.filter(function(e) {
        return f.hO(e);
    }).forEach(function(e) {
        f.sna[e] = f.qLb(f.Hu(e).Oc);
    });
}
    Pl(g, f) {
    var e, h, k;
    e = this.Hu(g);
    if (e && e.next) {
        h = new c.Cv(this.Qn);
        k = Object.keys(e.next).reduce(function(l, m) {
            l[m] = undefined === f[m] ? e.next[m] : Object.assign({}, e.next[m], {
                weight: f[m]
            });
            return l;
        }, {});
        k = Object.assign({}, e, {
            next: k
        });
        h.cf(g, k);
        this.Qn = h.build();
    }
}
    hO(g, f) {
    f = undefined === f ? this.Qn.ba : f;
    return (g in f);
}
    cca(g) {
    return this.sna[g];
}
    Hu(g) {
    return this.Qn.ba[g];
}
    rzc(g) {
    if (this.n6a.has(g))
        return this.n6a.get(g);
    g = this.Hu(g);
    return isFinite(g.eb) ? g.eb : undefined;
}
    KWb(g, f) {
    this.n6a.set(g, f);
    this.mLc(g);
}
    Z_c(g) {
    this.wWb.push(g);
}
    X_c(g) {
    this.XKb.push(g);
}
    j1() {
    var g;
    g = undefined === g ? this.Qn : g;
    return Object.values(g.ba).every(function(f) {
        return undefined !== f.Mp;
    }) && 1 < Object.values(g.ba).length;
}
    oLc() {
    var g;
    g = this;
    this.wWb.forEach(function(f) {
        return f(g.Qn);
    });
}
    iLc(g) {
    this.XKb.forEach(function(f) {
        return f(g);
    });
}
    mLc(g) {
    this.nTb.forEach(function(f) {
        return f(g);
    });
}
    qLb(g) {
    return null === g ? undefined : g;
}
    UVa() {
    return this.S_a;
}
    Uca(g) {
    var f;
    this.S_a[g] = (null !== (f = this.S_a[g]) && undefined !== f ? f : 0) + 1;
}
}
p = a(79048);
c = a(79048);
d.prototype.$_c = function(g) {
    this.nTb.push(g);
}
;
Ha.Object.defineProperties(d.prototype, {
    Le: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.oNa;
        }
    },
    D8a: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.E$b;
        }
    },
    Qn: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.jp;
        },
        set: function(g) {
            if (this.Li && !this.hO(this.Li, g.ba))
                throw Error("Provided playgraphMap does not contain the current segmentId " + this.Li);
            this.xSb(g);
        }
    },
    Li: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.X7b;
        },
        set: function(g) {
            if (!this.hO(g))
                throw Error("Provided currentSegmentId " + g + " does not exist in the current playgraph");
            this.X7b = g;
        }
    },
    ga: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.Hu(this.Li);
        }
    }
});
export const Qjb = d;

// Detected exports: Qjb
