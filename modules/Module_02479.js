/**
 * Netflix Cadmium Playercore - Module 2479
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: gNb, vLa
 */

// Webpack module 2479
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;
export const gNb = b.vLa = undefined;
d = a(22970);  // import from Module_22970
t = a(58768);  // import from Module_58768
p = a(36332);  // import from Module_36332
c = d.__importDefault(a(42979));
g = d.__importDefault(a(6838));
f = d.__importDefault(a(88257));
e = d.__importDefault(a(36114));
h = (function(k) {
    function l(m) {
        var n;
        n = k.call(this, p.dG.NONE) || this;
        n.Jw = m;
        return n;
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
            return r;
        });
    }
    ;
    l.prototype.equals = function(m) {
        return this === m ? true : m instanceof l ? k.prototype.equals.call(this, m) && this.Jw == m.Jw : false;
    }
    ;
    return l;
}
)(t.n6);
export const vLa = h;
export function gNb(k) {
    var l;
    try {
        l = k.Be("identity");
        return new h(l);
    } catch (m) {
        if (m instanceof g.default)
            throw new f.default(e.default.lf,"Unauthenticated authdata" + k);
        throw m;
    }
}

// Detected exports: gNb, vLa
