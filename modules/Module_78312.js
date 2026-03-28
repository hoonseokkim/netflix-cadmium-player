/**
 * Netflix Cadmium Playercore - Module 78312
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Efb
 * Dependencies: 5021, 30873, 32687, 45146, 45247, 81734, 85001, 91176
 * Purpose: Manifest handling, Buffer/Segment management, Logging, Event handling
 */

// import dep_5021 from './Module_5021.js';
// import dep_30873 from './Module_30873.js';
// import dep_32687 from './Module_32687.js';
// import dep_45146 from './Module_45146.js';
// import dep_45247 from './Module_45247.js';
// import dep_81734 from './Module_81734.js';
// import dep_85001 from './Module_85001.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 78312
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l;
class d {
    constructor(m, n, q, r, u, v) {
    var w, x, y, A, z;
    w = this;
    this.config = m;
    this.Kd = q;
    this.K = u;
    this.j = v;
    this.US = new h.Ac(false);
    this.jPa = new h.Ac(false);
    this.Co = this.Jk = undefined;
    this.c6a = false;
    this.jS = undefined;
    this.log = r.zb("LivePlaybackManager");
    this.jS = this.config().Wtc;
    x = this.config().c_c;
    y = this.config().XGc;
    this.c6a = (0,
    g.wc)(x) && (0,
    g.wc)(y);
    null === v || undefined === v ? undefined : v.addEventListener(f.ja.Sp, function() {
        var B;
        if (w.Da && ((0,
        c.ta)(w.j && w.j.ga === w.K, "Unexpected playback segment on playbackReady"),
        w.config().Oqc && (w.ONb = n(function(C) {
            (0,
            c.ta)(w.Da && w.j && w.j.ga === w.K, "Unexpected playback segment on playback rate update");
            w.K.playbackRate.value !== C && (w.K.playbackRate.set(C),
            w.j.fireEvent(f.ja.UM));
        })),
        w.c6a)) {
            B = w.ZA();
            A = w.Kd.gV((0,
            p.pc)(500), function() {
                var C, D, E, G;
                C = w.ZA();
                E = B + x;
                C >= E - 500 && (D = w.lRa(E));
                E = B + x + y;
                if (C >= E - 500) {
                    G = w.lRa(E);
                    null === A || undefined === A ? undefined : A.cancel();
                }
                w.A5a(D, G, true);
            });
        }
    });
    null === v || undefined === v ? undefined : v.addEventListener(f.ja.Fh, function() {
        var B;
        w.Da && ((0,
        c.ta)(w.j && w.j.ga === w.K, "Unexpected playback segment on closing"),
        w.ONb = undefined,
        null === (B = w.Ida) || undefined === B ? undefined : B.cancel(),
        w.Ida = undefined,
        null === A || undefined === A ? undefined : A.cancel());
    });
    null === v || undefined === v ? undefined : v.addEventListener(f.ja.bza, function(B) {
        w.Da && ((0,
        c.ta)(w.j && w.j.ga === w.K, "Unexpected playback segment on repositioning"),
        B.Jc !== f.Tc.Dv && B.Jc !== f.Tc.lX || w.US.set((B.Jc === f.Tc.lX || w.config().tV) && !w.rGb()));
    });
    null === v || undefined === v ? undefined : v.addEventListener(f.ja.G8a, function() {
        w.Da && ((0,
        c.ta)(w.j && w.j.ga === w.K, "Unexpected playback segment on userInitiatedPause"),
        w.US.set(false));
    });
    null === v || undefined === v ? undefined : v.background.addListener(function() {
        var B;
        w.Da && ((0,
        c.ta)(w.j && w.j.ga === w.K, "Unexpected playback segment on background update"),
        !w.j.background.value && w.Ku() && undefined === w.jS && (w.ZS() ? null === (B = w.j.ae) || undefined === B ? undefined : B.seek(w.Jk, f.Tc.Dv) : w.W3()));
    });
    this.K.mediaTime.addListener(function() {
        var B, C, D, E, G, F;
        if (w.Da) {
            (0,
            c.ta)(w.j && w.j.ga === w.K, "Unexpected playback segment on mediaTime update");
            E = w.j;
            w.bpa();
            G = z;
            F = null !== (B = w.K.Gs) && undefined !== B ? B : undefined;
            z = F;
            B = w.aM(G);
            G = w.aM(F);
            B !== G && (false,
            E.fireEvent(f.ja.UM));
            w.ZS() ? (null === (C = w.Ida) || undefined === C ? undefined : C.cancel(),
            w.Ida = undefined) : w.Ida || (w.Ida = w.Kd.gV((0,
            p.pc)(1E3), function() {
                w.bpa();
                E.fireEvent(f.ja.UM);
            }));
            null === (D = w.ONb) || undefined === D ? undefined : D.f5(w.j.mk.value && w.Ku(), F, w.ZA());
            w.config().Bqc && w.eEc() && w.MAb();
        }
    });
    null === v || undefined === v ? undefined : v.mk.addListener(function() {
        w.Da && ((0,
        c.ta)(w.j && w.j.ga === w.K, "Unexpected playback segment on playing update"),
        w.config().Cqc && w.MAb());
    });
    this.US.addListener(function() {
        (0,
        c.ta)(w.Da, "Unexpected call to intentToPlayAtLiveEdge.set(). isLive:" + w.Da);
        (0,
        c.ta)(w.j && w.j.ga === w.K, "Playback is required for live.");
        w.bpa();
    });
    this.jPa.addListener(function() {
        (0,
        c.ta)(w.Da, "Unexpected call to intentToPlayAtLiveEdge.set(). isLive:" + w.Da);
        (0,
        c.ta)(w.j && w.j.ga === w.K, "Playback is required for live.");
        false;
        w.j.fireEvent(f.ja.UM);
    });
}
    g_c() {
    var m, n;
    return undefined !== (null === (n = null === (m = this.K.S) || undefined === m ? undefined : m.Aa.Vi) || undefined === n ? undefined : n.cS);
}
    FYc() {
    var m, n, q, r;
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    r = null !== (q = null === (n = null === (m = this.K.S) || undefined === m ? undefined : m.Aa.Vi) || undefined === n ? undefined : n.Jxb) && undefined !== q ? q : false;
    return this.config().Ztc || r && this.g_c();
}
    g3a() {
    var m;
    (0,
    c.ta)(this.Da, "Unexpected call to processManifest(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    (0,
    c.ta)(null === (m = this.K.S) || undefined === m ? undefined : m.Aa.Vi, "Live manifest is unavailable.");
    m = this.K.S.Aa.Vi;
    this.A5a(m.bba, m.cS);
    m = this.config().$tc;
    undefined !== m && undefined !== this.Jk && (this.jS = this.Jk + m);
}
    A5a(m, n, q) {
    var r, u, v, w, x;
    (0,
    c.ta)(this.Da, "Unexpected call to setLiveEventTimes(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    if (!this.c6a || q) {
        q = this.j;
        v = this.Jk;
        w = this.Co;
        x = null !== (r = this.pvb(m)) && undefined !== r ? r : v;
        r = null !== (u = this.pvb(n)) && undefined !== u ? u : w;
        if (undefined === x && undefined === r || undefined !== x && 0 <= x && undefined === r || undefined !== x && 0 <= x && undefined !== r && r > x) {
            if ((this.Jk = x,
            this.Co = r,
            v !== this.Jk || w !== this.Co))
                (false,
                q.fireEvent(f.ja.UM));
        } else
            this.log.error("Unexpected live event times. Ignoring:startTime:" + (m + ", startPts:") + (x + ", endTime:") + (n + ", endPts:") + r);
    }
}
    Xvc() {
    var m;
    (0,
    c.ta)(this.Da, "Unexpected call to getCurrentContentEventTime(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    m = this.K.Gs;
    if (null !== m)
        return this.lRa(m);
}
    Yvc() {
    var m, n, q;
    (0,
    c.ta)(this.Da, "Unexpected call to getCurrentSegmentNumber(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    (0,
    c.ta)(null === (m = this.K.S) || undefined === m ? undefined : m.Aa.Vi, "Live manifest is unavailable.");
    m = this.K.Gs;
    if (null !== m) {
        n = this.K.S.Aa.Vi;
        q = n.iV[n.Iqa[this.K.S.Aa.il[0].streams[0].sh]];
        n = Number(q.FTb);
        q = new k.I(q.duration,q.O);
        return n + Math.floor(m / q.G);
    }
}
    Tsa() {
    var m;
    (0,
    c.ta)(this.Da, "Unexpected call to getUIAdjustedCurrentContentPts(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    m = this.K.Gs;
    if (null !== m)
        switch (this.aM(m)) {
        case e.Kx.c8:
            return 0;
        case e.Kx.Ika:
            return ((0,
            c.ta)(undefined !== this.Jk, "eventStartPts should be defined in LIVE_EVENT slate."),
            m - this.Jk);
        case e.Kx.FEa:
            return ((0,
            c.ta)(undefined !== this.Jk && undefined !== this.Co, "eventStartPts and eventEndPts should be defined in END_SLATE slate."),
            this.Co - this.Jk);
        }
}
    SQb(m) {
    var n, q;
    (0,
    c.ta)(this.Da, "Unexpected call to revertUIAdjustedTime(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    return undefined === this.Jk ? null !== (q = null !== (n = this.ZA()) && undefined !== n ? n : this.K.Gs) && undefined !== q ? q : m : this.Jk + m;
}
    DGb(m) {
    var n;
    (0,
    c.ta)(this.Da, "Unexpected call to isWithinUILiveEdgeThreshold(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    n = this.ZA();
    return undefined !== n && m >= n - this.config().BGc;
}
    NVa(m, n) {
    var q, r, u;
    (0,
    c.ta)(this.Da, "Unexpected call to getLiveBookmark(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    if (undefined !== this.jS)
        return {
            Hq: this.jS,
            DN: Number.MAX_SAFE_INTEGER,
            bxb: this.jS
        };
    this.config().tV && this.US.set(true);
    u = Number.MAX_SAFE_INTEGER;
    n || undefined === this.Jk || undefined === this.Co && 0 === m ? (this.US.set(true),
    m = u) : (m = this.Jk + m,
    undefined !== this.Co && m > this.Co && (m = this.Jk));
    return {
        Hq: m,
        DN: null !== (q = this.Co) && undefined !== q ? q : Number.MAX_SAFE_INTEGER,
        bxb: null !== (r = this.Jk) && undefined !== r ? r : u
    };
}
    YL() {
    var m, n, q;
    return Math.max(null !== (m = this.Co) && undefined !== m ? m : 0, null !== (n = this.ZA()) && undefined !== n ? n : 0, null !== (q = this.K.Gs) && undefined !== q ? q : 0);
}
    LDb() {
    var m;
    (0,
    c.ta)(this.Da, "Unexpected call to getLiveContentDuration(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    if (undefined === this.Jk)
        return 0;
    m = this.K.Gs;
    return (undefined !== this.Co ? this.Co : this.Fy() && null !== m ? m : this.YL()) - this.Jk;
}
    Hxc() {
    var m;
    (0,
    c.ta)(this.Da, "Unexpected call to getMaxSeekPts(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    m = this.ZA();
    m = undefined !== this.Co && undefined !== m ? Math.min(this.Co, m) : m;
    false;
    return null !== m && undefined !== m ? m : 0;
}
    ZA() {
    var m, n;
    (0,
    c.ta)(this.Da, "Unexpected call to getLiveEdge(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    return null === (n = null === (m = this.j.fb) || undefined === m ? undefined : m.Cn(this.K.R)) || undefined === n ? undefined : n.G;
}
    W3() {
    var m;
    (0,
    c.ta)(this.Da, "Unexpected call to seekToLiveEdge(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    this.US.set(!this.rGb());
    if (this.j.ae) {
        m = this.ZA();
        undefined !== m ? this.j.ae.seek(m, f.Tc.lX, this.K.M) : false;
    } else
        this.K.Hq = this.NVa(0, true).Hq;
}
    Fy() {
    (0,
    c.ta)(this.Da, "Unexpected call to isAtLiveEdge(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    this.bpa();
    return this.jPa.value;
}
    Ku() {
    (0,
    c.ta)(this.Da, "Unexpected call to intentToPlayAtLiveEdge(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    return this.US.value;
}
    aM(m) {
    var n, q, r, u;
    (0,
    c.ta)(this.Da, "Unexpected call to getLiveEventState(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    if ((0,
    l.Hy)(null === (n = this.K.S) || undefined === n ? undefined : n.Aa.rf))
        return e.Kx.Ika;
    m = null !== (q = null !== m && undefined !== m ? m : this.K.Gs) && undefined !== q ? q : 0;
    n = null !== (r = this.Jk) && undefined !== r ? r : Infinity;
    r = null !== (u = this.Co) && undefined !== u ? u : Infinity;
    return m < n ? e.Kx.c8 : m > r ? e.Kx.FEa : e.Kx.Ika;
}
    ZS(m) {
    (0,
    c.ta)(this.Da, "Unexpected call to isLiveEventEnded(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    if (m)
        return undefined !== this.Co;
    m = this.ZA();
    return undefined !== this.Co && undefined !== m && this.Co < m;
}
    eEc() {
    var m;
    (0,
    c.ta)(this.Da, "Unexpected call to isLiveEventStarted(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    m = this.ZA();
    return undefined !== this.Jk && undefined !== m && this.Jk < m;
}
    rGb() {
    var m;
    (0,
    c.ta)(this.Da, "Unexpected call to isPlaybackPausedByUser(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    return this.j.paused.value && !(null === (m = this.j.paused.sn) || undefined === m ? 0 : m.QB);
}
    bpa() {
    var m;
    (0,
    c.ta)(this.Da, "Unexpected call to calculateIsAtLiveEdge(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    this.jPa.set(this.Ku() && this.DGb(null !== (m = this.K.Gs) && undefined !== m ? m : 0));
}
    MAb() {
    (0,
    c.ta)(this.Da, "Unexpected call to forceLiveEdgeInStartSlate(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    this.j.mk.value && this.aM() === e.Kx.c8 && !this.Fy() && undefined === this.jS && this.W3();
}
    lRa(m) {
    var n, q;
    (0,
    c.ta)(this.Da, "Unexpected call to convertPtsToEventTime(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    (0,
    c.ta)(null === (n = this.K.S) || undefined === n ? undefined : n.Aa.Vi, "Live manifest is unavailable.");
    n = this.K.S.Aa.Vi;
    q = new Date(n.iV[n.Iqa[this.K.S.Aa.il[0].streams[0].sh]].XQ).getTime();
    return new Date(q - n.kra + m).toISOString();
}
    pvb(m) {
    var n, q, r;
    (0,
    c.ta)(this.Da, "Unexpected call to convertEventTimeToPts(). isLive:" + this.Da);
    (0,
    c.ta)(this.j && this.j.ga === this.K, "Playback is required for live.");
    (0,
    c.ta)(null === (n = this.K.S) || undefined === n ? undefined : n.Aa.Vi, "Live manifest is unavailable.");
    if (m) {
        n = this.K.S.Aa.Vi;
        q = n.iV[n.Iqa[this.K.S.Aa.il[0].streams[0].sh]];
        r = new Date(m).getTime() + n.kra - new Date(q.XQ).getTime();
        if (isNaN(r) || 0 > r)
            this.log.error("Invalid live event time. Ignoring: eventDateString:" + (m + ", eventAvailabilityOffsetMs:") + (n.kra + ", availabilityStartTime:") + q.XQ);
        else
            return r;
    }
}
}
p = a(5021);
c = a(45146);
g = a(32687);
f = a(85001);
e = a(30873);
h = a(81734);
k = a(45247);
l = a(91176);
Ha.Object.defineProperties(d.prototype, {
    Da: {
        configurable: true,
        enumerable: true,
        get: function() {
            var m, n;
            m = this.K;
            n = m.S;
            m = m.Ye;
            return n ? (0,
            l.qB)(n.Aa.rf) : "live" === m;
        }
    }
});
export const Efb = d;

// Detected exports: Efb
