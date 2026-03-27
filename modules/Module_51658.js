/**
 * Netflix Cadmium Playercore - Module 51658
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 51658
// Parameters: t (module), b (exports), a (require)


var p, c, g, f;
function d(e, h) {
    this.context = e;
    this.errorCode = h;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.lj = void 0;
t = a(22970);
p = a(22674);
c = a(71977);
g = a(31149);
f = a(34231);
d.prototype.send = function(e, h, k, l, m) {
    var n;
    n = this;
    m = void 0 === m ? f.ZC.KX : m;
    return this.hwc(e, h, k, m, l).then(function(q) {
        return n.context.Koc.send(q.context, q.request);
    });
}
;
d.prototype.hwc = function(e, h, k, l, m) {
    var n, q;
    try {
        n = this.context.xUc.create(this.context.lB.wH(), h.url, k, m, l);
        q = this.Kec(h, e, l);
        return Promise.resolve({
            context: q,
            request: n
        });
    } catch (r) {
        return Promise.reject(r);
    }
}
;
d.prototype.Kec = function(e, h, k) {
    var l;
    return {
        Je: this.context.Je,
        so: e.name,
        url: this.context.B3c((0,
        c.Pec)(this.context.Ek, this.context.hj, e.name, k)),
        Sn: e.Sn,
        timeout: this.context.hj.timeout,
        headers: Object.assign(Object.assign({}, (0,
        c.Oec)(this.context.Ek, this.context.hj, this.context.DR, e.name, k)), null !== (l = e.yUc) && void 0 !== l ? l : {}),
        Cm: e.Cm,
        log: h.log,
        BPa: h.BPa,
        Vv: h.Vv,
        J: h.J,
        requestId: this.context.lB.ulc(),
        M8a: this.M8a
    };
}
;
d.prototype.Ew = function(e) {
    return e instanceof g.we ? e : (0,
    c.Ew)(this.errorCode, e);
}
;
a = d;
b.lj = a;
b.lj = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.uv)()), t.__param(1, (0,
p.uv)())], a);


// Detected exports: lj