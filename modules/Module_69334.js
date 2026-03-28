/**
 * Netflix Cadmium Playercore - Module 69334
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: tJa
 * Dependencies: 22674, 22970, 42207, 87386
 * Purpose: Buffer/Segment management, Encryption/Decryption, Logging, Playback control
 */

// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_42207 from './Module_42207.js';
// import dep_87386 from './Module_87386.js';

// Webpack module 69334
// Parameters: t (module), b (exports), a (require)

var p, c, g;
class d {
    constructor(f, e, h) {
    this.ij = f;
    this.oc = h;
    this.ba = [];
    this.log = e.zb("PlayedSegmentsTrackerImpl");
}
    some(f) {
    return this.ba.some(f);
}
    lta() {
    return !!(this.ba[0] && this.ba[0].stream && this.oc.Mi(this.ba[0].stream.Wb));
}
    Iu(f) {
    return this.ba.filter(f).reduce(function(e, h) {
        return e + (h.endTime - h.startTime) / h.rate;
    }, 0);
}
    tca(f) {
    return this.ba.filter(f).reduce(function(e, h) {
        return e + h.endTime - h.startTime;
    }, 0);
}
    SUa(f, e) {
    var h, k;
    h = this;
    k = {};
    return this.ba.filter(function(l) {
        return !e || l.ym === e;
    }).reduce(function(l, m) {
        var n, q, r;
        n = f.bind(h, m)();
        q = n.key;
        n = p.__rest(n, ["key"]);
        m = m.endTime - m.startTime;
        r = k[q];
        r ? r.duration += m : (r = n,
        r.duration = m,
        l.push(r),
        k[q] = r);
        return l;
    }, []);
}
    cf(f, e, h) {
    var k;
    h = undefined === h ? this.ij.playbackRate.value : h;
    k = this.ba;
    f && e && e >= f.startTime && (f = {
        Yc: f.Yc,
        track: f.track,
        stream: f.stream,
        startTime: f.startTime,
        Fy: f.Fy,
        oda: f.oda,
        endTime: e,
        rate: h,
        ym: f.ym || "content",
        Xe: f.Xe
    },
    (e = k[k.length - 1]) && e.track === f.track && e.stream === f.stream && e.Yc === f.Yc && e.endTime === f.startTime && e.rate === f.rate && e.Fy === f.Fy && e.oda === f.oda && e.ym === f.ym && e.Xe === f.Xe ? e.endTime = f.endTime : k.push(f),
    false);
}
    sWa(f) {
    var e;
    e = this;
    return this.Jyc().reduce(function(h, k) {
        h[k] = {};
        f.forEach(function(l) {
            var m, n;
            l = Fa(l);
            m = l.next().value;
            n = l.next().value;
            h[k][m] = Math.floor(e.Iu(function(q) {
                return n(q) && q.Xe === k;
            }));
        });
        return h;
    }, {});
}
    Jyc() {
    return [].concat(Ba(new Set(this.ba.map(function(f) {
        return f.Xe;
    }).filter(function(f) {
        return undefined !== f;
    }))));
}
}
p = a(22970);
t = a(22674);
c = a(42207);
g = a(87386);
a(5021);
a = d;
export const tJa = a;
export const tJa = a = p.__decorate([p.__param(1, (0,
t.v)(g.Bb)), p.__param(2, (0,
t.v)(c.Zi))], a);

// Detected exports: tJa
