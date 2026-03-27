/**
 * Netflix Cadmium Playercore - Module 29973
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 29973
// Parameters: t (module), b (exports), a (require)

var d;
d = a(22970);
t = (function(p) {
    function c() {
        return null !== p && p.apply(this, arguments) || this;
    }
    d.__extends(c, p);
    c.prototype.parse = function() {
        this.Uc = this.qF([{
            Ecd: "int32"
        }, {
            maxBitrate: "int32"
        }, {
            Joa: "int32"
        }]);
        return true;
    }
    ;
    c.Ae = "btrt";
    c.Fd = false;
    return c;
}
)(a(72905).Kf);
export default t;
