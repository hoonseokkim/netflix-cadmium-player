/**
 * Netflix Cadmium Playercore - Module 17774
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: dbb, r1a
 * Dependencies: 5479, 22970, 61996, 79048
 * Purpose: Logging, Configuration, Dependency injection, Class definition
 */

// import dep_5479 from './Module_5479.js';
// import dep_22970 from './Module_22970.js';
// import dep_61996 from './Module_61996.js';
// import dep_79048 from './Module_79048.js';

// Webpack module 17774
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

export function r1a(f) {
    var e;
    e = [];
    return {
        Yp: function(h, k) {
            var l, m, n, q, r, u;
            m = h.J;
            n = h.Bm;
            q = f();
            r = null === (l = null === n || undefined === n ? undefined : n.Mf) || undefined === l ? undefined : l.jd;
            r && r !== m && (n = {
                Mf: {
                    Kb: q.mvc(r),
                    jd: r
                },
                Ep: null === n || undefined === n ? undefined : n.Ep
            });
            q.za.console.trace("In wrapped request viewable", m, n);
            u = k(d.__assign(d.__assign({}, h), {
                Bm: n
            }));
            e.forEach(function(v) {
                return v({
                    J: m,
                    mq: u.mq
                });
            });
            return u;
        },
        Q6a: function(h) {
            e.push(h);
        }
    };
}
;
d = a(22970);
p = a(79048);
c = a(5479);
g = a(61996);
t = (function(f) {
    class e extends f {
    constructor(h, k, l, m) {
        undefined === m && (m = "CphAsePlaygraph");
        k = f.call(this, h, k, l, m) || this;
        k.Wp = h;
        k.L4a = l;
        h.za.Xc(new c.ebb(k));
        return k;
    }
    dC(h) {
        var k, l;
        k = f.prototype.dC.call(this, h);
        if (k) {
            l = h.S.RD;
            l && !this.Fma && (this.rRa.Eg({
                applyingContentPlaygraph: true
            }),
            this.Fma = l,
            this.D8b = this.Wic(h.S),
            this.$fa());
        }
        return k;
    }
    KA(h) {
        if (this.Fma)
            return (h = p.fA.Jn(h, p.fA.create(this.Fma.Z)).d2,
            h.OY(this.za.Ib),
            h);
    }
    Wic(h) {
        var k, l;
        k = h.Gq;
        l = h.iM;
        return !(!k || !k.some(function(m) {
            return m.iM !== l;
        }));
    }
}
d.Object.defineProperties(e.prototype, {
        pEb: {
            get: function() {
                return this.D8b;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        RD: {
            get: function() {
                var h;
                return null === (h = this.Fma) || undefined === h ? undefined : h.Z;
            },
            enumerable: false,
            configurable: true
        }
    });
    d.__decorate([(0,
    g.kb)({
        methodName: "processViewableResponse"
    })], e.prototype, "dC", null);
    return e;
}
)(a(14739).ula);
export const dbb = t;

// Detected exports: dbb, r1a
