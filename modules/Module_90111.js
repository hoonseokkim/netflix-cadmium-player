/**
 * Netflix Cadmium Playercore - Module 90111
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: zjb
 * Dependencies: 65161, 66164, 85254, 90745, 91176
 * Purpose: Logging, Event handling, Configuration, Playback control
 */

// import dep_65161 from './Module_65161.js';
// import dep_66164 from './Module_66164.js';
// import dep_85254 from './Module_85254.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 90111
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(90745);
p = a(91176);
t = a(66164);
c = a(65161);
a = a(85254);
g = new t.platform.Console("PLAYERCLOCK");
t = (function() {
    class f {
    constructor(e) {
        this.player = e;
        this.LMa = false;
        this.IKb = new d.sf();
        this.wTc();
    }
    wTc() {
        var e, h;
        e = this;
        h = this.IKb;
        h.on(this.player, "paused", function() {
            return e.hxa();
        });
        h.on(this.player, "playing", function() {
            return e.hxa(true);
        });
        h.on(this.player, "underflow", function() {
            return e.hxa();
        });
        h.on(this.player, "skipped", function() {
            return e.u1a();
        });
        h.on(this.player, "clockAdjusted", function() {
            return e.afa();
        });
        h.on(this.player, "playbackRateChanged", function() {
            return e.MMc();
        });
    }
    hxa(e) {
        undefined === e && (e = false);
        e !== this.LMa && (this.YTb = (this.LMa = e) ? undefined : this.player.Ld,
        e ? g.log("PlayerClock: Player is running", this.player.Ld) : g.log("PlayerClock: Player is stopping", this.player.Ld));
        this.emit("stopStart", {
            type: "stopStart"
        });
    }
    u1a() {
        this.YTb = undefined;
        this.afa(c.Hx.rO);
    }
    afa(e) {
        undefined === e && (e = c.Hx.aH);
        g.log("PlayerClock: clock adjusted", {
            ir: this.zj,
            time: this.player.Ld,
            reason: c.Hx[e]
        });
        this.emit("clockAdjusted", {
            type: "clockAdjusted",
            reason: e
        });
    }
    MMc() {
        this.emit("speedChanged", {
            type: "speedChanged"
        });
    }
    La() {
        this.hxa();
        this.IKb.clear();
    }
}
Object.defineProperties(f.prototype, {
        currentTime: {
            get: function() {
                return this.YTb || this.player.Ld || p.I.ia;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        zj: {
            get: function() {
                return this.LMa;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        speed: {
            get: function() {
                var e;
                return null !== (e = this.player.playbackRate) && undefined !== e ? e : 1;
            },
            enumerable: false,
            configurable: true
        }
    });
    return f;
}
)();
export const zjb = t;
(0,
a.Ol)(d.EventEmitter, t);

// Detected exports: zjb
