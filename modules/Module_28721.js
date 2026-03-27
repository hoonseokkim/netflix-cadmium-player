/**
 * Netflix Cadmium Playercore - Module 28721
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 28721
// Parameters: t (module), b (exports), a (require)

var d, p;
d = a(22970);
p = a(32296);
t = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.parse = function(f) {
        var e, h, k, l, m;
        this.oi();
        this.Uc = this.qF([{
            skd: "int32"
        }, {
            lXa: "int32"
        }, {
            offset: 96,
            type: "offset"
        }, {
            name: "string"
        }]);
        this.Uc.lXa = (0,
        p.wK)(this.Uc.lXa);
        if (f && f.yh) {
            m = null === (l = null === (k = null === (h = null === (e = this.parent) || undefined === e ? undefined : e.parent) || undefined === h ? undefined : h.wn("tkhd")) || undefined === k ? undefined : k.Uc) || undefined === l ? undefined : l.trackId;
            "number" === typeof m && f.yh[m] && (f.yh[m].sE = this.Uc.lXa);
        }
        return true;
    }
    ;
    g.Ae = "hdlr";
    g.Fd = false;
    return g;
}
)(a(72905).Kf);
export default t;
