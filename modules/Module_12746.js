/**
 * Netflix Cadmium Playercore - Module 12746
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Event handling
 * Exports: RCa
 */

// Webpack module 12746
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const RCa = undefined;
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
t = (function(c) {
    function g(f) {
        var e;
        e = c.call(this) || this;
        e.first = new p.Zo();
        e.zxb = e.first.promise;
        null === f || undefined === f ? undefined : f.then(function(h) {
            return e.set(h);
        });
        return e;
    }
    d.__extends(g, c);
    g.prototype.set = function(f) {
        f !== this.value && (undefined === this.value && this.first.resolve(this),
        this.value = f,
        this.emit(f ? "yes" : "no"));
        return this;
    }
    ;
    Object.defineProperties(g.prototype, {
        sW: {
            get: function() {
                return this.value;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        w0a: {
            get: function() {
                if (undefined !== this.value)
                    return !this.value;
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.toString = function() {
        return String(this.value);
    }
    ;
    return g;
}
)(a(90745).EventEmitter);
b.RCa =

// Detected exports: RCa
