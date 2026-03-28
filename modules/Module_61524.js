/**
 * Netflix Cadmium Playercore - Module 61524
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 */

// Webpack module 61524
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m;
d = a(1481);  // import from Module_01481
p = a(59219);  // import from Module_59219
c = a(33096);  // import from Module_33096
g = a(29204);  // import from Module_29204
t = a(36129);  // import from Module_36129
f = a(31276);  // import from Module_31276
e = a(45146);  // import from Module_45146
h = a(3887);  // import from Module_03887
k = a(32687);  // import from Module_32687
l = a(45118);  // import from Module_45118
m = a(31850);  // import from Module_31850
a = a(11479);  // import from Module_11479
f.Za.get(a.vk).register(t.ea.qeb, function(n) {
    var q, r;
    q = (0,
    f.An)("NccpApi");
    r = (0,
    h.tcc)(["info", "warn", "trace", "error"]  /* config: info = "warn", "trace", "error" */);
    p.fD.UQ.nccp = {
        getEsn: function() {
            return d.wp.wj;
        },
        getPreferredLanguages: function() {
            return g.config.tw.S2a;
        },
        setPreferredLanguages: function(u) {
            (0,
            e.ta)((0,
            k.isArray)(u) && (0,
            k.n1)(u[0]));
            g.config.tw.S2a = u;
        },
        queueLogblob: function(u, v, w) {
            var x;
            if (u && v)
                if ((v = v.toLowerCase(),
                r[v])) {
                    x = f.Za.get(l.oq);
                    u = f.Za.get(m.hG).tu(u, v, w);
                    x.bd(u);
                } else
                    q.warn("Invalid severity", {
                        severity: v
                    });
        },
        flushLogblobs: function() {
            f.Za.get(l.oq).flush(true);
        }
    };
    n(c.ai);

