/**
 * Netflix Cadmium Playercore - Module 30689
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 */

// Webpack module 30689
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
d = a(29204);  // import from Module_29204
p = a(33096);  // import from Module_33096
t = a(36129);  // import from Module_36129
c = a(31276);  // import from Module_31276
b = a(11479);  // import from Module_11479
g = a(66476);  // import from Module_66476
c.Za.get(b.vk).register(t.ea.meb, function(e) {
    var h, k, l;
    if (d.config.hz) {
        h = (0,
        c.An)("PlayerPredictionModel");
        k = c.Za.get(g.YP);
        l = a(99886);  // import from Module_99886
        h.log = h.trace.bind(h);
        f = new l({},h,{
            kga: function() {},
            dUc: function() {}
        },k,{
            CU: function() {}
        });
        Da._cad_global.playerPredictionModel = f;
        h.info("ppm v2 initialized");
    }
    e(p.ai);

