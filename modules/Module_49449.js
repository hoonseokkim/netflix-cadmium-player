/**
 * Netflix Cadmium Playercore - Module 49449
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 49449
// Parameters: t (module), b (exports), a (require)


var p, c, g, f, e, h;
function d(k) {
    return f.lj.call(this, k, c.ea.i9a) || this;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.lCa = void 0;
t = a(22970);
p = a(22674);
c = a(36129);
g = a(19114);
f = a(51658);
e = a(83998);
a(2762);
h = a(71977);
Ia(d, f.lj);
d.prototype.DS = function(k) {
    var l;
    l = (0,
    h.GWa)(k.rf);
    return g.oj.events + "/" + l + k.event;
}
;
d.prototype.ef = function(k, l) {
    var m, n, q;
    m = this;
    n = this.dR(l);
    !1;
    !1;
    q = {
        url: l.href,
        name: g.oj.events,
        Cm: this.DS(l),
        Sn: 2
    };
    return this.send(k, q, n).then(function() {
        return l;
    }).catch(function(r) {
        throw m.Ew(r);
    });
}
;
d.prototype.dR = function(k) {
    return {
        xid: k.Ia,
        event: k.event,
        adEventToken: k.ay,
        adBreakTriggerId: k.hb,
        adBreakLocationMs: k.Wv,
        eventLocationMs: k.LH,
        adInsertionType: k.lOa,
        position: k.position,
        clientTime: k.sH,
        sessionStartTime: k.al,
        appId: k.appId,
        sessionId: k.sessionId,
        playTimes: {},
        adBreakStartTime: k.gOa,
        playbackOffsetRefAdBreakStart: k.vfa,
        adBreakStartOffset: k.fOa,
        mainManifestPlaybackContextId: k.q_a,
        embeddedReason: k.vn,
        programId: k.Xe
    };
}
;
a = d;
b.lCa = a;
b.lCa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(e.io))], a);


// Detected exports: lCa