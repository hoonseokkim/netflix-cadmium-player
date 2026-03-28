/**
 * Netflix Cadmium Playercore - Module 85432
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: yIa
 * Dependencies: 5021, 7605, 22674, 22970, 63368, 72639, 79542, 81378, 87386
 * Purpose: Network/HTTP, Logging, Configuration, Timing/Scheduling
 */

// import dep_5021 from './Module_5021.js';
// import dep_7605 from './Module_7605.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_63368 from './Module_63368.js';
// import dep_72639 from './Module_72639.js';
// import dep_79542 from './Module_79542.js';
// import dep_81378 from './Module_81378.js';
// import dep_87386 from './Module_87386.js';

// Webpack module 85432
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l;
class d {
    constructor(m, n, q) {
    this.performance = m;
    this.config = q;
    this.f$ = [];
    this.log = n.zb("PboBackoffManager");
}
    DRc(m, n) {
    var q;
    if (this.config.jTa && (0,
    e.oPb)(l, n) && (m = (null !== m && undefined !== m ? m : {})["x-netflix.playapi.backoff"]))
        try {
            q = JSON.parse(m);
            this.V3c(q);
            this.log.debug("Adding backoff", q);
            this.f$.push({
                I4a: q.retryAfterSeconds,
                GUc: q.requestTypes,
                Kz: q.viewableIds,
                Qdc: this.performance.now()
            });
        } catch (r) {}
}
    ovc(m, n) {
    var q, r, u;
    q = this;
    if (this.config.jTa) {
        r = this.performance.now();
        this.Ihc(r);
        u = this.f$.filter(function(v) {
            return (0,
            e.oPb)(v.GUc, m);
        }).filter(function(v) {
            return undefined === v.Kz || 0 === v.Kz.length || v.Kz.includes(n);
        });
        if (0 !== u.length) {
            if (m.startsWith("prefetch"))
                return (this.log.debug("getBackoff: cancelling " + m + " request for " + n),
                {
                    yZ: true
                });
            u = u.map(function(v) {
                return q.lDb(v, r);
            }).reduce(function(v, w) {
                return 0 < w.xl(v) ? w : v;
            }, (0,
            f.ri)(0));
            this.log.debug("getBackoff: delaying " + m + " request for " + n + " for " + u.na(f.Ba) + "ms");
            return {
                yZ: false,
                mVc: u
            };
        }
    }
}
    V3c(m) {
    if ("number" !== typeof m.retryAfterSeconds)
        throw Error("retryAfterSeconds is not a number");
    if (!Array.isArray(m.requestTypes))
        throw Error("requestTypes is not an array");
    if (0 === m.requestTypes.length)
        throw Error("requestTypes is empty");
    if (!m.requestTypes.every(function(n) {
        return "string" === typeof n;
    }))
        throw Error("requestTypes contains a non-string element");
    if (undefined !== m.viewableIds) {
        if (!Array.isArray(m.viewableIds))
            throw Error("viewableIds is not an array");
        if (!m.viewableIds.every(function(n) {
            return "number" === typeof n;
        }))
            throw Error("viewableIds contains a non-number element");
    }
}
    Ihc(m) {
    for (var n = this.f$.length - 1; 0 <= n; )
        (this.lDb(this.f$[n], m).TYa() || this.f$.splice(n, 1),
        --n);
}
    lDb(m, n) {
    n = (0,
    f.pc)(n).da((0,
    f.pc)(m.Qdc));
    return (0,
    f.ri)(m.I4a).da(n);
}
}
t = a(22970);
p = a(22674);
c = a(87386);
g = a(63368);
f = a(5021);
e = a(79542);
h = a(81378);
k = a(72639);
a = a(7605);
l = [].concat(Ba(h.d$a), Ba(k.e$a));
h = d;
export const yIa = h;
export const yIa = h = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.rla)), t.__param(1, (0,
p.v)(c.Bb)), t.__param(2, (0,
p.v)(a.Nx))], h);

// Detected exports: yIa
