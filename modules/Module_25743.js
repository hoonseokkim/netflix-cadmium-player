/**
 * Netflix Cadmium Playercore - Module 25743
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 25743
// Parameters: t (module), b (exports), a (require)


var p, c, g, f, e, h;
function d(k) {
    return f.lj.call(this, k, c.ea.xYb) || this;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.xIa = void 0;
t = a(22970);
p = a(22674);
c = a(36129);
g = a(19114);
f = a(51658);
e = a(83998);
h = a(34231);
Ia(d, f.lj);
d.prototype.ef = function(k) {
    var l;
    l = this;
    return this.send(k, {
        url: "/" + g.oj.OOa,
        name: g.oj.OOa,
        Cm: g.oj.OOa,
        Sn: 1,
        yUc: {
            "Content-Type": "application/json",
            "content-encoding": "msl_v1"
        }
    }, {
        provisionRequest: '{"ver":1,"scheme":"A128CBC-HS256","type":"SOCKETROUTER","keyx":{"scheme":"CLEAR"}}'
    }, void 0, h.ZC.KX).then(function(m) {
        return m.result;
    }).catch(function(m) {
        throw l.Ew(m);
    });
}
;
a = d;
b.xIa = a;
b.xIa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(e.io))], a);


// Detected exports: xIa