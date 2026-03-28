/**
 * Netflix Cadmium Playercore - Module 72978
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Data parsing / serialization
 * Exports: I7
 */

// Webpack module 72978
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k;
function d(l) {
    var q;
    for (var m = {}, n = l.length - 1; 0 <= n; n--) {
        q = l[n];
        q = ("").concat(q.JN, "-").concat(q.id);
        m[q] ? l.splice(n, 1) : m[q] = true;
    }
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const I7 = undefined;
c = a(22970);  // import from Module_22970
g = a(98776);  // import from Module_98776
f = a(29770);  // import from Module_29770
e = a(25564);  // import from Module_25564
t = a(87349);  // import from Module_87349
h = a(43607);  // import from Module_43607
k = a(48014);  // import from Module_48014
a = (function(l) {
    function m(n, q, r) {
        r = l.call(this, n, q, r) || this;
        r.console = n;
        r.stream = q;
        return r;
    }
    c.__extends(m, l);
    m.prototype.parse = function(n) {
        var q, r, u, v, w, x, y, A, z;
        q = this;
        r = (null === n || undefined === n ? undefined : n.Na) || ({});
        u = l.prototype.parse.call(this, n ? c.__assign(c.__assign({}, n), {
            Na: r
        }) : {
            Na: r
        });
        if (!u.done || !r.Kl || undefined === r.zl)
            return u;
        v = h.Om.path(this, ["moof"]);
        if (!v)
            return c.__assign(c.__assign({}, u), {
                done: false
            });
        w = (null === n || undefined === n ? undefined : n.events) || [];
        x = v.byteOffset + r.zl;
        y = r.fH || 0;
        r.Kl.forEach(function(B) {
            var C, D;
            C = new DataView(q.view.buffer,q.view.byteOffset + x,B.iJ);
            C = q.nOc(C);
            D = y + (B.KVc || 0);
            null !== A && undefined !== A ? A : A = D;
            z = D + B.R3;
            C && C.emib && C.emib.forEach(function(E) {
                w.push({
                    JN: D + E.NQc,
                    V_: E.V_,
                    id: E.id,
                    eO: E.eO,
                    value: E.value,
                    GI: E.GI
                });
            });
            x += B.iJ;
            y += B.R3;
        });
        n && n.bVb && (n.bVb.wed = A,
        n.bVb.Nhd = z);
        d(w);
        return u;
    }
    ;
    m.prototype.nOc = function(n) {
        var q;
        q = new k.Xja(n.byteLength);
        n = new e.T5(m.Se,q,n,this.console,{
            Fxa: true
        });
        return n.parse().done ? n.Se : undefined;
    }
    ;
    m.Se = (p = {},
    p[g.default.Ae] = g.default,
    p[f.default.Ae] = f.default,
    p);
    return m;
}
)(t.Wz);
b.I7 =

// Detected exports: I7
