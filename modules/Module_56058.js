/**
 * Netflix Cadmium Playercore - Module 56058
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Cvb, Qab
 */

// Webpack module 56058
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;
export const Cvb = b.Qab = undefined;
d = a(22970);  // import from Module_22970
p = d.__importDefault(a(42979));
c = a(68480);  // import from Module_68480
g = a(93652);  // import from Module_93652
f = a(32260);  // import from Module_32260
e = (function(h) {
    function k(l, m, n) {
        var q;
        q = h.call(this, l, null, null, 0, n) || this;
        p.default(n, function() {
            var r, u, v, w, x, y, A, z;
            r = m.mc;
            u = m.jm;
            v = m.vg;
            w = m.Jj;
            x = m.Ke;
            y = g.oM(x);
            A = c.qYa(m.QJb, l.EG);
            try {
                z = m.keyResponseData;
                q.tFb(l, y, A, u, z ? z.mc : r, v, m.lO);
                return q;
            } catch (B) {
                throw (f.Md(B) && (B.qc(r),
                B.fg(u),
                B.Ne(v),
                B.If(w),
                B.vi(x)),
                B);
            }
        });
        return q;
    }
    d.__extends(k, h);
    return k;
}
)(g.AHa);
export const Qab = e;
export function Cvb(h, k, l) {
    new e(h,k,l);
}

// Detected exports: Cvb, Qab
