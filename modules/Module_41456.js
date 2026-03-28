/**
 * Netflix Cadmium Playercore - Module 41456
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Kgb
 * Dependencies: 12548, 22970, 40666, 48170, 61996, 66164, 90745, 91176, 91562
 * Purpose: Logging, Event handling, Configuration, Caching/Storage
 */

// import dep_12548 from './Module_12548.js';
// import dep_22970 from './Module_22970.js';
// import dep_40666 from './Module_40666.js';
// import dep_48170 from './Module_48170.js';
// import dep_61996 from './Module_61996.js';
// import dep_66164 from './Module_66164.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';
// import dep_91562 from './Module_91562.js';

// Webpack module 41456
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l;

d = a(22970);
p = a(90745);
c = a(66164);
g = a(91176);
f = a(91562);
e = a(61996);
h = a(48170);
k = a(40666);
l = a(12548);
t = (function() {
    class m {
    constructor(n, q, r, u) {
        this.ka = n;
        this.jg = q;
        this.config = r;
        this.console = u;
        this.vE = new p.sf();
        this.y2a = new p.sf();
        this.events = new p.EventEmitter();
        this.console = (0,
        g.Nf)(c.platform, u, "MEDIAEVENTSMANAGER");
        h.u && this.console.trace("MediaEventsManager ctor");
        this.tk = new e.Tm({
            Ej: this,
            source: "media-events-manager",
            Ig: 10,
            console: u
        });
        this.aya = this.ka.sd;
        this.Oea = new l.Ahb();
    }
    Lsa(n) {
        return n.cg;
    }
    OI(n) {
        var q, r, u, v, w, x, y, A, z, B, C, D, E, G;
        q = this;
        if (this.enabled && n.Ab) {
            C = this.Lsa(n);
            if (C) {
                h.u && this.console.trace("MediaEventsManager", "onViewableReceived", n.J);
                D = function(F) {
                    F = {
                        id: F.id,
                        Qj: F.Qj,
                        cF: F.cF,
                        payload: F.payload
                    };
                    h.u && q.console.trace("emitting mediaEventReceived:", F);
                    q.events.emit("mediaEventReceived", F);
                }
                ;
                C.model.OB.forEach(D);
                this.vE.addListener(C.events, "netflixEventReceived", D);
                this.vE.addListener(C.events, "netflixEventCancelled", function(F) {
                    var H;
                    F = {
                        id: F.id,
                        Qj: F.Qj,
                        x3c: F.duration.G,
                        cF: F.cF,
                        payload: F.payload,
                        timestamp: c.platform.time.fa()
                    };
                    h.u && q.console.trace("emitting mediaEventCancelled:", F);
                    q.events.emit("mediaEventCancelled", F);
                    q.Oea.IAc(F);
                    null === (H = q.Hva) || undefined === H ? undefined : H.kd();
                });
                this.vE.addListener(C.events, "modelUpdated", function(F) {
                    var H;
                    h.u && q.console.trace("modelUpdated", {
                        id: n.J,
                        RWb: Array.from(F.h5.values())
                    });
                    (F.h5.has("breakstart") || F.h5.has("adbreak") || F.h5.has("breakend")) && q.events.emit("adsUpdated", {
                        L: n,
                        dwa: F.dwa
                    });
                    F.h5.has("netflix") && (h.u && q.console.trace("restarting mediaEventsTask - netflix updates"),
                    null === (H = q.Hva) || undefined === H ? undefined : H.kd());
                });
                this.vE.addListener(C.events, "progress", function(F) {
                    var H;
                    if (q.qJ) {
                        H = {
                            L: n,
                            wa: F.wa
                        };
                        h.u && q.console.trace("emitting mediaEventsProgress:", {
                            J: n.J,
                            wa: F.wa.ca()
                        });
                        q.events.emit("mediaEventsProgress", H);
                    }
                });
                if (n.Ab && (h.u && this.console.trace("Received media events", {
                    J: n.J,
                    Hdd: null === (u = null === (r = n.S) || undefined === r ? undefined : r.wd) || undefined === u ? undefined : u.Uj
                }),
                h.u)) {
                    E = n.Ic.dE;
                    r = n.Ic.$aa;
                    u = (null === (v = n.cg) || undefined === v ? undefined : v.model.cc.map(function(F) {
                        return F.Ga;
                    })) || [];
                    v = null === (y = null === (x = null === (w = n.cg) || undefined === w ? undefined : w.model.NM) || undefined === x ? undefined : x.Yk) || undefined === y ? undefined : y.Ga;
                    w = null === (B = null === (z = null === (A = n.cg) || undefined === A ? undefined : A.model.NM) || undefined === z ? undefined : z.Xk) || undefined === B ? undefined : B.Ga;
                    G = function(F, H) {
                        var J;
                        if (F) {
                            J = {
                                content: F.ca(g.vG.h6a),
                                Hg: new Date(n.Ic.Jpa(F).G).toISOString()
                            };
                            H && (J.Uld = F.da(H).ri);
                            return J;
                        }
                    }
                    ;
                    this.console.debug("Live Timeline", {
                        J: n.J,
                        Rh: {
                            start: G(E),
                            end: G(r),
                            Yk: G(v, E),
                            Xk: G(w, E),
                            In: u.map(function(F) {
                                return G(F, E);
                            }),
                            UZa: G(n.Ic.Cn(true), E)
                        }
                    });
                }
                this.vE.on(this.aya, "clockChanged", function() {
                    var F;
                    q.y2a.clear();
                    q.y2a.on(q.aya.Qa, "clockAdjusted", function(H) {
                        var J;
                        H.reason === g.Hx.rO && (h.u && q.console.trace("restarting mediaEventsTask - clockAdjusted"),
                        null === (J = q.Hva) || undefined === J ? undefined : J.kd());
                    });
                    h.u && q.console.trace("restarting mediaEventsTask - clockChanged");
                    null === (F = q.Hva) || undefined === F ? undefined : F.kd();
                });
                this.Hva = this.aya.Fs(function() {
                    return q.WVc(n);
                }, "media-events-scheduler");
            }
        }
    }
    G2(n, q) {
        this.qJ && this.wqa();
        this.aic(n, q);
    }
    WH(n) {
        var q;
        if (this.enabled) {
            q = this.Lsa(n);
            if (q)
                return (q = (q.model.cc || []).map(function(r) {
                    var u, v, w, x, y, A, z;
                    u = r.location;
                    v = r.Zp;
                    w = r.hb;
                    x = r.duration;
                    y = u.G;
                    A = n.Ip ? v === f.e8.KZb : true;
                    n.Ip ? z = {
                        zBa: "ENABLED_AS_NORMAL"
                    } : n.Ab && (z = {
                        zBa: "DISABLED_EXCEPT_FOR_PAUSE_EXIT"
                    });
                    return {
                        Ga: r.Ga,
                        location: u,
                        Xu: y,
                        qo: A,
                        kj: y,
                        yb: [],
                        VK: {},
                        duration: x,
                        Zk: x,
                        EPb: true,
                        yu: true,
                        type: "embedded",
                        Zp: v,
                        hb: w,
                        source: "mediaEvents",
                        o5: z
                    };
                }),
                this.tk.Eg({
                    ads: q.slice(-5)
                }),
                q);
            h.u && this.console.debug("No store found for viewable - not returning ads", n.R);
        } else
            h.u && this.console.debug("MediaEventsManager disabled - not returning ads");
    }
    qKc(n, q, r) {
        var u, v;
        u = this.jg.get(n);
        if (u) {
            v = q.da(g.I.Ca(this.config.gIb)).da(r);
            if (this.qJ) {
                (0,
                g.assert)(this.m6a, "Skip offset must be set if skip task is set");
                if (this.m6a.Hn(v))
                    return;
                this.wqa();
            }
            h.u && this.console.trace("MediaEventsManager: needsMediaEvents starting skip task", n, q, r, v);
            this.iwb(u, v);
        }
    }
    duc(n, q) {
        this.qJ && this.wqa();
        q = q.da(g.I.Ca(this.config.gIb));
        h.u && this.console.trace("MediaEventsManager: forceRestartSkipTask, starting skip task", n.J, q);
        this.iwb(n, q);
    }
    iwb(n, q) {
        var r;
        r = this;
        (0,
        g.assert)(!this.qJ, "Skip task must not be set when creating a new one");
        this.qJ = this.aya.Fs(function() {
            return r.jZc(n, q);
        }, "media-events-skipper");
        this.m6a = q;
    }
    wqa() {
        var n;
        (0,
        g.assert)(this.qJ, "Skip task  must be set when destructing it");
        null === (n = this.qJ) || undefined === n ? undefined : n.La();
        this.m6a = this.qJ = undefined;
    }
    La() {
        this.qJ && this.wqa();
        this.y2a.clear();
        this.vE.clear();
        this.Oea.reset();
    }
    jZc(n, q) {
        var r, u, v;
        return d.__generator(this, function(w) {
            switch (w.label) {
            case 0:
                (r = this.Lsa(n),
                (0,
                g.assert)(r, "Store must be present"),
                h.u && this.console.trace(("MediaEventsManager: starting skip task for viewable ").concat(n.J, " ") + ("with skip offset ").concat(q.ca())),
                w.label = 1);
            case 1:
                if (r.complete)
                    return [3, 3];
                u = r.Sw;
                v = u.add(q);
                h.u && this.console.trace(("MediaEventsManager: waiting until ").concat(v.ca(), " ") + ("to skip media events at ").concat(u.ca()));
                return [4, k.ie.Jm(v)];
            case 2:
                return (w.T(),
                r.nEb(u) || (h.u && this.console.trace(("MediaEventsManager: skipping at ").concat(u.ca()), {
                    skip: q.ca(),
                    target: u.ca(),
                    Mwb: r.Sw.ca(),
                    UZa: n.Cn().ca()
                }),
                r.lTb(u)),
                [3, 1]);
            case 3:
                return [2];
            }
        });
    }
    WVc(n) {
        var q, r, u, v, w, x, y, A, z, B, C, D, E;
        return d.__generator(this, function(G) {
            switch (G.label) {
            case 0:
                (G.ac.push([0, 7, 8, 9]),
                q = d.__values(this.Xxc(n)),
                r = q.next(),
                G.label = 1);
            case 1:
                if (r.done)
                    return [3, 6];
                u = r.value;
                v = u.event;
                w = u.Ho;
                h.u && this.console.trace("MediaEventsManager - Checking event schedule - ", {
                    ev: this.ev,
                    event: v,
                    Ho: w
                });
                if ((null === (E = this.ev) || undefined === E ? undefined : E.id) === v.id && w)
                    return [3, 3];
                this.ev && (h.u && this.console.trace("MediaEventsManager - Closing this.openedMediaEvent", {
                    ev: this.ev
                }),
                this.LQa(n, this.ev));
                x = this.ka.Ds({
                    J: n.J,
                    Ga: v.Ga
                });
                if (!x)
                    return [3, 3];
                y = this.ka.eB(x);
                if (!y)
                    return [3, 3];
                h.u && this.console.trace("MediaEventsManager - Waiting for media event to begin:", {
                    event: v
                });
                return [4, k.ie.Jm(y)];
            case 2:
                (G.T(),
                h.u && this.console.trace("MediaEventsManager - Opening media event:", {
                    event: v
                }),
                this.rNc(n, v),
                G.label = 3);
            case 3:
                A = this.ka.Ds({
                    J: n.J,
                    Ga: v.Ga.add(v.duration)
                });
                if (!A)
                    return [3, 5];
                z = this.ka.eB(A);
                if (!z)
                    return [3, 5];
                h.u && this.console.trace("MediaEventsManager - Waiting for event to elapse:", {
                    event: v
                });
                return [4, k.ie.Jm(z)];
            case 4:
                (G.T(),
                h.u && this.console.trace("MediaEventsManager - Closing event:", {
                    event: v
                }),
                this.LQa(n, v),
                G.label = 5);
            case 5:
                return (r = q.next(),
                [3, 1]);
            case 6:
                return [3, 9];
            case 7:
                return (B = G.T(),
                C = {
                    error: B
                },
                [3, 9]);
            case 8:
                try {
                    r && !r.done && (D = q.return) && D.call(q);
                } finally {
                    if (C)
                        throw C.error;
                }
                return [7];
            case 9:
                return [2];
            }
        });
    }
    Xxc(n) {
        var q, r, u, v, w, x, y, A, z, B, C, D, E;
        return d.__generator(this, function(G) {
            switch (G.label) {
            case 0:
                q = this.Lsa(n);
                (0,
                g.assert)(q, "Store must be present");
                r = this.ka;
                u = q.model.OB;
                v = r.gAb(n.J);
                if (!v)
                    return [3, 8];
                w = r.Rs(v);
                x = false;
                G.label = 1;
            case 1:
                (G.ac.push([1, 6, 7, 8]),
                y = d.__values(u),
                A = y.next(),
                G.label = 2);
            case 2:
                if (A.done)
                    return [3, 5];
                z = A.value;
                B = false;
                !x && w.Ga.lessThan(z.Ga.add(z.duration)) && (x = true,
                B = w.Ga.$f(z.Ga));
                return x ? [4, {
                    event: z,
                    Ho: B
                }] : [3, 4];
            case 3:
                (G.T(),
                G.label = 4);
            case 4:
                return (A = y.next(),
                [3, 2]);
            case 5:
                return [3, 8];
            case 6:
                return (C = G.T(),
                D = {
                    error: C
                },
                [3, 8]);
            case 7:
                try {
                    A && !A.done && (E = y.return) && E.call(y);
                } finally {
                    if (D)
                        throw D.error;
                }
                return [7];
            case 8:
                return [2];
            }
        });
    }
    rNc(n, q) {
        var r;
        this.ev = q;
        r = q.Ga;
        n = g.I.Ca(n.Al()).da(r).G;
        r = this.ka.Rs(this.ka.Wg).Ga.da(r);
        q = {
            id: q.id,
            Qj: q.Qj,
            U_: n,
            duration: q.duration.G,
            cF: q.cF,
            payload: q.payload,
            p7a: r.G,
            timestamp: c.platform.time.fa()
        };
        h.u && this.console.trace("emitting mediaEventTriggered:", q);
        this.events.emit("mediaEventTriggered", q);
        this.Oea.KAc(q);
    }
    aic(n, q) {
        var r, u;
        if (q && this.ev && n) {
            q = this.ka.Rs(q);
            r = this.ev.Ga;
            u = r.add(this.ev.duration);
            if (q.Ga.lessThan(r) || q.Ga.greaterThan(u))
                (h.u && this.console.trace("MediaEventsManager - Seek position not in window closing media event - ", {
                    ev: this.ev
                }),
                this.LQa(n, this.ev));
        }
    }
    LQa(n, q) {
        var r;
        this.ev = undefined;
        r = q.Ga.add(q.duration);
        n = g.I.Ca(n.Al()).da(r).G;
        q = {
            id: q.id,
            Qj: q.Qj,
            U_: n,
            timestamp: c.platform.time.fa()
        };
        h.u && this.console.trace("emitting mediaEventElapsed:", q);
        this.events.emit("mediaEventElapsed", q);
        this.Oea.JAc(q);
    }
}
Object.defineProperties(m.prototype, {
        enabled: {
            get: function() {
                return this.config.RR;
            },
            enumerable: false,
            configurable: true
        }
    });
    d.__decorate([(0,
    e.kb)({
        methodName: "getAds",
        df: true
    })], m.prototype, "WH", null);
    return m;
}
)();
export const Kgb = t;

// Detected exports: Kgb
