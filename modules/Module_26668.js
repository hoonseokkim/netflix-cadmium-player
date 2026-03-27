/**
 * Netflix Cadmium Playercore - Module 26668
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 */

// Webpack module 26668
// Parameters: t (module), b (exports), N/A (require)


function a(d) {
    this.log = d.rR("AseUtilsImpl");
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.y$a = void 0;
a.prototype.ptc = function(d, p) {
    var c, g, f;
    !1;
    c = p.slice(0).sort(function(e, h) {
        var k, l;
        return (null !== (k = e.Gc) && void 0 !== k ? k : 0) - (null !== (l = h.Gc) && void 0 !== l ? l : 0);
    }).sort(function(e, h) {
        var k, l, m;
        k = e.profile === d.profile ? 0 : 1;
        l = h.profile === d.profile ? 0 : 1;
        m = k - l;
        if (0 !== k && 0 !== l || 0 === m)
            k = m;
        else
            return m;
        0 === k && (k = (e.language === d.language || "zxx" === e.language ? 0 : 1) - (h.language === d.language || "zxx" === h.language ? 0 : 1));
        0 === k && (k = (e.jj === d.jj ? 0 : 1) - (h.jj === d.jj ? 0 : 1));
        return k;
    });
    g = 0;
    f = Fa(c).next().value;
    f && p.some(function(e, h) {
        if (e === f)
            return (g = h,
            !0);
    });
    !1;
    return g;
}
;
b.y$a = a;
