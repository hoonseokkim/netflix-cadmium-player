/**
 * Netflix Cadmium Playercore - Module 37025
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: vjb
 * Dependencies: 5021, 73403, 81734
 * Purpose: Configuration, Caching/Storage, Playback control, Enum definitions
 */

// import dep_5021 from './Module_5021.js';
// import dep_73403 from './Module_73403.js';
// import dep_81734 from './Module_81734.js';

// Webpack module 37025
// Parameters: t (module), b (exports), a (require)

var p, c, g;
class d {
    constructor(f, e, h, k, l, m, n, q, r, u, v, w, x, y, A) {
    this.index = f;
    this.R = e;
    this.M = h;
    this.qb = k;
    this.Ia = l;
    this.lk = m;
    this.zIb = n;
    this.kvb = r;
    this.ZJb = v;
    this.ze = x;
    this.bg = y;
    this.j = A;
    this.oa = new g.wJa();
    this.sl = new p.Ac(null);
    this.CC = new p.Ac(undefined);
    this.ig = new p.Ac(null);
    this.qj = new p.Ac(null);
    this.gf = new p.Ac(null);
    this.Fe = new p.Ac(null);
    this.Yc = [new p.Ac(null), new p.Ac(null), new p.Ac(null)];
    this.mediaTime = new p.Ac(undefined);
    this.playbackRate = new p.Ac(1);
    this.Xe = new p.Ac(undefined);
    this.fw = new p.Ac(null);
    this.background = new p.Ac(false);
    this.qZ = {
        source: "notcached",
        type: undefined
    };
    this.gR = "notcached";
    this.Aqa = false;
    q && (this.ig.set(q.ig.value),
    this.qj.set(q.qj.value));
    this.Rp = u(this);
    this.qr = this.ZJb.xTc(this.Ia, this.lk);
    this.Hc = w(this, A);
}
    qg(f) {
    this.qr.Yv(f);
}
    lM(f) {
    var e;
    e = this;
    Object.entries(f).forEach(function(h) {
        var k;
        k = Fa(h);
        h = k.next().value;
        k = k.next().value;
        e.qr.Yv(h, (0,
        c.pc)(k - e.lk.na(c.Ba)));
    });
}
    Ewa() {
    this.ZJb.TTc(this.Ia);
}
}
p = a(81734);
c = a(5021);
g = a(73403);
Ha.Object.defineProperties(d.prototype, {
    Ye: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.qb.Ye;
        }
    },
    yBa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.qb.yBa;
        }
    },
    Is: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.dd && this.dd.Is;
        }
    },
    ul: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f;
            return null !== (f = this.dd && this.dd.ul) && undefined !== f ? f : [];
        }
    },
    Jz: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f;
            return null !== (f = this.dd && this.dd.Jz) && undefined !== f ? f : [];
        }
    },
    EJ: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f;
            return null !== (f = this.dd && this.dd.EJ) && undefined !== f ? f : [];
        }
    },
    sk: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f;
            return null !== (f = this.dd && this.dd.sk) && undefined !== f ? f : [];
        }
    },
    de: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.dd && this.dd.de;
        }
    },
    Kb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.dd && this.dd.Kb;
        }
    },
    aT: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f;
            return null !== (f = this.dd && this.dd.aT) && undefined !== f ? f : false;
        }
    },
    JU: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f;
            return null !== (f = this.dd && this.dd.JU) && undefined !== f ? f : [];
        }
    },
    di: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f;
            return null !== (f = this.dd && this.dd.di) && undefined !== f ? f : [];
        }
    },
    vH: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f, e;
            return this.Hc.Da && (undefined === this.gY || 0 >= this.gY.na(c.Ba) || Infinity <= this.gY.na(c.Ba)) ? (0,
            c.pc)(this.Hc.YL()) : this.gY && 0 < this.gY.na(c.Ba) ? this.gY : (0,
            c.pc)(null !== (e = null === (f = this.S) || undefined === f ? undefined : f.Aa.duration) && undefined !== e ? e : 0);
        },
        set: function(f) {
            this.gY = f;
        }
    },
    AJb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.Hc.Da && (undefined === this.qna || 0 >= this.qna.na(c.Ba) || Infinity <= this.qna.na(c.Ba)) ? (0,
            c.pc)(this.Hc.Hxc()) : this.qna;
        },
        set: function(f) {
            this.qna = f;
        }
    },
    co: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.qb.co || 0;
        }
    },
    Gs: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f, e, h, k, l;
            if (undefined !== this.V$)
                return this.V$;
            if (undefined === this.mediaTime.value)
                return null;
            l = null === (e = null === (f = this.j) || undefined === f ? undefined : f.fb) || undefined === e ? undefined : e.Bwb;
            return l && this.Hc.Da && this.Hc.ZS() && (f = this.j.bk(l.J),
            e = null === (k = null === (h = this.j.fb) || undefined === h ? undefined : h.ei) || undefined === k ? undefined : k.ba[f.M],
            "content" !== (null === e || undefined === e ? undefined : e.type) && (h = this.kvb(this.mediaTime.value, f.M),
            k = this.Hc.Jk,
            null !== h && k && h < k)) ? h + k : this.kvb(this.mediaTime.value, this.M);
        }
    },
    correlationId: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f, e;
            return null === (e = null === (f = this.S) || undefined === f ? undefined : f.Aa.FA) || undefined === e ? undefined : e.Sf;
        }
    },
    lV: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f, e;
            return null === (e = null === (f = this.S) || undefined === f ? undefined : f.Aa.FA) || undefined === e ? undefined : e.lV;
        }
    },
    Pf: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.qr.Pf;
        }
    },
    fb: {
        configurable: true,
        enumerable: true,
        get: function() {
            var f;
            return null === (f = this.j) || undefined === f ? undefined : f.fb;
        }
    }
});
export const vjb = d;

// Detected exports: vjb
