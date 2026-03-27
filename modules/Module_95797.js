/**
 * Netflix Cadmium Playercore - Module 95797
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 95797
// Parameters: t (module), b (exports), a (require)


var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
p = a(26388);
c = a(49420);
t = (function(g) {
    function f() {
        return null !== g && g.apply(this, arguments) || this;
    }
    d.__extends(f, g);
    f.prototype.OH = function(e) {
        var h;
        if (e && e.Ha && !e.CNc && e.mediaType === p.l.V) {
            h = this.Nt("mdia");
            h && (h = h.Nt("mdhd")) && h.O !== e.Ha.O && (e.Ha = new c.I(e.Ha).Rc(h.O));
        }
        return !0;
    }
    ;
    f.Ae = "trak";
    f.Fd = !0;
    return f;
}
)(a(72905).Kf);
b["default"] = t;
