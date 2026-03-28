/**
 * Netflix Cadmium Playercore - Module 12548
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Ahb
 */

// Webpack module 12548
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Ahb = undefined;
d = a(22970);  // import from Module_22970
t = (function() {
    function p() {
        this.In = {
            Ww: 0,
            closed: 0,
            fd: 0,
            events: []
        };
    }
    Object.defineProperties(p.prototype, {
        ic: {
            get: function() {
                return "NetflixMediaEventsDataCollector";
            },
            enumerable: false,
            configurable: true
        }
    });
    p.prototype.KAc = function(c) {
        this.In.Ww++;
        this.In.events.push({
            id: c.id,
            Qj: c.Qj,
            action: "opened",
            timestamp: c.timestamp,
            duration: c.duration,
            U_: c.U_,
            p7a: c.p7a
        });
    }
    ;
    p.prototype.JAc = function(c) {
        this.In.closed++;
        this.In.events.push({
            id: c.id,
            Qj: c.Qj,
            action: "closed",
            timestamp: c.timestamp,
            U_: c.U_
        });
    }
    ;
    p.prototype.IAc = function(c) {
        this.In.fd++;
        this.In.events.push({
            id: c.id,
            Qj: c.Qj,
            action: "cancelled",
            timestamp: c.timestamp,
            duration: c.x3c
        });
    }
    ;
    p.prototype.avc = function() {
        if (this.fBc())
            return {
                Ww: this.In.Ww,
                closed: this.In.closed,
                fd: this.In.fd,
                events: d.__spreadArray([], d.__read(this.In.events), false)
            };
    }
    ;
    p.prototype.fBc = function() {
        return 0 < this.In.Ww || 0 < this.In.closed || 0 < this.In.fd;
    }
    ;
    p.prototype.reset = function() {
        this.In = {
            Ww: 0,
            closed: 0,
            fd: 0,
            events: []
        };
    }
    ;
    return p;
}
)();
b.Ahb =

// Detected exports: Ahb
