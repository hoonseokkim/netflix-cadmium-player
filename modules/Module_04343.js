/**
 * Netflix Cadmium Playercore - Module 4343
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Event handling
 * Exports: fFa
 */

// Webpack module 4343
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const fFa = undefined;
d = a(22970);  // import from Module_22970
t = a(70402);  // import from Module_70402
p = a(35621);  // import from Module_35621
c = {
    count: Infinity,
    dU: -Infinity,
    reset: -Infinity
};
a = (function(g) {
    function f(e) {
        var h, k;
        undefined === e && (e = c);
        h = g.call(this) || this;
        k = e.reset;
        h.DY = new p.w9a({
            count: e.count,
            dU: e.dU,
            reset: function() {
                return "number" === typeof k ? k : k(h.DY.total, h.DY.events.map(function(l) {
                    return l.event.error;
                }));
            }
        });
        return h;
    }
    d.__extends(f, g);
    f.prototype.reset = function() {
        this.DY.clear();
    }
    ;
    Object.defineProperties(f.prototype, {
        rSc: {
            get: function() {
                return this.DY.$Ab;
            },
            enumerable: false,
            configurable: true
        }
    });
    f.prototype.failure = function(e, h, k) {
        var l, m, n, q, r, u;
        l = this;
        if (e = this.DY.push({
            Oe: e,
            Wd: h.id,
            error: k
        })) {
            m = e.total;
            n = e.count;
            q = e.dU;
            r = e.reset;
            u = e.events.map(function(v) {
                return d.__assign({
                    fa: v.fa
                }, v.event);
            });
            Promise.resolve().then(function() {
                l.emit("failed", {
                    Wd: h,
                    error: {
                        type: "accumulated-failures",
                        message: ("Received ").concat(n, " failure(s) over ").concat(q, " ms"),
                        total: m,
                        reset: r,
                        RA: u
                    }
                });
            });
        }
        return this.DY.events.length;
    }
    ;
    return f;
}
)(t.EventEmitter);
b.fFa =

// Detected exports: fFa
