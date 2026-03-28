/**
 * Netflix Cadmium Playercore - Module 86823
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Validation / testing
 * Exports: WX
 */

// Webpack module 86823
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const WX = undefined;
d = a(43529);  // import from Module_43529
p = a(28999);  // import from Module_28999
t = (function() {
    function c(g) {
        undefined === g && (g = {
            L9: true
        });
        this.options = g;
        this.correlationId = 0;
        this.un = new p.Zo();
    }
    Object.defineProperties(c.prototype, {
        vda: {
            get: function() {
                return this.un.aO;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(c.prototype, {
        then: {
            get: function() {
                return this.promise.then.bind(this.promise);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(c.prototype, {
        promise: {
            get: function() {
                return this.un.promise;
            },
            enumerable: false,
            configurable: true
        }
    });
    c.prototype.nO = function(g, f) {
        var e, h;
        e = this;
        undefined === f && (f = true);
        f && (0,
        d.assert)(!this.vda);
        h = ++this.correlationId;
        g.then(function(k) {
            return e.Z9b(h, k);
        }, function(k) {
            return e.W9b(h, k);
        });
    }
    ;
    c.prototype.Z9b = function(g, f) {
        (g === this.correlationId || this.options.L9) && this.un.resolve(f);
    }
    ;
    c.prototype.W9b = function(g, f) {
        g === this.correlationId && this.un.reject(f);
    }
    ;
    return c;
}
)();
b.WX =

// Detected exports: WX
