/**
 * Netflix Cadmium Playercore - Module 62553
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: HFa
 */

// Webpack module 62553
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
function d(e) {
    return c.Yf.call(this, e, "HlsConfigImpl") || this;
}
export const HFa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(64174);  // import from Module_64174
g = a(83767);  // import from Module_83767
a = a(12501);  // import from Module_12501
Ia(d, c.Yf);
Ha.Object.defineProperties(d.prototype, {
    bOb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return true;
        }
    },
    LB: {
        configurable: true,
        enumerable: true,
        get: function() {
            return 16E3;
        }
    },
    QE: {
        configurable: true,
        enumerable: true,
        get: function() {
            return 4E3;
        }
    },
    LEb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return 1E4;
        }
    },
    Tw: {
        configurable: true,
        enumerable: true,
        get: function() {
            return 80;
        }
    }
});
f = d;
export const HFa = f;
t.__decorate([a.config(a.zd, "playsInline")], f.prototype, "bOb", null);
t.__decorate([a.config(a.tM, "minAudioMediaRequestDuration")], f.prototype, "LB", null);
t.__decorate([a.config(a.tM, "minVideoMediaRequestDuration")], f.prototype, "QE", null);
t.__decorate([a.config(a.tM, "hlsVideoMediaRequestTargetDuration")], f.prototype, "LEb", null);
t.__decorate([a.config(a.tM, "minStartingVideoVMAF")], f.prototype, "Tw", null);
b.HFa = f = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.gp))],

// Detected exports: HFa
