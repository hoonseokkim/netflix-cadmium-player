/**
 * Netflix Cadmium Playercore - Module 32028
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 */

// Webpack module 32028
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
c = a(13550);  // import from Module_13550
t = a(75498);  // import from Module_75498
g = a(24653);  // import from Module_24653
a = (function(f) {
    function e() {
        return null !== f && f.apply(this, arguments) || this;
    }
    d.__extends(e, f);
    e.prototype.rz = function(h) {
        var k, l;
        k = h.config;
        l = h.player;
        h = h.el;
        return (0,
        g.GRb)({
            config: k,
            player: l,
            el: h
        });
    }
    ;
    e.prototype.Ar = function(h) {
        h = h.rn;
        (0,
        p.assert)(h, "Must have at least one selected stream");
        return new c.ih(h);
    }
    ;
    e.prototype.Uf = function(h) {
        h = h.rn;
        (0,
        p.assert)(h, "Must have at least one selected stream");
        return new c.ih(h);
    }
    ;
    return e;
}
)(t.cA);
b["default"] =

