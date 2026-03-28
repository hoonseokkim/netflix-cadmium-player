/**
 * Netflix Cadmium Playercore - Module 99400
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: z7
 * Dependencies: 5021, 26388, 31276, 32219, 79542, 85001
 * Purpose: Manifest handling, Buffer/Segment management, Logging, Event handling
 */

// import dep_5021 from './Module_5021.js';
// import dep_26388 from './Module_26388.js';
// import dep_31276 from './Module_31276.js';
// import dep_32219 from './Module_32219.js';
// import dep_79542 from './Module_79542.js';
// import dep_85001 from './Module_85001.js';

// Webpack module 99400
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
class d {
    constructor(k, l, m, n, q, r, u, v) {
    var w;
    w = this;
    this.j = k;
    this.Ua = l;
    this.FS = n;
    this.ki = q;
    this.config = r;
    this.$a = u;
    this.lb = v;
    this.QM = function(x, y) {
        return function(A) {
            var z;
            z = y(A);
            if ("number" !== typeof z)
                throw Error("Event " + JSON.stringify(A) + " does not have movie Id");
            w.dKc.includes(z) && x(A);
        }
        ;
    }
    ;
    this.VIb = this.QM(function(x) {
        w.tAa(x.XS);
    }, function(x) {
        return x.R;
    });
    this.TIb = this.QM(function() {
        w.D$();
    }, function(x) {
        return x.R;
    });
    this.Hub = this.QM(function() {
        w.D$();
    }, function(x) {
        return x.movieId;
    });
    this.sQa = this.QM(function() {
        w.j.bc.value === f.Qb.Bg && (w.j.bc.removeListener(w.sQa),
        w.YB());
    }, function() {
        return w.j.R;
    });
    this.yJ = function(x) {
        w.$w && w.lb.yJ(x);
    }
    ;
    this.Nub = this.QM(this.lb.iic, function(x) {
        return x.R;
    });
    this.Wxb = this.QM(this.lb.Woc, function(x) {
        return x.R;
    });
    this.tIb = this.QM(this.lb.Pda, function(x) {
        return w.j.mm(x.segmentId).R;
    });
    this.YRb = this.QM(this.lb.Xga, function(x) {
        return w.j.mm(x.segmentId).R;
    });
    this.pt = function(x) {
        x.skip && (w.rO = true);
        switch (x.Jc) {
        case f.Tc.Dv:
        case f.Tc.lX:
        case f.Tc.m8:
        case f.Tc.q6:
        case f.Tc.Ska:
            w.M3 && w.wv && w.lb.r2a(w.getTime() - w.wv, w.M3);
            w.M3 = "repos";
            w.lb.XN(x.XT, x.gf, x.Fe);
            w.wv = w.getTime();
            (0,
            g.gi)(w.LD);
            break;
        case f.Tc.jka:
            w.M3 = "force_rebuffer";
            w.wv = w.getTime();
            (0,
            g.gi)(w.LD);
            break;
        case f.Tc.PX:
        case f.Tc.cp:
            break;
        default:
            return (0,
            e.MH)(x.Jc);
        }
    }
    ;
    this.Fq = function(x) {
        w.qI = x.XE;
        w.lb.Fq(x);
    }
    ;
    this.LD = function() {
        var x;
        if (w.wv && w.j.bc.value !== f.Qb.Bh) {
            x = w.getTime() - w.wv;
            w.lb.mv(x, w.rO, w.M3);
            w.qI && w.qI != w.j.oa.Cc && w.lb.rPa();
            w.wv = undefined;
            w.M3 = undefined;
            w.rO = undefined;
        }
    }
    ;
    this.YB = function() {
        w.$w || (w.$w = true,
        w.lb.aq(false),
        w.hYa(),
        w.config().Jta && (w.jI = Da.setTimeout(function() {
            w.ki.flush(false).catch(function() {
                return w.log.warn("failed to flush log batcher on initialLogFlushTimeout");
            });
            w.jI = undefined;
        }, w.config().Jta)));
    }
    ;
    this.Fh = function() {
        w.jI && (Da.clearTimeout(w.jI),
        w.jI = undefined);
        if (w.LAb() || w.config().aw)
            (w.JSa && (Da.clearInterval(w.JSa),
            w.JSa = undefined),
            w.lb.Nxb());
        w.qia && w.qia();
        w.$w ? w.lb.vw(!!w.j.$j) : w.j.$j ? w.lb.aq(true) : w.Ua.background.value || w.lb.s2a();
    }
    ;
    this.Qia = function(x) {
        x.oldValue && x.sn && x.sn.jR && w.lb.qH(x.oldValue, x.newValue, x.sn.jR, x.sn.g$);
    }
    ;
    this.Dfa = function(x) {
        var y;
        if (x.newValue) {
            y = x.newValue.stream;
            w.iT != y && (w.iT && y && w.lb.Z3a(w.iT, y, w.FS(x.newValue.CZ.startTime)),
            w.iT = y);
        }
    }
    ;
    this.dKc = l.bg ? k.RDb() : [l.R];
    this.log = (0,
    p.Fo)(k, "LogblobBuilder");
    this.Gb();
    m && this.tAa();
}
    Gb() {
    this.j.addEventListener(f.ja.ZM, this.VIb);
    this.j.addEventListener(f.ja.v_a, this.TIb);
    this.j.addEventListener(f.ja.Pda, this.tIb);
    this.j.addEventListener(f.ja.Xga, this.YRb);
    this.j.addEventListener(f.ja.Fh, this.Hub);
    if (this.LAb() || this.config().aw)
        (this.j.addEventListener(f.ja.HR, this.Wxb),
        this.JSa = Da.setInterval(this.lb.Nxb, this.config().$oc));
    this.config().i4a && this.j.addEventListener(f.ja.HR, this.Nub);
}
    tAa(k) {
    var l;
    l = this;
    this.vKb || (this.j.bc.value !== f.Qb.Bg || (undefined === k ? 0 : k) ? this.j.bc.addListener(this.sQa) : this.YB(),
    this.j.sl.addListener(this.yJ),
    this.j.oa.addListener([h.l.Ea], this.lb.gq),
    this.j.oa.addListener([h.l.V], this.Fq),
    this.j.qj.addListener(this.lb.Z9),
    this.j.paused.addListener(this.lb.Lxa),
    this.j.Fe.addListener(this.Dfa),
    this.j.bc.addListener(this.LD),
    this.j.bc.addListener(this.lb.wVb),
    this.j.ig.addListener(this.Qia),
    this.j.playbackRate.addListener(this.lb.qha),
    this.j.addEventListener(f.ja.Sj, this.lb.Sj),
    this.j.addEventListener(f.ja.ZY, this.lb.ZY),
    this.j.addEventListener(f.ja.ava, this.lb.ava),
    this.j.addEventListener(f.ja.C4, this.lb.C4),
    this.j.addEventListener(f.ja.iH, function(m) {
        l.M3 = "rebuffer";
        l.lb.iH(m);
        l.wv = l.getTime();
        (0,
        g.gi)(l.LD);
    }),
    this.j.addEventListener(f.ja.pt, this.pt),
    this.j.addEventListener(f.ja.R4, this.lb.R4),
    this.Ua.fw && this.Ua.fw.addListener(this.lb.fw),
    this.vKb = true);
}
    getTime() {
    return this.$a.Fc().na(c.Ba);
}
    hYa() {
    var k, l, m;
    k = this;
    m = [];
    this.config().VJb && (this.config().WJb.forEach(function(n) {
        m.push(Da.setTimeout(k.lb.HI, n));
    }),
    this.config().Ova && (l = Da.setInterval(this.lb.HI, this.config().Ova)),
    this.qia = function() {
        m.forEach(function(n) {
            Da.clearTimeout(n);
        });
        l && Da.clearInterval(l);
    }
    );
}
    LAb() {
    var k, l, m;
    m = null === (l = null === (k = this.j.ga.S) || undefined === k ? undefined : k.Aa.EF) || undefined === l ? undefined : l.H6a;
    if (undefined !== m && undefined !== m.downloadReportDenominator)
        try {
            return parseInt(m.downloadReportDenominator, 10);
        } catch (n) {
            this.log.error("Unable to parse manifest config override:" + m.downloadReportDenominator);
        }
    return this.config().Zxb;
}
}
p = a(31276);
c = a(5021);
g = a(32219);
f = a(85001);
e = a(79542);
h = a(26388);
d.prototype.D$ = function() {
    this.Fh();
    this.vKb && (this.j.removeEventListener(f.ja.ZM, this.VIb),
    this.j.removeEventListener(f.ja.v_a, this.TIb),
    this.j.removeEventListener(f.ja.Pda, this.tIb),
    this.j.removeEventListener(f.ja.Xga, this.YRb),
    this.j.sl.removeListener(this.yJ),
    this.j.oa.removeListener(this.lb.gq),
    this.j.oa.removeListener(this.Fq),
    this.j.qj.removeListener(this.lb.Z9),
    this.j.paused.removeListener(this.lb.Lxa),
    this.j.Fe.removeListener(this.Dfa),
    this.j.bc.removeListener(this.LD),
    this.j.bc.removeListener(this.sQa),
    this.j.bc.removeListener(this.lb.wVb),
    this.j.ig.removeListener(this.Qia),
    this.j.playbackRate.removeListener(this.lb.qha),
    this.j.removeEventListener(f.ja.Fh, this.Hub),
    this.j.removeEventListener(f.ja.Sj, this.lb.Sj),
    this.j.removeEventListener(f.ja.ZY, this.lb.ZY),
    this.j.removeEventListener(f.ja.C4, this.lb.C4),
    this.j.removeEventListener(f.ja.iH, this.lb.iH),
    this.j.removeEventListener(f.ja.pt, this.pt),
    this.j.removeEventListener(f.ja.R4, this.lb.R4),
    this.Ua.fw && this.Ua.fw.removeListener(this.lb.fw),
    this.j.removeEventListener(f.ja.HR, this.Wxb),
    this.j.removeEventListener(f.ja.HR, this.Nub));
}
;
export const z7 = d;

// Detected exports: z7
