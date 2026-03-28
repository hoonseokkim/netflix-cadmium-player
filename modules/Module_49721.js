/**
 * Netflix Cadmium Playercore - Module 49721
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: dLa
 */

// Webpack module 49721
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
function d(e, h, k) {
    var l;
    l = this;
    this.Hi = e;
    this.Kd = h;
    this.Kpa = k;
    this.K2 = function(m) {
        l.Em = undefined;
        l.Y1c(m || l.Kpa);
    }
    ;
    this.rHb = (0,
    g.pc)(-this.Kpa.na(g.Ba));
}
export const dLa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(81918);  // import from Module_81918
g = a(5021);  // import from Module_05021
a = a(53085);  // import from Module_53085
d.prototype.tg = function(e) {
    this.W4a = e;
    this.Em = this.Em || this.gi(this.K2);
}
;
d.prototype.rh = function() {
    this.Em && this.Em.cancel();
    this.Em = undefined;
}
;
d.prototype.Y1c = function(e) {
    var h, k;
    h = this.Hi.Fc();
    if (this.W4a) {
        k = e.da(h.da(this.rHb));
        0 >= k.xl(g.ia) ? (e = this.W4a,
        this.W4a = undefined,
        this.rHb = h,
        e()) : this.Em = this.Em || this.Kd.zr(k, this.K2.bind(this, e));
    }
}
;
d.prototype.gi = function(e) {
    return this.Kd.zr(g.ia, e);
}
;
f = d;
export const dLa = f;
b.dLa = f = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.re)), t.__param(1, (0,
p.v)(a.Vl))],

// Detected exports: dLa
