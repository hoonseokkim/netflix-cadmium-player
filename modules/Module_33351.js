/**
 * Netflix Cadmium Playercore - Module 33351
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: Bbb
 */

// Webpack module 33351
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Bbb = undefined;
d = a(90745);  // import from Module_90745
p = a(12746);  // import from Module_12746
t = (function() {
    function c(g) {
        undefined === g && (g = {});
        this.source = g;
        this.events = g.events || new d.EventEmitter();
        this.visible = g.visible || new p.RCa().set(true);
    }
    Object.defineProperties(c.prototype, {
        info: {
            get: function() {
                var g;
                g = this.source.info;
                if (g)
                    return g;
                throw Error("WebSocketClientDepencies.info must be implemented");
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(c.prototype, {
        NT: {
            get: function() {
                return this.source.NT;
            },
            enumerable: false,
            configurable: true
        }
    });
    c.prototype.sT = function(g, f) {
        var e, h;
        null === (h = (e = this.source).sT) || undefined === h ? undefined : h.call(e, g, f);
    }
    ;
    c.prototype.counter = function(g, f) {
        var e, h;
        return (null === (h = (e = this.source).counter) || undefined === h ? undefined : h.call(e, g, f)) || ({
            nB: function() {
                undefined;
            }
        });
    }
    ;
    Object.defineProperties(c.prototype, {
        RY: {
            get: function() {
                var g;
                g = this.source.RY;
                if (g)
                    return g;
                throw Error("WebSocketClientDepencies.ale must be implemented");
            },
            enumerable: false,
            configurable: true
        }
    });
    return c;
}
)();
b.Bbb =

// Detected exports: Bbb
