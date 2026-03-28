/**
 * Netflix Cadmium Playercore - Module 50539
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: EOb, zeb
 * Dependencies: 77737, 87606, 96103
 * Purpose: Logging
 */

// import dep_77737 from './Module_77737.js';
// import dep_87606 from './Module_87606.js';
// import dep_96103 from './Module_96103.js';

// Webpack module 50539
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n, q;

export function EOb(r, u, v, w) {
    var x, y, A;
    x = r.read(8);
    w = Math.max(0, Math.ceil(x + 4 * Math.log(Math.pow(10, w.dH / 20)) / Math.log(2)));
    r.reverse(8);
    r.write(8, w);
    v || (v = new q(r,0,u));
    x = v;
    y = x.Z8a === g ? 3 : 5;
    A = (1 << y) - 1;
    u = [];
    w = [];
    for (var z = [], B = 0; B < x.x2; ++B) {
        for (var C = 0, D = 0; C < x.rea; ) {
            for (var E = r.read(4), G = 0, F; (F = r.read(y)) === A; )
                G += F;
            G += F;
            C += G;
            u.push(E);
            w.push(G);
            ++D;
        }
        z.push(D);
    }
    x = true;
    for (y = 0; y < u.length; ++y)
        u[y] !== f && (u[y] === h && x ? (r.advance(9),
        x = false,
        p.xka.mTb(r, w[y] - 1)) : p.xka.mTb(r, w[y]));
    r.read(1) && r.advance(6 + 9 * (r.read(2) + 1));
    if (r.read(1))
        for ((x = v,
        y = 2 === x.Z8a ? m : n,
        A = 0); A < x.wLb; ++A)
            if (z = r.read(y[0]))
                for ((B = r.read(1),
                C = 0); C < z; ++C)
                    if ((r.advance(y[1]),
                    D = r.read(y[2])))
                        (r.advance(1),
                        E = r.read(1),
                        r.advance(D * (B + 3 - E)));
    (0,
    d.assert)(!r.read(1));
    x = v.x2;
    y = v.rea;
    A = v.HUb;
    v = v.TBa;
    for (B = z = 0; B < x; ++B)
        for ((C = v[B],
        D = 0); D < y; ++z)
            if ((E = u[z],
            G = w[z],
            E === f || E === h || E === l || E === k))
                D += G;
            else {
                F = E >= e ? 2 : 4;
                for (var H = 0; H < G; (++H,
                ++D))
                    for (var J = C * (A[D + 1] - A[D]) / F, M = 0; M < J; ++M)
                        p.xka.kZc(r, E);
            }
}
;
d = a(87606);
p = a(77737);
c = a(96103);
g = 2;
f = 0;
e = 5;
h = 13;
k = 14;
l = 15;
m = [1, 4, 3];
n = [2, 6, 5];
q = (function() {
    return function(r, u, v) {
        var w;
        this.TBa = [];
        this.x2 = 1;
        this.TBa[0] = 1;
        r.advance(1);
        this.Z8a = r.read(2);
        r.read(1);
        if (this.Z8a === g) {
            this.wLb = 8;
            this.rea = r.read(4);
            for (u = 0; 7 > u; ++u)
                r.read(1) ? this.TBa[this.x2 - 1]++ : (this.x2++,
                this.TBa[this.x2 - 1] = 1);
            this.HUb = c.ilb[v];
        } else {
            this.wLb = 1;
            this.rea = r.read(6);
            if (r.read(1)) {
                w = 14 + Math.min(this.rea, 40);
                r.read(1) && r.advance(w);
                u && r.read(1) && r.advance(w);
            }
            this.HUb = c.hlb[v];
        }
    }
    ;
}
)();
export const zeb = q;

// Detected exports: EOb, zeb
