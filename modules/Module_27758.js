/**
 * Netflix Cadmium Playercore - Module 27758
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Pm
 * Dependencies: 3887, 31276, 45146, 79173, 94886
 * Purpose: Event handling
 */

// import dep_3887 from './Module_3887.js';
// import dep_31276 from './Module_31276.js';
// import dep_45146 from './Module_45146.js';
// import dep_79173 from './Module_79173.js';
// import dep_94886 from './Module_94886.js';

// Webpack module 27758
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k;
function d() {
    var l;
    l = new c.jl();
    this.addEventListener = l.addListener.bind(this);
    this.removeEventListener = l.removeListener.bind(this);
    this.emit = l.qd.bind(this);
    this.yna = h++;
    this.Cg = (0,
    g.An)("ProbeRequest");
    this.tpb = p.lkb;
    (0,
    f.ta)(undefined !== this.tpb);
    this.Dg = b.Pm.he.UNSENT;
    false;
}

p = a(79173);
c = a(94886);
g = a(31276);
f = a(45146);
e = a(3887);
h = 0;
(function() {
    function l() {
        return JSON.stringify({
            url: this.Sg,
            id: this.yna,
            affected: this.Dma,
            readystate: this.Dg
        });
    }
    (0,
    e.Qf)(d.prototype, {
        w2: function(m) {
            this.Dg !== b.Pm.he.rP && this.Dg !== b.Pm.he.DONE && (this.Bna = m,
            m = {
                url: this.Sg,
                affected: this.Dma,
                probed: {
                    requestId: this.yna,
                    url: this.Sg,
                    md: this.l9,
                    groupId: this.Yma
                }
            },
            200 <= this.Bna && 299 >= this.Bna ? (this.Dg = b.Pm.he.DONE,
            this.emit(b.Pm.Mm.O7, m)) : (this.Dg = b.Pm.he.rP,
            this.emit(b.Pm.Mm.oK, m)));
        },
        L0a: function(m) {
            this.Dg !== b.Pm.he.rP && this.Dg !== b.Pm.he.DONE && (this.Bna = m,
            m = {
                url: this.Sg,
                affected: this.Dma,
                probed: {
                    requestId: this.yna,
                    url: this.Sg,
                    md: this.l9,
                    groupId: this.Yma
                }
            },
            this.Dg = b.Pm.he.rP,
            this.emit(b.Pm.Mm.oK, m));
        },
        open: function(m, n, q) {
            if (!m)
                return (false,
                false);
            this.Sg = m;
            this.Dma = n;
            this.l9 = q;
            this.Dg = b.Pm.he.OPENED;
            this.tpb.Pra(this);
            this.Dg = b.Pm.he.sG;
            return true;
        },
        Ue: function() {
            false;
            return true;
        },
        pg: function() {
            return this.yna;
        },
        toString: l,
        toJSON: l
    });
    Object.defineProperties(d.prototype, {
        readyState: {
            get: function() {
                return this.Dg;
            }
        },
        status: {
            get: function() {
                return this.Bna;
            }
        },
        url: {
            get: function() {
                return this.Sg;
            }
        },
        Qbd: {
            get: function() {
                return this.Dma;
            }
        }
    });
}
)();
(function(l) {
    l.Mm = {
        O7: "pr0",
        oK: "pr1"
    };
    l.he = {
        UNSENT: 0,
        OPENED: 1,
        sG: 2,
        DONE: 3,
        rP: 4,
        name: ["UNSENT", "OPENED", "SENT", "DONE", "FAILED"] /* UNSENT */
    };
}
)(k || (k = {}));
export const Pm = Object.assign(d, k);

// Detected exports: Pm
