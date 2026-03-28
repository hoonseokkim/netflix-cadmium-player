/**
 * Netflix Cadmium Playercore - Module 76563
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 */

// Webpack module 76563
// Parameters: t (module), b (exports), a (require)

var d, p;
t = a(59032);  // import from Module_59032
d = a(29204);  // import from Module_29204
p = a(31276);  // import from Module_31276
(0,
t.Vka)(function(c, g) {
    var f, e, h, k;
    f = {
        "video-merch-bob-vertical": 480,
        "video-merch-bob-horizontal": 384,
        "video-merch-jaw": 720,
        "show-as-a-row-bob-horizontal": 480,
        "mini-modal-horizontal": 720
    };
    Object.assign(f, d.config.f2c);
    e = f[g.Ye];
    if (d.config.g2c && e) {
        h = {};
        k = (0,
        p.Fo)(c, "MediaStreamFilter");
        return {
            xra: "uiLabel",
            nJ: function(l) {
                if (l.lower && l.height > e)
                    return (h[l.height] || (h[l.height] = true,
                    k.warn("Restricting resolution due to uiLabel", {
                        MaxHeight: e,
                        streamHeight: l.height
                    }),
                    g.fw.set({
                        reason: "uiLabel",
                        height: l.height
                    })),
                    true);
            }
        };
    }

