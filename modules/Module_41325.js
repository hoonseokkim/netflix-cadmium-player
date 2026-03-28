/**
 * Netflix Cadmium Playercore - Module 41325
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 */

// Webpack module 41325
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;
t = a(17925);  // import from Module_17925
d = a(29204);  // import from Module_29204
p = a(13044);  // import from Module_13044
b = a(87386);  // import from Module_87386
c = a(31276);  // import from Module_31276
g = a(45118);  // import from Module_45118
f = a(36410);  // import from Module_36410
e = a(45146);  // import from Module_45146
h = a(32687);  // import from Module_32687
a = a(60981);  // import from Module_60981
Da.netflix = Da.netflix || ({});
(0,
e.ta)(!Da.netflix.player);
Da.netflix.player = {
    VideoSession: t.xnb,
    diag: {
        togglePanel: function(k, l) {
            var m;
            m = [];
            if (!d.config || d.config.gga) {
                switch (k) {
                case "info":
                    m = p.tq.map(function(n) {
                        return n.Vxa;
                    });
                    break;
                case "streams":
                    m = p.tq.map(function(n) {
                        return n.Yxa;
                    });
                    break;
                case "log":
                    m = [];
                }
                m.forEach(function(n) {
                    (0,
                    h.gd)(l) ? l ? n.show() : n.uE() : n.toggle();
                });
            }
        },
        addLogMessageSink: function(k) {
            c.Za.get(g.oq).addListener({
                Ald: function() {},
                pJc: function(l) {
                    k({
                        data: l.data
                    });
                }
            });
        }
    },
    log: (0,
    c.An)("Ext"),
    LogLevel: b.ep,
    addLogSink: function(k, l) {
        c.Za.get(f.oX).Qya(k, l);
    },
    getVersion: function() {
        return "6.0055.939.911";
    },
    getMostRecentPlaybackDiagnosticGroups: function() {
        var k;
        return null === (k = p.Yz.Kea) || undefined === k ? undefined : k.Cxb.Uba();
    },
    MediaSession: new a.Xgb()

