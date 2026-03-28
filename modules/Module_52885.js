/**
 * Netflix Cadmium Playercore - Module 52885
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: b3b, fHa
 * Dependencies: 66164, 90745, 91176
 * Purpose: Network/HTTP, Manifest handling, Event handling, Configuration
 */

// import dep_66164 from './Module_66164.js';
// import dep_90745 from './Module_90745.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 52885
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

d = a(66164);
p = a(91176);
c = a(90745);
(function(e) {
    e[e.led = 0] = "dormant";
    e[e.active = 1] = "active";
    e[e.ty = 2] = "expired";
    e[e.aed = 3] = "deleted";
}
)(g || (export const b3b = g = {}));
f = 0;
t = (function() {
    class e {
    constructor(h) {
        var k;
        this.wq = h;
        this.events = new c.EventEmitter();
        this.Br = f++;
        this.YYa = new p.Ut(false);
        this.jEb = this.SXb = false;
        this.Wec();
        this.Oob = null !== (k = h.st.Vs) && undefined !== k ? k : false;
        this.ona = new p.WX();
        h.S && this.ona.nO(h.S);
    }
    pIc() {
        var h;
        h = this;
        this.ED || (this.DMa = true,
        setTimeout(function() {
            return h.wq.ED = true;
        }, 1));
    }
    Nfa() {
        this.Oob = false;
        this.wq.Nfa();
        this.events.emit("promoted", {
            type: "promoted"
        });
    }
    Wec() {
        this.Vob = d.platform.time.now();
    }
    VLb() {
        this.events.emit("removed", {
            type: "removed"
        });
    }
    uMc() {
        this.events.emit("expired", {
            type: "expired"
        });
    }
    ZE() {
        this.YYa.set(true);
        this.events.emit("completed", {
            type: "completed"
        });
    }
    LOa(h) {
        this.wq.SA.absolute = h;
    }
    toJSON() {
        return {
            state: this.state,
            hasManifest: this.gB,
            cacheHit: this.ED,
            wasFallbackItem: this.SXb,
            hasFallbackItem: this.jEb,
            viewableId: this.st.J,
            isPrefetch: this.Vs,
            expired: this.Mw,
            flushed: this.RH,
            seqId: this.Br
        };
    }
}
Object.defineProperties(e.prototype, {
        state: {
            get: function() {
                return this.gb;
            },
            set: function(h) {
                this.gb = h;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        S: {
            get: function() {
                return this.ona.promise;
            },
            set: function(h) {
                (0,
                p.assert)(!this.ona.vda, "Manifest promise is already resolved");
                this.ona.nO(h);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        ED: {
            get: function() {
                return this.wq.ED;
            },
            set: function(h) {
                this.wq.ED = h;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        gB: {
            get: function() {
                this.DMa || (this.DMa = this.ED);
                return this.DMa;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        stats: {
            get: function() {
                return this.wq.stats;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        SA: {
            get: function() {
                return this.wq.SA;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        RH: {
            get: function() {
                return !!this.wq.RH;
            },
            set: function(h) {
                this.wq.RH = h;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        eR: {
            get: function() {
                var h;
                h = this.wq.eR;
                return 0 === h && this.wq.S ? (this.wq.eR = JSON.stringify(this.wq.S).length,
                this.wq.eR) : h;
            },
            set: function(h) {
                this.wq.eR = h;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        st: {
            get: function() {
                return this.wq.st;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        sZa: {
            get: function() {
                return this.Vob;
            },
            set: function(h) {
                this.Vob = h;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        Vs: {
            get: function() {
                return this.Oob;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(e.prototype, {
        Mw: {
            get: function() {
                return (0,
                p.Mw)(this);
            },
            enumerable: false,
            configurable: true
        }
    });
    return e;
}
)();
export const fHa = t;

// Detected exports: b3b, fHa
