/**
 * Netflix Cadmium Playercore - Module 9002
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: ECa
 */

// Webpack module 9002
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
function d(e, h) {
    this.Qa = e;
    this.Rra = this.Qa.Hg.na(g.Ba) - 1;
    this.CHc = this.Fua = 0;
    this.id = "" + h.wH();
}
export const ECa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(30869);  // import from Module_30869
g = a(5021);  // import from Module_05021
a = a(62665);  // import from Module_62665
d.prototype.Fc = function() {
    var e, h;
    e = this.Qa.Hg.na(g.Ba) - this.Rra;
    if (e < this.Fua) {
        h = this.Fua + 1;
        this.Rra -= h - e;
        e = h;
    }
    this.Fua = e;
    return (0,
    g.pc)(this.Fua);
}
;
d.prototype.xxc = function() {
    return this.CHc++;
}
;
Ha.Object.defineProperties(d.prototype, {
    sI: {
        configurable: true,
        enumerable: true,
        get: function() {
            return (0,
            g.pc)(this.Rra);
        }
    }
});
f = d;
export const ECa = f;
b.ECa = f = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Yi)), t.__param(1, (0,
p.v)(a.gG))], f

// Detected exports: ECa
