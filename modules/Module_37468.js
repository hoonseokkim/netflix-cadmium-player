/**
 * Netflix Cadmium Playercore - Module 37468
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 37468
// Parameters: t (module), b (exports), a (require)


var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.scb = void 0;
d = a(50468);
t = a(85254);
p = a(75539);
c = a(24940);
a = (function() {
    function g(f, e, h) {
        this.YN = c.Rla.Oqa;
        d.Xo.Gb(this, f, e, h);
    }
    g.sR = function(f, e, h, k, l) {
        h = new g(f,h,k);
        h.ji = k.ji;
        h.active = !l;
        h.complete = l;
        h.aborted = !1;
        h.bytesReceived = 0;
        h.location = f.location || "";
        h.Ee = !1;
        h.Zg = void 0;
        h.eE = void 0;
        h.dh = void 0;
        h.status = 0;
        h.state = p.Ah.nq;
        f = e.data;
        h.Gya(f.buffer.slice(f.byteOffset, f.byteLength), !0);
        return h;
    }
    ;
    g.prototype.abort = function() {
        return !1;
    }
    ;
    g.prototype.Ey = function() {
        return this.complete;
    }
    ;
    g.prototype.Ue = function() {}
    ;
    g.prototype.pg = function() {
        return this.Oa;
    }
    ;
    g.prototype.yWa = function() {
        return this.Oa;
    }
    ;
    g.prototype.G5a = function(f) {
        this.listener = f;
    }
    ;
    g.prototype.uub = function() {
        this.listener = void 0;
    }
    ;
    g.prototype.Uta = function() {
        return this.Ey();
    }
    ;
    return g;
}
)();
b.scb = a;
(0,
t.Ol)(d.Xo, a, !1);


// Detected exports: scb