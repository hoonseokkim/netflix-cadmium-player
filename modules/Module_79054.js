/**
 * Netflix Cadmium Playercore - Module 79054
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Video element / playback control
 * Exports: DJa
 */

// Webpack module 79054
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n;
function d(q, r, u, v, w, x, y) {
    this.$a = q;
    this.pWc = u;
    this.Hl = w;
    this.ur = y;
    this.kWc = r.hE(false, "6.0055.939.911", q.id, x, v);
}
export const DJa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(81918);  // import from Module_81918
g = a(52531);  // import from Module_52531
f = a(88574);  // import from Module_88574
e = a(93488);  // import from Module_93488
h = a(2911);  // import from Module_02911
k = a(4203);  // import from Module_04203
l = a(65473);  // import from Module_65473
m = a(63368);  // import from Module_63368
a = a(75864);  // import from Module_75864
d.prototype.create = function(q, r, u, v) {
    var w, x;
    w = this.pWc.Llc(q, this.kWc, r);
    x = q.D8a;
    u.debug("Using " + (x ? "single" : "multiple") + " player playback strategy");
    return x ? new f.Ilb(this.Hl,q,r,u,w,v,this.ur) : new l.MP(q,r,w,v,this.ur);
}
;
n = d;
export const DJa = n;
b.DJa = n = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.re)), t.__param(1, (0,
p.v)(e.rlb)), t.__param(2, (0,
p.v)(h.CKa)), t.__param(3, (0,
p.v)(k.Pc)), t.__param(4, (0,
p.v)(g.RP)), t.__param(5, (0,
p.v)(m.tla)), t.__param(6, (0,
p.v)(a.U7))],

// Detected exports: DJa
