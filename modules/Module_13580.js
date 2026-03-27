/**
 * Netflix Cadmium Playercore - Module 13580
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 13580
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.vcb = void 0;
d = a(65161);
p = a(91967);
t = (function() {
    function c(g) {
        this.SCb = g;
    }
    Object.defineProperties(c.prototype, {
        ic: {
            get: function() {
                return "EllaReporter";
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(c.prototype, {
        enabled: {
            get: function() {
                return !0;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    c.prototype.Ph = function(g) {
        var f, e;
        if (g.Ui === p.Sc.Wj) {
            g = {};
            f = this.SCb(d.l.V);
            e = this.SCb(d.l.U);
            f && (f = this.eBb(f, d.l.V)) && (g.gcd = f);
            e && (e = this.eBb(e, d.l.U)) && (g.qnd = e);
            return 0 < Object.keys(g).length ? g : void 0;
        }
    }
    ;
    c.prototype.eBb = function(g, f) {
        var e;
        if ((g = g.SBb()) && (0 !== g.kq || 0 !== g.rx)) {
            e = g.l$.map(function(h) {
                var k;
                k = {
                    bitrate: h.bitrate,
                    y7a: h.duration
                };
                f === d.l.U ? k.ged = h.Oa : k.K9 = h.Oa;
                return k;
            });
            return {
                duration: g.kq,
                Nkd: g.rx,
                rjd: g.GC,
                ted: g.fia,
                Mkd: g.hia,
                qjd: g.gia,
                pcd: g.Jdc,
                zcd: e
            };
        }
    }
    ;
    return c;
}
)();
b.vcb = t;


// Detected exports: vcb