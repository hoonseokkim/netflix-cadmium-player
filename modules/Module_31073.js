/**
 * Netflix Cadmium Playercore - Module 31073
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: SCa
 * Dependencies: 4203, 5021, 22674, 22894, 22970, 33096, 36129, 59818, 63156, 77134, 81918, 87386, 90597, 96813
 * Purpose: Logging, Configuration, Error handling, Dependency injection
 */

// import dep_4203 from './Module_4203.js';
// import dep_5021 from './Module_5021.js';
// import dep_22674 from './Module_22674.js';
// import dep_22894 from './Module_22894.js';
// import dep_22970 from './Module_22970.js';
// import dep_33096 from './Module_33096.js';
// import dep_36129 from './Module_36129.js';
// import dep_59818 from './Module_59818.js';
// import dep_63156 from './Module_63156.js';
// import dep_77134 from './Module_77134.js';
// import dep_81918 from './Module_81918.js';
// import dep_87386 from './Module_87386.js';
// import dep_90597 from './Module_90597.js';
// import dep_96813 from './Module_96813.js';

// Webpack module 31073
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n, q, r, u;
class d {
    constructor(v, w, x, y, A, z) {
    var B;
    B = this;
    this.Vo = v;
    this.config = x;
    this.Vp = y;
    this.debug = A;
    this.$a = z;
    this.gVb = [];
    this.Pf = {};
    this.log = w.zb("loadAsync");
    this.SHc = (0,
    q.T0b)(function(C) {
        B.ATc = true;
        B.startTime = B.$a.Fc().na(m.Ba);
        B.load(B.gVb).then(function() {
            B.endTime = B.$a.Fc().na(m.Ba);
            C(u.ai);
        }).catch(function(D) {
            B.endTime = B.$a.Fc().na(m.Ba);
            C(D);
        });
    });
}
    Nda(v) {
    this.SHc(v);
}
    register(v, w) {
    this.debug.assert(!this.ATc);
    this.gVb.push({
        mHc: this.$fc(w),
        errorCode: v
    });
}
    qg(v) {
    this.debug.assert(undefined === this.Pf[v]);
    this.Pf[v] = this.$a.Fc().na(m.Ba);
}
    load(v) {
    var w;
    w = this;
    return (0,
    g.fRc)(v).then(function(x) {
        w.Vo.mark(f.zv.jo.NYb);
        return x.reduce(function(y, A) {
            return y.then(function() {
                return w.jHc(A);
            });
        }, Promise.resolve()).then(function() {
            w.Vo.mark(f.zv.jo.LYb);
        });
    });
}
    jHc(v) {
    var w, x;
    w = this;
    x = v.mHc;
    false;
    return this.Vp.tt((0,
    m.pc)(this.config().Zcc), x()).catch(function(y) {
        w.log.error("Failed to load component " + v.errorCode, y);
        w.Vo.mark(f.zv.jo.MYb);
        if (y instanceof l.Ox)
            throw {
                Ya: c.Y.KYb,
                errorCode: v.errorCode
            };
        y.errorCode = y.errorCode || v.errorCode;
        y.Ya = y.Ya || c.Y.JYb;
        throw y;
    });
}
}
t = a(22970);
p = a(77134);
c = a(36129);
g = a(96813);
f = a(63156);
e = a(22674);
h = a(87386);
k = a(4203);
l = a(59818);
m = a(5021);
n = a(90597);
q = a(22894);
r = a(81918);
u = a(33096);
d.prototype.$fc = function(v) {
    return function() {
        return new Promise(function(w, x) {
            v(function(y) {
                y.success ? w() : x(y);
            });
        }
        );
    }
    ;
}
;
a = d;
export const SCa = a;
export const SCa = a = t.__decorate([(0,
e.aa)(), t.__param(0, (0,
e.v)(p.ZX)), t.__param(1, (0,
e.v)(h.Bb)), t.__param(2, (0,
e.v)(k.Pc)), t.__param(3, (0,
e.v)(l.qG)), t.__param(4, (0,
e.v)(n.PC)), t.__param(5, (0,
e.v)(r.re))], a);

// Detected exports: SCa
