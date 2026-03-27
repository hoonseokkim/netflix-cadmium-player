/**
 * Netflix Cadmium Playercore - Module 18319
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 18319
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
p = a(93334);
t = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.parse = function(f) {
        var e, h, k;
        this.Hic = this.N.Hd();
        this.TYb = this.N.Hd();
        this.N.Hd();
        this.N.Hd();
        this.XFc = this.N.Hd() & 3;
        this.qAa = this.tNa(this.N.Hd() & 31);
        this.iOb = this.tNa(this.N.Hd());
        this.p3 = this.qAa.length ? this.qAa[0][1] : this.TYb;
        this.vpb = this.N.offset;
        this.startOffset + this.length < this.N.offset && (100 === this.p3 || 110 === this.p3 || 122 === this.p3 || 144 === this.p3) && (this.N.Hd(),
        this.N.Hd(),
        this.tNa(this.N.Hd()));
        k = this.startOffset + this.length - this.vpb;
        0 < k && this.xr(k, this.vpb);
        if (null === f || void 0 === f ? 0 : f.yh) {
            k = void 0;
            for (var l = this.parent; l; ) {
                k = null === (h = null === (e = l.wn("tkhd")) || void 0 === e ? void 0 : e.Uc) || void 0 === h ? void 0 : h.trackId;
                if (void 0 !== k)
                    break;
                l = l.parent;
            }
            (0,
            p.assert)(void 0 !== k, "trackId is undefined");
            f.yh[k].ncd = {
                qAa: this.qAa,
                iOb: this.iOb,
                p3: this.p3
            };
        }
        return !0;
    }
    ;
    g.prototype.tNa = function(f) {
        var k;
        for (var e = [], h = 0; h < f; ++h) {
            k = this.N.sg();
            e.push(this.N.KU(k));
        }
        return e;
    }
    ;
    g.Ae = "avcC";
    g.Fd = !1;
    return g;
}
)(a(72905).Kf);
b["default"] = t;
