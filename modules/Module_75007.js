/**
 * Netflix Cadmium Playercore - Module 75007
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: BRa, n3b, uf
 * Dependencies: 22970, 44127
 * Purpose: Error handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_44127 from './Module_44127.js';

// Webpack module 75007
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l;
b.$1a = export const BRa = t = a(22970);
d = t.__importDefault(a(42979));
p = t.__importDefault(a(10690));
c = t.__importDefault(a(42458));
g = t.__importDefault(a(51411));
f = t.__importDefault(a(6838));
e = t.__importDefault(a(88257));
h = t.__importDefault(a(36114));
k = a(44127);
export const uf = {
    Wl: 1,
    eA: 2
};
l = (function() {
    class m {
    constructor(n, q, r) {
        this.version = n;
        this.algorithm = q;
        this.mha = r;
    }
    Ed(n, q, r) {
        var u;
        u = this;
        d.default(r, function() {
            var v;
            switch (u.version) {
            case b.uf.Wl:
                return u.mha;
            case b.uf.eA:
                v = n.zf();
                v.put("version", u.version);
                v.put("algorithm", u.algorithm);
                v.put("signature", u.mha);
                n.Vj(v, q, r);
                break;
            default:
                throw new p.default("Signature envelope version " + u.version + " encoding unsupported.");
            }
        });
    }
}
return m;
}
)();
export const n3b = l;
export function BRa() {
    var m, n, q, r;
    if (2 == arguments.length)
        (m = b.uf.Wl,
        n = arguments[0],
        q = null,
        r = arguments[1]);
    else
        3 == arguments.length && (m = b.uf.eA,
        q = arguments[0],
        n = arguments[1],
        r = arguments[2]);
    d.default(r, function() {
        return new l(m,q,n);
    });
}
;
b.$1a = function(m, n, q, r) {
    d.default(r, function() {
        var u, v, w, x, y;
        if (n)
            switch (n) {
            case b.uf.Wl:
                return new l(b.uf.Wl,null,m);
            case b.uf.eA:
                try {
                    u = q.Qp(m);
                    v = u.xS("version");
                    if (b.uf.eA != v)
                        throw new c.default(h.default.sLa,"signature envelope " + m);
                    w = g.default.g8.nS(u.Be("algorithm"));
                    if (!w)
                        throw new c.default(h.default.qLa,"signature envelope " + m);
                    x = u.Ed("signature");
                    return new l(b.uf.eA,w,x);
                } catch (z) {
                    if (z instanceof f.default)
                        throw new e.default(h.default.lf,"signature envelope " + m,z);
                    throw z;
                }
            default:
                throw new c.default(h.default.sLa,"signature envelope " + k.Ji(m));
            }
        try {
            u = q.Qp(m);
        } catch (z) {
            if (z instanceof f.default)
                u = null;
            else
                throw z;
        }
        if (u && u.has("version"))
            try {
                y = u.xS("version");
                y !== y && (y = b.uf.Wl);
                v = false;
                for (var A in b.uf)
                    if (b.uf[A] == y) {
                        v = true;
                        break;
                    }
                v || (y = b.uf.Wl);
            } catch (z) {
                z instanceof f.default && (y = b.uf.Wl);
            }
        else
            y = b.uf.Wl;
        switch (y) {
        case b.uf.Wl:
            return new l(y,null,m);
        case b.uf.eA:
            try {
                return (w = g.default.g8.nS(u.Be("algorithm")),
                x = u.Ed("signature"),
                w ? new l(y,w,x) : new l(b.uf.Wl,null,m));
            } catch (z) {
                if (z instanceof f.default)
                    return new l(b.uf.Wl,null,m);
                throw z;
            }
        default:
            throw new c.default(h.default.sLa,"signature envelope " + m);
        }
    });
}
;

// Detected exports: BRa, n3b, uf
