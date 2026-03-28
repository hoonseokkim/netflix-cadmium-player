/**
 * Netflix Cadmium Playercore - Module 85981
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Jgb
 * Dependencies: 8149, 22970, 40666, 54366, 61996, 66164, 90745, 91176, 91562
 * Purpose: Network/HTTP, Buffer/Segment management, Logging, Event handling
 */

// import dep_8149 from './Module_8149.js';
// import dep_22970 from './Module_22970.js';
// import dep_40666 from './Module_40666.js';
// import dep_54366 from './Module_54366.js';
// import dep_61996 from './Module_61996.js';
// import dep_66164 from './Module_66164.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';
// import dep_91562 from './Module_91562.js';

// Webpack module 85981
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n;

d = a(22970);
p = a(90745);
c = a(91176);
g = a(91562);
f = a(66164);
e = a(91176);
h = a(91562);
k = a(40666);
l = a(8149);
m = a(61996);
n = a(54366);
t = (function() {
    class q {
    constructor(r, u, v, w) {
        this.pW = r;
        this.L = u;
        this.S0c = v;
        this.xo = w;
        this.events = new p.EventEmitter();
        this.eg = 0;
        this.wa = c.I.ia;
        this.Us = false;
        this.console = new f.platform.Console("MEDIAEVENTS_FETCHER","asejs",("[").concat(this.L.R, "]"));
        this.hF = new e.AbortController();
        this.AC = new c.iFa(this.console,{
            Ig: 10,
            sPa: true
        });
        this.ONa = new m.Tm({
            Ej: this,
            source: "media-events-provider",
            Ig: 10,
            console: this.console
        });
        this.L.jf.Xc(new n.ko(this.ONa));
    }
    hta() {
        return !this.Us && !this.S0c(this.wa);
    }
    Msc() {
        var r, u, v, w, x, y, A, z;
        return d.__generator(this, function(B) {
            switch (B.label) {
            case 0:
                ((0,
                c.assert)((0,
                l.dk)(this.stream), "MediaEventsFetchProviderBase: stream is not live"),
                this.console.log("Fetch task: starting", {
                    rgd: this.hta(),
                    Zjd: this.xN
                }),
                undefined === this.DEb && (this.console.log("Fetch task: queuing header request"),
                this.DEb = this.$qb(true).item),
                r = 20,
                B.label = 1);
            case 1:
                if (!(this.hta() && this.xN < r))
                    return [3, 3];
                u = this.stream.track.Du(this.eg);
                v = u.wa;
                w = u.qa;
                x = this.L.Al(true);
                y = Math.max(0, v.G - x);
                this.console.log("Fetch task: waitRelative", {
                    vnd: y,
                    wa: v,
                    m_a: x,
                    xN: this.xN
                });
                return [4, k.ie.Mz(c.I.Ca(y))];
            case 2:
                return (B.T(),
                A = v.G - x,
                null === (z = this.xo) || undefined === z ? undefined : z.CMc(A),
                this.$qb(false, this.eg, w, v),
                this.wa = v,
                this.eg++,
                [3, 1]);
            case 3:
                return (this.hta() || this.console.log("Fetch task: complete"),
                this.console.log("Fetch task: exiting"),
                [2]);
            }
        });
    }
    LIb(r) {
        return d.__awaiter(this, undefined, undefined, function() {
            var u, v, w, x;
            return d.__generator(this, function(y) {
                switch (y.label) {
                case 0:
                    return (this.console.log("Making header request"),
                    [4, this.izb(r, {
                        eg: undefined,
                        Ee: true,
                        stream: this.stream,
                        qa: c.I.ia,
                        wa: c.I.ia
                    })]);
                case 1:
                    u = y.T();
                    v = new g.Om(this.console,{},u,["moov"],false,{
                        Xld: true
                    });
                    w = v.parse();
                    if (!w.TB)
                        throw Error(w.parseError);
                    x = g.Om.path(v, ["moov", "trak", "mdia", "mdhd"] /* moov */);
                    (0,
                    c.assert)(undefined !== x, "mdhd should be defined");
                    this.O = x.O;
                    return [2];
                }
            });
        });
    }
    NIb(r, u, v, w) {
        return d.__awaiter(this, undefined, undefined, function() {
            var x, y, A, z, B, C;
            return d.__generator(this, function(D) {
                switch (D.label) {
                case 0:
                    (x = this.L.Ic.dE || c.I.uh,
                    v.da(x),
                    this.ONa.Eg({
                        si: u,
                        cst: v.ca(),
                        cet: w.ca()
                    }),
                    D.label = 1);
                case 1:
                    return (D.ac.push([1, 3, , 4]),
                    [4, this.izb(r, {
                        Ee: false,
                        wa: w,
                        qa: v,
                        stream: this.stream,
                        eg: u
                    })]);
                case 2:
                    return (y = D.T(),
                    [3, 4]);
                case 3:
                    return (A = D.T(),
                    (0,
                    c.xM)(A) || this.events.emit("mediaEventsReceived", {
                        type: "mediaEventsReceived",
                        events: [],
                        wa: w,
                        eg: u,
                        ohd: true
                    }),
                    [2]);
                case 4:
                    return undefined !== this.O ? [3, 6] : [4, this.DEb];
                case 5:
                    (D.T(),
                    D.label = 6);
                case 6:
                    (0,
                    c.assert)(undefined !== this.O, "timescale should be defined once header request resolves");
                    z = new g.I7(this.console,{},y);
                    B = {
                        events: []
                    };
                    C = z.parse(B);
                    this.console.debug("Parsed media events: ", C.done);
                    if (C.error)
                        throw Error(C.error);
                    this.console.debug("Received media events", {
                        events: B.events,
                        em: w,
                        eg: u
                    });
                    this.events.emit("mediaEventsReceived", {
                        type: "mediaEventsReceived",
                        events: this.dIc(B.events),
                        wa: w,
                        eg: u
                    });
                    return [2, B.events];
                }
            });
        });
    }
    dIc(r) {
        var u;
        u = this;
        return (null === r || undefined === r ? undefined : r.reduce(function(v, w) {
            (w = u.vOc(w)) && v.push(w);
            return v;
        }, [])) || [];
    }
    vOc(r) {
        var u, v, w, x, y;
        if (r.GI) {
            u = new c.I(r.JN,this.O).da(this.track.Wk);
            v = undefined !== r.V_ ? new c.I(r.V_,this.O) : undefined;
            if (r.eO === h.BX.eO) {
                w = new h.BX(new DataView(r.GI.buffer,r.GI.byteOffset,r.GI.byteLength),f.platform.AL,this.console);
                if (w = w.parse()) {
                    x = w.header;
                    return {
                        type: "netflix",
                        presentationTime: u,
                        xw: v,
                        id: x.Tbd,
                        Qj: r.value,
                        xDc: x.cancel || false,
                        cF: x.fjd || "application/json",
                        payload: w.body
                    };
                }
            } else if (r.eO === h.TX.eO && (w = new h.TX(new DataView(r.GI.buffer,r.GI.byteOffset,r.GI.byteLength),this.console),
            r = w.parse())) {
                w = r.id;
                x = r.event;
                a: {
                    if (12 === r.Uga && r.X3 && 4 < r.X3.byteLength) {
                        y = f.platform.AL(new Uint8Array(r.X3));
                        if ("NFLX" === y.slice(0, 4)) {
                            y = y.slice(4);
                            break a;
                        }
                    }
                    y = undefined;
                }
                return {
                    id: w,
                    type: x,
                    presentationTime: u,
                    xw: v,
                    eWc: r,
                    hb: y
                };
            }
        }
    }
    start(r) {
        var u;
        u = this;
        (0,
        c.assert)(!this.zj, "MediaEventsFetchProviderBase: start called while running");
        this.Us ? this.console.warn("MediaEventsFetchProviderBase: start called after destruct") : (this.eg = Math.max(r, this.stream.track.Qo),
        this.wa = this.stream.track.Du(this.eg).wa,
        this.c0 = this.pW.Fs(function() {
            return u.Msc();
        }, "media-events-fetcher"));
    }
    kd(r) {
        this.Us ? this.console.warn("MediaEventsFetchProviderBase: restart called after destruct") : (this.La(),
        this.Us = false,
        this.hF = new e.AbortController(),
        this.start(r));
    }
    La() {
        var r;
        this.Us = true;
        null === (r = this.c0) || undefined === r ? undefined : r.La();
        this.c0 = undefined;
        this.hF.abort();
        this.AC.clear();
        this.wa = c.I.ia;
    }
}
Object.defineProperties(q.prototype, {
        zj: {
            get: function() {
                var r;
                return !(null === (r = this.c0) || undefined === r || !r.Ho);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(q.prototype, {
        Bca: {
            get: function() {
                return undefined !== this.c0;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(q.prototype, {
        track: {
            get: function() {
                var r;
                r = this.L.getTracks(g.l.yk)[0];
                (0,
                c.assert)((0,
                l.Gn)(r), "MediaEventsFetchProviderBase: track is not live");
                return r;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(q.prototype, {
        stream: {
            get: function() {
                return this.track.Xd[0];
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(q.prototype, {
        xN: {
            get: function() {
                return this.AC.mF;
            },
            enumerable: false,
            configurable: true
        }
    });
    q.prototype.$qb = function(r, u, v, w) {
        var x, y, A;
        x = this;
        this.console.log("Fetch task: addRequestToQueue", {
            header: r,
            eg: u,
            qa: v,
            wa: w
        });
        (0,
        c.assert)(r || undefined !== u && undefined !== w && undefined !== v, "segmentIndex must be defined if not a header request");
        y = new c.yma();
        y.P6a(this.hF.signal);
        A = y.mh.signal;
        return this.AC.add({
            Vv: A,
            LFb: function() {
                return d.__awaiter(x, undefined, undefined, function() {
                    var z, B;
                    return d.__generator(this, function(C) {
                        switch (C.label) {
                        case 0:
                            return (C.ac.push([0, , 5, 6]),
                            r ? [4, this.LIb(A)] : [3, 2]);
                        case 1:
                            return [2, C.T()];
                        case 2:
                            return [4, this.NIb(A, u, v, w)];
                        case 3:
                            return [2, C.T()];
                        case 4:
                            return [3, 6];
                        case 5:
                            return (y.La(),
                            (!(null === (z = this.c0) || undefined === z ? 0 : z.Ho) && this.hta() && !this.Us || r) && (null === (B = this.c0) || undefined === B ? undefined : B.kd()),
                            [7]);
                        case 6:
                            return [2];
                        }
                    });
                });
            },
            q1a: function() {
                y.La();
            },
            priority: u || 0
        });
    }
    ;
    d.__decorate([(0,
    m.kb)({
        methodName: "makeHeaderRequest",
        df: true
    })], q.prototype, "LIb", null);
    d.__decorate([(0,
    m.kb)({
        methodName: "makeMediaSegmentRequest",
        df: true
    })], q.prototype, "NIb", null);
    d.__decorate([(0,
    m.kb)({
        methodName: "start",
        df: true
    })], q.prototype, "start", null);
    d.__decorate([(0,
    m.kb)({
        methodName: "restart",
        df: true
    })], q.prototype, "kd", null);
    d.__decorate([(0,
    m.kb)({
        methodName: "destruct",
        df: true
    })], q.prototype, "La", null);
    return q;
}
)();
export const Jgb = t;

// Detected exports: Jgb
