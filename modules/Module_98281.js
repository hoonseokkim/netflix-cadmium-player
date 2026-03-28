/**
 * Netflix Cadmium Playercore - Module 98281
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: yEa
 */

// Webpack module 98281
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g) {
    this.Moc = g;
}
export const yEa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
a = a(2413);  // import from Module_02413
d.prototype.Gb = function() {
    var g;
    g = this;
    this.pM || (this.pM = new Promise(function(f, e) {
        var h;
        h = [];
        g.Moc.forEach(function(k) {
            h.push(k.Gb());
        });
        Promise.all(h).then(function() {
            f();
        }).catch(function(k) {
            e(k);
        });
    }
    ));
    return this.pM;
}
;
c = d;
export const yEa = c;
b.yEa = c = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.KI)(a.Vbb))],

// Detected exports: yEa
