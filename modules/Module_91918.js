/**
 * Netflix Cadmium Playercore - Module 91918
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: ZIa
 */

// Webpack module 91918
// Parameters: t (module), b (exports), a (require)

var c, g;
function d(f, e, h, k, l, m, n) {
    this.version = f;
    this.url = e;
    this.id = h;
    this.languages = k;
    this.Xa = l;
    this.vpc = m;
    this.kKc = n;
}
function p(f) {
    this.hj = f;
}
export const ZIa = undefined;
t = a(22970);  // import from Module_22970
c = a(22674);  // import from Module_22674
a = a(7605);  // import from Module_07605
p.prototype.create = function(f, e, h, k, l) {
    return new d(this.hj.version,e,f,this.hj.languages,h,k,l);
}
;
g = p;
export const ZIa = g;
b.ZIa = g = t.__decorate([(0,
c.aa)(), t.__param(0, (0,
c.v)(a.Nx))], g);
d.prototype.toJSON = function() {
    return {
        version: this.version,
        url: this.url,
        id: this.id,
        languages: this.languages,
        params: this.Xa,
        echo: this.vpc
    };
}

// Detected exports: ZIa
