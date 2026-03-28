/**
 * Netflix Cadmium Playercore - Module 27255
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 * Exports: bdb
 */

// Webpack module 27255
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const bdb = undefined;
d = a(52571);  // import from Module_52571
p = a(16146);  // import from Module_16146
t = (function() {
    function c() {
        this.global = new p.G7();
        this.GN = {};
    }
    c.prototype.add = function(g, f) {
        (0,
        d.assert)(undefined === this.GN[g], "Cannot add new memory object for playgraph");
        this.GN[g] = f;
        this.global.add(f.lw);
        this.global.add(f.Caa);
    }
    ;
    return c;
}
)();
b.bdb =

// Detected exports: bdb
