/**
 * Netflix Cadmium Playercore - Module 53693
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Bib
 * Dependencies: 22970, 40666, 48170, 52571
 * Purpose: Buffer/Segment management, Logging, Configuration, Timing/Scheduling
 */

// import dep_22970 from './Module_22970.js';
// import dep_40666 from './Module_40666.js';
// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';

// Webpack module 53693
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(48170);
c = a(52571);
g = a(40666);
t = (function() {
    class f {
    constructor(e, h, k, l) {
        var m;
        m = this;
        this.tc = e;
        this.ZNc = h;
        this.T1a = k;
        this.console = l;
        e.Qa.on("stopStart", function() {
            return m.Vhc();
        });
        p.u && this.console.trace(("PacingThrottler: pacingFactory=").concat(h, ", pacingThreshold=").concat(k.ca()));
    }
    Vhc() {
        var e, h;
        h = this.tc.Qa;
        this.GZ = h.zj ? h.currentTime : undefined;
        this.P9 = this.mba = undefined;
        p.u && this.console.trace(("PacingThrottler: clock reset ").concat(null === (e = this.GZ) || undefined === e ? undefined : e.G));
    }
    waitUntil(e) {
        var h;
        e = (0,
        g.s5)(this.tc, e, true);
        h = e.promise;
        this.V8a = e.Oe;
        return h;
    }
    process(e) {
        return d.__awaiter(this, undefined, undefined, function() {
            var h, k, l, m;
            return d.__generator(this, function(n) {
                switch (n.label) {
                case 0:
                    if (e.done)
                        return [3, 11];
                    h = e.value.value;
                    (0,
                    c.assert)(h.Vb);
                    k = this.tc.Qa;
                    if (!this.mba || !this.P9)
                        return [3, 10];
                    if (!this.P9.greaterThan(this.T1a))
                        return [3, 8];
                    if (!this.GZ)
                        return [3, 5];
                    l = h.Vb.da(this.GZ).da(this.T1a);
                    m = this.GZ.add(l.Af(this.ZNc));
                    if (!m.lessThan(h.Vb))
                        return [3, 3];
                    if (!m.greaterThan(k.currentTime))
                        return [3, 2];
                    p.u && this.console.trace(("PacingThrottler: waiting until ").concat(m.ca(), " for mediaRequest @") + ("").concat(h.Vb.ca(), ", ") + ("current time ").concat(k.currentTime.ca(), ", ") + ("clock start time ").concat(this.GZ.ca(), ", ") + ("distance ").concat(l.ca()));
                    return [4, this.waitUntil(m)];
                case 1:
                    (n.T(),
                    n.label = 2);
                case 2:
                    return [3, 4];
                case 3:
                    (p.u && this.console.warn("PacingThrottler: invalid schedule time " + ("").concat(m.ca(), " for mediaRequest ") + ("@").concat(h.Vb.ca(), ", ") + ("current time ").concat(k.currentTime.ca(), ", ") + ("clock start time ").concat(this.GZ.ca(), ", ") + ("distance ").concat(l.ca())),
                    n.label = 4);
                case 4:
                    return [3, 7];
                case 5:
                    l = h.Vb.da(this.mba);
                    if (!l.greaterThan(this.T1a))
                        return [3, 7];
                    p.u && this.console.trace(("PacingThrottler: (buffering) waiting until ").concat(this.mba.G, "ms") + (" for mediaRequest @").concat(h.Vb.G, "ms, ") + ("current time ").concat(k.currentTime.G));
                    return [4, this.waitUntil(this.mba)];
                case 6:
                    (n.T(),
                    n.label = 7);
                case 7:
                    return [3, 9];
                case 8:
                    (this.P9 = this.P9.add(h.Ob),
                    n.label = 9);
                case 9:
                    return [3, 11];
                case 10:
                    (this.mba = h.Vb,
                    this.P9 = h.Ob,
                    n.label = 11);
                case 11:
                    return [2, e];
                }
            });
        });
    }
    reset() {
        var e;
        null === (e = this.V8a) || undefined === e ? undefined : e.La();
    }
}
Object.defineProperties(f.prototype, {
        name: {
            get: function() {
                return "Pacing";
            },
            enumerable: false,
            configurable: true
        }
    });
    return f;
}
)();
export const Bib = t;

// Detected exports: Bib
