/**
 * Netflix Cadmium Playercore - Module 66412
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 66412
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.mcc = function(c, g) {
    return (0,
    p.NI)(c, {
        toJSON: function() {
            var f;
            f = d.__assign({}, c);
            g.forEach(function(e) {
                delete f[e];
            });
            return f;
        }
    });
}
;
d = a(22970);
p = a(54520);


// Detected exports: mcc