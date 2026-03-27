/**
 * Netflix Cadmium Playercore - Module 45645
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 45645
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
    c.prototype.parse = function() {
        this.oi();
        this.Uc = this.qF(1 === this.version ? [{
            lS: "int64"
        }] : [{
            lS: "int32"
        }]);
        return !0;
    }
    ;
    c.Ae = "mehd";
    c.Fd = !1;
    return c;
}
)(a(72905).Kf);
b["default"] = t;
