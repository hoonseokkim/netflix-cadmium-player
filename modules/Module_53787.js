/**
 * Netflix Cadmium Playercore - Module 53787
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: UI / rendering
 * Exports: F9a
 */

// Webpack module 53787
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const F9a = undefined;
d = a(90745);  // import from Module_90745
p = a(91967);  // import from Module_91967
t = (function() {
    function c(g, f, e) {
        var h;
        h = this;
        this.od = f;
        this.Xj = new d.sf();
        this.um = "adHydratorAudit";
        this.ic = "adHydratorAuditor";
        this.enabled = true;
        this.Xj.on(g.events, "adBreakPresenting", function(k) {
            h.state.zqb.push(k.presentingInfo.Sa.xf.Br);
        });
        this.Xj.on(e.events, "adBreakHydrated", function() {
            h.state.xqb++;
        });
        this.Xj.on(e.events, "adBreakHydrationFailed", function() {
            h.state.wqb++;
        });
        this.Xj.on(e.events, "adBreakHydrationSkipped", function() {
            h.state.Aqb++;
        });
        this.state = {
            xqb: 0,
            wqb: 0,
            Aqb: 0,
            zqb: []
        };
    }
    c.prototype.Ph = function(g) {
        g = g.Ui;
        if (this.od.Gw() && g === p.Sc.Wj)
            return {
                adBreaksPresentedSequence: this.state.zqb,
                adBreaksHydratedCount: this.state.xqb,
                adBreaksFailedHydratedCount: this.state.wqb,
                adBreaksSkippedCount: this.state.Aqb
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
b.F9a =

// Detected exports: F9a
