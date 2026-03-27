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

p = a(45247);
c = a(36129);
g = a(17612);
d.prototype.qu = function(f) {
    var e;
    e = f.mediaType;
    return e === p.l.V ? {
        qu: true
    } : e === p.l.U ? this.igc(f) : {
        qu: false,
        reason: "not-audio-not-video"
    };
}
;
d.prototype.kd = function(f, e) {
    var h, k, l;
    h = this;
    false;
    export const undefined = == (null !== (k = e[p.l.U]) && undefined !== k ? k : e[p.l.V]) && this.log.warn("No fromSegment for audio/video given in playgraph restart");
    this.j.paused.value || this.j.paused.set(true, {
        QB: true
    });
    null === (l = this.j.ae) || undefined === l ? undefined : l.VZc();
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
    k = true;
    l = f.Aba;
    m = f.aia;
    n = f.from;
    q = f.to;
    if (l.M !== m.M && this.YSb(l, m, this.config.sWc))
        return {
            qu: false,
            reason: "testing-forced-ads-content"
        };
    if (l.M !== m.M && g.wb.g1(null !== (h = null === (e = this.j.hm) || undefined === e ? undefined : e.Wy.Oy) && undefined !== h ? h : "") && this.YSb(l, m, this.config.QPc))
        return {
            qu: false,
            reason: "playready-forced-ads-content"
        };
    f = this.config.i4c;
    return 0 < f.length ? (f.some(function(r) {
        r = new RegExp(r);
        if (r.test(n.profile) && !r.test(q.profile) || r.test(q.profile) && !r.test(n.profile))
            return (false,
            k = false,
            true);
    }),
    k ? {
        qu: k
    } : {
        qu: false,
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
    f = null === (l = null === (k = this.fb.ei) || undefined === k ? undefined : k.ba[f.M]) || undefined === l ? undefined : l.type;
    e = null === (n = null === (m = this.fb.ei) || undefined === m ? undefined : m.ba[e.M]) || undefined === n ? undefined : n.type;
    m = f + "to" + e;
    return h.map(function(q) {
        return q.toLowerCase();
    }).includes(m.toLowerCase());
}
;
export const Okb = d;

// Detected exports: Okb