/**
 * Netflix Cadmium Playercore - Module 71368
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 71368
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
        this.Uc = 1 === this.version ? this.qF([{
            creationTime: "int64"
        }, {
            modificationTime: "int64"
        }, {
            O: "int32"
        }, {
            duration: "int64"
        }]) : this.qF([{
            creationTime: "int32"
        }, {
            modificationTime: "int32"
        }, {
            O: "int32"
        }, {
            duration: "int32"
        }]);
        return !0;
    }
    ;
    c.Ae = "mvhd";
    c.Fd = !1;
    return c;
}
)(a(72905).Kf);
b["default"] = t;
