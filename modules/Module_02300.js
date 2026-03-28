/**
 * Netflix Cadmium Playercore - Module 2300
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: mJa
 * Dependencies: 66164, 90745, 91176
 * Purpose: Manifest handling, Logging, Event handling, Configuration
 */

// import dep_66164 from './Module_66164.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 2300
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

a(22970);
d = a(66164);
p = a(91176);
c = a(91176);
g = a(90745);
f = 0;
t = (function() {
    class e {
    constructor(h, k, l) {
        this.u_a = h;
        this.Jp = k;
        this.id = f++;
        this.Pta = this.a$b = false;
        this.events = new g.EventEmitter();
        this.console = (0,
        p.Nf)(d.platform, l, ("PLAYBACKMANIFESTCACHE [").concat(this.id, "]"));
        this.console.trace("Creating this instance");
        this.tfa = new c.Jka(this.console,"playback-manifest-cache");
    }
    aga() {
        this.Pta || (this.Pta = true,
        e.I1a++);
    }
    YVb() {
        this.Pta && (this.Pta = false,
        e.I1a--);
    }
    Bp(h) {
        var k, l, m;
        k = this;
        l = h.J;
        m = this.Jp(h);
        return this.tfa.eWa(m, function() {
            var n;
            k.console.trace("Getting manifest", {
                J: l,
                SJb: m
            });
            k.a$b && h.Vs && (h.Vs = false);
            n = k.u_a.Bp(h);
            n.value.S.then(function() {
                k.console.trace("Manifest received", {
                    J: l,
                    SJb: m
                });
            }, function(q) {
                k.console.trace("Manifest error received", {
                    error: q
                });
            });
            e.J1a++;
            k.aga();
            return {
                value: {
                    S: n.value
                },
                tN: function() {
                    n.Qk.release();
                    k.events.emit("itemRemoved", {
                        type: "itemRemoved",
                        item: n.value
                    });
                    k.console.trace("Releasing manifest", {
                        J: l,
                        SJb: m,
                        Bid: k.tfa.size,
                        Gcd: n
                    });
                    e.J1a--;
                    0 === k.size && k.YVb();
                }
            };
        });
    }
    Hh() {
        var h;
        this.console.trace("Destroying");
        null === (h = this.tfa) || undefined === h ? undefined : h.clear();
        this.YVb();
    }
}
Object.defineProperties(e.prototype, {
        size: {
            get: function() {
                return this.tfa.size;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        WOc: {
            get: function() {
                return Array.from(this.tfa.values()).filter(function(h) {
                    return !h.value.S.gB;
                }).length;
            },
            enumerable: false,
            configurable: true
        }
    });
    e.J1a = 0;
    e.I1a = 0;
    return e;
}
)();
export const mJa = t;

// Detected exports: mJa
