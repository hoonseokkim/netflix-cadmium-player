/**
 * Netflix Cadmium Playercore - Module 60575
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: G9a
 */

// Webpack module 60575
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const G9a = undefined;
d = a(90745);  // import from Module_90745
p = a(91967);  // import from Module_91967
t = (function() {
    function c(g, f, e) {
        var k;
        function h(l) {
            var m, n;
            (m = k.state.kOa)[n = l.event] || (m[n] = 0);
            k.state.kOa[l.event]++;
        }
        k = this;
        this.od = f;
        this.PS = e;
        this.Xj = new d.sf();
        this.um = "adImpressionAudit";
        this.ic = "adImpressionAuditor";
        this.enabled = true;
        this.Xj.on(g.events, "adPresenting", function() {
            k.state.qrb++;
        });
        this.Xj.on(g.events, "adBreakPresenting", function(l) {
            var m, n, q, r;
            k.state.yqb++;
            l = l.presentingInfo;
            l.Sa.xf.empty || k.state.Bqb++;
            l.Sa.i1 || k.state.wJc++;
            (m = k.state.iOa)[n = l.Sa.type] || (m[n] = 0);
            k.state.iOa[l.Sa.type]++;
            (q = k.state.hOa)[r = l.Sa.xf.source] || (q[r] = 0);
            k.state.hOa[l.Sa.xf.source]++;
        });
        this.Xj.on(e.events, "adEvent", h);
        this.Xj.on(e.events, "adBreakEvent", h);
        this.state = {
            yqb: 0,
            Bqb: 0,
            wJc: 0,
            kOa: {},
            qrb: 0,
            iOa: {},
            hOa: {}
        };
    }
    c.prototype.Ph = function(g) {
        g = g.Ui;
        if (this.od.Gw() && g === p.Sc.Wj)
            return {
                presented: {
                    breaks: this.state.yqb,
                    breaksWithAds: this.state.Bqb,
                    ads: this.state.qrb,
                    adBreaksPresentedByType: this.state.iOa,
                    adBreaksPresentedBySource: this.state.hOa
                },
                events: this.state.kOa,
                logger: this.PS.Tq()
            };
    }
    ;
    c.prototype.La = function() {
        this.Xj.clear();
    }
    ;
    return c;
}
)();
b.G9a =

// Detected exports: G9a
