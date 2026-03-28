/**
 * Netflix Cadmium Playercore - Module 89397
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: hDa, iDa, jDa
 * Dependencies: 20447, 22224, 22674, 22816, 22970, 25066, 27081, 30837, 54534, 83767
 * Purpose: Configuration, Dependency injection, Class definition, Enum definitions
 */

// import dep_20447 from './Module_20447.js';
// import dep_22224 from './Module_22224.js';
// import dep_22674 from './Module_22674.js';
// import dep_22816 from './Module_22816.js';
// import dep_22970 from './Module_22970.js';
// import dep_25066 from './Module_25066.js';
// import dep_27081 from './Module_27081.js';
// import dep_30837 from './Module_30837.js';
// import dep_54534 from './Module_54534.js';
// import dep_83767 from './Module_83767.js';

// Webpack module 89397
// Parameters: t (module), b (exports), a (require)

var g, f, e, h, k, l, m, n, q;
class d {
    constructor(r, u) {
    this.Te = r;
    this.oB = u;
}
    apply() {
    this.Te.eua ? Object.assign(this, (0,
    m.Iwc)(this.Te)) : this.Te.NYa ? Object.assign(this, (0,
    l.gyc)(this.Te)) : this.Te.bua || this.Te.yYa ? Object.assign(this, (0,
    k.qwc)(this.Te, this.oB)) : this.Te.xda ? Object.assign(this, (0,
    n.fzc)(this.Te)) : Object.assign(this, (0,
    h.Lvc)(this.Te));
    return this;
}
}
function p(r, u) {
    var v;
    v = f.cJa.call(this) || this;
    r.YS ? Object.assign(v, (0,
    n.Vwc)(r)) : r.eua ? Object.assign(v, (0,
    m.Hwc)(r)) : r.NYa ? Object.assign(v, (0,
    l.fyc)(r)) : r.bua || r.yYa ? Object.assign(v, (0,
    k.pwc)(u)) : r.xda ? Object.assign(v, (0,
    n.ezc)(r)) : Object.assign(v, (0,
    h.Kvc)(r));
    return v;
}
function c(r) {
    this.data = r.eua ? (0,
    m.Jwc)(r) : r.NYa ? (0,
    l.hyc)(r) : r.bua || r.yYa ? (0,
    k.rwc)(r) : r.xda ? (0,
    n.gzc)(r) : (0,
    h.Mvc)(r);
}
export const jDa = t = a(22970);
g = a(22674);
f = a(27081);
e = a(22816);
h = a(25066);
k = a(30837);
l = a(20447);
m = a(54534);
n = a(22224);
a = a(83767);
Ha.Object.defineProperties(c.prototype, {
    version: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data.version;
        }
    },
    cwa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data.cwa;
        }
    },
    sy: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data.sy;
        }
    },
    zu: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data.zu;
        }
    },
    p0: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data.p0;
        }
    },
    DL: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data.DL;
        }
    },
    dxb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data.dxb;
        }
    },
    j_a: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data.j_a;
        }
    },
    Aaa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data.Aaa;
        }
    },
    nXb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data.nXb;
        }
    },
    TOa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.data.TOa;
        }
    }
});
q = c;
export const hDa = q;
export const hDa = q = t.__decorate([(0,
g.aa)(), t.__param(0, (0,
g.v)(e.AW))], q);
Ia(p, f.cJa);
q = p;
export const iDa = q;
export const iDa = q = t.__decorate([(0,
g.aa)(), t.__param(0, (0,
g.v)(e.AW)), t.__param(1, (0,
g.v)(a.BP))], q);
q = d;
export const jDa = q;
export const jDa = q = t.__decorate([(0,
g.aa)(), t.__param(0, (0,
g.v)(e.AW)), t.__param(1, (0,
g.v)(a.BP))], q);

// Detected exports: hDa, iDa, jDa
