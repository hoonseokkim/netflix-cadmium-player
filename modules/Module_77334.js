/**
 * Netflix Cadmium Playercore - Module 77334
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: rJa
 */

// Webpack module 77334
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
function d(k, l) {
    k = c.Yf.call(this, k, "PlaydataConfigImpl") || this;
    k.config = l;
    return k;
}
export const rJa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(64174);  // import from Module_64174
g = a(83767);  // import from Module_83767
f = a(12501);  // import from Module_12501
e = a(5021);  // import from Module_05021
a = a(34231);  // import from Module_34231
Ia(d, c.Yf);
Ha.Object.defineProperties(d.prototype, {
    mU: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.config.bE ? "unsentplaydatatest" : "unsentplaydata";
        }
    },
    i5a: {
        configurable: true,
        enumerable: true,
        get: function() {
            return true;
        }
    },
    ORb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return (0,
            e.pc)(1E4);
        }
    },
    m2a: {
        configurable: true,
        enumerable: true,
        get: function() {
            return (0,
            e.pc)(4E3);
        }
    },
    YGb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return (0,
            e.h0a)(1);
        }
    }
});
h = d;
export const rJa = h;
t.__decorate([f.config(f.string, "playdataPersistKey")], h.prototype, "mU", null);
t.__decorate([f.config(f.zd, "sendPersistedPlaydata")], h.prototype, "i5a", null);
t.__decorate([f.config(f.Jo, "playdataSendDelayMilliseconds")], h.prototype, "ORb", null);
t.__decorate([f.config(f.Jo, "playdataPersistIntervalMilliseconds")], h.prototype, "m2a", null);
t.__decorate([f.config(f.Jo, "heartbeatCooldown")], h.prototype, "YGb", null);
b.rJa = h = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.gp)), t.__param(1, (0,
p.v)(a.Rt))],

// Detected exports: rJa
