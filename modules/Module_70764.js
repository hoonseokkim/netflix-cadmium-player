/**
 * Netflix Cadmium Playercore - Module 70764
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: UI / rendering
 * Exports: Xjb
 */

// Webpack module 70764
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Xjb = undefined;
d = a(66164);  // import from Module_66164
p = a(91967);  // import from Module_91967
t = (function() {
    function c() {
        this.creationTime = d.platform.time.fa();
        this.Uc = {
            isPrefetchItem: true,
            prefetchClaimDurationMs: 0,
            prefetchedVideoMs: 0,
            prefetchedAudioMs: 0
        };
    }
    c.prototype.cdc = function(g) {
        this.Z = g;
    }
    ;
    c.prototype.PVc = function(g, f) {
        var e;
        g = null === (e = this.Z) || undefined === e ? undefined : e.zn(g);
        this.Uc = {
            isPrefetchItem: true,
            prefetchedVideoMs: g.W4,
            prefetchedAudioMs: g.V4,
            prefetchClaimDurationMs: d.platform.time.fa() - this.creationTime,
            prefetchRank: f
        };
    }
    ;
    Object.defineProperties(c, {
        ic: {
            get: function() {
                return "PrefetchReporter";
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(c.prototype, {
        ic: {
            get: function() {
                return c.ic;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(c.prototype, {
        enabled: {
            get: function() {
                return true;
            },
            enumerable: false,
            configurable: true
        }
    });
    c.prototype.Ph = function(g) {
        if (g.Ui === p.Sc.Gm)
            return this.Uc;
    }
    ;
    return c;
}
)();
b.Xjb =

// Detected exports: Xjb
