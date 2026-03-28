/**
 * Netflix Cadmium Playercore - Module 29770
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Data parsing / serialization
 */

// Webpack module 29770
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
d = a(22970);  // import from Module_22970
t = (function(p) {
    function c(g, f, e, h, k) {
        return p.call(this, g, f, e, h, k) || this;
    }
    d.__extends(c, p);
    c.prototype.parse = function() {
        this.oi();
        this.N.dc();
        this.NQc = this.N.mPb();
        this.V_ = this.N.dc();
        4294967295 === this.V_ && (this.V_ = Infinity);
        this.id = this.N.dc();
        this.eO = this.N.E3a();
        this.value = this.N.E3a();
        this.GI = new Uint8Array(this.N.s3(this.length - (this.N.offset - this.startOffset)));
        return true;
    }
    ;
    c.Ae = "emib";
    c.Fd = false;
    return c;
}
)(a(72905).Kf);
b["default"] =

