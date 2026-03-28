/**
 * Netflix Cadmium Playercore - Module 34166
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: yma
 */

// Webpack module 34166
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const yma = undefined;
d = a(41674);  // import from Module_41674
t = (function() {
    function p() {
        var c;
        c = this;
        this.u9 = [];
        this.mh = new d.AbortController();
        this.mMb = function() {
            c.mh.abort();
        }
        ;
    }
    Object.defineProperties(p.prototype, {
        signal: {
            get: function() {
                return this.mh.signal;
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.abort = function() {
        this.mh.abort();
    }
    ;
    p.prototype.La = function() {
        var c;
        c = this.u9;
        this.u9 = [];
        c.forEach(function(g) {
            return g();
        });
    }
    ;
    p.prototype.P6a = function(c) {
        var g, f;
        g = this;
        if (c.aborted)
            this.mh.abort(c.reason);
        else {
            c.addEventListener("abort", this.mMb);
            f = function() {
                c.removeEventListener("abort", g.mMb);
                g.u9 = g.u9.filter(function(e) {
                    return e !== f;
                });
            }
            ;
            this.u9.push(f);
            this.signal.addEventListener("abort", f);
        }
    }
    ;
    return p;
}
)();
b.yma =

// Detected exports: yma
