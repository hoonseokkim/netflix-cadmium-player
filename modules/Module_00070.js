/**
 * Netflix Cadmium Playercore - Module 70
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 */

// Webpack module 70
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
d = a(52569);  // import from Module_52569
p = a(33096);  // import from Module_33096
c = a(36129);  // import from Module_36129
g = a(22365);  // import from Module_22365
t = a(31276);  // import from Module_31276
a = a(11479);  // import from Module_11479
f = t.Za.get(a.vk);
f.register(c.ea.teb, function(e) {
    g.vo && g.vo.generateKey && g.vo.importKey && g.vo.unwrapKey ? (f.qg("wcs"),
    (0,
    d.N2)(g.vo.generateKey({
        name: "AES-CBC",
        length: 128
    }, true, ["encrypt", "decrypt"]  /* config: encrypt = "decrypt" */)).then(function() {
        f.qg("wcdone");
        e(p.ai);
    }, function(h) {
        var k;
        h = "" + h;
        if (0 <= h.indexOf("missing crypto.subtle"))
            k = c.Y.LLa;
        else
            0 <= h.indexOf("timeout waiting for iframe to load") && (k = c.Y.g7b);
        e({
            Ya: k,
            Cf: h
        });
    })) : e({
        Ya: c.Y.LLa
    });
});

