/**
 * Netflix Cadmium Playercore - Module 29043
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 29043
// Parameters: t (module), b (exports), a (require)


var d;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
d = a(22970);
t = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.prototype.parse = function(g) {
        var f, e, h;
        f = this.N.offset;
        e = this.N.sg();
        this.Twb = e >> 3;
        this.uLc = e & 7;
        this.b0c = [];
        for (e = 0; e <= this.uLc; e++) {
            h = {
                xuc: this.N.ib(2),
                xec: this.N.ib(5),
                yec: this.N.ib(5),
                Z$b: this.N.ib(3),
                Rhd: this.N.ib(1),
                vQb: this.N.ib(3),
                tLc: this.N.ib(4)
            };
            0 < h.tLc ? h.Vcd = this.N.ib(9) : this.N.ib(1);
            this.b0c.push(h);
        }
        g && g.kyb && (g.kyb.Twb = this.Twb,
        2 <= this.byteLength - (this.N.offset - f) && (this.N.ib(7),
        f = this.N.ib(1),
        g.kyb.dcd = 1 === f));
        return !0;
    }
    ;
    c.Ae = "dec3";
    return c;
}
)(a(72905).Kf);
b["default"] = t;
