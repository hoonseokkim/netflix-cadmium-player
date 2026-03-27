/**
 * Netflix Cadmium Playercore - Module 84379
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 84379
// Parameters: t (module), b (exports), a (require)


var d, p, c, g, f;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
p = a(75589);
c = a(49420);
g = a(70428);
t = a(72905);
f = a(41192);
a = (function(e) {
    function h() {
        return null !== e && e.apply(this, arguments) || this;
    }
    d.__extends(h, e);
    h.prototype.parse = function() {
        this.oi();
        this.ZR = this.N.dc();
        return !0;
    }
    ;
    h.prototype.OH = function(k) {
        var l;
        l = Object.keys(this.Se);
        l.length && (l = l[0],
        this.Se[l].length && (l = this.Se[l][0],
        l instanceof g.default ? this.Ha = new c.I(l.mS,l.samplerate) : l instanceof f.default && (l = l.Se[p.QHa]) && l.length && (l = l[0].Uc,
        1E3 !== l.pw && 1001 !== l.pw || 0 !== l.Zy % 1E3 ? this.N.console.warn("Unexpected frame rate in NetflixFrameRateBox: " + l.Zy + "/" + l.pw) : this.Ha = new c.I(l.pw,l.Zy)),
        k && this.Ha && (k.Ha = this.Ha)));
        return !0;
    }
    ;
    h.prototype.XPb = function(k) {
        void 0 !== this.Se[k] && 0 !== this.Se[k].length && (this.Ec.fo(this.ZR - 1, this.byteOffset + 12),
        k = this.Se[k][0],
        this.xr(k.byteLength, k.byteOffset));
    }
    ;
    h.Ae = "stsd";
    h.Fd = !0;
    return h;
}
)(t.Kf);
b["default"] = a;
