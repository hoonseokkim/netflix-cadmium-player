/**
 * Netflix Cadmium Playercore - Module 71077
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Configuration
 * Exports: BGa, lhd, ds
 */

// Webpack module 71077
// Parameters: t, b

var d;
function a(p, c) {
    var g;
    g = false;
    400 <= p && 499 >= p && 420 !== p && 452 !== p ? g = true : c && 504 === p && (g = true);
    return g;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const BGa = b.ds = undefined;
export const lhd = a;
(function(p) {
    p[p.LX = 0] = "RETRY";
    p[p.jlb = 1] = "SWITCH_STREAM";
    p[p.oKa = 2] = "SKIP";
    p[p.Scb = 3] = "FORWARD";
    p[p.d8 = 4] = "STOP";
    p[p.UJa = 5] = "REQUEST_SEEK_TO_EDGE";
    p[p.Vla = 6] = "SKIP_OR_FORWARD";
}
)(d || (export const ds = d = {}));
t = (function() {
    function p(c, g) {
        this.L = c;
        this.config = g;
    }
    p.prototype.cz = function(c, g, f) {
        var e, h, k;
        e = c.status;
        h = c.qa;
        c = c.wa;
        if (!a(e, this.config.Xqa))
            return d.Scb;
        if (410 === e && this.L.Hy && c.lessThan(this.L.Dba()))
            return d.UJa;
        this.L.fr.LQb();
        k = this.L.Ic.$aa;
        if (k && 410 === e && h.$f(k) || 454 === e)
            return d.d8;
        if (g.G <= this.config.Fea)
            return d.oKa;
        g = this.L.Al() - this.config.zGc;
        return 410 !== e && c.G > g ? d.LX : f ? d.jlb : d.Vla;
    }
    ;
    return p;
}
)();
export const BGa = t;

// Detected exports: BGa, lhd, ds
