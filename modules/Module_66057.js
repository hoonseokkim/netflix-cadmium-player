/**
 * Netflix Cadmium Playercore - Module 66057
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: e7b, gDa
 * Dependencies: 4203, 22674, 22970, 63368, 75236, 83767
 * Purpose: Configuration, Dependency injection, Class definition, Enum definitions
 */

// import dep_4203 from './Module_4203.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_63368 from './Module_63368.js';
// import dep_75236 from './Module_75236.js';
// import dep_83767 from './Module_83767.js';

// Webpack module 66057
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h;
class d {
    constructor(k, l, m) {
    this.userAgentData = m;
    this.Te = this.usc(k, l.data.browserInfo);
}
    Wsa(k, l) {
    var m;
    if (l = this.jAc(l))
        switch (k) {
        case h.yI:
            m = 0 < l.length ? Number(l[0]) : 0;
            break;
        case h.k2:
            m = 1 < l.length ? Number(l[1]) : 0;
            break;
        case h.W2:
            m = 2 < l.length ? Number(l[2]) : 0;
            break;
        case h.nza:
            m = 3 < l.length ? Number(l[3]) : 0;
        }
    return undefined === m || isNaN(m) ? 0 : m;
}
    jAc(k) {
    return null === k || undefined === k ? undefined : k.split(".");
}
    yM(k) {
    return this.Te.name === k;
}
    UDc(k) {
    return this.Te.YAc === k;
}
    usc(k, l) {
    return Object.assign(Object.assign({
        YAc: this.wsc(k, l)
    }, this.tsc(k, l)), {
        qxa: this.ysc(k, l)
    });
}
    wsc(k, l) {
    return l && l.hardware ? l.hardware : (/Mobile|iPhone/).test(k) ? c.h7.phone : (/Android/).test(k) ? c.h7.H0c : c.h7.Bic;
}
    tsc(k, l) {
    return l && l.name && l.version ? {
        name: l.name,
        version: l.version
    } : (/OPR/).test(k) ? {
        name: c.ho.opera,
        version: ""
    } : (/Tesla/).test(k) ? {
        name: c.ho.NUb,
        version: ""
    } : (/Quest/).test(k) ? {
        name: c.ho.YOb,
        version: ""
    } : (l = k.match(/Edge\/(\d*)\./)) ? {
        name: c.ho.tw,
        version: l[1]
    } : (l = k.match(/Edg\/(\d*)\./)) ? {
        name: c.ho.myb,
        version: l[1]
    } : (l = k.match(/Chrome\/(\d*)\./)) ? {
        name: c.ho.AQa,
        version: l[1]
    } : (l = k.match(/Firefox\/(\d*)\./)) ? {
        name: c.ho.tAb,
        version: l[1]
    } : (k = k.match(/(\d*)\.(\d*)\.?(\d*)? Safari/)) ? {
        name: c.ho.aRb,
        version: k[1]
    } : {
        name: c.ho.AQa,
        version: ""
    };
}
    ysc(k, l) {
    return l && l.os && l.os.name && l.os.version ? {
        name: l.os.name,
        version: l.os.version
    } : (/CrOS/).test(k) ? {
        name: c.Wr.hub,
        version: ""
    } : (l = k.match(/Mac OS X (\d*)_?(\d*)?_?(\d*)?/)) ? {
        name: c.Wr.FIb,
        version: l[1] + "." + l[2] + "." + l[3]
    } : (/Windows NT/).test(k) ? {
        name: c.Wr.$8a,
        version: ""
    } : (/Android.*Chrome\/[.0-9]* Mobile/).test(k) || (/Android.*Chrome\/[.0-9]* /).test(k) ? {
        name: c.Wr.WOa,
        version: ""
    } : (/Linux/).test(k) ? {
        name: c.Wr.VHb,
        version: ""
    } : (/iPhone/).test(k) ? {
        name: c.Wr.MFb,
        version: ""
    } : {
        name: c.Wr.$8a,
        version: ""
    };
}
}
t = a(22970);
p = a(22674);
c = a(4203);
g = a(83767);
f = a(63368);
a = a(75236);
d.prototype.$S = function(k) {
    return this.Te.qxa.name === k;
}
;
Ha.Object.defineProperties(d.prototype, {
    VFb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.yM(c.ho.AQa);
        }
    },
    yYa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.yM(c.ho.tw);
        }
    },
    bua: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.yM(c.ho.myb);
        }
    },
    eua: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.yM(c.ho.tAb);
        }
    },
    NYa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.yM(c.ho.opera);
        }
    },
    xda: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.yM(c.ho.aRb);
        }
    },
    xGb: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.yM(c.ho.NUb);
        }
    },
    mua: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.yM(c.ho.YOb);
        }
    },
    bda: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.$S(c.Wr.WOa);
        }
    },
    YS: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.$S(c.Wr.MFb);
        }
    },
    Tta: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.$S(c.Wr.WOa) && this.UDc(c.h7.phone);
        }
    },
    dda: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.$S(c.Wr.hub);
        }
    },
    GYa: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.$S(c.Wr.VHb);
        }
    },
    zE: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.$S(c.Wr.FIb);
        }
    },
    uB: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.$S(c.Wr.$8a);
        }
    },
    gw: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.Wsa(h.yI, this.Te.version);
        }
    },
    HNc: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.Wsa(h.yI, this.Te.qxa.version);
        }
    },
    INc: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.Wsa(h.k2, this.Te.qxa.version);
        }
    },
    JNc: {
        configurable: true,
        enumerable: true,
        get: function() {
            return this.Wsa(h.W2, this.Te.qxa.version);
        }
    }
});
e = d;
export const gDa = e;
export const gDa = e = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(f.mnb)), t.__param(1, (0,
p.v)(g.BP)), t.__param(2, (0,
p.v)(a.rma))], e);
(function(k) {
    k[k.yI = 0] = "major";
    k[k.k2 = 1] = "minor";
    k[k.W2 = 2] = "patch";
    k[k.nza = 3] = "revision";
}
)(h || (export const e7b = h = {}));

// Detected exports: e7b, gDa
