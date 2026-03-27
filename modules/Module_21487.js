/**
 * Netflix Cadmium Playercore - Module 21487
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 */

// Webpack module 21487
// Parameters: t (module), b (exports), N/A (require)


Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
t = (function() {
    function a() {
        this.Iza = this.Jza = this.uy = this.R6a = 0;
    }
    a.prototype.uOa = function() {
        this.R6a++;
    }
    ;
    a.prototype.tOa = function() {
        this.uy++;
    }
    ;
    a.prototype.HOa = function(d) {
        0 < d && (this.Jza += d,
        this.Iza++);
    }
    ;
    a.prototype.iwc = function() {
        var d;
        d = this.R6a + this.uy;
        if (0 !== d)
            return this.uy / d;
    }
    ;
    a.prototype.nvc = function() {
        if (0 !== this.Iza)
            return this.Jza / this.Iza;
    }
    ;
    a.prototype.reset = function() {
        this.Iza = this.Jza = this.uy = this.R6a = 0;
    }
    ;
    return a;
}
)();
b["default"] = t;
