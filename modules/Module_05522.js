/**
 * Netflix Cadmium Playercore - Module 5522
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: z7
 * Dependencies: 5021, 26388, 32219, 85001
 * Purpose: Logging, Event handling, Configuration, Error handling
 */

// import dep_5021 from './Module_5021.js';
// import dep_26388 from './Module_26388.js';
// import dep_32219 from './Module_32219.js';
// import dep_85001 from './Module_85001.js';

// Webpack module 5522
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
class d {
    constructor(e, h, k, l, m) {
    var n;
    n = this;
    this.j = e;
    this.ki = h;
    this.config = k;
    this.$a = l;
    this.lb = m;
    this.D$ = function() {
        n.Fh();
        n.j.Ua.sl.removeListener(n.yJ);
        n.j.Ua.oa.removeListener(n.lb.gq);
        n.j.Ua.oa.removeListener(n.Fq);
        n.j.Ua.qj.removeListener(n.lb.Z9);
        n.j.mk.removeListener(n.aOb);
        n.j.C3.removeListener(n.pt);
        n.j.Ua.Fe.removeListener(n.Dfa);
        n.j.bc.removeListener(n.LD);
        n.j.bc.removeListener(n.BZ);
        n.j.Ua.ig.removeListener(n.Qia);
        n.j.Ua.playbackRate.removeListener(n.lb.qha);
        n.j.removeEventListener(g.cb.closed, n.D$);
        n.j.removeEventListener(g.cb.Ioa, n.lb.Sj);
    }
    ;
    this.BZ = function() {
        n.j.bc.value === g.Qb.Bg && (n.j.bc.removeListener(n.BZ),
        n.YB());
    }
    ;
    this.yJ = function(q) {
        n.$w && n.lb.yJ(q);
    }
    ;
    this.pt = function(q) {
        n.$w && undefined !== q.newValue && (n.L3 && n.wv && n.lb.r2a(n.getTime() - n.wv, n.L3.F4a),
        n.L3 = {
            F4a: "repos",
            kQb: q.newValue
        },
        n.lb.XN(q.newValue, n.j.Ua.gf.value, n.j.Ua.Fe.value),
        n.wv = n.getTime(),
        (0,
        c.gi)(n.LD));
    }
    ;
    this.aOb = function(q) {
        n.$w && n.lb.Lxa(!q.newValue);
    }
    ;
    this.Fq = function(q) {
        q.XE && (n.qI = q.XE,
        n.lb.Fq(q),
        n.L3 = {
            F4a: "repos",
            kQb: g.Tc.m8
        },
        n.wv = n.getTime(),
        (0,
        c.gi)(n.LD));
    }
    ;
    this.LD = function() {
        var q;
        if (n.wv && n.L3 && n.j.bc.value !== g.Qb.Bh) {
            q = n.getTime() - n.wv;
            n.lb.mv(q, false, n.L3);
            n.qI && n.qI != n.j.Ua.oa.Cc && n.lb.rPa();
            n.wv = undefined;
            n.L3 = undefined;
        }
    }
    ;
    this.YB = function() {
        n.$w || (n.$w = true,
        n.lb.aq(n.j),
        n.hYa(),
        n.config().Jta && (n.jI = Da.setTimeout(function() {
            n.ki.flush(false).catch(function() {
                return n.log.warn("failed to flush log batcher on initialLogFlushTimeout");
            });
            n.jI = undefined;
        }, n.config().Jta)));
    }
    ;
    this.Fh = function() {
        n.jI && (Da.clearTimeout(n.jI),
        n.jI = undefined);
        n.qia && n.qia();
        n.$w ? n.lb.vw() : n.j.$j ? n.lb.aq(n.j) : n.lb.s2a();
    }
    ;
    this.Qia = function(q) {
        q.oldValue && q.sn && q.sn.jR && n.lb.qH(q.oldValue, q.newValue, q.sn.jR, q.sn.g$);
    }
    ;
    this.Dfa = function(q) {
        var r;
        if (q.newValue) {
            r = q.newValue.stream;
            n.iT != r && (n.iT && r && n.lb.Z3a(n.iT, r, q.newValue.CZ.startTime),
            n.iT = r);
        }
    }
    ;
    this.tAa();
}
    tAa() {
    this.j.addEventListener(g.cb.closed, this.D$);
    this.j.addEventListener(g.cb.Ioa, this.lb.Sj);
    this.j.Ua.sl.addListener(this.yJ);
    this.j.Ua.oa.addListener([f.l.Ea], this.lb.gq);
    this.j.Ua.oa.addListener([f.l.V], this.Fq);
    this.j.Ua.qj.addListener(this.lb.Z9);
    this.j.mk.addListener(this.aOb);
    this.j.C3.addListener(this.pt);
    this.j.Ua.Fe.addListener(this.Dfa);
    this.j.bc.addListener(this.LD);
    this.j.bc.addListener(this.BZ);
    this.j.Ua.ig.addListener(this.Qia);
    this.j.Ua.playbackRate.addListener(this.lb.qha);
}
    getTime() {
    return this.$a.Fc().na(p.Ba);
}
    hYa() {
    var e, h, k;
    e = this;
    k = [];
    this.config().VJb && (this.config().WJb.forEach(function(l) {
        k.push(Da.setTimeout(e.lb.HI, l));
    }),
    this.config().Ova && (h = Da.setInterval(this.lb.HI, this.config().Ova)),
    this.qia = function() {
        k.forEach(function(l) {
            Da.clearTimeout(l);
        });
        h && Da.clearInterval(h);
    }
    );
}
}
p = a(5021);
c = a(32219);
g = a(85001);
f = a(26388);
export const z7 = d;

// Detected exports: z7
