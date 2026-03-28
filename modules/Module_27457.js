/**
 * Netflix Cadmium Playercore - Module 27457
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Hfb
 * Dependencies: 22970, 48170, 59458, 91176
 * Purpose: Manifest handling, Encryption/Decryption, Logging, Event handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_48170 from './Module_48170.js';
// import dep_59458 from './Module_59458.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 27457
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(91176);
c = a(59458);
g = a(48170);
t = (function() {
    class f {
    constructor(e, h, k) {
        var l;
        this.L = e;
        this.config = h;
        this.console = k;
        this.Xob = this.config.C1;
        this.Fpb = 0;
        this.oha = null;
        e.Ab && (this.L.FOb(),
        this.t_a = this.uOc(),
        this.VIc = (e = null === (l = e.S.Vi) || undefined === l ? undefined : l.iWc) && 0 < e ? p.I.uuc(e) : p.I.uh,
        this.Fpb = this.mmc());
    }
    jRa(e) {
        return (e instanceof p.I ? e : p.I.Ca(new Date(e).getTime())).da(this.HAa);
    }
    cjc(e) {
        var h;
        e = this.jRa(e);
        h = this.dE;
        if (h)
            return e.da(h);
        this.console.warn("LivePositionService.convertEpochToLiveUXContentTimestamp(): Event start time is not available");
        return p.I.ia;
    }
    Jpa(e) {
        return this.HAa.add(e);
    }
    iRa(e) {
        return this.t_a.add(e);
    }
    Yga(e) {
        return this.L.fr.Yga(e);
    }
    q2a(e) {
        return this.L.fr.q2a(e);
    }
    Gdc(e) {
        return e.add(p.I.Ca(this.config.Tk));
    }
    Cn(e) {
        return p.I.Ca(Math.max(0, this.Al(e) - this.config.Tk));
    }
    Dba() {
        var e, h;
        e = this.Zba(true);
        h = p.I.Ca(this.L.fr.Wf).da(this.VIc);
        return h.lessThan(e) ? p.I.ia : h.da(e);
    }
    AM() {
        return null !== this.oha;
    }
    K5a(e) {
        this.oha = p.I.Ca(this.L.fr.Wf - this.config.Tk - e - this.config.cZc);
    }
    G4a(e) {
        this.AM() && (this.oha = this.oha.add(p.I.Ca(e)));
    }
    Zba(e) {
        return e && this.AM() ? this.oha : this.t_a;
    }
    PVa(e) {
        return this.Zba(e).add(p.I.Ca(this.Xob)).add(p.I.Ca(this.nQb));
    }
    Al(e) {
        e = this.PVa(e).G;
        return Math.max(0, this.L.fr.Wf - e);
    }
    rvb(e) {
        return this.dE ? e.add(this.dE) : this.Cwb.m_a;
    }
    uOc() {
        var e, h;
        e = this.L.S.Vi;
        (0,
        p.assert)(e, "LivePositionService.parseManifestAvailabilityStartTime(): Expected live metadata");
        h = d.__read(Object.keys(e.iV), 1)[0];
        e = new Date("string" === typeof e.XQ ? e.XQ : e.iV[h].XQ).getTime();
        return p.I.Ca(e);
    }
    mmc() {
        var e;
        if (Math.random() < this.config.Wua)
            return (g.u && (0,
            p.assert)(0 >= this.config.Jda, "`liveEarlyRequestDefaultoffsetMs` must be negative"),
            this.config.Jda);
        e = (0,
        c.ePb)(0, this.config.dva, {
            aDc: true,
            uCc: true
        });
        g.u && this.console.log(("Client request offset is ").concat(e, "ms"));
        return e;
    }
}
Object.defineProperties(f.prototype, {
        nQb: {
            get: function() {
                return this.Fpb;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        bIb: {
            get: function() {
                return this.Xob;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        Wf: {
            get: function() {
                return this.L.fr.Wf;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        HAa: {
            get: function() {
                return this.t_a.da(this.bsc);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        z_c: {
            get: function() {
                var e;
                e = this.L.Rh.ML;
                if (undefined !== e)
                    return p.I.Ca(e);
                e = this.L.Rh.endTime;
                if (undefined === e)
                    return p.I.uh;
                e = new Date(e).getTime() + this.config.dIb;
                return p.I.Ca(e);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        bba: {
            get: function() {
                var e;
                e = this.L.Rh.startTime;
                if (undefined !== e)
                    return p.I.Ca(new Date(e).getTime());
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        cS: {
            get: function() {
                var e;
                e = this.L.Rh.endTime;
                if (undefined !== e)
                    return p.I.Ca(new Date(e).getTime());
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        eUb: {
            get: function() {
                return this.z_c.da(this.HAa);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        dE: {
            get: function() {
                var e;
                e = this.L.Rh.startTime;
                if (undefined !== e)
                    return this.jRa(e);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        Cwb: {
            get: function() {
                return {
                    m_a: p.I.Ca(this.Al(true)),
                    AGc: this.Cn(true)
                };
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        $aa: {
            get: function() {
                var e;
                e = this.L.Rh.endTime;
                if (undefined !== e)
                    return this.jRa(e);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(f.prototype, {
        bsc: {
            get: function() {
                var e, h;
                h = this.L.S.Vi;
                h = null !== (e = null === h || undefined === h ? undefined : h.kra) && undefined !== e ? e : 0;
                return p.I.Ca(h);
            },
            enumerable: false,
            configurable: true
        }
    });
    return f;
}
)();
export const Hfb = t;

// Detected exports: Hfb
