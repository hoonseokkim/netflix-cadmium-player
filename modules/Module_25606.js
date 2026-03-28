/**
 * Netflix Cadmium Playercore - Module 25606
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Constants / enumerations
 * Exports: wcb
 */

// Webpack module 25606
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;
export const wcb = undefined;
d = a(22970);  // import from Module_22970
p = a(91331);  // import from Module_91331
c = d.__importDefault(a(42979));
g = a(23710);  // import from Module_23710
f = d.__importDefault(a(10690));
e = d.__importDefault(a(88361));
h = d.__importDefault(a(36114));
t = (function(k) {
    function l(m, n) {
        var q;
        q = k.call(this, p.sma.zEa) || this;
        q.Zm = m;
        q.ybd = n;
        return q;
    }
    d.__extends(l, k);
    l.prototype.Y$ = function(m, n, q) {
        c.default(q, function() {
            return g.RMb(n);
        });
    }
    ;
    l.prototype.ssb = function(m, n, q) {
        var r;
        r = this;
        c.default(q, function() {
            var u, v;
            if (!(m instanceof g.LEa))
                throw new f.default("Incorrect authentication data type " + m + ".");
            u = m.email;
            v = m.password;
            if (!u || 0 == u.trim().length || !v || 0 == v.trim().length)
                throw new e.default(h.default.t0b).If(m);
            u = r.Zm.whd(u, v);
            if (null == u)
                throw new e.default(h.default.$bb).If(m);
            if (n && (v = n.hW,
            !u.equals(v)))
                throw new e.default(h.default.Z6b,"uad user " + u + "; uit user " + v).If(m);
            return u;
        });
    }
    ;
    return l;
}
)(a(49137).zLa);
b.wcb =

// Detected exports: wcb
