/**
 * Netflix Cadmium Playercore - Module 18089
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Constants / enumerations
 * Exports: Tkb
 */

// Webpack module 18089
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k;
export const Tkb = undefined;
d = a(22970);  // import from Module_22970
t = a(80477);  // import from Module_80477
p = a(36332);  // import from Module_36332
c = d.__importDefault(a(42979));
g = a(90973);  // import from Module_90973
f = d.__importDefault(a(10690));
e = d.__importDefault(a(24571));
h = d.__importDefault(a(36114));
k = a(33863);  // import from Module_33863
a = (function(l) {
    function m(n, q) {
        var r;
        r = l.call(this, p.dG.MX) || this;
        r.Uu = n;
        r.store = q;
        return r;
    }
    d.__extends(m, l);
    m.prototype.Y$ = function(n, q) {
        c.default(q, function() {
            return g.cNb(n);
        });
    }
    ;
    m.prototype.WA = function(n, q) {
        var r, u, v, w;
        if (!(q instanceof g.Skb))
            throw new f.default("Incorrect authentication data type " + q + ".");
        r = q.Jw;
        u = q.Fya;
        v = this.store.hDb(u);
        w = this.store.Hyc(u);
        if (u == this.Uu && !w)
            throw new e.default(h.default.H5b,u).fg(q);
        if (u != this.Uu && !v)
            throw new e.default(h.default.I5b,u).fg(q);
        return new k.Tla(n,r,w,v,k.mG.QX);
    }
    ;
    return m;
}
)(t.UEa);
b.Tkb =

// Detected exports: Tkb
