/**
 * Netflix Cadmium Playercore - Module 73036
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 73036
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(48170);
p = a(40666);
c = a(91967);
t = (function() {
    function g(f) {
        var h;
        function e() {
            var k;
            if (f.O3) {
                k = f.O3.zqc();
                h.lL.add(k.Tq());
            }
        }
        h = this;
        this.tc = f;
        this.lL = new Set();
        f.on("clockChanged", e);
        f.on("rootSchedulerReleasing", function(k) {
            k.O3.BBa && h.lL.add(k.O3.BBa.Tq());
        });
        e();
    }
    Object.defineProperties(g.prototype, {
        ic: {
            get: function() {
                return "task-verbose-audit";
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        um: {
            get: function() {
                return "tsch-verbose";
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        enabled: {
            get: function() {
                return d.u;
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.Ph = function(f) {
        var e, h, k;
        if (f.Ui === c.Sc.Wj) {
            null === (h = null === (e = this.tc) || undefined === e ? undefined : e.O3.BBa) || undefined === h ? undefined : h.Tq();
            this.lL.forEach(function(l) {
                k = k ? p.$X.reduce(k, l) : l;
            });
            return k;
        }
    }
    ;
    return g;
}
)();
export const qmb = t;

// Detected exports: qmb