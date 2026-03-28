/**
 * Netflix Cadmium Playercore - Module 58191
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Utility module
 * Exports: skb
 */

// Webpack module 58191
// Parameters: t, b

var p, c, g;
function a(f) {
    return undefined !== (null === f || undefined === f ? undefined : f.Wnb);
}
function d(f) {
    return (a(f) ? f : Object.defineProperties(f, {
        Wnb: {
            value: {},
            configurable: false,
            enumerable: false
        }
    })).Wnb;
}
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const skb = undefined;
c = null !== (p = Number.MAX_SAFE_INTEGER) && undefined !== p ? p : 1E9;
g = Date.now() % c;
t = (function() {
    function f() {
        this.qv = 0;
        this.id = g = (g + 1) % c;
    }
    f.prototype.add = function(e) {
        d(e)[this.id] = this.qv;
        return this;
    }
    ;
    f.prototype.has = function(e) {
        return a(e) && d(e)[this.id] === this.qv;
    }
    ;
    f.prototype.delete = function(e) {
        if (!this.has(e))
            return false;
        d(e)[this.id] = undefined;
        return true;
    }
    ;
    f.prototype.clear = function() {
        this.qv = (this.qv + 1) % c;
        return this;
    }
    ;
    return f;
}
)();
export const skb = t;

// Detected exports: skb
