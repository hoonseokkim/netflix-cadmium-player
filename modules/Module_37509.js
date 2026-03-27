/**
 * Netflix Cadmium Playercore - Module 37509
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 37509
// Parameters: t (module), b (exports), a (require)

var d, p;

t = a(94886);
d = a(32219);
p = a(22365);
export const Ce = new t.jl();
export const Dn = 1;
export const gM = 2;
export const Zsa = 3;
export const Qs = 4;
export const Ysa = 5;
(0,
d.gi)(function() {
    var g, f, e;
    function c(h, k) {
        if (f)
            f.on(h, k);
        else
            Da.addEventListener(h, k);
    }
    g = Da.jQuery;
    f = g && g(Da);
    g = (g = Da.netflix) && g.cadmium && g.cadmium.addBeforeUnloadHandler;
    e = p.$i.hidden;
    g ? g(function(h) {
        Ce.qd(Dn, h);
    }) : c("beforeunload", function(h) {
        Ce.qd(Dn, h);
    });
    c("keydown", function(h) {
        Ce.qd(gM, h);
    });
    c("resize", function() {
        Ce.qd(Zsa);
    });
    p.$i.addEventListener("visibilitychange", function() {
        e !== p.$i.hidden && (e = p.$i.hidden,
        Ce.qd(Qs));
    });
});
(function() {
    Da.addEventListener("error", function(c) {
        Ce.qd(Ysa, c);
        return true;
    });
}
)();

// Detected exports: Ysa, Qs, Zsa, gM, Dn, Ce