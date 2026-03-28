/**
 * Netflix Cadmium Playercore - Module 42306
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: YX
 */

// Webpack module 42306
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const YX = undefined;
d = a(44847);  // import from Module_44847
t = (function() {
    function p(c, g) {
        this.nb = c;
        this.$b = g;
    }
    p.prototype.wh = function(c) {
        return new p(this.nb.wh(c),this.$b.wh(c));
    }
    ;
    p.prototype.Af = function(c) {
        return new p(this.nb.Af(c),this.$b.Af(c));
    }
    ;
    Object.defineProperties(p.prototype, {
        length: {
            get: function() {
                return this.$b.da(this.nb);
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.add = function(c) {
        return new p(this.nb.add(c),this.$b.add(c));
    }
    ;
    p.prototype.da = function(c) {
        return new p(this.nb.da(c),this.$b.da(c));
    }
    ;
    Object.defineProperties(p.prototype, {
        duration: {
            get: function() {
                return this.length;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        cua: {
            get: function() {
                return this.nb.equal(this.$b);
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.OZ = function(c, g) {
        "number" === typeof c && (c = d.I.Ca(c));
        return "ms" === g ? c.G >= this.nb.G && c.G <= this.$b.G : c.$f(this.nb) && c.Hn(this.$b);
    }
    ;
    p.prototype.toString = function(c) {
        return c === d.vG.G ? ("").concat(this.nb.toString(d.vG.G)) + (" - ").concat(this.$b.toString(d.vG.G)) : c === d.vG.h6a ? ("").concat(this.nb.ca()) + (" dur:").concat(this.duration.ca(c)) : ("").concat(this.nb.ca(), " - ").concat(this.$b.ca());
    }
    ;
    p.prototype.equals = function(c) {
        return this.nb.equal(c.nb) && this.$b.equal(c.$b);
    }
    ;
    return p;
}
)();
b.YX =

// Detected exports: YX
