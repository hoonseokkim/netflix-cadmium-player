/**
 * Netflix Cadmium Playercore - Module 77228
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: zDa
 */

// Webpack module 77228
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l;
function d(m, n, q, r, u) {
    this.u_ = m;
    this.Pd = n;
    this.a2 = r;
    this.bv = u;
    this.log = q.zb("CannedChallengeProviderImpl");
}
export const zDa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(47737);  // import from Module_47737
g = a(2248);  // import from Module_02248
f = a(87386);  // import from Module_87386
e = a(92395);  // import from Module_92395
h = a(21103);  // import from Module_21103
k = a(53921);  // import from Module_53921
l = a(84218);  // import from Module_84218
d.prototype.zWa = function(m) {
    var n;
    n = this;
    return Promise.all([this.u_(), this.CVa()]).then(function(q) {
        var r;
        r = Fa(q);
        q = r.next().value;
        r = r.next().value;
        return q.Huc({
            type: m,
            initData: r,
            Zta: false
        }, n.a2());
    }).then(function(q) {
        var r;
        r = Fa(q);
        q = r.next().value;
        r = r.next().value;
        r = n.Pd.encode(r.data[0]);
        n.log.trace("Challenge generated", r);
        return {
            Ml: q,
            lQa: r
        };
    });
}
;
d.prototype.CVa = function() {
    var m;
    m = this;
    return this.bv.ZH().then(function(n) {
        return n.kE();
    }).then(function(n) {
        switch (n) {
        case k.Qr.a0:
            return l.Ucb;
        case k.Qr.f3:
            return l.jjb;
        default:
            return l.Nnb;
        }
    }).then(function(n) {
        return n.map(m.Pd.decode);
    });
}
;
a = d;
export const zDa = a;
b.zDa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.aka)), t.__param(1, (0,
p.v)(g.Km)), t.__param(2, (0,
p.v)(f.Bb)), t.__param(3, (0,
p.v)(e.D7)), t.__param(4, (0,
p.v)(h.Vz))],

// Detected exports: zDa
