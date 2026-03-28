/**
 * Netflix Cadmium Playercore - Module 77399
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: TCc
 */

// Webpack module 77399
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function TCc(p, c) {
    var h, k, l, m, n, q, r, w, x, y, A, z, B, C;
    for (var g, f, e = 0; e < p.length; e++) {
        h = d.__read(c, 3);
        k = h[0];
        l = h[1];
        m = h[2];
        n = d.__read(p[e], 3);
        q = n[0];
        h = n[1];
        r = n[2];
        if (!(k >= h)) {
            k = [k, Math.min(h, l), q, h].filter(function(D, E, G) {
                return G.indexOf(D) === E;
            }).sort(function(D, E) {
                return D - E;
            });
            q = k.length - 1;
            n = Array(q);
            m += r;
            try {
                for (var u = (g = undefined,
                d.__values([c, p[e]])), v = u.next(); !v.done; v = u.next()) {
                    w = d.__read(v.value, 3);
                    x = w[0];
                    y = w[1];
                    A = w[2];
                    r = y - x;
                    for (c = 0; c < q; c++) {
                        z = k[c + 1];
                        B = Math.min(z, y) - Math.max(k[c], x);
                        if (0 < B) {
                            C = B * A / r;
                            m -= C;
                            n[c] = n[c] ? n[c] + C : C;
                        }
                        if (y <= z)
                            break;
                    }
                }
            } catch (D) {
                g = {
                    error: D
                };
            } finally {
                try {
                    v && !v.done && (f = u.return) && f.call(u);
                } finally {
                    if (g)
                        throw g.error;
                }
            }
            r = [];
            for (c = 0; c < q; c++)
                (A = n[c],
                0 < A && r.push([k[c], k[c + 1], A]));
            p.splice.apply(p, d.__spreadArray([e, 1], d.__read(r), false));
            if (h < l)
                c = [h, l, m];
            else
                return;
        }
    }
    c && 0 < c[2] && p.splice(p.length, 0, c);
}
;
d = a(2297

// Detected exports: TCc
