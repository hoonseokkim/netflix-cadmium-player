/**
 * Netflix Cadmium Playercore - Module 45240
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 45240
// Parameters: t (module), b (exports), a (require)


var p, c, g;
function d(f, e, h) {
    this.j = f;
    this.config = e;
    this.fb = this.j.fb;
    this.log = h.rR("RestartManagerImpl");
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.Okb = void 0;
p = a(45247);
c = a(36129);
g = a(17612);
d.prototype.qu = function(f) {
    var e;
    e = f.mediaType;
    return e === p.l.V ? {
        qu: !0
    } : e === p.l.U ? this.igc(f) : {
        qu: !1,
        reason: "not-audio-not-video"
    };
}
;
d.prototype.kd = function(f, e) {
    var h, k, l;
    h = this;
    !1;
    void 0 === (null !== (k = e[p.l.U]) && void 0 !== k ? k : e[p.l.V]) && this.log.warn("No fromSegment for audio/video given in playgraph restart");
    this.j.paused.value || this.j.paused.set(!0, {
        QB: !0
    });
    null === (l = this.j.ae) || void 0 === l ? void 0 : l.VZc();
    this.fb.stop();
    return this.j.WSc().then(function() {
        return h.fb.fVc();
    }).then(function() {
        return h.fb.Faa(h.j.R);
    }).catch(function(m) {
        h.log.error("Restart player for non-seamless transition failed.", {
            error: m,
            restartContext: {
                mediaAttributesRecord: f,
                fromSegments: e
            }
        });
        h.j.Gg(c.ea.C4b, m);
    });
}
;
d.prototype.igc = function(f) {
    var e, h, k, l, m, n, q;
    k = !0;
    l = f.Aba;
    m = f.aia;
    n = f.from;
    q = f.to;
    if (l.M !== m.M && this.YSb(l, m, this.config.sWc))
        return {
            qu: !1,
            reason: "testing-forced-ads-content"
        };
    if (l.M !== m.M && g.wb.g1(null !== (h = null === (e = this.j.hm) || void 0 === e ? void 0 : e.Wy.Oy) && void 0 !== h ? h : "") && this.YSb(l, m, this.config.QPc))
        return {
            qu: !1,
            reason: "playready-forced-ads-content"
        };
    f = this.config.i4c;
    return 0 < f.length ? (f.some(function(r) {
        r = new RegExp(r);
        if (r.test(n.profile) && !r.test(q.profile) || r.test(q.profile) && !r.test(n.profile))
            return (!1,
            k = !1,
            !0);
    }),
    k ? {
        qu: k
    } : {
        qu: !1,
        reason: {
            mediaType: "video",
            Jc: "mismatch",
            details: "codec"
        }
    }) : {
        qu: k
    };
}
;
d.prototype.YSb = function(f, e, h) {
    var k, l, m, n;
    f = null === (l = null === (k = this.fb.ei) || void 0 === k ? void 0 : k.ba[f.M]) || void 0 === l ? void 0 : l.type;
    e = null === (n = null === (m = this.fb.ei) || void 0 === m ? void 0 : m.ba[e.M]) || void 0 === n ? void 0 : n.type;
    m = f + "to" + e;
    return h.map(function(q) {
        return q.toLowerCase();
    }).includes(m.toLowerCase());
}
;
b.Okb = d;


// Detected exports: Okb