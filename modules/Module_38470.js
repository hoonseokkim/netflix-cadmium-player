/**
 * Netflix Cadmium Playercore - Module 38470
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: KHa
 */

// Webpack module 38470
// Parameters: t (module), b (exports), a (require)

var d, p, c;
export const KHa = b.I0b = undefined;
t = a(22970);  // import from Module_22970
d = t.__importDefault(a(51411));
p = t.__importDefault(a(10690));
b.I0b = {
    zg: d.default.P.zg,
    zi: d.default.P.zi
};
c = 0;
a = (function() {
    function g() {
        var f;
        f = ++c;
        if (0 >= f || !isFinite(f))
            throw new p.default("MSL context unique ID has overflowed. Are you sure you are using MSL context's correctly?");
        this.z$b = c;
        this.Wpb = false;
        this.nd = 0;
    }
    g.prototype.j3c = function(f) {
        var e;
        e = this.getTime() / 1E3;
        this.nd = f.getTime() / 1E3 - e;
        this.Wpb = true;
    }
    ;
    g.prototype.Isa = function() {
        var f;
        if (!this.Wpb)
            return null;
        f = this.getTime() / 1E3 + this.nd;
        return new Date(1E3 * f);
    }
    ;
    g.prototype.equals = function(f) {
        return this === f ? true : false;
    }
    ;
    g.prototype.wi = function() {
        return this.z$b.toString();
    }
    ;
    return g;
}
)();
b.KHa =

// Detected exports: KHa
