/**
 * Netflix Cadmium Playercore - Module 18477
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: UIa
 * Dependencies: 22674, 22970, 26388, 85001, 87386, 96687
 * Purpose: Audio handling, Buffer/Segment management, Logging, Event handling
 */

// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_26388 from './Module_26388.js';
// import dep_85001 from './Module_85001.js';
// import dep_87386 from './Module_87386.js';
// import dep_96687 from './Module_96687.js';

// Webpack module 18477
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e;
class d {
    constructor(h, k) {
    this.qNb = k;
    this.log = h.zb("PlaydataServices");
}
    Gm(h) {
    var k;
    k = this;
    this.qNb().then(function(l) {
        h.addEventListener(g.ja.ZM, function(m) {
            var n, q;
            if (undefined !== m.l3) {
                n = h.bk(m.l3);
                q = n.bg && n.bg === h.ga.bg;
                q || l.zha(n);
                m.XS || new Promise(function(r) {
                    var u;
                    if (h.mk.value)
                        r();
                    else {
                        u = function(v) {
                            v.newValue && (r(),
                            h.mk.removeListener(u));
                        }
                        ;
                        h.mk.addListener(u);
                    }
                }
                ).then(function() {
                    q || l.Gm(h, k.bTb(h), function(r) {
                        return h.tL(r);
                    });
                });
            }
        });
        h.addEventListener(g.ja.YB, function() {
            l.Gm(h.ga, k.bTb(h), function(m) {
                return h.tL(m);
            });
        });
        h.background.value || h.addEventListener(g.ja.RZa, function(m) {
            var n;
            m = h.bk(m.R);
            if (null === (n = m.ze) || undefined === n ? 0 : n.jd)
                (n = h.bk(m.ze.jd),
                k.log.trace("Auxiliary viewable segment (viewableId: " + m.R + "). Starting playdata monitor for parent viewable " + n.R),
                m = n);
            l.w6a(m);
        });
        h.addEventListener(g.ja.Fh, function() {
            l.WTb();
        });
        h.addEventListener(g.ja.G8a, function() {
            l.PRb(h.ga).catch(function(m) {
                (m = m.EN) && h.tL(m);
            });
        });
        h.addEventListener(g.ja.mXb, function() {
            l.QRb(h.ga).catch(function(m) {
                (m = m.EN) && h.tL(m);
            });
        });
        h.oa.addListener([e.l.Ea], function() {
            h.qb.ESa ? k.log.trace("stickiness is disabled for timedtext") : l.Qza(h.ga);
        });
        h.oa.addListener([e.l.V], function() {
            h.qb.ESa ? k.log.trace("stickiness is disabled for audio") : l.Qza(h.ga).catch(function(m) {
                (m = m.EN) && h.tL(m);
            });
        });
    });
}
    bTb(h) {
    return h.state.value == g.Nc.Lf;
}
}
t = a(22970);
p = a(22674);
c = a(87386);
g = a(85001);
f = a(96687);
e = a(26388);
a = d;
export const UIa = a;
export const UIa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Bb)), t.__param(1, (0,
p.v)(f.S7))], a);

// Detected exports: UIa
