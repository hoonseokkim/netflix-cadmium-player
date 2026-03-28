/**
 * Netflix Cadmium Playercore - Module 25915
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Ofb
 * Dependencies: 52571
 * Purpose: Logging, Configuration
 */

// import dep_52571 from './Module_52571.js';

// Webpack module 25915
// Parameters: t (module), b (exports), a (require)

var d;

d = a(52571);
t = (function() {
    class p {
    constructor(c, g) {
        this.config = c;
        this.console = g;
        (0,
        d.assert)(this.config.D1, "Ella must be enabled to use the coordinator");
    }
    uYc(c, g) {
        var f;
        if (!c.vh)
            return {
                ng: true,
                reason: "headerNotReceived"
            };
        if (!this.config.KE)
            return {
                ng: false,
                reason: "ellaNonMixingMode"
            };
        c = g.gm;
        if (undefined === c)
            return {
                ng: true,
                reason: "noEllaPositionDefined"
            };
        f = c - g.up;
        return g.up < c ? {
            ng: true,
            reason: "httpCatchingUp",
            context: {
                pU: g.up,
                gm: c,
                qw: f
            }
        } : {
            ng: false,
            reason: "ellaCaughtUp",
            context: {
                pU: g.up,
                gm: c,
                qw: f
            }
        };
    }
    tYc(c, g) {
        var f, e, h, k, l, m;
        f = c.qa.G;
        e = c.wa.G;
        if (!this.config.KE)
            return {
                ng: true,
                reason: "ellaNonMixingMode",
                context: {
                    j0a: this.config.KE,
                    Ve: c.index,
                    AUa: e
                }
            };
        h = g.gm;
        if (undefined === h)
            return {
                ng: true,
                reason: "establishingEllaPosition",
                context: {
                    j0a: this.config.KE,
                    Ve: c.index,
                    AUa: e
                }
            };
        k = h - g.up;
        l = g.up < f;
        m = g.up > f;
        return l || m ? {
            ng: false,
            reason: l ? "pipelineBehindElla" : "pipelineAheadOfElla",
            context: {
                j0a: this.config.KE,
                gm: h,
                Ve: c.index,
                rfd: f,
                AUa: e,
                pU: g.up,
                qw: k
            }
        } : {
            ng: true,
            reason: "pipelineCaughtUpToElla",
            context: {
                j0a: this.config.KE,
                gm: h,
                Ve: c.index,
                AUa: e,
                pU: g.up,
                qw: k
            }
        };
    }
    OYc(c) {
        var g, f;
        (0,
        d.assert)(this.config.KE, "coordinator should be consulted to start streaming only when mixing is enabled");
        if (undefined === c.gm)
            return {
                ng: false,
                reason: "noEllaPosition"
            };
        g = c.gm - c.up;
        f = this.config.cIb;
        return g <= f ? {
            ng: true,
            reason: "proximityThresholdReached",
            context: {
                Oq: g,
                threshold: f,
                pU: c.up,
                gm: c.gm
            }
        } : {
            ng: false,
            reason: "tooFarFromElla",
            context: {
                Oq: g,
                threshold: f,
                pU: c.up,
                gm: c.gm
            }
        };
    }
    QYc(c) {
        var g, f;
        (0,
        d.assert)(this.config.KE, "coordinator should be consulted to stop streaming only when mixing is enabled");
        if (undefined === c.gm)
            return {
                ng: false,
                reason: "noEllaPosition"
            };
        g = c.gm - c.up;
        f = 2 * this.config.cIb;
        return g > f ? {
            ng: true,
            reason: "tooFarBehindElla",
            context: {
                Oq: g,
                threshold: f,
                pU: c.up,
                gm: c.gm
            }
        } : {
            ng: false,
            reason: "withinStopThreshold",
            context: {
                Oq: g,
                threshold: f,
                pU: c.up,
                gm: c.gm
            }
        };
    }
}
return p;
}
)();
export const Ofb = t;

// Detected exports: Ofb
