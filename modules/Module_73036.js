/**
 * Netflix Cadmium Playercore - Module 73036
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 73036
// Parameters: t (module), b (exports), a (require)


var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.qmb = void 0;
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
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(g.prototype, {
        um: {
            get: function() {
                return "tsch-verbose";
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(g.prototype, {
        enabled: {
            get: function() {
                return d.u;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    g.prototype.Ph = function(f) {
        var e, h, k;
        if (f.Ui === c.Sc.Wj) {
            null === (h = null === (e = this.tc) || void 0 === e ? void 0 : e.O3.BBa) || void 0 === h ? void 0 : h.Tq();
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
b.qmb = t;


// Detected exports: qmb