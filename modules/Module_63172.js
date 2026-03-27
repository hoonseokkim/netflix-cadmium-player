/**
 * Netflix Cadmium Playercore - Module 63172
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 63172
// Parameters: t (module), b (exports), a (require)


var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.ejb = void 0;
d = a(65161);
p = a(95324);
c = a(91967);
t = (function() {
    function g(f) {
        this.$d = f;
    }
    Object.defineProperties(g.prototype, {
        ic: {
            get: function() {
                return "PipelineReporter";
            },
            enumerable: !1,
            configurable: !0
        }
    });
    Object.defineProperties(g.prototype, {
        enabled: {
            get: function() {
                return !0;
            },
            enumerable: !1,
            configurable: !0
        }
    });
    g.prototype.Ph = function(f) {
        var e, h, k;
        f = f.Ui;
        if (f === c.Sc.Mr || f === c.Sc.Wj) {
            f = {};
            e = this.$d(d.l.U);
            h = this.$d(d.l.V);
            k = this.$d(d.l.Ea);
            e && (f.videoPipelineSummary = this.V6a(e));
            h && (f.audioPipelineSummary = this.V6a(h));
            k && (f.textPipelineSummary = this.V6a(k));
            return f;
        }
    }
    ;
    g.prototype.V6a = function(f) {
        var e, h, k, l, m;
        m = f.pe.Ta;
        m = {
            actualStartPlayerTimestamp: null === (e = m.Vb) || void 0 === e ? void 0 : e.G,
            actualPartialPlayerTimestamp: m.jNb,
            completePlayerTimestamp: null === (h = f.Hk) || void 0 === h ? void 0 : h.G,
            segmentId: f.M,
            contentStartMs: null === (k = f.qa) || void 0 === k ? void 0 : k.G,
            contentEndMs: null === (l = f.wa) || void 0 === l ? void 0 : l.G,
            streamingPlayerMs: f.tJ.G,
            isStreamable: f.Ly(),
            isNormalized: f.ag(),
            isDoneStreaming: f.Gp(),
            trackNeedsHeaderRequest: f.track.Nea,
            completedRequests: m.Xub,
            activeRequests: f.pe.bn,
            unsentRequests: f.pe.JO,
            bytes: {
                current: m.la,
                received: m.Wfa,
                partial: m.Zw,
                completed: m.ypa,
                unsent: m.t2c
            }
        };
        f instanceof p.Mka && (f.hIb && (m.liveMissingFragments = f.hIb),
        f = f.s5a,
        m.serverTimeDeltaUpdateStat = {
            max: f.max,
            min: f.min,
            trace: f.trace,
            serverTime: f.r5a,
            count: f.count
        });
        return m;
    }
    ;
    return g;
}
)();
b.ejb = t;


// Detected exports: ejb