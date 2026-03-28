/**
 * Netflix Cadmium Playercore - Module 90973
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: cNb, Skb
 */

// Webpack module 90973
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;
export const cNb = b.Skb = undefined;
d = a(22970);  // import from Module_22970
t = a(58768);  // import from Module_58768
p = a(36332);  // import from Module_36332
c = d.__importDefault(a(42979));
g = d.__importDefault(a(6838));
f = d.__importDefault(a(88257));
e = d.__importDefault(a(36114));
h = (function(k) {
    function l(m, n) {
        var q;
        q = k.call(this, p.dG.MX) || this;
        q.Jw = m;
        q.Fya = n;
        return q;
    }
    d.__extends(l, k);
    l.prototype.nE = function() {
        return this.Jw;
    }
    ;
    l.prototype.rS = function(m, n) {
        var q;
        q = this;
        c.default(n, function() {
            var r;
            r = m.zf();
            r.put("identity", q.Jw);
            r.put("pubkeyid", q.Fya);
            return r;
        });
    }
    ;
    l.prototype.equals = function(m) {
        return this === m ? true : m instanceof l ? k.prototype.equals.call(this, m) && this.Jw == m.Jw && this.Fya == m.Fya : false;
    }
    ;
    return l;
}
)(t.n6);
export const Skb = h;
export function cNb(k) {
    var l, m;
    try {
        l = k.Be("identity");
        m = k.Be("pubkeyid");
        return new h(l,m);
    } catch (n) {
        if (n instanceof g.default)
            throw new f.default(e.default.lf,"RSA authdata" + k);
        throw n;
    }
}

// Detected exports: cNb, Skb
