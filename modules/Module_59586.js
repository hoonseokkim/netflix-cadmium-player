/**
 * Netflix Cadmium Playercore - Module 59586
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: IHa
 */

// Webpack module 59586
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
function d(h) {
    return c.Yf.call(this, h, "MseConfigImpl") || this;
}
export const IHa = undefined;
t = a(22970);  // import from Module_22970
p = a(12501);  // import from Module_12501
c = a(64174);  // import from Module_64174
g = a(22674);  // import from Module_22674
f = a(83767);  // import from Module_83767
e = a(5021);  // import from Module_05021
Ia(d, c.Yf);
Ha.Object.defineProperties(d.prototype, {
    oKb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return (0,
            e.pc)(5E3);
        }
    },
    qMb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return (0,
            e.pc)(1E3);
        }
    },
    rMb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return (0,
            e.pc)(1E3);
        }
    }
});
a = d;
export const IHa = a;
t.__decorate([p.config(p.Jo, "minDecoderBufferMilliseconds")], a.prototype, "oKb", null);
t.__decorate([p.config(p.Jo, "optimalDecoderBufferMilliseconds")], a.prototype, "qMb", null);
t.__decorate([p.config(p.Jo, "optimalDecoderBufferMillisecondsBranching")], a.prototype, "rMb", null);
b.IHa = a = t.__decorate([(0,
g.aa)(), t.__param(0, (0,
g.v)(f.gp))],

// Detected exports: IHa
