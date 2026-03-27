/**
 * Netflix Cadmium Playercore - Module 86563
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 86563
// Parameters: t (module), b (exports), a (require)


var p, c, g, f, e, h, k, l, m, n, q, r, u;
function d(v, w, x, y, A, z) {
    v = f.lj.call(this, v, c.ea.qX) || this;
    v.platform = w;
    v.dea = x;
    v.bGc = y;
    v.YHc = A;
    v.ZPc = z;
    return v;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.MIa = void 0;
t = a(22970);
p = a(72639);
c = a(36129);
g = a(19114);
a(2762);
f = a(51658);
e = a(83998);
h = a(91581);
k = a(34231);
l = a(17398);
m = a(829);
n = a(22674);
q = a(67658);
r = a(41332);
u = a(56039);
Ia(d, f.lj);
d.prototype.Yyc = function(v, w) {
    var x, y, A, z, B, C;
    A = w ? g.oj.cGc : g.oj.S;
    w = w ? "licensedManifest" : "manifest";
    z = v.Bu === p.qq.R7;
    B = "postplay" === v.qb.Ye || "postplay-seamless" === v.qb.Ye || v.h1;
    if (z || B)
        w = (B ? "postplay/" : "prefetch/") + w;
    C = "live" === v.qb.Ye;
    C && (w += "/live");
    (B = !(null === (x = v.ze) || void 0 === x || !x.Pj) || !(null === (y = v.ze) || void 0 === y || !y.hb)) && (w = "adBreakHydration" + (C ? "/live" : ""));
    if (x = !!v.$y)
        A = w = "prefetchLiveAds";
    !v.Ep || B || x || (w += "/ad");
    v = !!v.Iw;
    return {
        Cm: w,
        nic: A,
        Sn: z || v ? 0 : 3
    };
}
;
d.prototype.ef = function(v, w) {
    var x, y;
    x = this;
    y = w.Bu === p.qq.Yla ? k.ZC.Ujb : k.ZC.KX;
    return this.YHc().transform(w, y).then(function(A) {
        var z, B;
        z = Fa(A);
        A = z.next().value;
        B = z.next().value;
        !1;
        z = x.Yyc(w, "licensedManifest" === B.so);
        return x.send(v, {
            url: B.so,
            name: z.nic,
            Cm: z.Cm,
            Sn: z.Sn
        }, A, void 0, y).then(function(C) {
            var D, E, G;
            D = C.result;
            x.ZPc.forEach(function(F) {
                return F.process(D);
            });
            C = x.dea.create(D);
            E = C.Aa;
            if (B.DH) {
                G = E.il.map(function(F) {
                    return F.Vu;
                }).filter(Boolean);
                0 < G.length ? (G = x.bGc.CVb(G),
                E = (0,
                u.JVa)(E.il[0].streams),
                B.DH.Pqb(G, E),
                C.DH = B.DH,
                C.FYa = !0) : B.DH.close();
            }
            C.X9 = B.X9;
            C.Nia = B.Nia;
            !1;
            return C;
        });
    }).catch(function(A) {
        !1;
        throw x.Ew(A);
    });
}
;
a = d;
b.MIa = a;
b.MIa = a = t.__decorate([(0,
n.aa)(), t.__param(0, (0,
n.v)(e.io)), t.__param(1, (0,
n.v)(h.Vt)), t.__param(2, (0,
n.v)(l.sX)), t.__param(3, (0,
n.v)(m.JIa)), t.__param(4, (0,
n.v)(q.Uib)), t.__param(5, (0,
n.optional)()), t.__param(5, (0,
n.KI)(r.ygb))], a);


// Detected exports: MIa