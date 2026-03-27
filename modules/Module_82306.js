/**
 * Netflix Cadmium Playercore - Module 82306
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 82306
// Parameters: t (module), b (exports), a (require)


var p, c, g, f, e;
function d(h) {
    return f.lj.call(this, h, c.ea.V0b) || this;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.GIa = void 0;
t = a(22970);
p = a(22674);
c = a(36129);
g = a(19114);
f = a(51658);
a = a(83998);
Ia(d, f.lj);
d.prototype.ef = function(h, k) {
    var l, m, n;
    l = this;
    n = h.links;
    n = {
        url: null !== (m = null === n || void 0 === n ? void 0 : n.A0("generateScreenshots").href) && void 0 !== m ? m : "/generateScreenshots",
        name: g.oj.S,
        Cm: "generateScreenshots",
        Sn: 2
    };
    return this.send(h, n, k).then(function(q) {
        return q.result;
    }).catch(function(q) {
        throw l.Ew(q);
    });
}
;
e = d;
b.GIa = e;
b.GIa = e = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.io))], e);


// Detected exports: GIa