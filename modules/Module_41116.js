/**
 * Netflix Cadmium Playercore - Module 41116
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 41116
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
p = a(72905);
t = (function(c) {
    function g() {
        return null !== c && c.apply(this, arguments) || this;
    }
    d.__extends(g, c);
    g.prototype.parse = function(f) {
        this.oi();
        this.Y4a = this.N.gC();
        p.u && this.N.console.trace("SchemeTypeBoxTranslator: " + this.Y4a);
        if ("cenc" === this.Y4a) {
            if ((this.N.offset -= 4,
            p.u && this.N.console.trace("SchemeTypeBoxTranslator: writing type piff at offset " + this.N.offset),
            this.Ec.a9a("piff"),
            null === f || void 0 === f ? 0 : f.ce))
                f.ce.urc = "piff";
        } else if (null === f || void 0 === f ? 0 : f.ce)
            f.ce.urc = this.Y4a;
        this.N.dc();
        return !0;
    }
    ;
    g.Ae = "schm";
    g.Fd = !1;
    return g;
}
)(p.Kf);
b["default"] = t;
