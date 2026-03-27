/**
 * Netflix Cadmium Playercore - Module 45830
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 45830
// Parameters: t (module), b (exports), a (require)


var p, c, g;
function d(f, e) {
    this.Ql = f;
    this.dy = e;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.IIa = void 0;
t = a(22970);
p = a(22674);
c = a(74870);
a = a(2248);
d.prototype.CVb = function(f) {
    var e, h;
    e = this;
    h = f.map(function(k) {
        return k.links.releaseLicense.href;
    }).map(function(k) {
        return e.Ql.Cxa(k.substring(k.indexOf("?") + 1));
    });
    return {
        success: !0,
        o1: f.map(function(k, l) {
            return {
                id: k.drmSessionId,
                NHb: h[l].drmlicensecontextid,
                OHb: h[l].licenseid
            };
        }),
        DB: f.map(function(k) {
            return {
                data: e.dy.decode(k.licenseResponseBase64),
                sessionId: k.drmSessionId
            };
        })
    };
}
;
g = d;
b.IIa = g;
b.IIa = g = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Um)), t.__param(1, (0,
p.v)(a.Km))], g);


// Detected exports: IIa