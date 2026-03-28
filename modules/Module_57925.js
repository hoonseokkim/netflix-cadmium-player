/**
 * Netflix Cadmium Playercore - Module 57925
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: UFa
 */

// Webpack module 57925
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
function d(h, k) {
    h = g.Yf.call(this, h, "IndexedDBConfigImpl") || this;
    h.config = k;
    h.version = 1;
    h.Yea = "namedatapairs";
    return h;
}
export const UFa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(12501);  // import from Module_12501
g = a(64174);  // import from Module_64174
f = a(34231);  // import from Module_34231
a = a(83767);  // import from Module_83767
Ia(d, g.Yf);
Ha.Object.defineProperties(d.prototype, {
    name: {
        configurable: true,
        enumerable: true,
        get: function() {
            return "netflix.player" + (this.config.bE ? "Test" : "");
        }
    },
    timeout: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.config.ZTb;
        }
    },
    moa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.config.moa;
        }
    },
    j6a: {
        configurable: true,
        enumerable: true,
        get: function() {
            return 0;
        }
    },
    i6a: {
        configurable: true,
        enumerable: true,
        get: function() {
            return 0;
        }
    },
    EAb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return true;
        }
    }
});
e = d;
export const UFa = e;
t.__decorate([c.config(c.Ez, "simulateIdbOpenError")], e.prototype, "j6a", null);
t.__decorate([c.config(c.Ez, "simulateIdbLoadAllError")], e.prototype, "i6a", null);
t.__decorate([c.config(c.zd, "fixInvalidDatabase")], e.prototype, "EAb", null);
b.UFa = e = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.gp)), t.__param(1, (0,
p.v)(f.Rt))],

// Detected exports: UFa
