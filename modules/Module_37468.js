/**
 * Netflix Cadmium Playercore - Module 37468
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 37468
// Parameters: t (module), b (exports), a (require)

var d, p, c;

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
        h.aborted = false;
        h.bytesReceived = 0;
        h.location = f.location || "";
        h.Ee = false;
        h.Zg = undefined;
        h.eE = undefined;
        h.dh = undefined;
        h.status = 0;
        h.state = p.Ah.nq;
        f = e.data;
        h.Gya(f.buffer.slice(f.byteOffset, f.byteLength), true);
        return h;
    }
    ;
    g.prototype.abort = function() {
        return false;
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
        this.listener = undefined;
    }
    ;
    g.prototype.Uta = function() {
        return this.Ey();
    }
    ;
    return g;
}
)();
export const scb = a;
(0,
t.Ol)(d.Xo, a, false);

// Detected exports: scb