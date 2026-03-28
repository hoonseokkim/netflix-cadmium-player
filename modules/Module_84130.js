/**
 * Netflix Cadmium Playercore - Module 84130
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: gLa
 */

// Webpack module 84130
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f, e, h) {
    this.Kd = f;
    this.t7a = e;
    this.sE = h;
}
export const gLa = undefined;
t = a(22970);  // import from Module_22970
p = a(53085);  // import from Module_53085
c = a(22674);  // import from Module_22674
g = a(5021);  // import from Module_05021
d.prototype.OL = function() {
    this.Em || (this.Em = this.Kd.zr((0,
    g.pc)(this.t7a), this.sE));
}
;
d.prototype.Er = function() {
    this.Em && this.Em.cancel();
    this.Em = undefined;
}
;
a = d;
export const gLa = a;
b.gLa = a = t.__decorate([(0,
c.aa)(), t.__param(0, (0,
c.v)(p.Vl))],

// Detected exports: gLa
