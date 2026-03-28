/**
 * Netflix Cadmium Playercore - Module 28865
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Encryption / cryptography
 * Exports: CRa
 */

// Webpack module 28865
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;
export const CRa = undefined;
d = a(22970);  // import from Module_22970
p = d.__importDefault(a(42979));
c = d.__importDefault(a(6838));
g = d.__importDefault(a(42458));
f = d.__importDefault(a(58511));
e = a(54449);  // import from Module_54449
(function(h) {
    function k(l, m, n, q, r, u, v) {
        return h.call(this, l, m, n, q, r, u, v) || this;
    }
    d.__extends(k, h);
    k.prototype.bo = function(l, m, n) {
        var q;
        q = this;
        p.default(n, function() {
            if (q.encodings[m])
                return q.encodings[m];
            l.Vj(q.pta, m, {
                result: function(r) {
                    p.default(n, function() {
                        q.qp.encrypt(r, l, m, {
                            result: function(u) {
                                p.default(n, function() {
                                    q.qp.sign(u, l, m, {
                                        result: function(v) {
                                            p.default(n, function() {
                                                var w;
                                                w = l.zf();
                                                q.mc ? w.put(f.default.Yeb, q.mc) : w.put(f.default.hGa, q.jm);
                                                w.put(f.default.Xeb, u);
                                                w.put(f.default.jGa, v);
                                                l.Vj(w, m, {
                                                    result: function(x) {
                                                        p.default(n, function() {
                                                            return q.encodings[m] = x;
                                                        });
                                                    },
                                                    error: n.error
                                                });
                                            });
                                        },
                                        error: function(v) {
                                            p.default(n, function() {
                                                v instanceof g.default && (v = new c.default("Error signing the header data.",v));
                                                throw v;
                                            });
                                        }
                                    });
                                });
                            },
                            error: function(u) {
                                p.default(n, function() {
                                    u instanceof g.default && (u = new c.default("Error encrypting the header data.",u));
                                    throw u;
                                });
                            }
                        });
                    });
                },
                error: n.error
            });
        });
    }
    ;
    return k;
}
)(e.wX);
export function CRa(h, k, l, m, n, q) {
    new e.wX(h,k,l,m,n,null,q);
}

// Detected exports: CRa
