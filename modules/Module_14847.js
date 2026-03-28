/**
 * Netflix Cadmium Playercore - Module 14847
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: LCa
 * Dependencies: 35963, 91176
 * Purpose: Configuration, Parsing/Serialization, UI components, Enum definitions
 */

// import dep_35963 from './Module_35963.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 14847
// Parameters: t (module), b (exports), a (require)

var g, f, e, h;
function d(k) {
    switch (k) {
    case "AD_BREAK":
    case "AD_BREAK_ENUMERATED_ADS":
        return 52;
    case "NON_AD_BREAK":
        return 34;
    case "NO_INDICATION":
        return 60;
    default:
        return 60;
    }
}
function p(k) {
    switch (k) {
    case "ENABLED_AS_NORMAL":
        return {
            pz: true,
            UI: true,
            pI: true
        };
    case "DISABLED_EXCEPT_FOR_PAUSE_EXIT":
        return {
            pz: false,
            UI: true,
            pI: true
        };
    case "DISABLED_EXCEPT_FOR_PAUSE_EXIT_LIVE_EDGE":
        return {
            pz: false,
            UI: true,
            pI: true
        };
    default:
        return {
            pz: undefined,
            UI: undefined,
            pI: undefined
        };
    }
}
function c(k, l, m) {
    var n;
    if (3 <= (null === k || undefined === k ? undefined : k.length)) {
        n = 0;
        k = k.toLowerCase().substring(0, 3).split("").map(function(q) {
            return "t" === q ? true : "f" === q ? false : "*" === q ? 0 === (1 << n++ & m) : undefined;
        });
        l.pz = k[0];
        l.UI = k[1];
        l.pI = k[2];
    } else
        (l.pz = undefined,
        l.UI = undefined,
        l.pI = undefined);
}
b.h$a = export const LCa = b.i$a = undefined;
g = a(91176);
f = a(35963);
e = a(88E3);
t = (function() {
    class k {
    constructor(l, m, n, q) {
        undefined === q && (q = NaN);
        this.config = l;
        this.Dh = m;
        this.VLa = n;
        this.k9 = q;
        this.mXa = this.Kob = this.EMa = false;
        this.nNa = {
            pz: undefined,
            UI: undefined,
            pI: undefined
        };
        this.i1 = this.k4 = false;
        this.aQ = [];
        this.oWb(m, n);
    }
    pWb(l) {
        var m;
        m = this;
        undefined === l && (l = []);
        this.aQ = l.map(function(n, q) {
            q = m.aQ[q];
            return (null === q || undefined === q ? undefined : q.id) === n.id ? q : new e.g$a(n);
        });
    }
    oWb(l, m) {
        var n, q, r, u, v, w;
        u = this.Dh.state;
        this.Dh = l;
        v = l.xa;
        w = l.state;
        u = w.Pu !== u.Pu;
        if (this.aQ.length !== (null === (n = v.yb) || undefined === n ? undefined : n.length) || u)
            (this.pWb(v.yb),
            "hydration" === v.source && undefined !== w.ah && (this.EMa = w.ah));
        this.VLa = m;
        c(this.config.Mha, this.nNa, m);
        n = this.config.Mha;
        4 < (null === n || undefined === n ? undefined : n.length) ? (n = n.substring(4),
        m %= n.length / 2,
        m = parseInt(n.substring(2 * m, 2 * m + 2), 16)) : m = undefined;
        this.Mpb = m;
        v.o5 && (v.o5.oXb && (this.Mpb = d(v.o5.oXb)),
        v.o5.zBa && (this.nNa = p(v.o5.zBa)));
        w.Fn && "viewable" !== v.source && (this.UBc(l, null !== (q = w.Pu) && undefined !== q ? q : -1),
        this.k4 = w.DM || false);
        this.k9 = null !== (r = w.Pu) && undefined !== r ? r : -1;
    }
    Ura() {
        return this.Dh.xa.Pj;
    }
    Cu() {
        return this.Dh.xa.hb;
    }
    QXc() {
        this.yb.length || (this.EMa = true);
    }
    mIc() {
        this.i1 = true;
    }
    UBc(l, m) {
        this.mXa && m === this.k9 || (this.Dh = l,
        this.pWb(l.xa.yb),
        this.mXa = true,
        this.k9 = m,
        this.k4 = l.state.DM);
    }
    clone() {
        return new k(this.config,this.Dh,this.VLa,this.k9);
    }
    clone() {
        return new k(this.xf.clone(),this.tha,this.N_);
    }
}
Object.defineProperties(k.prototype, {
        qo: {
            get: function() {
                return this.Dh.xa.qo;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        Ub: {
            get: function() {
                return this.VLa;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        Fn: {
            get: function() {
                return !!this.Dh.state.Fn;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        MB: {
            get: function() {
                return !!this.Dh.state.MB;
            },
            set: function(l) {
                this.Dh.state.MB = l;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        location: {
            get: function() {
                return this.Dh.xa.location;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        Ga: {
            get: function() {
                return this.Dh.xa.Ga;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        kj: {
            get: function() {
                return this.Dh.xa.kj;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        eZ: {
            get: function() {
                return this.Dh.xa.eZ;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        Zp: {
            get: function() {
                var l;
                return null !== (l = this.Mpb) && undefined !== l ? l : this.Dh.xa.Zp;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        Br: {
            get: function() {
                return this.k9;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        bya: {
            get: function() {
                return this.nNa;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        VK: {
            get: function() {
                return this.Dh.xa.VK;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        yb: {
            get: function() {
                return this.aQ;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        empty: {
            get: function() {
                return this.duration.equal(g.I.ia);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        source: {
            get: function() {
                return this.Dh.xa.source;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        duration: {
            get: function() {
                return "embedded" === this.Dh.xa.type ? this.Dh.xa.duration : this.yb.reduce(function(l, m) {
                    return l.add(m.endTime.da(m.startTime));
                }, g.I.ia);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        ywa: {
            get: function() {
                var l;
                l = this.Dh.xa;
                return "dynamic" === l.type ? l.ywa : undefined;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        type: {
            get: function() {
                return this.yb.length || !this.Dh.xa.yu && "embedded" !== this.Dh.xa.type ? "dynamic" : "embedded";
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        hb: {
            get: function() {
                return this.Dh.xa.hb;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        eGb: {
            get: function() {
                return this.ah || !this.sj && !this.mXa ? this.aQ.every(function(l) {
                    return l.ah;
                }) : false;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        ah: {
            get: function() {
                return this.EMa ? true : this.aQ.length ? this.aQ.every(function(l) {
                    return l.ah;
                }) : false;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        sj: {
            get: function() {
                return !!this.Dh.state.sj;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        ZSb: {
            get: function() {
                var l;
                l = "viewable" === this.Dh.xa.source && this.De;
                return !!this.Dh.state.sj && !this.De && !l;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        De: {
            get: function() {
                return !!this.Dh.state.Fn;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        Zk: {
            get: function() {
                return this.Dh.xa.Zk;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        S0: {
            get: function() {
                return this.Kob;
            },
            set: function(l) {
                l && (this.Kob = true);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        L4: {
            get: function() {
                var l;
                return null !== (l = this.Dh.state.L4) && undefined !== l ? l : false;
            },
            enumerable: false,
            configurable: true
        }
    });
    return k;
}
)();
b.i$a = t;
h = (function() {
    function k(l, m) {
        this.wxa = l;
        this.d8b = m;
    }
    Object.defineProperties(k.prototype, {
        duration: {
            get: function() {
                return g.I.Ca(this.d8b);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k, {
        N0a: {
            get: function() {
                return this.A9b || (this.A9b = new k(f.oja.start,0));
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k, {
        rLc: {
            get: function() {
                return this.z9b || (this.z9b = new k(f.oja.end,0));
            },
            enumerable: false,
            configurable: true
        }
    });
    return k;
}
)();
export const LCa = h;
t = (function() {
    function k(l, m, n) {
        this.xf = l;
        this.Spb = m || h.N0a;
        this.h8b = n || h.N0a;
    }
    Object.defineProperties(k.prototype, {
        tha: {
            get: function() {
                return this.Spb;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        N_: {
            get: function() {
                return this.h8b;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        lBc: {
            get: function() {
                return this.Spb !== h.N0a || this.N_ !== h.rLc;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        duration: {
            get: function() {
                return this.xf.duration.add(this.tha.duration).add(this.N_.duration);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        txa: {
            get: function() {
                return this.tha.duration.add(this.N_.duration);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        type: {
            get: function() {
                return this.xf.type;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        Zp: {
            get: function() {
                return this.xf.Zp;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(k.prototype, {
        i1: {
            get: function() {
                return this.xf.i1;
            },
            enumerable: false,
            configurable: true
        }
    });
    return k;
}
)();
b.h$a = t;

// Detected exports: LCa
