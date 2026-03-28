/**
 * Netflix Cadmium Playercore - Module 18945
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Event handling
 * Exports: Jic
 */

// Webpack module 18945
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function Jic(h) {
    var k, l, m, n;
    k = this;
    if (h.jb) {
        if (!c.jb.CDc) {
            m = new f.platform.Console("LASER");
            n = p.VERSION;
            c.jb.ky({
                console: m,
                pPc: "CADMIUM",
                platformVersion: "6.0055.939.911",
                aWc: n,
                wV: function() {
                    return d.__awaiter(k, undefined, undefined, function() {
                        var q;
                        return d.__generator(this, function(r) {
                            switch (r.label) {
                            case 0:
                                return [4, g.k_.import("laserLogSink")];
                            case 1:
                                return (q = r.T(),
                                e.u && m.trace("External socket client ready"),
                                [2, {
                                    send: function(u) {
                                        var v;
                                        v = u.ntl ? "laser-event-ntl" : "laser-event";
                                        delete u.ntl;
                                        q.send(v, u);
                                    }
                                }]);
                            }
                        });
                    });
                }
            });
            c.jb.eXc(f.platform.time);
            e.u && m.trace(("Configured for ").concat("CADMIUM", " (").concat("6.0055.939.911", "). Using schema v").concat(n));
        }
        c.jb.enable(h.p1);
        c.jb.LS || (n = {
            type: null !== (l = h.u1) && undefined !== l ? l : "MANUAL_TEST"
        },
        h.t1 && (n.name = h.t1),
        h.r1 && (n.description = h.r1),
        h.q1 && (n.CVc = h.q1),
        c.jb.b_c(n));
    } else
        c.jb.disable();
}
;
d = a(22970);  // import from Module_22970
p = a(91877);  // import from Module_91877
c = a(97685);  // import from Module_97685
g = a(57349);  // import from Module_57349
f = a(66164);  // import from Module_66164
e = a(4817

// Detected exports: Jic
