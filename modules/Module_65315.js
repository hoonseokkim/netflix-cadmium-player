/**
 * Netflix Cadmium Playercore - Module 65315
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: EDa
 */

// Webpack module 65315
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n;
function d(q, r, u, v) {
    this.dm = q;
    this.Pd = r;
    this.py = u;
    this.config = v;
}
export const EDa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(36129);  // import from Module_36129
g = a(6405);  // import from Module_06405
f = a(2248);  // import from Module_02248
e = a(61731);  // import from Module_61731
h = a(59818);  // import from Module_59818
k = a(23563);  // import from Module_23563
l = a(4203);  // import from Module_04203
m = a(31149);  // import from Module_31149
n = a(82100);  // import from Module_82100
d.prototype.xpa = function() {
    return false;
}
;
d.prototype.tPa = function() {
    return true;
}
;
d.prototype.dQa = function() {
    return true;
}
;
d.prototype.DVa = function() {
    return n.ZF;
}
;
d.prototype.dsa = function() {
    return this.py.n5a ? this.Pd.decode(this.py.n5a) : this.Pd.decode(n.Fnb);
}
;
d.prototype.xWa = function() {
    return [n.bK, n.$la, n.Zla];
}
;
d.prototype.oYa = function() {
    Promise.reject(new m.we(c.ea.CEa));
}
;
d.prototype.nRa = function(q) {
    var r;
    return {
        type: q.type,
        sessionId: null === (r = q.target) || undefined === r ? undefined : r.sessionId,
        ET: [new Uint8Array(q.message)],
        messageType: q.messageType
    };
}
;
d.prototype.xL = function(q) {
    var r, u, v;
    r = new e.wk(c.ea.nla);
    u = null === q || undefined === q ? undefined : q.code;
    null != u && undefined !== u ? (u = parseInt(u, 10),
    r.subCode = 1 <= u && 9 >= u ? c.Y.VW + u : c.Y.VW) : r.subCode = q instanceof h.Ox ? c.Y.l6 : c.Y.Sr;
    try {
        v = q.message.match(/\((\d*)\)/)[1];
        r.extCode = this.dm.Ora(v, 4);
    } catch (w) {}
    r.zaa(q);
    return r;
}
;
d.prototype.x0 = function() {}
;
a = d;
export const EDa = a;
b.EDa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.dP)), t.__param(1, (0,
p.v)(f.Km)), t.__param(2, (0,
p.v)(k.SC)), t.__param(3, (0,
p.v)(l.Pc))],

// Detected exports: EDa
