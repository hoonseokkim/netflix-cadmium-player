/**
 * Netflix Cadmium Playercore - Module 94971
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: inb
 */

// Webpack module 94971
// Parameters: t (module), b (exports), a (require)

var d, p;
export const inb = undefined;
d = a(14894);  // import from Module_14894
p = a(41161);  // import from Module_41161
t = (function() {
    function c(g, f) {
        undefined === f && (f = null);
        this.IMa = g;
        this.am = f;
    }
    c.prototype.setTimeout = function(g) {
        this.am = g;
    }
    ;
    c.prototype.qNc = function() {
        var g;
        g = new p.Ydb(this.IMa,this.am);
        return {
            input: new d.Wdb(g),
            cU: g
        };
    }
    ;
    return c;
}
)();
b.inb =

// Detected exports: inb
