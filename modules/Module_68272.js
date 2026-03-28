/**
 * Netflix Cadmium Playercore - Module 68272
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: WKa
 * Dependencies: 22674, 22970, 45247, 81734, 87386
 * Purpose: Video handling, Buffer/Segment management, Logging, Configuration
 */

// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_45247 from './Module_45247.js';
// import dep_81734 from './Module_81734.js';
// import dep_87386 from './Module_87386.js';

// Webpack module 68272
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
class d {
    constructor(e) {
    this.W_a = {};
    this.Gta = {};
    this.Cua = -1;
    this.L6a = new g.Ac(null);
    this.X2a = new g.Ac(null);
    this.va = e.zb("StreamChangeDetector");
}
    Gb(e, h, k) {
    var l;
    l = this;
    e.forEach(function(m) {
        m.stream.urls.forEach(function(n) {
            l.W_a[n.url] = [m, n.Ug];
        });
    });
    this.iSa = h;
    this.Cnc = k;
    new PerformanceObserver(function(m) {
        l.U2c(m.getEntries());
    }
    ).observe({
        entryTypes: ["resource"],
        buffered: false
    });
}
    gSb(e) {
    var h, k, l;
    if (this.iSa) {
        k = this.qsa(e);
        if (k !== this.Cua) {
            for (this.Cua = k; 0 <= k && !this.Gta[k]; )
                k--;
            l = Fa(null !== (h = this.Gta[k]) && undefined !== h ? h : [this.iSa, this.Cnc]);
            h = l.next().value;
            l = l.next().value;
            this.va.debug("Setting time to " + e + ", using metadata from fragment " + k + " for " + ((0,
            c.FI)(h.track.type) + " track with bitrate ") + (h.stream.bitrate + " from cdn " + l));
            e = h.Ta[this.Cua];
            k = e.Nb;
            this.X2a.set({
                stream: h,
                CZ: {
                    startTime: Math.floor(1E3 * k),
                    endTime: Math.floor(1E3 * (k + e.duration))
                },
                Gk: l
            });
        }
    }
}
    qsa(e) {
    var h, k, l, m, n;
    h = this.iSa.Ta;
    e /= 1E3;
    k = 0;
    l = h.length - 1;
    if (e >= h[l].Nb)
        return l;
    for (; l >= k; ) {
        m = k + Math.floor((l - k) / 2);
        n = h[m];
        if (e < n.Nb)
            l = m - 1;
        else if (e >= n.Nb + n.duration)
            k = m + 1;
        else
            return m;
    }
    return h.length - 1;
}
    U2c(e) {
    var h;
    h = this;
    e.filter(function(k) {
        return "video" === k.initiatorType;
    }).forEach(function(k) {
        var l, m, n;
        l = k.name.indexOf("&fi=");
        if (0 < l) {
            m = k.name.substring(0, l);
            l = Number(k.name.substring(l + 4));
            if (h.W_a[m]) {
                n = Fa(h.W_a[m]);
                k = n.next().value;
                n = n.next().value;
                m && !Number.isNaN(l) && k && (h.Gta[l] && (h.Cua = -1),
                h.Gta[l] = [k, n],
                m = k.Ta[l].Nb,
                false,
                h.L6a.set(k, {
                    jR: Math.floor(1E3 * m),
                    Gk: n
                }));
            }
        }
    });
}
}
t = a(22970);
p = a(22674);
c = a(45247);
g = a(81734);
a = a(87386);
f = d;
export const WKa = f;
export const WKa = f = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.Bb))], f);

// Detected exports: WKa
