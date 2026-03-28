/**
 * Netflix Cadmium Playercore - Module 35621
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Event handling
 * Exports: w9a
 */

// Webpack module 35621
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const w9a = undefined;
d = a(22970);  // import from Module_22970
p = a(28020);  // import from Module_28020
t = (function() {
    function c(g) {
        this.events = [];
        this.total = 0;
        this.options = d.__assign({}, g);
    }
    c.prototype.clear = function() {
        this.events = [];
        this.filled = undefined;
        this.total = 0;
    }
    ;
    Object.defineProperties(c.prototype, {
        $Ab: {
            get: function() {
                if (this.filled) {
                    if ((0,
                    p.fa)() - this.filled.fa < this.filled.reset)
                        return true;
                    this.filled = undefined;
                }
                return false;
            },
            enumerable: false,
            configurable: true
        }
    });
    c.prototype.push = function(g) {
        var f, e, h, k, l;
        if (!this.$Ab) {
            f = (0,
            p.fa)();
            e = this.options.dU;
            h = f - e;
            this.events = this.events.filter(function(m) {
                return m.fa > h;
            });
            g = this.events.push({
                fa: f,
                event: g
            });
            k = this.events;
            l = this.options;
            if (g >= l.count)
                return (this.total++,
                l = l.reset,
                "function" === typeof l && (l = l()),
                this.filled = {
                    fa: f,
                    reset: l
                },
                this.events = [],
                {
                    fa: f,
                    total: this.total,
                    count: g,
                    dU: e,
                    reset: l,
                    events: k
                });
        }
    }
    ;
    return c;
}
)();
b.w9a =

// Detected exports: w9a
