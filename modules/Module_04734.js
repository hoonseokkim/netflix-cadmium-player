/**
 * Netflix Cadmium Playercore - Module 4734
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: NJa
 */

// Webpack module 4734
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f) {
    this.Kd = f;
}
export const NJa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(53085);  // import from Module_53085
g = a(59818);  // import from Module_59818
d.prototype.tt = function(f, e) {
    var h;
    h = this;
    return new Promise(function(k, l) {
        var m;
        m = h.Kd.zr(f, function() {
            l(new g.Ox(f));
        });
        e.then(function(n) {
            k(n);
            m.cancel();
        }).catch(function(n) {
            l(n);
            m.cancel();
        });
    }
    );
}
;
a = d;
export const NJa = a;
b.NJa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Vl))], a

// Detected exports: NJa
