/**
 * Netflix Cadmium Playercore - Module 12849
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: KJa
 * Dependencies: 4203, 5021, 22674, 22970, 32573, 42207, 81918, 87386, 87657, 94886
 * Purpose: Logging, Event handling, Configuration, Error handling
 */

// import dep_4203 from './Module_4203.js';
// import dep_5021 from './Module_5021.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_32573 from './Module_32573.js';
// import dep_42207 from './Module_42207.js';
// import dep_81918 from './Module_81918.js';
// import dep_87386 from './Module_87386.js';
// import dep_87657 from './Module_87657.js';
// import dep_94886 from './Module_94886.js';

// Webpack module 12849
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n;
class d {
    constructor(q, r, u, v) {
    this.is = u;
    this.Hi = v;
    this.log = q.zb("TaskScheduler");
    this.Xb = new m.jl();
    this.config = r();
    this.currentIteration = this.eaa = 0;
    this.KV = [];
    this.paused = false;
    this.wAa = [];
    this.Yub = [];
    this.VCc = this.config.yQc || n.append;
    this.addEventListener = this.Xb.addListener;
}
    pause() {
    this.paused = true;
}
    gi() {
    var q, r, u, v;
    q = this;
    if (this.eaa === this.KV.length)
        this.log.trace("all tasks completed");
    else if (this.paused)
        this.log.trace("in paused state", {
            currentTaskIndex: this.eaa,
            numberOfTasks: this.KV.length
        });
    else {
        r = this.$xc();
        u = this.currentIteration;
        r.startTime = this.Hi.Fc().na(l.Ba);
        r.status = e.Yr.zz;
        this.Xb.qd(c.xla.P0c, {
            R: r.R,
            type: r.type
        });
        this.wAa.push(r);
        v = function(w) {
            r.endTime = q.Hi.Fc().na(l.Ba);
            w();
            q.Yub.push(r);
            q.wAa.splice(q.wAa.indexOf(r), 1);
            q.currentIteration === u && (q.eaa++,
            q.gi());
        }
        ;
        r.DVc().then(function() {
            v(function() {
                r.status = e.Yr.D4;
                q.j3a(r, c.xla.Q0c, "task succeeded");
            });
        }).catch(function(w) {
            v(function() {
                0 <= [e.Yr.fd, e.Yr.mgc, e.Yr.hQa].indexOf(w.status) ? (r.status = w.status,
                q.j3a(r, c.xla.N0c, "cancelled task")) : (r.status = e.Yr.pd,
                q.j3a(r, c.xla.O0c, "task failed", w));
            });
        });
    }
}
    getStats(q, r, u) {
    var v, w, x, y;
    v = this.Yub.map(function(A) {
        return A.Fu();
    });
    w = this.wAa.map(function(A) {
        return A.Fu();
    });
    x = this.is.Mi(q) && this.is.Mi(r);
    y = {};
    if (this.is.Mi(u))
        return (y.uic = v.filter(function(A) {
            return A.movieId === u;
        }),
        y);
    v.concat(w).forEach(function(A) {
        var z;
        y[A.type + "_" + A.status] = (y[A.type + "_" + A.status] | 0) + 1;
        z = A.status == e.Yr.zz ? A.startTime : A.endTime;
        x && z && z >= q && z < r && (y[A.type + "_" + A.status + "_delta"] = (y[A.type + "_" + A.status + "_delta"] | 0) + 1);
    });
    return y;
}
    j3a(q, r, u, v) {
    var w;
    w = q.Fu();
    v ? this.log.warn(u, w, v) : this.log.trace(u, w);
    this.Xb.qd(r, {
        R: q.R,
        type: q.type,
        reason: q.status
    });
    q.w2(w);
}
    WCc(q) {
    var r, u;
    r = this.KV.filter(function(v) {
        return v.ZOc && v.status === e.Yr.pn;
    });
    u = this.VCc;
    return u === n.uta ? [].concat(q) : u === n.prepend ? r.concat(q) : q.concat(r);
}
}
t = a(22970);
p = a(22674);
c = a(87657);
g = a(87386);
f = a(4203);
e = a(32573);
h = a(42207);
k = a(81918);
l = a(5021);
m = a(94886);
(function(q) {
    q.prepend = "prepend";
    q.append = "append";
    q.uta = "ignore";
}
)(n || (n = {}));
d.prototype.$ac = function(q) {
    this.log.trace("adding tasks, number of tasks: " + q.length);
    this.paused = false;
    this.KV = this.WCc(q);
    this.eaa = 0;
    this.currentIteration += 1;
    this.gi();
}
;
d.prototype.$xc = function() {
    return this.KV[this.eaa];
}
;
a = d;
export const KJa = a;
export const KJa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(g.Bb)), t.__param(1, (0,
p.v)(f.Pc)), t.__param(2, (0,
p.v)(h.Zi)), t.__param(3, (0,
p.v)(k.re))], a);

// Detected exports: KJa
