/**
 * Netflix Cadmium Playercore - Module 3992
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 32699, 72577, 78192, 92435
 * Purpose: Subtitles/Captions, Buffer/Segment management, Logging, Event handling
 */

// import dep_32699 from './Module_32699.js';
// import dep_72577 from './Module_72577.js';
// import dep_78192 from './Module_78192.js';
// import dep_92435 from './Module_92435.js';

// Webpack module 3992
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
class d {
    constructor(k) {
    p.call(this);
    this.Sg = k.url;
    this.AQ = k.request;
    this.yQ = k.yd || 0;
    this.ya = k.va;
    this.rl = this.Wx = null;
    k.KB ? this.Wx = k.KB : (this.nd = k.offset,
    this.KK = k.size);
    this.Aq;
    this.jNa = k;
}
    start() {
    this.Wx ? (this.ya.warn("midx was prefectched and provided"),
    this.zob(this.Wx)) : this.b8b(this.nd, this.KK, this.X9b.bind(this));
}
    close() {}
    Nsa(k, l) {
    return this.Aq && this.Aq.HWa(k, l);
}
    Zq(k, l) {
    return (k = this.Nsa(k, l)) ? k.length : k;
}
    oO(k, l) {
    this.ya.debug("setStreamStartPosition: buffering subtitles at pts " + k);
    this.yQ = k;
    this.Aq ? this.Aq.oO(k, l) : l && l();
}
    ZL(k) {
    var l, m, n;
    if (!this.Aq || k > e.Gwc(this.Wx))
        return [];
    this.Aq && this.Aq.MSa(k);
    l = this.Lv.Po;
    m = this.Lv.index;
    n = [];
    m = e.gd(m) && this.rl[m + 1];
    if (!(m && m.entries.length || l && !(k > l.endTime)))
        return [];
    l && l.images.length && (n = this.Gob(l, k, []));
    2 > n.length && m && m.images.length && (l = this.Gob(m, k, n),
    n.push.apply(n, l));
    return this.Aq.Y5a(k) ? null : e.fvb(n);
}
    Pl(k, l) {
    this.Aq && this.Aq.Pl(k, l);
}
    Wn(k, l) {
    this.Aq && this.Aq.Wn(k, l);
}
    b8b(k, l, m) {
    this.ya.debug("downloading midx...");
    this.Lob(k, l, "binary", m);
}
    c8b(k, l, m) {
    this.ya.debug("downloading sidx...");
    this.Lob(k, l, undefined, m);
}
    Lob(k, l, m, n) {
    this.AQ({
        url: this.Sg,
        offset: k,
        size: l,
        responseType: m
    }, n);
}
    X9b(k, l) {
    if (k)
        this.emit(h.Qt, e.Tba(k, "midxdownloaderror"));
    else
        try {
            this.Wx = new c(l);
            this.zob(this.Wx);
        } catch (m) {
            this.emit(h.Qt, e.Tba(m, "midxparseerror"));
        }
}
    zob(k) {
    var l;
    l = k.entries.reduce(function(m, n) {
        return m + n.size;
    }, 0);
    l ? (this.emit(h.M2b, k),
    this.c8b(k.startOffset, l, this.$9b.bind(this, k))) : this.emit(h.Qt, e.Tba({}, "nosidxfoundinmidx"));
}
    Gob(k, l, m) {
    var x;
    for (var n = k.entries, q = 0, r = n.length, u = [], v, w = this.Wx; q < r; ) {
        v = n[q];
        if (v.displayTime <= l)
            v.displayTime + v.duration >= l && u.push(e.KRa(v, k.images[q].data, w));
        else {
            x = u.length && u[u.length - 1] || m.length && m[m.length - 1];
            if (x && x.displayTime > l && x.displayTime !== v.displayTime)
                break;
            x.OS !== v.OS && u.push(e.KRa(v, k.images[q].data, w));
        }
        q++;
    }
    return u;
}
}
p = a(22699).EventEmitter;
c = a(72577);
g = a(92435);
f = a(78192);
e = a(32699);
h = d.events = {
    M2b: "midxready",
    e6b: "sidxready",
    D5b: "ready",
    Qt: "error"
};
d.prototype = Object.create(p.prototype);
d.prototype.constructor = d;
Object.defineProperties(d.prototype, {
    Lv: {
        get: function() {
            return this.Aq && this.Aq.WRa;
        }
    }
});
d.prototype.$9b = function(k, l, m) {
    var n, q, r, u;
    n = this;
    if (l)
        n.emit(h.Qt, e.Tba(l, "sidxdownloaderror"));
    else {
        q = 0;
        r = 0;
        n.rl = [];
        try {
            u = 0;
            k.entries.forEach(function(v) {
                var w;
                w = new g(m,q,k.fYa,n.ya,r,r + v.duration,u);
                n.rl.push(w);
                v.YYc = w;
                r = w.fx;
                q += v.size;
                u++;
            });
        } catch (v) {
            n.emit(h.Qt, e.Tba(v, "sidxparseerror"));
            return;
        }
        n.emit(h.e6b, n.rl);
        this.Aq = new f(n.jNa,k,n.rl);
        l = n.yQ;
        n.jNa && n.jNa.Mza || (l = Math.max(n.yQ - 1E4, 0));
        this.Aq.MSa(l, function(v) {
            v && n.ya.error("initial sidx download failed");
            n.emit(h.D5b);
        });
    }
}
;
t.exports = d;

