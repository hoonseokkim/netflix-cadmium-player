/**
 * Netflix Cadmium Playercore - Module 37736
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Event handling
 * Exports: OJa
 */

// Webpack module 37736
// Parameters: t (module), b (exports), a (require)

var d;
d = this && this.__extends || (function() {
    function p(c, g) {
        p = Object.setPrototypeOf || ({
            __proto__: []
        })instanceof Array && (function(f, e) {
            f.__proto__ = e;
        }
        ) || (function(f, e) {
            for (var h in e)
                Object.prototype.hasOwnProperty.call(e, h) && (f[h] = e[h]);
        }
        );
        return p(c, g);
    }
    return function(c, g) {
        function f() {
            this.constructor = c;
        }
        if ("function" !== typeof g && null !== g)
            throw new TypeError("Class extends value " + String(g) + " is not a constructor or null");
        p(c, g);
        c.prototype = null === g ? Object.create(g) : (f.prototype = g.prototype,
        new f());
    }
    ;
}
)();
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const OJa = undefined;
t = (function(p) {
    function c(g) {
        var f;
        f = p.call(this) || this;
        f.parent = g;
        return f;
    }
    d(c, p);
    c.prototype.emit = function(g, f, e) {
        var h;
        h = p.prototype.emit.call(this, g, f);
        this.parent && true === (null === e || undefined === e ? undefined : e.Dkd) && this.parent.emit(g, f);
        return h;
    }
    ;
    return c;
}
)(a(90745).EventEmitter);
b.OJa =

// Detected exports: OJa
