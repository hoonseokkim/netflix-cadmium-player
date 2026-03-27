/**
 * Netflix Cadmium Playercore - Module 28838
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 28838
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f, e, h;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.nzc = function(k, l) {
    var m, n, q, r, u, v, w;
    if (k) {
        k = {};
        if (null === (m = l.btc) || void 0 === m ? 0 : m.enabled)
            k["response-time-average"] = new d.Mkb();
        if (null === (n = l.ftc) || void 0 === n ? 0 : n.enabled)
            k["throughput-trend"] = new p.Amb();
        if (null === (q = l.etc) || void 0 === q ? 0 : q.enabled)
            k["throughput-coefficient-of-variation"] = new c.vmb();
        if (null === (r = l.Uzb) || void 0 === r ? 0 : r.enabled)
            (n = l.Uzb,
            m = n.ro,
            k["throughput-switches"] = new g.wmb({
                U3a: n.U3a,
                $Na: n.$Na,
                ro: m
            }));
        if (null === (u = l.Rzb) || void 0 === u ? 0 : u.enabled)
            k["low-throughput"] = new f.cgb({
                LV: l.Rzb.LV
            });
        if (null === (v = l.Tzb) || void 0 === v ? 0 : v.enabled)
            (r = l.Tzb,
            m = r.ro,
            u = r.Q1,
            v = r.R1,
            n = r.PD,
            q = r.dF,
            r = r.P3,
            k["throughput-bucket-percentiles"] = new e.umb({
                ro: m,
                Q1: u,
                R1: v,
                PD: n,
                dF: q,
                P3: r
            }));
        if (null === (w = l.Szb) || void 0 === w ? 0 : w.enabled)
            (l = l.Szb,
            m = l.ro,
            u = l.Q1,
            v = l.R1,
            n = l.PD,
            q = l.dF,
            r = l.P3,
            k["response-time-bucket-percentiles"] = new h.Nkb({
                ro: m,
                Q1: u,
                R1: v,
                PD: n,
                dF: q,
                P3: r
            }));
        return k;
    }
}
;
d = a(55930);
p = a(85899);
c = a(51290);
g = a(6298);
f = a(82071);
e = a(20615);
h = a(10138);


// Detected exports: nzc