/**
 * Netflix Cadmium Playercore - Module 23710
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: RMb, LEa
 */

// Webpack module 23710
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;
export const RMb = b.LEa = undefined;
d = a(22970);  // import from Module_22970
t = a(5248);  // import from Module_05248
p = a(91331);  // import from Module_91331
c = d.__importDefault(a(42979));
g = d.__importDefault(a(6838));
f = d.__importDefault(a(88257));
e = d.__importDefault(a(36114));
h = (function(k) {
    function l(m, n) {
        var q;
        q = k.call(this, p.sma.zEa) || this;
        q.email = m;
        q.password = n;
        return q;
    }
    d.__extends(l, k);
    l.prototype.rS = function(m, n) {
        var q;
        q = this;
        c.default(n, function() {
            var r;
            r = m.zf();
            r.put("email", q.email);
            r.put("password", q.password);
            return r;
        });
    }
    ;
    l.prototype.equals = function(m) {
        return this === m ? true : m instanceof l ? k.prototype.equals.call(this, m) && this.email == m.email && this.password == m.password : false;
    }
    ;
    return l;
}
)(t.yLa);
export const LEa = h;
export function RMb(k) {
    var l, m;
    try {
        l = k.Be("email");
        m = k.Be("password");
        return new h(l,m);
    } catch (n) {
        if (n instanceof g.default)
            throw new f.default(e.default.lf,"email/password authdata " + k,n);
        throw n;
    }
}

// Detected exports: RMb, LEa
