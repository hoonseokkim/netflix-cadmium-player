/**
 * Netflix Cadmium Playercore - Module 28978
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: tEa
 */

// Webpack module 28978
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l;
function d(m, n, q, r) {
    this.Ql = m;
    this.dy = n;
    this.K3c = q;
    this.$Fc = r;
}
export const tEa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(74870);  // import from Module_74870
g = a(2248);  // import from Module_02248
f = a(84408);  // import from Module_84408
e = a(53921);  // import from Module_53921
h = a(24735);  // import from Module_24735
k = a(82100);  // import from Module_82100
a = a(98166);  // import from Module_98166
d.prototype.Vu = function(m) {
    var n;
    n = this;
    return this.Ql.K$(m.rL[0].data[0], [8, 4]) ? Promise.resolve({
        o1: [{
            id: "ddd",
            NHb: "cert",
            OHb: undefined
        }],
        DB: [{
            sessionId: "ddd",
            data: new Uint8Array(this.dy.decode(k.Enb))
        }]
    }) : this.Ql.K$(m.rL[0].data[0], this.K3c.decode("certificate")) ? Promise.resolve({
        o1: [{
            id: "ddd",
            NHb: "cert",
            OHb: undefined
        }],
        DB: [{
            sessionId: "ddd",
            data: new Uint8Array(this.dy.decode(k.bFa))
        }]
    }) : this.$Fc.wA(this.suc(m)).then(function(q) {
        return n.tuc(q);
    });
}
;
d.prototype.suc = function(m) {
    var n, q;
    n = this;
    q = m.rL.map(function(r) {
        return r.data.map(function(u) {
            return {
                sessionId: r.sessionId,
                dataBase64: n.dy.encode(u)
            };
        });
    });
    return {
        Ia: m.Ia,
        de: m.de,
        cyb: m.cyb,
        Ti: (0,
        h.QHb)(m.Ti),
        KR: e.Qr[m.KR],
        rL: q.reduce(function(r, u) {
            return r.concat(u);
        }, []),
        Kp: m.Kp,
        rf: m.rf,
        J: m.J,
        eo: m.eo
    };
}
;
d.prototype.tuc = function(m) {
    return {
        o1: m.o1,
        DB: m.DB
    };
}
;
l = d;
export const tEa = l;
b.tEa = l = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Um)), t.__param(1, (0,
p.v)(g.Km)), t.__param(2, (0,
p.v)(f.zG)), t.__param(3, (0,
p.v)(a.pfb))],

// Detected exports: tEa
