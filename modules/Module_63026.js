/**
 * Netflix Cadmium Playercore - Module 63026
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: UI / rendering
 * Exports: Bhb
 */

// Webpack module 63026
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Bhb = undefined;
d = a(91967);  // import from Module_91967
t = (function() {
    function p(c) {
        this.xo = c;
    }
    Object.defineProperties(p.prototype, {
        ic: {
            get: function() {
                return "NetflixMediaEventsReporter";
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        enabled: {
            get: function() {
                return !!this.xo;
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.Ph = function(c) {
        return c.Ui === d.Sc.Wj && this.xo && (c = this.xo.avc()) ? {
            netflixMediaEvents: {
                opened: c.Ww,
                closed: c.closed,
                cancelled: c.fd,
                events: c.events.map(function(g) {
                    return {
                        id: g.id,
                        applicationScope: g.Qj,
                        action: g.action,
                        timestamp: g.timestamp,
                        duration: g.duration,
                        eventDelay: g.U_,
                        timeSinceTriggeredMs: g.p7a
                    };
                })
            }
        } : {};
    }
    ;
    p.prototype.La = function() {}
    ;
    return p;
}
)();
b.Bhb =

// Detected exports: Bhb
