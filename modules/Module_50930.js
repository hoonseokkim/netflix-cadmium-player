/**
 * Netflix Cadmium Playercore - Module 50930
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Pdb
 * Dependencies: 42431, 52571, 78541
 * Purpose: Logging, Event handling, Configuration, Enum definitions
 */

// import dep_42431 from './Module_42431.js';
// import dep_52571 from './Module_52571.js';
// import dep_78541 from './Module_78541.js';

// Webpack module 50930
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(78541);
p = a(42431);
a(65161);
c = a(52571);
t = (function() {
    class g {
    constructor(f, e, h, k, l, m, n, q) {
        this.ma = f;
        this.track = e;
        this.XZc = h;
        this.IZc = k;
        this.config = l;
        this.console = m;
        this.events = n;
        this.XMc = q;
        this.Dj = 0;
        this.W2a = this.Dk = false;
    }
    Ly() {
        return this.track.Nea;
    }
    Gp() {
        return this.track.vh;
    }
    ag() {
        return false;
    }
    aCb() {
        return {
            Ta: [],
            Ixa: 0,
            Zw: 0,
            z3: 0
        };
    }
    BVb() {
        var f;
        (0,
        c.assert)(this.Gp());
        f = this.Jd;
        this.Sv = undefined;
        return f;
    }
    U7a(f) {
        return (f = f.IC(this.ma.K, this.Jd)) ? {
            Ff: f,
            reason: "success"
        } : {
            Ff: f,
            reason: "pipelineTryIssueHeaderRequest"
        };
    }
    cancel() {
        this.Sv && (this.ma.L.BY(this.mediaType, this.Sv),
        p.WJ.instance.yaa(this.Sv),
        this.Sv.removeAllListeners(),
        this.Sv = undefined);
    }
    OYa() {
        var f, e, h;
        h = this.config.pr;
        if (null === (f = this.Jd) || undefined === f ? 0 : f.track)
            h = null === (e = this.Jd) || undefined === e ? undefined : e.track.pr;
        return h;
    }
    E0() {
        return this.ma.QCb(this.mediaType);
    }
    TD() {
        var f, e;
        f = this;
        e = (0,
        d.TD)(this.mediaType, this.track.L, this.config, this.console, this.track.Ab, function(h) {
            return f.events.emit("transportReport", h);
        }, function(h) {
            return f.events.emit("mediaRequestComplete", h);
        }, function() {});
        e.on("created", this.XMc);
        return e;
    }
}
Object.defineProperties(g.prototype, {
        mediaType: {
            get: function() {
                return this.track.mediaType;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        M: {
            get: function() {
                return this.ma.K.id;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        xh: {
            get: function() {
                return this.ma.xh;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        uAa: {
            get: function() {
                return this.XZc();
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        Hk: {
            get: function() {
                return this.uAa;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        tJ: {
            get: function() {
                return this.uAa;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        IAa: {
            get: function() {
                return this.IZc;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        f0: {
            get: function() {
                return this.ma.f0;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        Jd: {
            get: function() {
                return this.Sv || (this.Sv = this.TD());
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        Pk: {
            get: function() {
                return !this.track.Nea;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        e2a: {
            get: function() {
                return false;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        bq: {
            get: function() {
                return this.ma.rca(this.mediaType);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        Vw: {
            get: function() {
                return -Infinity;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        AA: {
            get: function() {
                return "available";
            },
            enumerable: false,
            configurable: true
        }
    });
    return g;
}
)();
export const Pdb = t;

// Detected exports: Pdb
