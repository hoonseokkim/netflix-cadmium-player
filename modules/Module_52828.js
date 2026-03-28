/**
 * Netflix Cadmium Playercore - Module 52828
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Purpose: Dependencies: [36129, 31276, 31701, 11479]
 * Original signature: function(t, b, a)
 */

// Webpack module 52828
// Parameters: t (module), b (exports), a (require)
var d, p;
t = a(36129);
d = a(31276);
p = a(31701);
a = a(11479);
d.Za.get(a.vk).register(t.ea.ieb, function(c) {
    d.Za.get(p.Wbb)().then(function() {
        c({
            success: true
        });
    }).catch(function(g) {
        d.log.error("error in initializing indexedDb debug tool", g);
        c({
            success: true
        });
    });
});
