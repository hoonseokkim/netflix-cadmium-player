/**
 * Netflix Cadmium Playercore - Module 39461
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: s5, tK
 * Dependencies: 12847, 22970, 32910, 36992, 43529, 47359, 84007, 90745, 97322
 * Purpose: Logging, Event handling, Configuration, Class definition
 */

// import dep_12847 from './Module_12847.js';
// import dep_22970 from './Module_22970.js';
// import dep_32910 from './Module_32910.js';
// import dep_36992 from './Module_36992.js';
// import dep_43529 from './Module_43529.js';
// import dep_47359 from './Module_47359.js';
// import dep_84007 from './Module_84007.js';
// import dep_90745 from './Module_90745.js';
// import dep_97322 from './Module_97322.js';

// Webpack module 39461
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l;

export function s5(m, n, q) {
    var r;
    r = undefined;
    return (q || m.Qa.zj) && m.Qa.currentTime.$f(n) ? {
        promise: Promise.resolve()
    } : {
        promise: new Promise(function(u) {
            r = m.uu(k.ie.Jm(n), u);
        }
        ),
        Oe: r
    };
}
;
d = a(22970);
p = a(90745);
c = a(43529);
g = a(97322);
f = a(32910);
e = a(84007);
h = a(12847);
k = a(36992);
l = a(47359);
t = (function(m) {
    class n extends m {
    constructor(q, r, u, v) {
        var w;
        undefined === u && (u = "unknown");
        undefined === v && (v = 0);
        w = m.call(this) || this;
        w.Qa = q;
        w.console = r;
        w.name = u;
        w.priority = v;
        w.IKc = 0;
        w.Ks = new p.sf();
        w.yC = new Set();
        w.toa(q);
        return w;
    }
    kwb(q, r) {
        q = new (q.bind.apply(q, d.__spreadArray([undefined], d.__read(r), false)))();
        q.id = this.IKc++;
        q.Pcc(this);
        this.MY(q);
        return q;
    }
    Fs() {
        for (var q = [], r = 0; r < arguments.length; r++)
            q[r] = arguments[r];
        return this.kwb(e.iX, q);
    }
    Tq() {
        var q, r;
        r = d.__assign(d.__assign({}, null === (q = this.lp) || undefined === q ? undefined : q.Tq()), {
            privateNumTasks: this.yC.size
        });
        f.u && this.trace("audit", r);
        return r;
    }
    uu() {
        for (var q = [], r = 0; r < arguments.length; r++)
            q[r] = arguments[r];
        return this.kwb(h.h8, q);
    }
    Opa(q, r, u) {
        return this.Fs(function() {
            return d.__generator(this, function(v) {
                switch (v.label) {
                case 0:
                    return [4, k.ie.Mz(r)];
                case 1:
                    return (v.T(),
                    q(),
                    [3, 0]);
                case 2:
                    return [2];
                }
            });
        }, u);
    }
    toa(q) {
        var r, u, v;
        r = this;
        this.lp && this.lp.tBa({
            mz: (0,
            g.Ij)(this.yC.values())
        });
        this.KPb();
        u = l.NX.Kwc(q, this.console);
        v = u.tc;
        u = u.Qk;
        this.lp = v;
        this.Ks.clear();
        this.Qa = q;
        this.Ks.on(v, "stopping", function() {
            return r.emit("stopping");
        });
        this.xVc = u;
        this.lp.tBa({
            NY: (0,
            g.Ij)(this.yC.values())
        });
        this.emit("clockChanged");
    }
    La() {
        var q;
        if (!this.Us) {
            q = this.lp.XRa && this.yC.has(this.lp.XRa);
            this.reset();
            q && this.lp.nIc();
            this.KPb();
        }
    }
    KPb() {
        var q;
        this.lp && this.emit("rootSchedulerReleasing", {
            O3: this.lp
        });
        null === (q = this.xVc) || undefined === q ? undefined : q.release();
        this.lp = undefined;
    }
    reset() {
        var q;
        if (!this.Us) {
            q = (0,
            g.Ij)(this.yC.values());
            this.lp.tBa({
                mz: q
            });
            this.yC.clear();
            q.forEach(function(r) {
                return r.La();
            });
        }
    }
    kd() {
        var q;
        if (!this.Us) {
            q = (0,
            g.Ij)(this.yC.values());
            this.lp.tBa({
                mz: q
            });
            q.forEach(function(r) {
                return r.kd();
            });
        }
    }
    MY(q, r) {
        undefined === r && (r = true);
        this.Us ? f.u && this.console.warn(("Task added after destruction ").concat(q.name, " on ").concat(this.name)) : (this.yC.add(q),
        this.lp.MY(q, r));
    }
    zga(q) {
        (0,
        c.assert)(q.tc === this);
        this.Us ? f.u && this.console.warn(("Task restarted after destruction ").concat(q.name, " on ").concat(this.name)) : (this.yC.add(q),
        this.lp.zga(q));
    }
    PU(q, r) {
        undefined === r && (r = true);
        !this.Us && this.yC.has(q) && (this.yC.delete(q),
        this.lp.PU(q, r));
    }
    trace() {
        for (var q, r = [], u = 0; u < arguments.length; u++)
            r[u] = arguments[u];
        null === (q = this.console) || undefined === q ? undefined : q.trace.apply(q, d.__spreadArray([("TaskScheduler(").concat(this.name, "):")], d.__read(r), false));
    }
}
d.Object.defineProperties(n.prototype, {
        Us: {
            get: function() {
                return undefined === this.lp;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(n.prototype, {
        O3: {
            get: function() {
                return this.lp;
            },
            enumerable: false,
            configurable: true
        }
    });
    return n;
}
)(p.EventEmitter);
export const tK = t;

// Detected exports: s5, tK
