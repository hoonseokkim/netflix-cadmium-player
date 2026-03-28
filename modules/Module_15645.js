/**
 * Netflix Cadmium Playercore - Module 15645
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Ljb
 */

// Webpack module 15645
// Parameters: t (module), b (exports), a (require)

var p;
function d() {}
export const Ljb = undefined;
p = a(79048);  // import from Module_79048
d.prototype.I1c = function(c) {
    var g;
    if (!this.GEc(c.ba))
        return c;
    g = new p.Cv().BF(c.Ef);
    Object.entries(c.ba).forEach(function(f) {
        var e;
        e = Fa(f);
        f = e.next().value;
        e = e.next().value;
        f === c.Ef ? g.cf(f, Object.assign(Object.assign({}, e), {
            next: undefined,
            eb: undefined,
            Oc: undefined
        })) : g.cf(f, e);
    });
    return g.build();
}
;
d.prototype.GEc = function(c) {
    c = Object.values(c).map(function(g) {
        return g.J;
    });
    return 1 === new Set(c).size;
}
;
b.Ljb =

// Detected exports: Ljb
