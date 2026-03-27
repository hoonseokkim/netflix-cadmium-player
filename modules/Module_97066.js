/**
 * Netflix Cadmium Playercore - Module 97066
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 97066
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
    g.prototype.OH = function() {
        var f;
        f = this.wn("esds");
        if (f = f && f.E0b.wn(5))
            ((0,
            p.assert)(this.samplerate),
            this.mS = f.mS * this.samplerate / f.xza);
        return !0;
    }
    ;
    g.Ae = "mp4a";
    g.Fd = !0;
    return g;
}
)(a(70428).default);
b["default"] = t;
