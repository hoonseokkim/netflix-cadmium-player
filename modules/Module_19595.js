/**
 * Netflix Cadmium Playercore - Module 19595
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: k8
 * Dependencies: 91176
 * Purpose: Configuration, Class definition, Enum definitions
 */

// import dep_91176 from './Module_91176.js';

// Webpack module 19595
// Parameters: t (module), b (exports), a (require)

var d;

d = a(91176);
t = (function() {
    class p {
    constructor(c) {
        this.pD = c;
        this.AAb = new d.Zo();
    }
    La() {
        this.pD = undefined;
    }
    JXc(c) {
        this.$Kc = c;
    }
    oV(c) {
        this.Bd = c;
        this.AAb.resolve();
    }
    ESb(c) {
        this.x_c = c;
    }
    FSb(c) {
        this.y_c = c;
    }
    R5a(c) {
        this.CWc = c;
    }
}
Object.defineProperties(p.prototype, {
        Hua: {
            get: function() {
                var c;
                return this.$Kc || (null === (c = this.parent) || undefined === c ? undefined : c.Hua);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        El: {
            get: function() {
                var c;
                return this.Bd || (null === (c = this.parent) || undefined === c ? undefined : c.El);
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        DHb: {
            get: function() {
                var c, g;
                return null !== (c = this.x_c) && undefined !== c ? c : null === (g = this.parent) || undefined === g ? undefined : g.DHb;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        DZa: {
            get: function() {
                var c, g;
                return null !== (c = this.y_c) && undefined !== c ? c : null === (g = this.parent) || undefined === g ? undefined : g.DZa;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        track: {
            get: function() {
                return this.CWc;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        MXb: {
            get: function() {
                return this.AAb.promise;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(p.prototype, {
        parent: {
            get: function() {
                var c;
                return null === (c = this.pD) || undefined === c ? undefined : c.call(this);
            },
            enumerable: false,
            configurable: true
        }
    });
    return p;
}
)();
export const k8 = t;

// Detected exports: k8
