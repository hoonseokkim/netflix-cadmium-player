/**
 * Netflix Cadmium Playercore - Module 46876
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Mnb
 * Dependencies: 28020, 91072, 94450
 * Purpose: Configuration, Error handling, Class definition, Enum definitions
 */

// import dep_28020 from './Module_28020.js';
// import dep_91072 from './Module_91072.js';
// import dep_94450 from './Module_94450.js';

// Webpack module 46876
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(91072);
p = a(28020);
c = a(94450);
t = (function() {
    class g {
    constructor(f, e) {
        this.pn = (0,
        p.fa)();
        this.open = 0;
        this.timeline = new d.Imb();
        this.client = f;
        f = {
            client: f
        };
        this.oMb = new c.Counter(e,"ws.opening",f);
        this.pMb = new c.Counter(e,"ws.onopen",f);
        this.Dub = new c.Counter(e,"ws.close",f);
        this.Eub = new c.Counter(e,"ws.onclose",f);
        this.TRb = new c.Counter(e,"ws.send",f);
        this.m5a = new c.Counter(e,"ws.send.bytes",f);
        this.vPb = new c.Counter(e,"ws.onmessage",f);
        this.Wfa = new c.Counter(e,"ws.onmessage.bytes",f);
        this.vTa = new c.Counter(e,"ws.onerror",f);
    }
    uNc() {
        this.oMb.nB();
        this.timeline.type || this.timeline.$6a("closed");
    }
    Ww() {
        this.pMb.nB();
        this.timeline.$6a("open");
        this.open++;
    }
    closed() {
        this.Dub.nB();
        0 < this.open && 0 === --this.open && this.timeline.$6a("closed");
    }
    T(f) {
        this.TRb.nB();
        this.m5a.nB(f);
    }
    uPb(f) {
        this.vPb.nB();
        this.Wfa.nB(f);
    }
    error() {
        this.vTa.nB();
    }
}
Object.defineProperties(g.prototype, {
        WWb: {
            get: function() {
                return (0,
                p.fa)() - this.pn;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        Csb: {
            get: function() {
                var f;
                f = this.timeline.total;
                return 0 === f ? 0 : this.timeline.C1c() / f * 100;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        xTb: {
            get: function() {
                return "open" === this.timeline.type ? this.timeline.duration : 0;
            },
            enumerable: false,
            configurable: true
        }
    });
    g.prototype.$hc = function() {
        this.Eub.nB();
    }
    ;
    Object.defineProperties(g.prototype, {
        values: {
            get: function() {
                return {
                    client: this.client,
                    fa: (0,
                    p.fa)(),
                    WWb: this.WWb,
                    Csb: this.Csb,
                    xTb: this.xTb,
                    Ujd: this.oMb.total,
                    open: this.pMb.total,
                    close: this.Dub.total,
                    fdd: this.Eub.total,
                    T: this.TRb.total,
                    m5a: this.m5a.total,
                    uPb: this.vPb.total,
                    Wfa: this.Wfa.total,
                    RA: this.vTa.total
                };
            },
            enumerable: false,
            configurable: true
        }
    });
    return g;
}
)();
export const Mnb = t;

// Detected exports: Mnb
