/**
 * Netflix Cadmium Playercore - Module 20674
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Dependency injection / IoC
 * Exports: IEa
 */

// Webpack module 20674
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l;
function d(m, n) {
    this.dm = m;
    this.Pd = n;
}
export const IEa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(36129);  // import from Module_36129
g = a(6405);  // import from Module_06405
f = a(2248);  // import from Module_02248
e = a(61731);  // import from Module_61731
h = a(59818);  // import from Module_59818
k = a(31149);  // import from Module_31149
l = a(82100);  // import from Module_82100
d.prototype.xpa = function() {
    return true;
}
;
d.prototype.tPa = function() {
    return false;
}
;
d.prototype.dQa = function() {
    return false;
}
;
d.prototype.DVa = function() {
    return l.ZF;
}
;
d.prototype.dsa = function() {}
;
d.prototype.xWa = function() {
    return [];
}
;
d.prototype.oYa = function() {
    Promise.reject(new k.we(c.ea.CEa));
}
;
d.prototype.nRa = function(m) {
    var n;
    n = new Uint8Array(m.message);
    n = this.xsc(n, "PlayReadyKeyMessage", "Challenge");
    n = this.Pd.decode(n);
    return {
        type: m.type,
        sessionId: m.target.sessionId,
        ET: [n],
        messageType: m.messageType
    };
}
;
d.prototype.xL = function(m) {
    var n, q, r;
    n = new e.wk(c.ea.nla);
    q = m.code;
    null != q && undefined !== q ? (q = parseInt(q, 10),
    n.subCode = 1 <= q && 9 >= q ? c.Y.VW + q : c.Y.VW) : n.subCode = m instanceof h.Ox ? c.Y.l6 : c.Y.Sr;
    try {
        r = (/\((\d+)\)/).exec(m.message);
        n.extCode = this.dm.Ora(Number(r && r[1]), 4);
    } catch (u) {}
    n.zaa(m);
    return n;
}
;
d.prototype.xsc = function(m, n) {
    var r, u, v;
    for (var q = 1; q < arguments.length; ++q)
        ;
    for (q = 1; q < arguments.length; q++)
        ;
    q = "";
    u = m.length;
    for (r = 0; r < u; r++) {
        v = m[r];
        0 < v && (q += String.fromCharCode(v));
    }
    u = "\\s*(.*)\\s*";
    for (r = arguments.length - 1; 0 < r; r--) {
        v = arguments[r];
        if (0 > q.search(v))
            return "";
        v = "(?:[^:].*:|)" + v;
        u = "[\\s\\S]*<" + v + "[^>]*>" + u + "</" + v + ">[\\s\\S]*";
    }
    return (q = q.match(new RegExp(u))) ? q[1] : "";
}
;
d.prototype.x0 = function() {}
;
a = d;
export const IEa = a;
b.IEa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.dP)), t.__param(1, (0,
p.v)(f.Km))],

// Detected exports: IEa
