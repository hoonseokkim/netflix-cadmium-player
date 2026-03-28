/**
 * Netflix Cadmium Playercore - Module 22074
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Ifb
 */

// Webpack module 22074
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Ifb = undefined;
d = a(91176);  // import from Module_91176
p = a(8149);  // import from Module_08149
t = (function() {
    function c() {}
    c.prototype.yt = function(g) {
        this.Wk = (0,
        p.dk)(g) ? g.Wk : d.I.ia;
        this.O = g.O;
    }
    ;
    c.prototype.append = function(g) {
        var f, e, h, k;
        f = g.Na;
        e = g.qf;
        h = g.Ih;
        k = g.Sh;
        g = g.offset.da(this.Wk.Rc(this.O));
        return {
            Na: f,
            offset: g,
            qf: e,
            Ih: h,
            Sh: k
        };
    }
    ;
    return c;
}
)();
b.Ifb =

// Detected exports: Ifb
