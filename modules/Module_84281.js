/**
 * Netflix Cadmium Playercore - Module 84281
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: g5c
 */

// Webpack module 84281
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;
export function g5c(e, h) {
    var k, l;
    try {
        l = (0,
        c.h5c)(e);
    } catch (m) {
        d.log.error("xml2xmlDoc exception", m);
    }
    (0,
    f.gi)(function() {
        if (l && l.documentElement)
            try {
                k = (0,
                g.i5c)(l);
            } catch (m) {
                d.log.error("xmlDoc2js exception", m);
            }
        (0,
        f.gi)(function() {
            k ? h({
                success: true,
                object: k
            }) : h({
                success: false,
                Ya: p.Y.O0b
            });
        });
    });
}
;
d = a(31276);  // import from Module_31276
p = a(36129);  // import from Module_36129
c = a(78857);  // import from Module_78857
g = a(74413);  // import from Module_74413
f = a(3221

// Detected exports: g5c
