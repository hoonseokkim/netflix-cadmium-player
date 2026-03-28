/**
 * Netflix Cadmium Playercore - Module 15850
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: vJa
 */

// Webpack module 15850
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
function d(h, k) {
    var m;
    function l() {
        m.h2a.then(function(n) {
            m.va.trace("Unloading PBO Playdata Services");
            n.close();
        });
        f.Ce.removeListener(f.Dn, l);
    }
    m = this;
    this.qNb = k;
    this.MNb = false;
    this.h2a = k();
    this.va = h.zb("PlayerPlaydataMonitorImpl");
    f.Ce.addListener(f.Dn, l);
}
export const vJa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(87386);  // import from Module_87386
g = a(96687);  // import from Module_96687
f = a(37509);  // import from Module_37509
e = a(85001);  // import from Module_85001
d.prototype.Gm = function(h, k) {
    var l;
    l = this;
    this.h2a.then(function(m) {
        m.Gm(k, true, function(n) {
            return h.close(n);
        });
        m.w6a(k);
        h.addEventListener(e.cb.I2a, function() {
            h.Ky() ? l.MNb ? m.QRb(k).catch(function(n) {
                (n = n.EN) && h.close(n);
            }) : l.MNb = true : m.PRb(k).catch(function(n) {
                (n = n.EN) && h.close(n);
            });
        });
        h.addEventListener(e.cb.gq, function() {
            m.Qza(k).catch(function(n) {
                (n = n.EN) && h.close(n);
            });
        });
        h.addEventListener(e.cb.Fq, function() {
            m.Qza(k).catch(function(n) {
                (n = n.EN) && h.close(n);
            });
        });
    });
}
;
d.prototype.zha = function(h) {
    return this.h2a.then(function(k) {
        k.WTb();
        return k.zha(h).catch();
    });
}
;
a = d;
export const vJa = a;
b.vJa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Bb)), t.__param(1, (0,
p.v)(g.S7))],

// Detected exports: vJa
