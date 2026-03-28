/**
 * Netflix Cadmium Playercore - Module 29254
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: RJa
 */

// Webpack module 29254
// Parameters: t, b

var p, c, g;
function a(f) {
    return undefined !== (null === f || undefined === f ? undefined : f.Vnb);
}
function d(f) {
    return (a(f) ? f : Object.defineProperties(f, {
        Vnb: {
            value: {},
            configurable: false,
            enumerable: false
        }
    })).Vnb;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const RJa = undefined;
c = null !== (p = Number.MAX_SAFE_INTEGER) && undefined !== p ? p : 1E9;
g = Date.now() % c;
t = (function() {
    function f() {
        this.id = g = (g + 1) % c;
    }
    f.prototype.get = function(e) {
        return a(e) ? d(e)[this.id] : undefined;
    }
    ;
    f.prototype.set = function(e, h) {
        d(e)[this.id] = h;
        return this;
    }
    ;
    f.prototype.has = function(e) {
        return a(e) && undefined !== d(e)[this.id];
    }
    ;
    f.prototype.delete = function(e) {
        if (!this.has(e))
            return false;
        d(e)[this.id] = undefined;
        return true;
    }
    ;
    return f;
}
)();
export const RJa = t;

// Detected exports: RJa
