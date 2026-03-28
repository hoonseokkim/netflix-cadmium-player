/**
 * Netflix Cadmium Playercore - Module 2948
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Configuration
 * Exports: ylb
 */

// Webpack module 2948
// Parameters: t, b

Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const ylb = undefined;
t = (function() {
    function a(d) {
        this.config = d;
    }
    a.prototype.aQa = function(d, p) {
        var c, g;
        c = this;
        d = p(d);
        g = d.Up.map(function(f) {
            return f.Nd.priority;
        }).sort();
        d.Up.forEach(function(f) {
            f.fya = c.config.oQc / (2 << g.lastIndexOf(f.Nd.priority));
        });
        return d;
    }
    ;
    return a;
}
)();
export const ylb = t;

// Detected exports: ylb
