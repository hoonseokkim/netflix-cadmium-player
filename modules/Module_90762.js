/**
 * Netflix Cadmium Playercore - Module 90762
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 90762
// Parameters: t (module), b (exports), a (require)


var c, g, f, e, h, k, l, m, n, q, r, u;
function d(v) {
    v = Error.call(this, v);
    this.message = v.message;
    ("stack"in v) && (this.stack = v.stack);
    this.name = "CodecSwitchingError";
}
function p(v, w, x, y) {
    var A, z;
    A = this;
    this.j = v;
    this.type = w;
    this.log = y;
    this.bna = new f.Ac(!1);
    this.hQ = {
        data: void 0,
        state: "",
        operation: ""
    };
    this.error = void 0;
    this.mimeType = this.vzb((this.type === u.l.U ? this.j.oa.Mc : this.j.oa.Cc).streams);
    this.Wm = new e.jl();
    this.SMa = {
        Type: this.type
    };
    if (g.config.B1) {
        z = !0;
        this.hUa = new f.Ac(!1);
    }
    this.log.trace("Adding source buffer", this.SMa, {
        TypeId: this.mimeType
    });
    this.Zl = x.addSourceBuffer(this.mimeType);
    this.Zl.addEventListener("updatestart", function() {
        !1;
        A.hQ.state = "updatestart";
    });
    this.Zl.addEventListener("update", function() {
        !1;
        A.hQ.state = "update";
    });
    this.Zl.addEventListener("updateend", function() {
        var B;
        !1;
        A.bna.set(!1);
        A.eob && A.eob();
        A.hQ.state = "updateend";
        B = 0;
        try {
            B = A.Zl.buffered.length;
        } catch (C) {}
        z && B && (z = !1,
        A.hUa.set(!0),
        !1);
    });
    this.Zl.addEventListener("error", function(B) {
        var C;
        !1;
        try {
            C = B.target.error && B.target.error.message;
            (B.message || C) && y.error("error event received on sourcebuffer", {
                mediaErrorMessage: B.message
            });
        } catch (D) {}
        B = {
            Ya: (0,
            c.pVa)(A.type),
            Cf: A.isa()
        };
        v.Gg(k.ea.U4b, B);
    });
    this.Zl.addEventListener("abort", function() {
        !1;
    });
    v.addEventListener(n.ja.closed, function() {
        A.Zl = void 0;
    });
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.n_b = b.rHa = void 0;
c = a(93294);
g = a(29204);
f = a(81734);
e = a(94886);
h = a(31276);
a(24550);
k = a(36129);
a(5021);
l = a(45146);
m = a(32687);
n = a(85001);
q = a(95162);
r = a(48220);
u = a(26388);
p.prototype.ak = function() {
    return this.bna.value;
}
;
p.prototype.updating = function() {
    return this.Zl ? this.Zl.updating : !1;
}
;
p.prototype.bha = function(v) {
    this.eob = v;
}
;
p.prototype.isa = function() {
    return this.hQ;
}
;
p.prototype.buffered = function() {
    return this.Zl.buffered;
}
;
p.prototype.toString = function() {
    return "SourceBuffer (type: " + this.type + ")";
}
;
p.prototype.toJSON = function() {
    return {
        type: this.type
    };
}
;
p.prototype.bVa = function() {
    var v, y, A;
    try {
        v = this.Zl.buffered;
        if (v) {
            for (var w = [], x = 0; x < v.length; x++) {
                y = 1E3 * v.start(x);
                A = 1E3 * v.end(x);
                (0,
                l.ta)(A > y);
                w.push({
                    start: y,
                    end: A
                });
            }
            return w;
        }
    } catch (z) {}
}
;
p.prototype.bsa = function() {
    var v, w;
    v = this.bVa();
    if (v) {
        v = v.map(function(x) {
            return {
                start: x.start / 1E3,
                end: x.end / 1E3
            };
        });
        w = v.reduce(function(x, y) {
            return x + y.end - y.start;
        }, 0);
        v = v.map(function(x) {
            return x.start + "-" + x.end;
        });
        return {
            Buffered: w.toFixed(3),
            Ranges: v.join("|")
        };
    }
}
;
p.prototype.Jrb = function(v, w) {
    var x;
    !1;
    try {
        (0,
        l.ta)(this.Zl.buffered && 1 >= this.Zl.buffered.length, "Gaps in media are not allowed: " + JSON.stringify(this.bsa()));
    } catch (y) {}
    (0,
    l.ta)(!this.ak());
    x = w && w.Qfa / 1E3;
    (0,
    m.wc)(x) && this.Zl.timestampOffset !== x && (!1,
    this.gAa("timestampOffset", x),
    this.Zl.timestampOffset = x);
    this.gAa((null === w || void 0 === w ? 0 : w.Ee) ? "headerappend" : "mediaappend");
    this.Zl.appendBuffer(v);
    !1;
    this.bna.set(!0);
}
;
p.prototype.remove = function(v, w) {
    (0,
    l.ta)(!this.ak());
    try {
        this.gAa("remove");
        !1;
        this.Zl.remove(v, w);
        this.bna.set(!0);
    } catch (x) {
        this.log.error("SourceBuffer remove exception", x, this.SMa);
    }
}
;
p.prototype.gAa = function(v, w) {
    this.hQ.data = w;
    this.hQ.state = "init";
    this.hQ.operation = v;
}
;
p.prototype.JSb = function(v, w) {
    this.NFc = v / w * 1E3;
}
;
p.prototype.Bgc = function(v) {
    var w;
    if (this.Zl) {
        if ((v = this.vzb([{
            type: this.Xic,
            Zc: v
        }]),
        v !== this.mimeType)) {
            w = this.mimeType;
            this.log.info("Changing SourceBuffer mime-type from: " + this.mimeType + " to: " + v);
            if (!this.Zl.changeType)
                throw new d("Platform doesnt support changing SourceBuffer mime-type");
            try {
                this.gAa("changeType", v);
                this.Zl.changeType(v);
                this.mimeType = v;
            } catch (x) {
                throw (this.log.error("Error changing SourceBuffer type", x, this.SMa, {
                    From: w,
                    To: v
                }),
                new d(x.message));
            }
        }
    } else
        this.log.info("No SourceBuffer");
}
;
p.prototype.appendBuffer = function(v, w) {
    !w || w.Ee ? this.VY(v, w) : this.YOa(v, w);
    return !0;
}
;
p.prototype.VY = function(v, w) {
    this.j.ae.VY(this, v, w || ({}));
}
;
p.prototype.YOa = function(v, w) {
    v = this.Qic(v, w);
    !1;
    this.j.ae.YOa(v);
}
;
p.prototype.Qic = function(v, w) {
    var x;
    x = this.NFc || 0;
    return {
        pg: function() {
            return this.requestId;
        },
        constructor: {
            name: "MediaRequest"
        },
        mediaType: this.mediaType,
        readyState: r.ye.he.DONE,
        PN: w.Nb,
        kF: w.Nb + w.duration,
        th: w.duration,
        Qfa: x,
        em: w.em,
        M: w.M,
        Oa: w.Oa,
        md: +w.md,
        location: w.location,
        Yoa: w.offset,
        Xoa: w.offset + w.la - 1,
        bitrate: w.bitrate,
        response: v,
        hBc: v && 0 < v.byteLength,
        rB: !0,
        get Ee() {
            return !this.rB;
        },
        zRb: this.D8 - Math.floor(x) || Infinity,
        toJSON: function() {
            var y;
            y = {
                requestId: this.requestId,
                segmentId: this.M,
                isHeader: this.Ee,
                ptsStart: this.PN,
                ptsOffset: this.Qfa,
                responseType: this.Ebd,
                duration: this.th,
                readystate: this.Dg
            };
            this.stream && (y.bitrate = this.stream.bitrate);
            return JSON.stringify(y);
        }
    };
}
;
p.prototype.endOfStream = function() {
    var v;
    this.j.NQ("EndOfStream");
    null === (v = this.j.ae) || void 0 === v ? void 0 : v.Fwa(this.mediaType);
    return !0;
}
;
p.prototype.GTb = function(v) {
    this.s$b = v;
}
;
p.prototype.addEventListener = function(v, w, x) {
    this.Wm.addListener(v, w, x);
}
;
p.prototype.removeEventListener = function(v, w) {
    this.Wm.removeListener(v, w);
}
;
p.prototype.vzb = function(v) {
    var w;
    w = h.Za.get(q.OKa);
    return this.type === u.l.U ? w.mwb(v) : w.yvb(v);
}
;
Ha.Object.defineProperties(p.prototype, {
    mediaType: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.type;
        }
    },
    HTb: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.s$b;
        }
    },
    Xic: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return 0 === this.type ? "audio" : "video";
        }
    }
});
b.rHa = p;
Ia(d, Error);
b.n_b = d;


// Detected exports: n_b, rHa