/**
 * Netflix Cadmium Playercore - Module 15913
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 15913
// Parameters: t (module), b (exports), a (require)


var f;
function d(e, h, k) {
    this.r_ = !1 === e;
    this.xu = e || .01;
    this.fGa = void 0 === h ? 25 : h;
    this.Fab = void 0 === k ? 1.1 : k;
    this.nn = new f(p);
    this.reset();
}
function p(e, h) {
    return e.Gf > h.Gf ? 1 : e.Gf < h.Gf ? -1 : 0;
}
function c(e, h) {
    return e.OE - h.OE;
}
function g(e) {
    this.config = e || ({});
    this.mode = this.config.mode || "auto";
    d.call(this, "cont" === this.mode ? e.xu : !1);
    this.zoc = this.config.ratio || .9;
    this.Aoc = this.config.nmd || 1E3;
    this.ewa = 0;
}
f = a(35558).C5b;
d.prototype.reset = function() {
    this.nn.clear();
    this.KZa = this.n = 0;
}
;
d.prototype.size = function() {
    return this.nn.size;
}
;
d.prototype.Ij = function(e) {
    var h;
    h = [];
    e ? (this.Lma(!0),
    this.nn.Iaa(function(k) {
        h.push(k);
    })) : this.nn.Iaa(function(k) {
        h.push({
            Gf: k.Gf,
            n: k.n
        });
    });
    return h;
}
;
d.prototype.summary = function() {
    return [(this.r_ ? "exact " : "approximating ") + this.n + " samples using " + this.size() + " centroids", "min = " + this.kk(0), "Q1  = " + this.kk(.25), "Q2  = " + this.kk(.5), "Q3  = " + this.kk(.75), "max = " + this.kk(1)].join("\n");
}
;
d.prototype.push = function(e, h) {
    h = h || 1;
    e = Array.isArray(e) ? e : [e];
    for (var k = 0; k < e.length; k++)
        this.uob(e[k], h);
}
;
d.prototype.x3a = function(e) {
    e = Array.isArray(e) ? e : [e];
    for (var h = 0; h < e.length; h++)
        this.uob(e[h].Gf, e[h].n);
}
;
d.prototype.Lma = function(e) {
    var h;
    if (!(this.n === this.KZa || !e && this.Fab && this.Fab > this.n / this.KZa)) {
        h = 0;
        this.nn.Iaa(function(k) {
            k.OE = h + k.n / 2;
            h = k.a_ = h + k.n;
        });
        this.n = this.KZa = h;
    }
}
;
d.prototype.Ctc = function(e) {
    var h, k;
    if (0 === this.size())
        return null;
    h = this.nn.lowerBound({
        Gf: e
    });
    k = null === h.data() ? h.jz() : h.data();
    return k.Gf === e || this.r_ ? k : (h = h.jz()) && Math.abs(h.Gf - e) < Math.abs(k.Gf - e) ? h : k;
}
;
d.prototype.oY = function(e, h, k) {
    this.nn.Qu({
        Gf: e,
        n: h,
        a_: k
    });
    this.n += h;
}
;
d.prototype.Cma = function(e, h, k) {
    h !== e.Gf && (e.Gf += k * (h - e.Gf) / (e.n + k));
    e.a_ += k;
    e.OE += k / 2;
    e.n += k;
    this.n += k;
}
;
d.prototype.uob = function(e, h) {
    var k, l, m;
    k = this.nn.min();
    l = this.nn.max();
    m = this.Ctc(e);
    m && m.Gf === e ? this.Cma(m, e, h) : m === k ? this.oY(e, h, 0) : m === l ? this.oY(e, h, this.n) : this.r_ ? this.oY(e, h, m.a_) : (k = m.OE / this.n,
    Math.floor(4 * this.n * this.xu * k * (1 - k)) - m.n >= h ? this.Cma(m, e, h) : this.oY(e, h, m.a_));
    this.Lma(!1);
    !this.r_ && this.fGa && this.size() > this.fGa / this.xu && this.op();
}
;
d.prototype.oec = function(e) {
    var h, k;
    this.nn.hA = c;
    h = this.nn.upperBound({
        OE: e
    });
    this.nn.hA = p;
    k = h.jz();
    e = k && k.OE === e ? k : h.next();
    return [k, e];
}
;
d.prototype.kk = function(e) {
    var h;
    h = (Array.isArray(e) ? e : [e]).map(this.S9b, this);
    return Array.isArray(e) ? h : h[0];
}
;
d.prototype.S9b = function(e) {
    var h, k;
    if (0 !== this.size()) {
        this.Lma(!0);
        this.nn.min();
        this.nn.max();
        e *= this.n;
        h = this.oec(e);
        k = h[0];
        h = h[1];
        return h === k || null === k || null === h ? (k || h).Gf : this.r_ ? e <= k.a_ ? k.Gf : h.Gf : k.Gf + (e - k.OE) * (h.Gf - k.Gf) / (h.OE - k.OE);
    }
}
;
d.prototype.op = function() {
    var e;
    if (!this.$ub) {
        e = this.Ij();
        this.reset();
        for (this.$ub = !0; 0 < e.length; )
            this.x3a(e.splice(Math.floor(Math.random() * e.length), 1)[0]);
        this.Lma(!0);
        this.$ub = !1;
    }
}
;
g.prototype = Object.create(d.prototype);
g.prototype.constructor = g;
g.prototype.push = function(e) {
    d.prototype.push.call(this, e);
    this.lhc();
}
;
g.prototype.oY = function(e, h, k) {
    this.ewa += 1;
    d.prototype.oY.call(this, e, h, k);
}
;
g.prototype.Cma = function(e, h, k) {
    1 === e.n && --this.ewa;
    d.prototype.Cma.call(this, e, h, k);
}
;
g.prototype.lhc = function() {
    !("auto" !== this.mode || this.size() < this.Aoc) && this.ewa / this.size() > this.zoc && (this.mode = "cont",
    this.r_ = !1,
    this.xu = this.config.xu || .01,
    this.op());
}
;
t.exports = {
    TDigest: d,
    Digest: g
};
