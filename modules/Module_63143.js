/**
 * Netflix Cadmium Playercore - Module 63143
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: eDa
 */

// Webpack module 63143
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k, l, m, n) {
    this.Poa = l;
    this.oc = m;
    this.kec = n;
    this.va = k.zb("Bookmark");
}
export const eDa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(72516);  // import from Module_72516
g = a(81364);  // import from Module_81364
f = a(87386);  // import from Module_87386
e = a(42207);  // import from Module_42207
h = a(5021);  // import from Module_05021
d.prototype.sbc = function(k) {
    var l, m;
    l = k.qb.playbackState && k.qb.playbackState.currentTime;
    m = this.Rvc(k.R);
    l = this.oc.p_(l) ? (0,
    h.pc)(l) : m;
    m = 0;
    this.oc.Mi(l) ? (this.va.info("Overriding bookmark", {
        From: k.LF.na(h.Ba),
        To: l.na(h.Ba)
    }),
    l = Object.assign({}, k, {
        LF: l
    })) : l = k;
    return k.Hc.Da && (m = k.Hc.NVa(k.LF.na(h.Ba)),
    l = Object.assign({}, l, {
        LF: (0,
        h.pc)(m.Hq),
        DN: (0,
        h.pc)(m.DN)
    }),
    m = m.bxb,
    !k.Hc.ZS()) ? (this.va.trace("Do not apply bookmark ignore logic for ongoing LIVE events"),
    l.LF) : l.LF.MYa() ? (this.va.trace("Ignoring bookmark because it's negative"),
    (0,
    h.pc)(m)) : this.fCc(l) ? (this.va.trace("Ignoring bookmark because it's too close to beginning"),
    (0,
    h.pc)(m)) : this.eCc(l) ? (this.va.trace("Ignoring bookmark because it's too close to end"),
    (0,
    h.pc)(m)) : this.dCc(l) ? (this.va.trace("Ignoring bookmark because it's too close to the end to start decoding"),
    (0,
    h.pc)(m)) : l.LF;
}
;
d.prototype.fCc = function(k) {
    return 0 > k.LF.xl(this.AVa(k));
}
;
d.prototype.AVa = function(k) {
    return this.Xsb(this.Poa.AVa(), k.DN);
}
;
d.prototype.eCc = function(k) {
    return 0 < k.LF.xl(this.BVa(k));
}
;
d.prototype.BVa = function(k) {
    var l;
    l = k.qb.bh ? this.Poa.Xwc() : this.Poa.BVa();
    return k.DN.da(this.Xsb(l, k.DN));
}
;
d.prototype.dCc = function(k) {
    return 0 < k.LF.xl(this.xwc(k));
}
;
d.prototype.xwc = function(k) {
    return k.DN.da((0,
    h.pc)(k.wN));
}
;
d.prototype.Rvc = function(k) {
    var l;
    k = this.Poa.ZUa()[k];
    l = -1;
    this.oc.du(k) ? l = parseInt(k) : this.oc.mp(k) && (l = k);
    if (this.oc.O9(l))
        return (0,
        h.pc)(l);
}
;
d.prototype.Xsb = function(k, l) {
    return this.kec.L_c(k, l);
}
;
a = d;
export const eDa = a;
b.eDa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(f.Bb)), t.__param(1, (0,
p.v)(c.bab)), t.__param(2, (0,
p.v)(e.Zi)), t.__param(3, (0,
p.v)(g.aab))],

// Detected exports: eDa
