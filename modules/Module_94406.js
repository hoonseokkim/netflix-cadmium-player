/**
 * Netflix Cadmium Playercore - Module 94406
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [31187, 18610]; Class/prototype-based
 * Original signature: function(t, b, a)
 */

// Webpack module 94406
// Parameters: t (module), b (exports), a (require)
var d, p;
b = a(31187);
d = a(18610);
p = (function() {
    function c(g, f) {
        this.Zia = f;
        this.f = g;
    }
    c.prototype["@@transducer/init"] = d.Gb;
    c.prototype["@@transducer/result"] = d.result;
    c.prototype["@@transducer/step"] = function(g, f) {
        return this.Zia["@@transducer/step"](g, this.f(f));
    }
    ;
    return c;
}
)();
a = b(function(c, g) {
    return new p(c,g);
});
t.exports = a;
