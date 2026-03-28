/**
 * Netflix Cadmium Playercore - Module 57718
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: NKa
 */

// Webpack module 57718
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f) {
    this.rUb = f;
    this.I$b = "video/mp4;codecs={0}";
    this.z7b = "audio/mp4;codecs={0}";
}
export const NKa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(73796);  // import from Module_73796
a = a(88490);  // import from Module_88490
d.prototype.mwb = function(f) {
    var e;
    f = c.vnb[null === (e = f[0]) || undefined === e ? undefined : e.Zc] || c.zc.UF;
    return this.rUb.format(this.I$b, f);
}
;
d.prototype.yvb = function(f) {
    var e;
    f = c.J$a[null === (e = f[0]) || undefined === e ? undefined : e.Zc] || c.zc.ap;
    return this.rUb.format(this.z7b, f);
}
;
g = d;
export const NKa = g;
b.NKa = g = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.emb))],

// Detected exports: NKa
