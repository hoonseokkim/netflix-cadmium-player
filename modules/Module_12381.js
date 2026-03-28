/**
 * Netflix Cadmium Playercore - Module 12381
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Hgb, R0b
 * Dependencies: 22970, 35536, 89025, 91176, 94258
 * Purpose: Buffer/Segment management, Event handling, Timing/Scheduling, Error handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_35536 from './Module_35536.js';
// import dep_89025 from './Module_89025.js';
// import dep_91176 from './Module_91176.js';
// import dep_94258 from './Module_94258.js';

// Webpack module 12381
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;

d = a(22970);
p = a(91176);
c = a(35536);
g = a(94258);
f = a(89025);
e = [50, 100, 150, 200, 250, 300, 500, 1E3, 2E3, 1E4];
h = (function() {
    class k {
    constructor(l) {
        this.size = l;
        this.xA = [];
    }
    push(l) {
        for (this.xA.push(l); this.xA.length >= this.size; )
            this.xA.shift();
    }
    Ij() {
        return this.xA;
    }
    BMc(l) {
        this.state.wUb.push(l);
    }
    AMc(l) {
        this.state.bzb.push(l);
    }
    zMc(l) {
        this.state.lqb.push(l);
    }
    F1c(l) {
        d.__awaiter(this, undefined, undefined, function() {
            var m, n, q, r, u;
            return d.__generator(this, function(v) {
                switch (v.label) {
                case 0:
                    (m = new c.rK(),
                    m.start(),
                    v.label = 1);
                case 1:
                    return (v.ac.push([1, 3, , 4]),
                    [4, l]);
                case 2:
                    return (n = v.T(),
                    m.stop(),
                    this.state.NEb.push(m.duration),
                    [3, 4]);
                case 3:
                    return (q = v.T(),
                    (0,
                    p.xM)(q) ? this.state.nqb++ : this.state.dWb++,
                    [2]);
                case 4:
                    return (n.ok || (r = null !== (u = this.state.HXa[n.status]) && undefined !== u ? u : 0,
                    this.state.HXa[n.status] = r + 1),
                    [2]);
                }
            });
        });
    }
    mNc() {
        this.state.Aia++;
    }
    qMc(l) {
        this.state.yRb++;
        this.state.DRb.push(l);
    }
    WLc(l, m, n) {
        var q, r;
        if ((0,
        f.Vta)(l)) {
            r = null !== (q = this.state.Q_a[l.Qj]) && undefined !== q ? q : 0;
            this.state.Q_a[l.Qj] = r + 1;
        } else
            (q = null !== (r = this.state.Z4a[l.type]) && undefined !== r ? r : 0,
            this.state.Z4a[l.type] = q + 1);
        m && this.state.qHb.push({
            eventType: l.type,
            presentationTimeS: n.ri
        });
    }
    CMc(l) {
        this.state.nRb.push(l);
    }
    Wyc() {
        return {
            httpLatencyBuckets: this.state.NEb,
            unhandledExceptions: this.state.dWb,
            abortsCount: this.state.nqb,
            httpErrorCounts: this.state.HXa,
            successAttemptsCounts: this.state.wUb,
            scheduledDelay: this.state.nRb,
            errorAttemptsCounts: this.state.bzb,
            abortAttemptsCounts: this.state.lqb,
            scteEventsReceivedCounts: this.state.Z4a,
            mediaEventsReceivedCounts: this.state.Q_a,
            urlsChanged: this.state.Aia,
            segmentDroppedEvents: this.state.yRb,
            segmentsDropped: this.state.DRb.Ij(),
            lastEventsAdded: this.state.qHb.Ij()
        };
    }
}
return k;
}
)();
export const R0b = h;
t = (function() {
    function k() {
        this.state = {
            lqb: new p.jh(),
            nqb: 0,
            bzb: new p.jh(),
            HXa: {},
            NEb: new g.uG(e),
            nRb: new p.jh(),
            Z4a: {},
            Q_a: {},
            wUb: new p.jh(),
            dWb: 0,
            Aia: 0,
            yRb: 0,
            DRb: new h(10),
            qHb: new h(10)
        };
    }
    return k;
}
)();
export const Hgb = t;

// Detected exports: Hgb, R0b
