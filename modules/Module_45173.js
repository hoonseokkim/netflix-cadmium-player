/**
 * Netflix Cadmium Playercore - Module 45173
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Igb
 * Dependencies: 22970, 44053, 61996, 65161, 97685
 * Purpose: Network/HTTP, Buffer/Segment management, Logging, Event handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_44053 from './Module_44053.js';
// import dep_61996 from './Module_61996.js';
// import dep_65161 from './Module_65161.js';
// import dep_97685 from './Module_97685.js';

// Webpack module 45173
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

d = a(22970);
p = a(97685);
c = a(65161);
g = a(61996);
f = a(44053);
t = (function(e) {
    class h extends e {
    constructor(k, l, m, n, q) {
        var r;
        r = e.call(this, k, l, n, q) || this;
        r.requestId = -1;
        r.X1 = new f.Ngb(l,m,r.console,fetch,q);
        r.X1.events.on("eosReceived", function(u) {
            r.events.emit("eosReceived", u);
        });
        r.X1.events.on("errorReceived", function(u) {
            false;
            0 !== u.Azb.status && r.MQb(u.Azb);
        });
        r.Osc = r.X1.Cwc();
        return r;
    }
    MQb(k, l) {
        (k = k.headers.get("X-TCP-Info")) ? this.L.qC ? this.L.qC.COb(k, {
            mediaType: c.l.yk,
            Cl: this.X1.wZa || 0,
            XAa: false
        }) : this.L.tI && (l ? this.L.tI.i3a(this.stream, undefined, l, c.l.yk, k, this.X1.wZa, undefined) : (l = this.L.tI.decode(c.l.yk, k, false),
        undefined === (null === l || undefined === l ? undefined : l.Wf) || isNaN(l.Wf) || this.L.wia(l.Wf, this.X1.wZa || 0),
        (null === l || undefined === l ? 0 : l.Rh) && this.L.tia(l.Rh.startTime, l.Rh.endTime))) : false;
    }
    izb(k, l) {
        return d.__awaiter(this, undefined, undefined, function() {
            var m, n, q, r, u, v, w, x, y, A, z, B, C, D;
            return d.__generator(this, function(E) {
                switch (E.label) {
                case 0:
                    m = this.stream;
                    n = m.Le;
                    q = this.L.gj;
                    r = q.sBa(this.track.L.J, this.track.Xd, this.track.wsa(l.qa));
                    this.PM = this.stream.Hb;
                    if (!r)
                        throw Error("Unable to perform location selection");
                    u = m.L0(l.Ee, l.eg);
                    v = (++this.requestId).toString();
                    w = null;
                    p.jb.isEnabled && p.jb.log((A = {},
                    A.playgraphId = n,
                    A.type = "HTTP_REQUEST_STATE_CHANGE",
                    A.id = v,
                    A.mediaType = "MEDIA_EVENTS",
                    A.bitrateKbps = 0,
                    A.url = u,
                    A.state = "WAITING",
                    A.retryCount = 0,
                    A));
                    w = function() {
                        var G;
                        p.jb.isEnabled && p.jb.log((G = {},
                        G.playgraphId = n,
                        G.type = "HTTP_REQUEST_STATE_CHANGE",
                        G.id = v,
                        G.state = "ABORTED",
                        G));
                    }
                    ;
                    k.addEventListener("abort", w);
                    return [4, this.Osc(l)(u, {
                        headers: {
                            "Cache-Control": "no-cache, no-store",
                            "X-Gibbon-Cache-Control": "no-cache, no-store"
                        },
                        signal: k
                    })];
                case 1:
                    x = E.T();
                    p.jb.isEnabled && p.jb.log((z = {},
                    z.playgraphId = n,
                    z.type = "HTTP_REQUEST_STATE_CHANGE",
                    z.id = v,
                    z.state = "RECEIVING",
                    z.httpStatus = x.status,
                    z.responseType = "OPEN_RANGE",
                    z.chunked = false,
                    z.contentLength = parseInt(null !== (D = x.headers.get("Content-Length")) && undefined !== D ? D : "-1", 10),
                    z));
                    this.console.debug("MediaEventsFetchProvider: Received request for", {
                        url: u,
                        Ee: l.Ee,
                        eg: l.eg,
                        tdd: l.qa.ri
                    });
                    this.MQb(x, u);
                    if (!x.ok)
                        throw (w && k.removeEventListener("abort", w),
                        p.jb.isEnabled && p.jb.log((B = {},
                        B.playgraphId = n,
                        B.type = "HTTP_REQUEST_STATE_CHANGE",
                        B.id = v,
                        B.state = "FAILED",
                        B.httpStatus = x.status,
                        B)),
                        Error(("Failed to fetch media events: ").concat(x.status)));
                    return [4, x.arrayBuffer()];
                case 2:
                    return (y = E.T(),
                    w && k.removeEventListener("abort", w),
                    p.jb.isEnabled && p.jb.log((C = {},
                    C.playgraphId = n,
                    C.type = "HTTP_REQUEST_STATE_CHANGE",
                    C.id = v,
                    C.state = "SUCCEEDED",
                    C)),
                    [2, y]);
                }
            });
        });
    }
    Aia(k) {
        var l;
        null === (l = this.xo) || undefined === l ? undefined : l.mNc();
        l = this.stream.track.Du(k).qa;
        this.L.gj.sBa(this.track.L.J, this.track.Xd, this.track.wsa(l));
        this.stream.Hb !== this.PM && (this.ONa.Eg({
            url: this.stream.Hb,
            out: this.xN,
            segmentIndex: this.eg
        }),
        this.kd(k));
    }
}
d.d.__decorate([(0,
    g.kb)({
        methodName: "urlsChanged",
        df: true
    })], h.prototype, "Aia", null);
    return h;
}
)(a(85981).Jgb);
export const Igb = t;

// Detected exports: Igb
