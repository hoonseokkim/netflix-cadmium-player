/**
 * Netflix Cadmium Playercore - Module 56656
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 */

// Webpack module 56656
// Parameters: t (module), b (exports), N/A (require)


Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.$Ca = void 0;
t = (function() {
    function a() {
        this.children = new Map();
    }
    a.prototype.NU = function(d) {
        this.children.set(d.id, d);
    }
    ;
    a.prototype.c5 = function(d) {
        this.children.delete(d);
    }
    ;
    a.prototype.Hh = function() {
        this.children.forEach(function(d) {
            return d.Hh();
        });
        this.children.clear();
    }
    ;
    return a;
}
)();
b.$Ca = t;
