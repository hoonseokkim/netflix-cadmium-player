/**
 * Netflix Cadmium Playercore - Module 51742
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Video element / playback control
 * Exports: tjb
 */

// Webpack module 51742
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f, e, h, k, l) {
    f = g.nX.call(this, f, e, h, l) || this;
    f.j = k;
    (0,
    p.Rw)(f, "playback");
    return f;
}
export const tjb = undefined;
p = a(66523);  // import from Module_66523
c = a(90694);  // import from Module_90694
g = a(29045);  // import from Module_29045
Ia(d, g.nX);
d.prototype.rR = function(f) {
    return new d(this.$a,this.Voa,this.Ct,this.j,f);
}
;
d.prototype.RK = function(f, e, h) {
    f = new c.JGa(f,this.Cd,this.$a.Fc(),e,h,this.j.index);
    e = Fa(this.Ct.Ct);
    for (h = e.next(); !h.done; h = e.next())
        (h = h.value,
        h(f, this.j));
}
;
b.tjb =

// Detected exports: tjb
