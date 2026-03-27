/**
 * Netflix Cadmium Playercore - Module 46303
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 46303
// Parameters: t (module), b (exports), a (require)


var p, c, g, f, e;
function d(h, k, l) {
    this.Qa = h;
    this.platform = k;
    this.config = l;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.HIa = void 0;
t = a(22970);
p = a(22674);
c = a(30869);
g = a(5021);
f = a(91581);
a = a(4203);
d.prototype.G1c = function(h) {
    var k, l;
    k = this;
    l = this.Qa.Hg.na(g.Ev);
    return {
        inputs: h.rL.map(function(m) {
            var n, q, r, u, v;
            return {
                drmSessionId: m.sessionId,
                clientTime: l,
                challengeBase64: m.dataBase64,
                xid: h.Ia.toString(),
                videoTrackName: h.eo,
                platform: null === (n = k.config().Te) || void 0 === n ? void 0 : n.version,
                clientVersion: k.platform.version,
                osVersion: null === (r = null === (q = k.config().Te) || void 0 === q ? void 0 : q.os) || void 0 === r ? void 0 : r.version,
                osName: null === (v = null === (u = k.config().Te) || void 0 === u ? void 0 : u.os) || void 0 === v ? void 0 : v.name
            };
        }),
        SZa: "standard" === h.Ti.toLowerCase() ? "license" : "ldl",
        rf: h.rf,
        J: h.J
    };
}
;
e = d;
b.HIa = e;
b.HIa = e = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Yi)), t.__param(1, (0,
p.v)(f.Vt)), t.__param(2, (0,
p.v)(a.Pc))], e);


// Detected exports: HIa