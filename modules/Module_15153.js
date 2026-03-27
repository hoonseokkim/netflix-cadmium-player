/**
 * Netflix Cadmium Playercore - Module 15153
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 15153
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
function d(h) {
    return f.lj.call(this, h, c.ea.gZb) || this;
}

t = a(22970);
p = a(22674);
c = a(36129);
g = a(19114);
f = a(51658);
a = a(83998);
Ia(d, f.lj);
d.prototype.ef = function(h, k) {
    var l;
    l = this;
    return this.send(h, {
        url: "/" + g.oj.bind,
        name: g.oj.bind,
        Cm: g.oj.bind,
        Sn: 2
    }, k).then(function(m) {
        return m.result;
    }).catch(function(m) {
        throw l.Ew(m);
    });
}
;
e = d;
export const zIa = e;
export const zIa = e = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.io))], e);

// Detected exports: zIa