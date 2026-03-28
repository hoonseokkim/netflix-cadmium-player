/**
 * Netflix Cadmium Playercore - Module 691
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: KDa
 */

// Webpack module 691
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k;
function d(l, m, n, q) {
    var r;
    r = this;
    this.config = l;
    this.Ymc = m;
    this.Xb = n;
    this.performance = q;
    this.cNc = function(u) {
        r.o5a = u.da(r.Hg);
    }
    ;
    (0,
    p.Rw)(this, "date");
    (0,
    p.Rw)(this, "performance");
    this.Qbc = undefined !== this.performance && undefined !== this.performance.timing && undefined !== this.performance.now;
    this.o5a = c.ia;
    this.Xb.addListener(k.ZFa.ZRb, this.cNc);
}
export const KDa = undefined;
t = a(22970);  // import from Module_22970
p = a(66523);  // import from Module_66523
c = a(5021);  // import from Module_05021
g = a(22674);  // import from Module_22674
f = a(63368);  // import from Module_63368
e = a(87061);  // import from Module_87061
h = a(15160);  // import from Module_15160
k = a(85001);  // import from Module_85001
d.prototype.rbc = function(l) {
    return l.add(this.o5a);
}
;
Ha.Object.defineProperties(d.prototype, {
    Hg: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.yKb ? (0,
            c.timestamp)(this.performance.timing.navigationStart + this.performance.now()) : (0,
            c.pc)(this.Ymc.now());
        }
    },
    kJ: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.Hg.add(this.o5a);
        }
    },
    yKb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.config.dXb && this.Qbc;
        }
    }
});
a = d;
export const KDa = a;
b.KDa = a = t.__decorate([(0,
g.aa)(), t.__param(0, (0,
g.v)(e.Tab)), t.__param(1, (0,
g.v)(f.vbb)), t.__param(2, (0,
g.v)(h.pFa)), t.__param(3, (0,
g.v)(f.rla)), t.__param(3, (0,
g.optional)())], a)

// Detected exports: KDa
