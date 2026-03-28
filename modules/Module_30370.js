/**
 * Netflix Cadmium Playercore - Module 30370
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: ybb
 */

// Webpack module 30370
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;
export const ybb = undefined;
d = a(22970);  // import from Module_22970
t = a(21399);  // import from Module_21399
p = a(65630);  // import from Module_65630
c = a(77593);  // import from Module_77593
g = d.__importDefault(a(6838));
f = d.__importDefault(a(42979));
e = a(72536);  // import from Module_72536
a = (function(h) {
    function k() {
        return null !== h && h.apply(this, arguments) || this;
    }
    d.__extends(k, h);
    k.prototype.cDb = function() {
        return p.YC.JSON;
    }
    ;
    k.prototype.Ouc = function(l, m) {
        if (p.YC.JSON === m)
            return new c.Qeb(this,l);
        throw new g.default("Unsupported encoder format: " + m + ".");
    }
    ;
    k.prototype.Qp = function(l) {
        var m;
        m = this.pOc(l);
        if (p.YC.JSON == m)
            return new e.DP(this,l);
        throw new g.default("Unsupported encoder format: " + m + ".");
    }
    ;
    k.prototype.Vj = function(l, m, n) {
        var q;
        q = this;
        f.default(n, function() {
            if (p.YC.JSON == m)
                e.Nyb(q, l, n);
            else
                throw new g.default("Unsupported encoder format: " + m + ".");
        });
    }
    ;
    return k;
}
)(t.mhb);
b.ybb =

// Detected exports: ybb
