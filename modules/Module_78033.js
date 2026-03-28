/**
 * Netflix Cadmium Playercore - Module 78033
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: FFa
 */

// Webpack module 78033
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
function d(e, h) {
    this.MBc = e;
    this.log = h.zb("HeaderFetcherImpl");
}
export const FFa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
c = a(87386);  // import from Module_87386
g = a(2571);  // import from Module_02571
f = a(32934);  // import from Module_32934
d.prototype.download = function(e) {
    var k, l, m, n, q;
    function h(r) {
        if (q < l.length - 1)
            return (false,
            q++,
            k.Xxb(l[q].url, m, n).catch(h));
        throw r;
    }
    k = this;
    l = e.urls;
    m = e.offset;
    n = e.length;
    q = 0;
    return this.Xxb(l[q].url, m, n).catch(h);
}
;
d.prototype.Xxb = function(e, h, k) {
    return this.MBc.download({
        url: e,
        withCredentials: false,
        responseType: f.ResponseType.wZb,
        EL: "hls_headers",
        Hz: true,
        offset: h,
        length: k,
        ox: f.N7
    }, {
        T1: 1
    });
}
;
a = d;
export const FFa = a;
b.FFa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.Vdb)), t.__param(1, (0,
p.v)(c.Bb))],

// Detected exports: FFa
