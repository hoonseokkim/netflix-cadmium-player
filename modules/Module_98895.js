/**
 * Netflix Cadmium Playercore - Module 98895
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 98895
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g, f, e, h, k, l) {
    g = p.nX.call(this, g, f, e, h) || this;
    g.groups = k;
    Array.isArray(l) ? g.prefix = l : l && "string" === typeof l && (g.prefix = [],
    g.prefix.push(l));
    return g;
}
b.o$a = undefined;
p = a(29045);  // import from Module_29045
c = a(22097);  // import from Module_22097
Ia(d, p.nX);
d.prototype.RK = function(g, f, e) {
    g = new c.n$a(g,this.Cd,this.$a.Fc(),f,e,this.prefix);
    f = Fa(this.Ct.Ct);
    for (e = f.next(); !e.done; e = f.next())
        (e = e.value,
        e(g));
}
;
d.prototype.rR = function(g) {
    return new d(this.$a,this.Voa,this.Ct,g,this.groups,this.prefix);
}
;
b.o$a =

