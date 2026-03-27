/**
 * Netflix Cadmium Playercore - Module 45645
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 45645
// Parameters: t (module), b (exports), a (require)

var d;
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
        return true;
    }
    ;
    c.Ae = "mehd";
    c.Fd = false;
    return c;
}
)(a(72905).Kf);
export default t;
