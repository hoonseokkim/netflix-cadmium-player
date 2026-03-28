/**
 * Netflix Cadmium Playercore - Module 31496
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: prototype
 * Purpose: Subtitles/Captions, Buffer/Segment management, Encryption/Decryption, Logging
 */

// Webpack module 31496
// Parameters: t (module), b (exports), a (require)

var d;
d = a(22699).EventEmitter;
b = function l(c, g, f, e, h, k) {
    if (!(this instanceof l))
        return new l(c,g,f,e,h,k);
    d.call(this);
    this.lD = c;
    this.F8 = g;
    this.Xma = f;
    this.P8b = e;
    this.Yl = {};
    this.Ym = {};
    this.ya = h || console;
    this.Vm = false;
    this.KMa = k.Da;
    this.b$b = k && k.Pfa || 0;
    this.t$b = k && k.a_c || 0;
}
;
export const prototype = Object.create(d.prototype);
b.prototype.stop = function() {
    clearTimeout(this.wf);
    this.wf = undefined;
    this.Tya();
}
;
b.prototype.Tya = function() {
    var c;
    c = this;
    Object.keys(c.Yl).forEach(function(g) {
        c.emit("removesubtitle", c.Yl[g]);
    });
    c.Yl = {};
    c.Ym = {};
}
;
b.prototype.pause = function() {
    this.Vm || (clearTimeout(this.wf),
    this.wf = undefined);
}
;
b.prototype.LJ = function(c) {
    var g, f, e;
    g = this;
    f = g.lD();
    e = g.F8(f);
    null !== e && g.Vm && (g.Vm = false,
    this.ya.debug("bufferingComplete"),
    g.emit("bufferingComplete"),
    this.P8b()) ? this.ya.debug("bufferingComplete while paused, no longer scheduling internal pts events") : (c = "number" === typeof c ? c : 0,
    Object.keys(g.Yl).forEach(function(h) {
        h = g.Yl[h];
        h.displayTime - g.b$b <= f && f < h.displayTime + h.duration || (delete g.Yl[h.id],
        g.emit("removesubtitle", h));
    }),
    Object.keys(g.Ym).forEach(function(h) {
        h = g.Ym[h];
        f >= h.displayTime + h.duration && delete g.Ym[h.id];
    }),
    null !== e && 0 < e.length ? (c = e.length,
    g.ya.debug("found " + c + " entries for pts " + f),
    e.forEach(function(h) {
        h.displayTime - g.t$b <= f && f < h.displayTime + h.duration && !g.Yl[h.id] && (g.emit("showsubtitle", h),
        g.Yl[h.id] = h,
        delete g.Ym[h.id]);
    }),
    c = e[e.length - 1],
    g.Yl[c.id] || g.Ym[c.id] || (g.emit("stagesubtitle", c),
    g.Ym[c.id] = c),
    e = g.w$b(f, e),
    "number" === typeof e && Infinity > e ? g.j9(e) : g.j9(2E4)) : null === e ? (e = 250 * Math.pow(2, c),
    2E3 < e && (e = 2E3),
    g.ya.warn("checking buffer again in " + e + "ms"),
    g.Vm || (g.Vm = true,
    g.emit("underflow")),
    g.j9(e, c + 1)) : g.KMa ? (e = 500,
    g.ya.trace("Live : No entries for " + f + "checking buffer again in " + e + "ms"),
    g.j9(e)) : g.j9(2E4));
}
;
b.prototype.j9 = function(c, g) {
    var f;
    f = this;
    f.ya.debug("Scheduling pts check.", {
        timeout: c,
        HF: f.wf
    });
    clearTimeout(f.wf);
    f.wf = setTimeout(function() {
        f.LJ(g);
    }, c);
}
;
b.prototype.w$b = function(c, g) {
    g = g.reduce(this.s9b.bind(this, c), Infinity);
    return Infinity > g ? this.Xma(g, c) : g;
}
;
b.prototype.s9b = function(c, g, f) {
    var e;
    e = f.displayTime;
    f = f.displayTime + f.duration;
    this.ya.debug("next events: start", e, "end", f, "now", c);
    return e < g && c < e ? e : f < g && c < f ? f : g;
}
;
t.exports = b;

// Detected exports: prototype
