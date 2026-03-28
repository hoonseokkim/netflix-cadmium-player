/**
 * Netflix Cadmium Playercore - Module 33399
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: KFa
 * Dependencies: 5021, 22674, 22970, 30869, 63368, 64274, 66523, 72574, 81438
 * Purpose: Network/HTTP, Timing/Scheduling, Parsing/Serialization, Error handling
 */

// import dep_5021 from './Module_5021.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_30869 from './Module_30869.js';
// import dep_63368 from './Module_63368.js';
// import dep_64274 from './Module_64274.js';
// import dep_66523 from './Module_66523.js';
// import dep_72574 from './Module_72574.js';
// import dep_81438 from './Module_81438.js';

// Webpack module 33399
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m;
class d {
    constructor(n, q, r) {
    this.Qa = n;
    this.e5c = q;
    this.performance = r;
    (0,
    c.Rw)(this, "performance");
}
    get(n, q, r) {
    var u;
    u = this;
    return new Promise(function(v, w) {
        var x, y, A;
        try {
            x = u.e5c.create();
            ("withCredentials"in x) || w(Error("Missing CORS support"));
            x.open("GET", n, true);
            q && (x.withCredentials = true);
            r && (x.timeout = r.na(m.Ba));
            y = u.Qa.Hg;
            A = undefined;
            x.onreadystatechange = function() {
                var z;
                switch (x.readyState) {
                case XMLHttpRequest.HEADERS_RECEIVED:
                    A = u.Qa.Hg.da(y);
                    break;
                case XMLHttpRequest.DONE:
                    z = u.Qa.Hg.da(y);
                    z = {
                        body: x.responseText,
                        status: x.status,
                        headers: p.Y1a(x.getAllResponseHeaders()),
                        Of: u.XVa(n, (0,
                        f.la)(x.responseText.length), z, A)
                    };
                    v(z);
                }
            }
            ;
            x.send();
        } catch (z) {
            w(z);
        }
    }
    );
}
    XVa(n, q, r, u) {
    q = {
        size: q,
        duration: r,
        q7a: u
    };
    if (!this.performance || !this.performance.getEntriesByName)
        return q;
    r = this.performance.getEntriesByName(n);
    if (0 == r.length && (r = this.performance.getEntriesByName(n + "/"),
    0 == r.length))
        return q;
    n = r[r.length - 1];
    q = (0,
    g.bea)(q);
    n.decodedBodySize && (q.size = (0,
    f.la)(n.decodedBodySize));
    0 < n.duration ? q.duration = (0,
    m.timestamp)(n.duration) : 0 < n.startTime && 0 < n.responseEnd && (q.duration = (0,
    m.timestamp)(n.responseEnd - n.startTime));
    0 < n.requestStart && (q.Oxb = (0,
    m.timestamp)(n.domainLookupEnd - n.domainLookupStart),
    q.e7a = (0,
    m.timestamp)(n.connectEnd - n.connectStart),
    q.q7a = (0,
    m.timestamp)(n.responseStart - n.startTime),
    0 === n.secureConnectionStart ? q.x7a = (0,
    m.timestamp)(0) : undefined !== n.secureConnectionStart && (r = n.connectEnd - n.secureConnectionStart,
    q.x7a = (0,
    m.timestamp)(r),
    q.e7a = (0,
    m.timestamp)(n.connectEnd - n.connectStart - r)),
    0 < this.performance.timeOrigin && 0 < n.responseStart && (q.qQb = (0,
    m.timestamp)(this.performance.timeOrigin + n.requestStart),
    q.FQb = (0,
    m.timestamp)(this.performance.timeOrigin + n.responseStart)));
    return q;
}
}
t = a(22970);
c = a(66523);
g = a(64274);
f = a(72574);
e = a(63368);
h = a(30869);
k = a(22674);
l = a(81438);
m = a(5021);
d.Y1a = function(n) {
    var q, u, v;
    q = {};
    n = n.split("\r\n");
    for (var r = 0; r < n.length; r++) {
        u = n[r];
        v = u.indexOf(": ");
        0 < v && (q[u.substring(0, v).toLowerCase()] = u.substring(v + 2));
    }
    return q;
}
;
a = p = d;
export const KFa = a;
export const KFa = a = p = t.__decorate([(0,
k.aa)(), t.__param(0, (0,
k.v)(h.Yi)), t.__param(1, (0,
k.v)(l.Rnb)), t.__param(2, (0,
k.v)(e.rla)), t.__param(2, (0,
k.optional)())], a);

// Detected exports: KFa
