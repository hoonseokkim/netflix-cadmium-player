/**
 * Netflix Cadmium Playercore - Module 61453
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: cEa
 */

// Webpack module 61453
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g, f) {
    this.Kd = g;
    this.Kpa = f;
}
export const cEa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
a = a(53085);  // import from Module_53085
d.prototype.tg = function(g) {
    this.rh();
    this.Em = this.Kd.zr(this.Kpa, g);
}
;
d.prototype.rh = function() {
    this.Em && this.Em.cancel();
    this.Em = undefined;
}
;
c = d;
export const cEa = c;
b.cEa = c = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.Vl))],

// Detected exports: cEa
