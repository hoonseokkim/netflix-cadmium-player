/**
 * Netflix Cadmium Playercore - Module 18595
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 */

// Webpack module 18595
// Parameters: t (module), b (exports), a (require)

var d;
d = a(22970);  // import from Module_22970
t = (function(p) {
    function c(g, f, e) {
        var h;
        h = this.constructor;
        f = p.call(this, f) || this;
        h = h.prototype;
        "undefined" === typeof Object.setPrototypeOf ? f.__proto__ = h : Object.setPrototypeOf(f, h);
        f.name = g;
        f.Jc = e;
        g = f.toString();
        f.stack && (g += "\n" + f.stack);
        f.Jc && f.Jc.stack && (g += "\nCaused by " + f.Jc.stack);
        f.stack = g;
        return f;
    }
    d.__extends(c, p);
    c.prototype.toString = function() {
        return this.name + ": " + this.message;
    }
    ;
    return c;
}
)(Error);
b["default"] =

