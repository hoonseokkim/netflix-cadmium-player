/**
 * Netflix Cadmium Playercore - Module 27104
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: eJa
 * Dependencies: 3887, 4203, 22674, 22970, 30873, 33096, 39551, 42207, 71501, 87386, 90597
 * Purpose: Audio handling, Video handling, Buffer/Segment management, Encryption/Decryption
 */

// import dep_3887 from './Module_3887.js';
// import dep_4203 from './Module_4203.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_30873 from './Module_30873.js';
// import dep_33096 from './Module_33096.js';
// import dep_39551 from './Module_39551.js';
// import dep_42207 from './Module_42207.js';
// import dep_71501 from './Module_71501.js';
// import dep_87386 from './Module_87386.js';
// import dep_90597 from './Module_90597.js';

// Webpack module 27104
// Parameters: t (module), b (exports), a (require)

var c, g, f, e, h, k, l, m, n, q;
class d {
    constructor(r, u, v, w, x, y) {
    var A;
    A = this;
    this.ij = r;
    this.config = v;
    this.oc = w;
    this.debug = x;
    this.YQ = {};
    this.Uxb = false;
    this.e$ = {};
    this.rYa = 0;
    this.msa = function(z) {
        var B, C, D;
        B = z.stream;
        if (B) {
            z = B.ob;
            C = B.bitrate;
            D = B.Wb;
        } else
            z = z.track.ob;
        return {
            key: z + "$" + C + "$" + D,
            ob: z,
            bitrate: C,
            Wb: D
        };
    }
    ;
    this.QBb = function(z) {
        var B, C, D;
        C = A.msa(z);
        D = null === (B = z.Yc) || undefined === B ? undefined : B.id;
        z = z.track.correlationId;
        return Object.assign({}, C, {
            key: C.key + "$" + D + "$" + z,
            Gk: D,
            correlationId: z
        });
    }
    ;
    this.vvc = function(z) {
        var B;
        B = z.stream;
        z = null === B || undefined === B ? undefined : B.ob;
        B = null === B || undefined === B ? undefined : B.bitrate;
        return {
            key: z + "$" + B,
            ob: null !== z && undefined !== z ? z : "",
            f2: B
        };
    }
    ;
    this.rAc = function(z) {
        var B;
        B = z.stream;
        z = null === B || undefined === B ? undefined : B.ob;
        B = null === B || undefined === B ? undefined : B.Wb;
        return {
            key: z + "$" + B,
            ob: null !== z && undefined !== z ? z : "",
            f2: B
        };
    }
    ;
    this.log = u.zb("PlayTimeTracker");
    this.$xa = y(r);
    this.fz = y(r);
    this.x2a = y(r);
    this.startTime = this.ij.mediaTime.value;
    this.hva = this.config().W$b;
    this.qW();
    this.YQ.abrdel = 0;
    this.hva.forEach(function(z) {
        z = "abrdel" + z;
        A.e$[z] = 0;
        A.YQ[z] = 0;
    });
}
    Iu(r) {
    r = undefined === r ? "content" : r;
    this.sO(this.ij.mediaTime.value);
    return Math.floor(this.fz.Iu(function(u) {
        return u.ym === r;
    }));
}
    sVa(r) {
    this.sO(this.ij.mediaTime.value);
    return Math.floor(this.fz.Iu(r));
}
    tca(r) {
    var u;
    r = undefined === r ? "content" : r;
    this.sO(this.ij.mediaTime.value);
    u = this.fz.tca(function(v) {
        return v.ym === r;
    });
    this.debug.assert(u === Math.floor(u), "Value of totalContentPlayTime is not an integer.");
    return Math.floor(u);
}
    kvc() {
    this.sO(this.ij.mediaTime.value);
    return {
        audio: this.Qba(this.$xa, this.QBb),
        video: this.Qba(this.fz, this.QBb)
    };
}
    xyc() {
    var r, u, v;
    r = this.Iu("content");
    u = this.Iu("ads");
    v = this.Iu("other");
    r = {
        total: r,
        totalAdDuration: u,
        totalOtherDuration: v,
        totalCombinedDuration: r + u + v,
        totalContentTime: this.tca("content"),
        totalStartSlateDuration: this.sVa(function(w) {
            return true === w.oda;
        }),
        totalLiveEdgeDuration: this.sVa(function(w) {
            return true === w.Fy;
        }),
        totalLiveEdgeAdDuration: this.sVa(function(w) {
            return true === w.Fy && "ads" === w.ym;
        }),
        audio: this.Qba(this.$xa, this.msa),
        video: this.Qba(this.fz, this.msa),
        timedtext: this.Qba(this.x2a, this.msa),
        programs: this.vwc(this.fz)
    };
    this.debug.assert(!(!r.audio || !r.video));
    return r;
}
    WUa() {
    var r, u;
    this.sO(this.ij.mediaTime.value);
    r = this.fz.SUa(this.vvc);
    try {
        u = this.pBb(r);
    } catch (v) {
        return (this.log.warn("Failed to calc average bitrate."),
        null);
    }
    this.YQ.abrdel = Math.round(u);
    return this.YQ.abrdel;
}
    qBb() {
    var r, u;
    this.sO(this.ij.mediaTime.value);
    r = this.fz.SUa(this.rAc);
    try {
        u = this.pBb(r);
    } catch (v) {
        return (this.log.warn("Failed to calc average vmaf."),
        null);
    }
    return Math.round(u);
}
    oBb() {
    var r, u;
    r = this;
    if (!this.Uxb) {
        u = this.Iu();
        this.hva.forEach(function(v) {
            var w, x, y;
            if (0 === r.e$["abrdel" + v] && u > v * l.Ur) {
                w = 0;
                x = 0;
                y = 0;
                r.fz.some(function(A) {
                    w += A.stream.bitrate * (A.endTime - A.startTime);
                    x += A.endTime - A.startTime;
                    y = A.stream.bitrate;
                    return x > v * l.Ur;
                });
                w && (r.e$["abrdel" + v] = Math.round((w - y * (x - v * l.Ur)) / (v * l.Ur)));
            }
        });
        0 !== this.e$["abrdel" + this.hva[this.hva.length - 1]] && (this.Uxb = true);
        (0,
        m.Qi)(this.e$, function(v, w) {
            r.YQ[v] = 0 === w ? r.YQ.abrdel : w;
        });
    }
    return this.YQ;
}
    Cac(r) {
    this.rYa += r;
}
    lta() {
    return this.fz.lta();
}
    qW() {
    var r;
    r = this;
    this.ij.gf.addListener(function(u) {
        r.c_ = r.Mtb(r.c_, r.$xa, u.newValue);
    });
    this.ij.Fe.addListener(function(u) {
        r.i_ = r.Mtb(r.i_, r.fz, u.newValue);
    });
    this.ij.playbackRate.addListener(function(u) {
        r.sO(r.ij.mediaTime.value, u.oldValue);
    });
    this.ij.Xe.addListener(function(u) {
        r.Umc = u.newValue;
    });
    this.ij.sl.addListener(this.TLc.bind(this));
}
    M0a(r, u) {
    this.sO(r);
    this.startTime = u;
    this.i_ = this.c_ = undefined;
    this.h_ && (this.h_.startTime = this.startTime);
    false;
}
    TLc(r) {
    this.x2a.cf(this.h_, this.ij.mediaTime.value);
    this.h_ = (r = r.newValue) ? {
        track: r,
        startTime: this.ij.mediaTime.value,
        endTime: e.iG
    } : undefined;
}
    sO(r, u) {
    u = undefined === u ? this.ij.playbackRate.value : u;
    r && this.c_ && this.i_ && (r = Math.min(r, this.c_.endTime, this.i_.endTime),
    this.$xa.cf(this.c_, r, u),
    this.c_.startTime = r,
    this.fz.cf(this.i_, r, u),
    this.i_.startTime = r,
    this.h_ && (this.x2a.cf(this.h_, r, u),
    this.h_.startTime = r),
    this.startTime = r,
    false);
}
    Mtb(r, u, v) {
    var w, x;
    r && u.cf(r, Math.min(r.endTime, this.ij.mediaTime.value), undefined);
    if (v && v.stream) {
        r = v.CZ;
        u = v.stream;
        w = v.ym;
        x = this.ij.Hc;
        return {
            Yc: v.Yc,
            track: u.track,
            stream: u,
            startTime: Math.max(r.startTime, this.startTime),
            endTime: r.endTime,
            oda: x.Da ? x.aM(r.jvb) === q.Kx.c8 : undefined,
            Fy: x.Da ? x.Ku() : undefined,
            ym: w,
            Xe: this.Umc
        };
    }
}
    Qba(r, u) {
    return r.SUa(u, "content").map(function(v) {
        return new p().encode(v);
    });
}
    vwc(r) {
    return r.sWa([["totalDuration", function(u) {
        return "content" === u.ym;
    }
    ] /* totalDuration */, ["totalAdDuration", function(u) {
        return "ads" === u.ym;
    }
    ] /* totalAdDuration */, ["totalOtherDuration", function(u) {
        return "other" === u.ym;
    }
    ] /* totalOtherDuration */]);
}
    pBb(r) {
    var u, v, w;
    u = this;
    v = 0;
    r.forEach(function(x) {
        if (u.oc.Mi(x.duration) && u.oc.Mi(x.f2))
            v += x.duration;
        else
            throw Error("Invalid arguments: missing duration and/or metric in segment.");
    });
    if (!v)
        return 0;
    w = 0;
    r.forEach(function(x) {
        w += x.f2 * x.duration / v;
    });
    return w;
}
}
class p {
    constructor() {}
    encode(r) {
    return {
        downloadableId: r.ob,
        correlationId: r.correlationId,
        bitrate: r.bitrate,
        vmaf: r.Wb,
        duration: r.duration,
        metric: r.f2,
        cdnId: r.Gk
    };
}
    decode(r) {
    return {
        ob: r.downloadableId,
        correlationId: r.correlationId,
        bitrate: r.bitrate,
        Wb: r.vmaf,
        duration: r.duration,
        f2: r.metric,
        Gk: r.cdnId
    };
}
}
t = a(22970);
c = a(22674);
g = a(87386);
f = a(4203);
e = a(71501);
a(5021);
h = a(42207);
k = a(90597);
l = a(33096);
m = a(3887);
n = a(39551);
q = a(30873);
a = d;
export const eJa = a;
export const eJa = a = t.__decorate([(0,
c.aa)(), t.__param(1, (0,
c.v)(g.Bb)), t.__param(2, (0,
c.v)(f.Pc)), t.__param(3, (0,
c.v)(h.Zi)), t.__param(4, (0,
c.v)(k.PC)), t.__param(5, (0,
c.v)(n.sJa))], a);

// Detected exports: eJa
