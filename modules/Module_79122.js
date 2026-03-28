/**
 * Netflix Cadmium Playercore - Module 79122
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: ahb
 * Dependencies: 24940, 26388, 66164
 * Purpose: Configuration, Enum definitions
 */

// import dep_24940 from './Module_24940.js';
// import dep_26388 from './Module_26388.js';
// import dep_66164 from './Module_66164.js';

// Webpack module 79122
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(66164);
p = a(26388);
c = a(24940);
t = (function() {
    class g {
    constructor(f) {
        this.context = f;
        this.YN = c.Rla.Je;
    }
    pg() {
        return ("ME:").concat(this.context.attempt, "::").concat(this.context.Bm.eg);
    }
}
Object.defineProperties(g.prototype, {
        response: {
            get: function() {
                return this.context.response;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        Zg: {
            get: function() {
                var f;
                f = this.response.status;
                return 0 === f || 900 === f ? d.platform.Bi.Rr.uka : 500 <= f && 600 > f ? d.platform.Bi.Rr.d7 : 400 <= f && 500 > f ? d.platform.Bi.Rr.vka : d.platform.Bi.Rr.lo;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        eE: {
            get: function() {
                return this.response.statusText;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        status: {
            get: function() {
                return this.response.status;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        dh: {
            get: function() {
                return this.status;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        url: {
            get: function() {
                return this.context.request.url;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        ji: {
            get: function() {
                return this.context.Bm.eg;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        stream: {
            get: function() {
                return this.context.Bm.stream;
            },
            enumerable: false,
            configurable: true
        }
    });
    Object.defineProperties(g.prototype, {
        mediaType: {
            get: function() {
                return p.l.yk;
            },
            enumerable: false,
            configurable: true
        }
    });
    return g;
}
)();
export const ahb = t;

// Detected exports: ahb
