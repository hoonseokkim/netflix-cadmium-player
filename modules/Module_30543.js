/**
 * Netflix Cadmium Playercore - Module 30543
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 30543
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
function d(h) {
    h = f.lj.call(this, h, c.ea.i2b) || this;
    h.M8a = function(k) {
        var l, m;
        if (null === (m = null === (l = null === k || undefined === k ? undefined : k.body) || undefined === l ? undefined : l.result) || undefined === m || !m.nlp)
            throw Error("SocketRouter message not acknowledged");
    }
    ;
    return h;
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
        url: "/" + g.oj.sT,
        name: g.oj.sT,
        Cm: g.oj.sT,
        Sn: 1
    }, k).then(function(m) {
        return m.result;
    }).catch(function(m) {
        throw l.Ew(m);
    });
}
;
e = d;
export const LIa = e;
export const LIa = e = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.io))], e);

// Detected exports: LIa