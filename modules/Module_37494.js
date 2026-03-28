/**
 * Netflix Cadmium Playercore - Module 37494
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Sfb
 * Dependencies: 4574, 18797, 22699, 22970, 23309, 60514
 * Purpose: Subtitles/Captions, Buffer/Segment management, Logging, Event handling
 */

// import dep_4574 from './Module_4574.js';
// import dep_18797 from './Module_18797.js';
// import dep_22699 from './Module_22699.js';
// import dep_22970 from './Module_22970.js';
// import dep_23309 from './Module_23309.js';
// import dep_60514 from './Module_60514.js';

// Webpack module 37494
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;

d = a(22970);
t = a(22699);
p = a(18797);
c = a(60514);
g = a(23309);
f = a(4574);
e = a(4574);
h = t.EventEmitter;
a = (function(k) {
    class l extends k {
    constructor(m) {
        var n, q, r;
        n = k.call(this) || this;
        q = m.yd;
        r = m.va;
        h.call(n);
        n.YG = new f.CGa(r);
        n.$l = "number" === typeof q ? m.yd : 0;
        n.ya = "object" === typeof r ? m.va : console;
        n.Tb = [];
        n.ol = 0;
        n.oo = n.$l;
        n.wf = null;
        n.ql = false;
        n.ns = false;
        n.cQ = m.Pfa || 0;
        n.Pe = new g.Pfb(n.ya);
        n.FQ = m.M6a;
        n.ya.trace("LiveTextStream created with options", m);
        return n;
    }
    start() {
        this.ya.info(("Incremental live text stream created, starting at pts ").concat(this.$l));
        "undefined" !== typeof this.Pe.ES(this.$l) && this.gU.call(this, this.$l);
    }
    w3a(m) {
        var n, q, r, u;
        n = this;
        q = m.xml;
        r = q.indexOf("<p");
        this.ya.trace("pushNextSegment", m);
        this.Pe.zOa(m, -1 !== r ? r : 0);
        if (!this.ql) {
            u = this.Pe.Ch[0];
            this.Pe.ria(u);
            this.$l = u.Nb;
        }
        -1 < r ? (this.YG.Vqb(q, m.M, m.iz),
        this.ya.trace(("Live segment ").concat(m.M, " is pushed to segment manager"), {
            Nb: m.Nb,
            Xg: m.Xg,
            Loc: m.iz
        }),
        !this.ql && 3 > this.ol && (q = 0 < this.Tb.length ? this.Tb[this.Tb.length - 1].startTime + 1 : this.$l,
        this.ya.trace("parseNextSegment is called from push new live Segment at " + q),
        this.gU.call(this, q))) : (this.ya.trace(("Live segment ").concat(m.M, " is pushed to segment manager, it is an empty segment")),
        this.ql || setTimeout(function() {
            n.KC(m.M);
        }, 10));
    }
    ZL(m) {
        var n, q, r, u, v, w;
        n = this;
        u = this;
        u.ya.trace(("LiveTextStream:get subtitles at pts ").concat(m));
        v = u.Pe.ES(m);
        if ("undefined" === typeof v)
            return (u.ya.debug(("LiveTextStream: get subtitle at pts ").concat(m, " returns empty result with segment not available at this pts")),
            []);
        u.Pe.ria(v);
        m < u.oo - u.cQ ? (u.ya.trace(("Pts is less than backup tolerance, resetting buffer. pts: ").concat(m), (", _lastPts: ").concat(u.oo, ", _backupTolerance: ").concat(u.cQ)),
        u.Tb = [],
        u.ol = 0) : (u.ol = 0 < u.Tb.length ? Math.max(u.Pe.aca() - v.M + 1, 0) : 0,
        0 === u.ol && (u.Tb = []));
        v = u.Tb;
        u.ya.trace(("LiveTextStream: lastBufferedPts calculation ").concat(m), (", buffer.length: ").concat(v.length, ", result: ").concat(0 < v.length ? null === (q = v[v.length - 1]) || undefined === q ? undefined : q.startTime : m));
        q = this.Pe.Ov;
        w = 0 < v.length && undefined !== q ? q.Nb : m;
        u.oo = m;
        u.ya.info("LiveTextStream: timer is " + u.wf + " bufffered segment number is " + u.ol + " is parsing entry : " + this.ns + " maxBufferedStartPts " + (null === (r = this.Pe.Ov) || undefined === r ? undefined : r.Nb));
        for (!u.wf && 3 > u.ol && !u.ns && (u.ya.info("LiveTextStream: buffer size: " + u.ol + "; minimum: 3"),
        u.ns = true,
        u.wf = setTimeout(function() {
            u.wf = null;
            n.ya.trace("parseNextSegment is called from getCurrentAndNextSubtitle at " + (w + 1));
            n.gU.call(u, w + 1);
        }, 10)); 0 < v.length && v[0].endTime < m; )
            v.shift();
        return (0,
        p.psa)(v, m).map(function(x) {
            var y;
            y = u.Pe.yVa(x.segId);
            return p.tqa.call(u, y, x);
        });
    }
    Zq(m, n) {
        return this.YG ? this.YG.Zq(m, n) : 0;
    }
    close() {}
    gU(m) {
        var n;
        n = this.$Va.call(this, m);
        "undefined" !== typeof n ? (this.ya.trace("Next segment to parse at pts " + m + " is segment " + n.M),
        0 === n.NS ? (this.ya.trace("This is an empty segment"),
        this.KC(n.M)) : (this.a2a.call(this, n),
        this.ya.trace("parseNextSegEntries buffer length: " + this.Tb.length))) : (this.ya.debug("Next segment is undefined at pts " + m),
        this.ns = false);
    }
    a2a(m) {
        var n, q, r, u, v;
        n = this;
        q = this;
        r = m.xml.slice(0, m.NS);
        u = m.xml.slice(m.NS, m.xml.lastIndexOf("/p>") + 3);
        (0,
        p.UMb)(r, function(w, x) {
            null !== w ? (w.EEb = r,
            w.M = m.M,
            q.emit("error", w)) : (v = x,
            q.Pe.l8a(m.M, v),
            n.X1a.call(q, u, v, m));
        });
    }
    X1a(m, n, q) {
        var r, u, v, w, x, y, A;
        r = this;
        u = this;
        v = 0;
        w = [];
        x = n.defaultStyle ? [n.defaultStyle] : [];
        y = n.lang ? [n.lang] : [];
        u.ya.debug(m);
        A = c.We(true);
        A.onerror = function(z) {
            z.xml = m;
            u.emit("error", z);
        }
        ;
        A.onend = function() {
            var z;
            z = u.Tb.reduce(function(B, C) {
                C = C.blocks.reduce(function(D, E) {
                    return D.concat([E.id]);
                }, []);
                return B.concat(C);
            }, []);
            w.forEach(function(B) {
                var C;
                if (-1 === z.indexOf(B.id)) {
                    C = B && B.blocks && B.blocks.filter(function(D) {
                        return 0 < D.textNodes.length;
                    });
                    C && 0 < C.length && (B.blocks = C,
                    u.Tb.push(B));
                }
            });
            r.KC(q.M);
        }
        ;
        A.ontext = function(z) {
            ("" !== z.trim() || z.match(/ +/)) && (0,
            p.Ud)((0,
            p.Ud)(w).blocks).textNodes.push({
                text: z.match(/ +/) ? z : z.trim(),
                style: (0,
                p.Ud)(x),
                lang: (0,
                p.Ud)(y),
                lineBreaks: v
            });
            v = 0;
        }
        ;
        A.onclosetag = function() {
            var z;
            z = A.tag;
            "undefined" !== typeof z.attributes.style && x.pop();
            "undefined" !== typeof z.attributes["xml:lang"] && y.pop();
        }
        ;
        A.onopentag = function(z) {
            var B, C;
            B = z.attributes;
            z = z.name;
            if ("p" === z) {
                v = 0;
                z = q.M.toString() + "_" + B["xml:id"];
                B.style && x.push(B.style);
                B["xml:lang"] && y.push(B["xml:lang"]);
                C = (0,
                e.wL)(B.begin);
                0 === w.length || (0,
                p.Ud)(w).displayTime !== C ? (B = r.wRa(z, 0, B, q.iz),
                B.segId = q.M,
                w.push(B)) : (0,
                p.Ud)(w).blocks.push({
                    textNodes: [],
                    region: B.region,
                    id: z,
                    extent: B["tts:extent"] || null,
                    origin: B["tts:origin"] || null
                });
            } else
                "span" === z ? (x.push(B.style),
                B["xml:lang"] && y.push(B["xml:lang"]),
                z = n.styles[B.style],
                B.style && z && z.ruby && 0 <= ["container", "baseContainer", "textContainer"] /* container */.indexOf(z.ruby) && (0,
                p.Ud)((0,
                p.Ud)(w).blocks).textNodes.push({
                    text: "",
                    style: (0,
                    p.Ud)(x),
                    lang: (0,
                    p.Ud)(y),
                    lineBreaks: 0
                })) : "br" === z && v++;
        }
        ;
        A.write("<entries>").write(m).write("</entries>").close();
    }
    wRa(m, n, q, r) {
        var u;
        u = {};
        u.id = m;
        u.startTime = (0,
        e.wL)(q.begin || "") - r;
        u.endTime = (0,
        e.wL)(q.end || "") - r;
        u.style = q.style;
        u.region = q.region;
        u.displayTime = u.startTime;
        u.duration = u.endTime - u.startTime;
        u.extent = q["tts:extent"] || null;
        u.origin = q["tts:origin"] || null;
        u.latestEndSoFar = n > u.endTime ? n : u.endTime;
        u.blocks = [{
            textNodes: [],
            region: u.region,
            id: m,
            extent: u.extent || null,
            origin: u.origin || null
        }];
        return u;
    }
    KC(m) {
        this.Pe.KC(m);
        this.ol += 1;
        this.ns = false;
        this.ya.trace("updateMaxParsedSegment " + m);
        if (!this.ql && 3 <= this.ol || this.Pe.pTa && this.Pe.qDb(m) === this.Pe.pTa)
            (this.Pe.pTa && this.Pe.qDb(m) === this.Pe.pTa && this.ya.trace("Marking stream ready due to EOS"),
            this.ql = true,
            this.emit("ready"));
    }
}
d.l.prototype.$Va = function(m) {
        var n, q;
        q = this.YG.HCb(m);
        this.ya.trace(("Most recent entry at current pts ").concat(m, " is segment id  ").concat(q));
        -1 === q && (q = (null === (n = this.Pe.ES(m)) || undefined === n ? undefined : n.M) || -1);
        return q === this.Pe.aca() ? this.Pe.cWa() : this.Pe.fE(q);
    }
    ;
    return l;
}
)(h);
export const Sfb = a;

// Detected exports: Sfb
