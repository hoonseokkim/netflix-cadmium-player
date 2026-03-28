/**
 * Netflix Cadmium Playercore - Module 28419
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: lDa
 */

// Webpack module 28419
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m;
function d(n, q, r, u, v, w) {
    this.config = n;
    this.lN = r;
    this.profile = u;
    this.N7a = v;
    this.A$ = w;
    this.BAb = true;
    this.log = q.zb("CDMAttestedDescriptor");
    this.BBb(l.ZC.KX);
}
export const lDa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(4203);  // import from Module_04203
g = a(87386);  // import from Module_87386
f = a(97996);  // import from Module_97996
e = a(70865);  // import from Module_70865
h = a(71501);  // import from Module_71501
k = a(2492);  // import from Module_02492
l = a(34231);  // import from Module_34231
m = a(24735);  // import from Module_24735
d.prototype.BBb = function(n) {
    var q;
    q = this;
    return this.N7a.rV(n) ? this.config().tqc ? this.zBb().then(function(r) {
        return r ? (false,
        Promise.resolve(undefined)) : q.rxc();
    }).then(function(r) {
        return Promise.all([Promise.resolve(r), q.zBb()]);
    }).then(function(r) {
        var u;
        r = Fa(r);
        u = r.next().value;
        if (r.next().value)
            false;
        else
            return u;
    }) : this.lN().then(function(r) {
        r.KT.YPb();
    }) : Promise.resolve(undefined);
}
;
d.prototype.zBb = function() {
    var n;
    n = this;
    return this.lN().then(function(q) {
        if (n.BAb)
            (n.BAb = false,
            q.KT.YPb());
        else
            return (q = q.KT.dM(n.profile)) && q.find(function(r) {
                return "cad" === r.name;
            });
    });
}
;
d.prototype.rxc = function() {
    var n;
    n = this;
    this.MHb || (this.MHb = this.A$.zWa(m.Tr.dK).then(function(q) {
        q.Ml.close();
        return q.lQa;
    }).catch(function(q) {
        n.log.error("Failed to generate challenge", q);
    }));
    return this.MHb;
}
;
a = d;
export const lDa = a;
b.lDa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Pc)), t.__param(1, (0,
p.v)(g.Bb)), t.__param(2, (0,
p.v)(f.J7)), t.__param(3, (0,
p.v)(h.SP)), t.__param(4, (0,
p.v)(e.q8)), t.__param(5, (0,
p.v)(k.Hja))],

// Detected exports: lDa
