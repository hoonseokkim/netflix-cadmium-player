/**
 * Netflix Cadmium Playercore - Module 71576
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Manifest parsing / streaming protocol
 * Exports: nHa
 */

// Webpack module 71576
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n, q;
function d(r, u, v, w, x) {
    this.dea = v;
    this.Hi = w;
    this.Kh = x;
    this.log = r.zb("VideoPreparer");
    this.config = u();
}
export const nHa = undefined;
t = a(22970);  // import from Module_22970
p = a(4203);  // import from Module_04203
c = a(22674);  // import from Module_22674
g = a(87386);  // import from Module_87386
f = a(81918);  // import from Module_81918
e = a(5021);  // import from Module_05021
h = a(17398);  // import from Module_17398
k = a(72639);  // import from Module_72639
l = a(50323);  // import from Module_50323
m = a(49745);  // import from Module_49745
n = a(91176);  // import from Module_91176
q = a(54973);  // import from Module_54973
d.prototype.fetch = function(r, u) {
    var v, w, x;
    this.log.trace("Fetching manifest", (0,
    l.jFa)(r));
    w = r.Xa;
    x = new n.AbortController();
    this.config.X$b && w && w.S && !this.Kh.Iw(r.R) && (!(("clientGenesis"in w.S) && w.S.clientGenesis) || "number" === typeof w.S.clientGenesis && Date.now() - w.S.clientGenesis < this.config.qOb) && (w = this.dea.create(w.S)) && (w.WU = this.Hi.Fc().na(e.Ba),
    w.F3 = this.Hi.Fc().na(e.Ba),
    this.Kh.CV(r.R, w));
    return this.Kh.Bp({
        Ia: u.NRa(r.R),
        J: r.R,
        qb: null !== (v = r.Xa) && undefined !== v ? v : {},
        Bu: k.qq.R7,
        Ti: (0,
        q.Yba)(this.config, true, r.h1),
        h1: r.h1
    }, x.signal, true, function(y) {
        u.events.emit("manifestRemovedFromCache", {
            target: u,
            type: "manifestRemovedFromCache",
            J: r.R,
            S: y
        });
    });
}
;
a = d;
export const nHa = a;
b.nHa = a = t.__decorate([(0,
c.aa)(), t.__param(0, (0,
c.v)(g.Bb)), t.__param(1, (0,
c.v)(p.Pc)), t.__param(2, (0,
c.v)(h.sX)), t.__param(3, (0,
c.v)(f.re)), t.__param(4, (0,
c.v)(m.tX))],

// Detected exports: nHa
