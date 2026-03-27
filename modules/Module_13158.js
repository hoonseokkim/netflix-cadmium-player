/**
 * Netflix Cadmium Playercore - Module 13158
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 13158
// Parameters: t (module), b (exports), a (require)


var p, c, g, f, e, h;
function d(k) {
    return f.lj.call(this, k, c.ea.jfb) || this;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.vIa = void 0;
t = a(22970);
p = a(22674);
c = a(36129);
g = a(19114);
f = a(51658);
e = a(83998);
h = a(71977);
Ia(d, f.lj);
d.prototype.DS = function(k) {
    var l;
    l = "ldl" === k.SZa ? "prefetch/license" : "license";
    k = (0,
    h.Jzc)(k.rf);
    return "" + l + k;
}
;
d.prototype.ef = function(k, l) {
    var m, n;
    m = this;
    n = {
        url: k.links.A0(l.SZa).href,
        name: g.oj.Vu,
        Cm: this.DS(l),
        Sn: "ldl" === l.SZa ? 0 : 3
    };
    return this.send(k, n, l.inputs, "drmSessionId").then(function(q) {
        q = q.result;
        m.Rgc(q);
        return q;
    }).catch(function(q) {
        throw m.Ew(q);
    });
}
;
d.prototype.Rgc = function(k) {
    k.forEach(function(l) {
        if (!l.licenseResponseBase64)
            throw Error("Received empty licenseResponseBase64");
    });
}
;
a = d;
b.vIa = a;
b.vIa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(e.io))], a);


// Detected exports: vIa