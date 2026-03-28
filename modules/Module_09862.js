/**
 * Netflix Cadmium Playercore - Module 9862
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Kjb, Qn
 * Dependencies: 5021, 15645, 31276, 33096, 45842, 85001, 98899
 * Purpose: Buffer/Segment management, Encryption/Decryption, Logging, Configuration
 */

// import dep_5021 from './Module_5021.js';
// import dep_15645 from './Module_15645.js';
// import dep_31276 from './Module_31276.js';
// import dep_33096 from './Module_33096.js';
// import dep_45842 from './Module_45842.js';
// import dep_85001 from './Module_85001.js';
// import dep_98899 from './Module_98899.js';

// Webpack module 9862
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k;
class d {
    constructor(l, m, n, q, r, u, v, w) {
    this.L7a = r;
    this.O8a = w;
    q.xBa && (l = new g.Ljb().I1c(l));
    this.rb = v(l);
    this.Im = new c.Tjb(this.rb);
    this.Im.iSb(this.rb.ga.J);
    this.log = m.zb("PlaygraphManager");
    this.Xb = n.create();
    this.ez = u.create(this.rb, this.Im, this.log, this.Xb);
    this.lYc();
    this.mYc();
}
    mYc() {
    var l, m, n;
    l = this;
    try {
        m = navigator.mediaSession;
        if (null !== m && undefined !== m && m.setActionHandler) {
            n = h.Za.get(k.uK)((0,
            f.pc)(500));
            m.setActionHandler("play", function() {
                l.rb.Uca("play");
                n.tg(function() {
                    l.Rb().play();
                });
            });
            m.setActionHandler("pause", function() {
                l.rb.Uca("pause");
                n.tg(function() {
                    l.Rb().pause();
                });
            });
            m.setActionHandler("seekbackward", function() {
                l.rb.Uca("seekbackward");
                n.tg(function() {
                    var q, r;
                    q = l.Rb();
                    r = q.XA();
                    r && q.seek(Math.max(0, r - 10 * e.Ur), p.Tc.Dv);
                });
            });
            m.setActionHandler("seekforward", function() {
                l.rb.Uca("seekforward");
                n.tg(function() {
                    var q, r, u;
                    q = l.Rb();
                    r = q.XA();
                    u = q.YL();
                    r && q.seek(Math.min(r + 10 * e.Ur, u), p.Tc.Dv);
                });
            });
            m.setActionHandler("seekto", function(q) {
                l.rb.Uca("seekto");
                n.tg(function() {
                    var r, u;
                    r = l.Rb();
                    u = q.seekTime;
                    undefined !== u && 0 <= u && u < r.YL() && r.seek(u * e.Ur, p.Tc.Dv);
                });
            });
            m.setActionHandler("previoustrack", null);
            m.setActionHandler("nexttrack", null);
        }
    } catch (q) {
        this.log.error("Error setting up MediaSession", q);
    }
}
    lWa() {
    return this.rb.Le;
}
    isa() {
    return this.rb.ga;
}
    KBb() {
    return this.rb.Li;
}
    CS() {
    return this.rb.Qn;
}
    Wn(l) {
    for (var m = [], n = 0; n < arguments.length; ++n)
        m[n - 0] = arguments[n];
    this.rb.Wn.apply(this.rb, Ba(m));
}
    Lhc(l) {
    for (var m = [], n = 0; n < arguments.length; ++n)
        m[n - 0] = arguments[n];
    this.rb.dsb(m);
}
    MO(l) {
    this.rexport const Qn = l;
}
    Byc() {
    return this.rb.eya.H0();
}
    Pl(l, m) {
    this.rb.Pl(l, m);
}
    dXa(l, m, n, q) {
    var r, u;
    n = undefined === n ? {} : n;
    q = undefined === q ? true : q;
    if (l !== this.rb.Li)
        throw Error("Invalid currentSegmentId");
    if (-1 === Object.keys(null !== (r = this.CS().ba[l].next) && undefined !== r ? r : {}).indexOf(m))
        throw Error("Invalid nextSegmentId");
    this.log.info("Transition initiated: " + l + " -> " + m);
    null === (u = n.Dr) || undefined === u ? undefined : u.isUIAutoPlay;
    return this.ez.eXa(m, n, q);
}
    rDb() {
    var l, m;
    l = this.ez.bI().XH();
    m = this.rb.ga.Va;
    return l ? l - m : undefined;
}
    Cyc() {
    var l, m;
    l = this.rb.eya.H0(this.rb.Li);
    m = this.rDb();
    return l && m ? l + m : undefined;
}
    Ws() {
    return this.ez.Ws();
}
    addListener(l, m, n) {
    this.Xb.addListener(l, m, n);
}
    removeListener(l, m) {
    this.Xb.removeListener(l, m);
}
    Vq() {
    return this.ez.Vq();
}
    Rb() {
    return this.ez.bI();
}
    gmc(l, m, n) {
    var q;
    l = undefined === l ? this.CS().Ef : l;
    m = undefined === m ? {} : m;
    q = this.O8a.hwb(this);
    this.xQc(null !== l && undefined !== l ? l : this.CS().Ef, m, n);
    return q;
}
    hbc(l) {
    var m;
    this.log.info("Adding segment - movieId: " + l.R + ", startPts: " + l.Nb + ", logicalEnd: " + l.Cj);
    m = Object.assign({}, l.Xa, l.Nb ? {
        Nb: l.Nb
    } : {}, l.Cj ? {
        Cj: l.Cj
    } : {});
    this.aUb(l.R, m, l.S);
    return this.ez.erb(l);
}
    transition(l) {
    var m;
    m = this.rb.cca(this.rb.Li);
    return m ? this.dXa(this.rb.Li, m, l) : (this.log.error("Next segment is not defined"),
    Promise.reject());
}
    close(l) {
    return this.ez.close(l);
}
    xQc(l, m, n) {
    var q;
    undefined === l && (l = null === (q = this.CS()) || undefined === q ? undefined : q.Ef);
    (m || n) && this.aUb(this.CS().ba[l].J, null !== m && undefined !== m ? m : {}, n);
    this.ez.DU(l);
}
    aUb(l, m, n) {
    n && this.Im.$K(l, n);
    this.Im.Oac(l, m);
}
    lYc() {
    var l;
    l = this;
    this.rb.Z_c(function() {
        l.Im.$E();
        l.ez.$E();
    });
    this.rb.$_c(function(m) {
        l.ez.t1a(m);
    });
    this.rb.X_c(function(m) {
        l.ez.ZT(m);
    });
    this.addListener(p.JX.Rga, function(m) {
        return l.bNc(m);
    });
    this.addListener(p.cb.HFb, function(m) {
        return l.LMc(m);
    });
}
    LMc(l) {
    var m;
    m = this;
    this.ez.QVb(l).catch(function() {
        return m.Xb.qd(p.cb.error, l.cia());
    });
}
    bNc(l) {
    var m, n, q;
    m = this;
    n = this.Rb().getError();
    if (n)
        this.Xb.qd(p.cb.kZ, n);
    else {
        l = l.player;
        n = l.Vq().id;
        if (!this.Ewb || this.Ewb !== n) {
            q = function(r) {
                return m.RB(r);
            }
            ;
            this.Rb().UPb(p.ja.iO, q);
            l.EOa(p.ja.iO, q);
            this.Ewb = n;
        }
        this.Xb.qd(p.cb.Doa);
        this.Xb.qd(p.cb.Fq);
        this.Xb.qd(p.cb.EC);
        this.Xb.qd(p.cb.gq);
        this.Xb.qd(p.cb.lia);
        this.Xb.qd(p.cb.kZ);
    }
}
    RB(l) {
    var m, n, q;
    false;
    m = l.metrics;
    if (m) {
        n = this.Rb();
        q = n.mm(l.position.segmentId);
        m = n.mm(m.srcsegment);
        this.L7a.HRc(l, q, m, !!n.WCb().bh);
    }
}
}
p = a(85001);
c = a(98899);
g = a(15645);
f = a(5021);
e = a(33096);
h = a(31276);
k = a(45842);
export const Kjb = d;

// Detected exports: Kjb, Qn
