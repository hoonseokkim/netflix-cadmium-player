/**
 * Netflix Cadmium Playercore - Module 18181
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 * Exports: nLa
 */

// Webpack module 18181
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k, l) {
    this.Hi = k;
    this.config = l;
}
export const nLa = undefined;
t = a(22970);  // import from Module_22970
p = a(85001);  // import from Module_85001
c = a(94025);  // import from Module_94025
g = a(81918);  // import from Module_81918
f = a(22674);  // import from Module_22674
e = a(5021);  // import from Module_05021
a = a(4203);  // import from Module_04203
d.prototype.M_ = function(k) {
    var l;
    k.mia = {};
    if (!k.l1() && k.EJ && 0 < k.EJ.length && (k.DJ = this.dCb(k),
    k.DJ)) {
        l = this.jYc(k);
        l() || (k.bc.addListener(l),
        k.ig.addListener(l));
    }
}
;
d.prototype.jYc = function(k) {
    var m;
    function l() {
        var n, q;
        if (!k.ig.value || k.bc.value === p.Qb.Bh)
            return false;
        n = k.DJ;
        q = n.getState();
        return q === c.dA.LOADING ? false : q !== c.dA.EP && n.retry ? (n = m.Xzc(k)) ? (k.mia.offset = m.Hi.Fc().na(e.Ba),
        k.DJ = n,
        n.download(),
        true) : false : (k.bc.removeListener(l),
        k.ig.removeListener(l),
        false);
    }
    m = this;
    return l;
}
;
d.prototype.Xzc = function(k) {
    var l, m;
    l = this.config();
    m = k.Rp.Iu() < l.Q1c;
    l = (k.ig.value ? k.ig.value.bitrate : 0) > l.P1c;
    return this.izc(k, m && l);
}
;
d.prototype.izc = function(k, l) {
    if (l && (l = this.dCb(k),
    this.nDb(k, l.size)))
        return (k.mia.sQb = "h",
        l);
    l = this.yxc(k);
    if (this.nDb(k, l.size))
        return (k.mia.sQb = "l",
        l);
}
;
d.prototype.nDb = function(k, l) {
    var m, n;
    m = this.config();
    n = Math.min(k.U9(), k.Iia());
    return k.Sdc.rfc(l) * (1 + .01 * m.lbc[2]) < n * m.T1c;
}
;
d.prototype.dCb = function(k) {
    return k.EJ[k.EJ.length - 1];
}
;
d.prototype.yxc = function(k) {
    return k.EJ[0];
}
;
h = d;
export const nLa = h;
b.nLa = h = t.__decorate([(0,
f.aa)(), t.__param(0, (0,
f.v)(g.re)), t.__param(1, (0,
f.v)(a.Pc))],

// Detected exports: nLa
