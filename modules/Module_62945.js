/**
 * Netflix Cadmium Playercore - Module 62945
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Caching / storage
 * Exports: storage
 */

// Webpack module 62945
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n;
export const storage = undefined;
t = a(22674);  // import from Module_22674
d = a(91133);  // import from Module_91133
p = a(48159);  // import from Module_48159
c = a(56278);  // import from Module_56278
g = a(42304);  // import from Module_42304
f = a(42236);  // import from Module_42236
e = a(84970);  // import from Module_84970
h = a(57925);  // import from Module_57925
k = a(67894);  // import from Module_67894
l = a(17892);  // import from Module_17892
m = a(86607);  // import from Module_86607
n = a(26305);  // import from Module_26305
b.storage = new t.Ie(function(q) {
    q(p.xhb).gg(function() {
        return function() {
            return Da.localStorage;
        }
        ;
    });
    q(p.ceb).gg(function() {
        return function() {
            return Da.indexedDB;
        }
        ;
    });
    q(m.dhb).to(n.zHa).sa();
    q(l.PJ).to(k.CCa).sa();
    q(c.Tfb).to(g.DGa).sa();
    q(d.Bka).to(h.UFa).sa();
    q(f.Deb).to(e.VFa).sa();
    q(f.beb).to(e.MFa).sa();
    q(f.Eeb).to(e.WFa).sa();
}

// Detected exports: storage
