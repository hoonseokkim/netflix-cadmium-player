/**
 * Netflix Cadmium Playercore - Module 87887
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Nmb
 */

// Webpack module 87887
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Nmb = undefined;
d = a(91176);  // import from Module_91176
t = (function() {
    function p() {
        this.nVc = [400, 404, 408, 409];
    }
    p.prototype.CM = function(c, g) {
        var f;
        g = g(c);
        if (undefined === g.At) {
            f = c.response;
            f.ok || (600 > f.status && 500 <= f.status && (g.At = true),
            (0,
            d.kc)(this.nVc, function(e) {
                return e === f.status;
            }) && (g.At = true));
        }
        return g;
    }
    ;
    return p;
}
)();
b.Nmb =

// Detected exports: Nmb
