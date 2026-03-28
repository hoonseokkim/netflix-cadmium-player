/**
 * Netflix Cadmium Playercore - Module 36911
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: UZ, kCc, kkb
 */

// Webpack module 36911
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k;
function d(l, m) {
    if (m == f.kl.EX) {
        if (l instanceof Uint8Array)
            return l;
        if ("string" === typeof l)
            try {
                return h.Fk(l);
            } catch (n) {
                throw new c.default(e.default.gX,m + " " + l,n);
            }
        throw new c.default(e.default.gX,m + " " + l);
    }
    if (m == f.kl.Eka) {
        if ("string" === typeof l)
            try {
                l = JSON.parse(l);
            } catch (n) {
                throw new c.default(e.default.gX,m + " " + l,n);
            }
        if ("object" === typeof l && l.constructor === Object)
            return l;
        throw new c.default(e.default.gX,m + " " + l);
    }
    throw new c.default(e.default.gX,"Invalid format '" + m + "'");
}
export const kCc = b.UZ = b.kkb = undefined;
t = a(22970);  // import from Module_22970
p = t.__importDefault(a(42979));
c = t.__importDefault(a(42458));
g = a(50441);  // import from Module_50441
f = a(11475);  // import from Module_11475
e = t.__importDefault(a(36114));
h = a(44127);  // import from Module_44127
k = (function() {
    function l(m, n, q) {
        var u;
        function r(v) {
            p.default(n, function() {
                u.gx = m;
                u.nTa = v;
                return u;
            });
        }
        u = this;
        p.default(n, function() {
            if ("object" !== typeof m || "private" != m.type)
                throw new TypeError("Only original private crypto keys are supported.");
            !q && m.extractable ? g.hh.exportKey(f.kl.EX, m).then(function(v) {
                r(new Uint8Array(v));
            }, function(v) {
                n.error(new c.default(e.default.iGa,f.kl.EX,v));
            }) : r(q);
        });
    }
    l.prototype.mE = function() {
        return this.nTa;
    }
    ;
    return l;
}
)();
export const kkb = k;
export function UZ(l, m) {
    new k(l,m);
}
;
export function kCc(l, m, n, q, r) {
    p.default(r, function() {
        var u;
        u = d(l, q);
        g.hh.importKey(q, u, m, true, n).then(function(v) {
            new k(v,r,u);
        }, function(v) {
            r.error(new c.default(e.default.gX,null,v));
        });
    });
}

// Detected exports: UZ, kCc, kkb
