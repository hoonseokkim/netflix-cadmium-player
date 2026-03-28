/**
 * Netflix Cadmium Playercore - Module 9568
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Event handling
 * Exports: i8
 */

// Webpack module 9568
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const i8 = undefined;
d = a(22970);  // import from Module_22970
t = a(70402);  // import from Module_70402
p = a(47348);  // import from Module_47348
a = (function(c) {
    function g(f, e) {
        var h;
        h = c.call(this) || this;
        h.id = (0,
        p.aCc)(f);
        h.trace = e.extend(h.id);
        h.OH = function() {
            h.OH = undefined;
            h.emit("closed");
            h.removeAllListeners();
            return true;
        }
        ;
        return h;
    }
    d.__extends(g, c);
    Object.defineProperties(g.prototype, {
        open: {
            get: function() {
                return !!this.OH;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        closed: {
            get: function() {
                return this.YHb("closed", !this.open);
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.close = function() {
        var f;
        return null === (f = this.OH) || undefined === f ? undefined : f.call(this);
    }
    ;
    g.prototype.send = function() {
        return this.open;
    }
    ;
    g.prototype.toJSON = function() {
        return this.id;
    }
    ;
    return g;
}
)(t.EventEmitter);
b.i8 =

// Detected exports: i8
