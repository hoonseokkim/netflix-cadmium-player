/**
 * Netflix Cadmium Playercore - Module 37509
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 37509
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.Ysa = b.Qs = b.Zsa = b.gM = b.Dn = b.Ce = void 0;
t = a(94886);
d = a(32219);
p = a(22365);
b.Ce = new t.jl();
b.Dn = 1;
b.gM = 2;
b.Zsa = 3;
b.Qs = 4;
b.Ysa = 5;
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
        b.Ce.qd(b.Dn, h);
    }) : c("beforeunload", function(h) {
        b.Ce.qd(b.Dn, h);
    });
    c("keydown", function(h) {
        b.Ce.qd(b.gM, h);
    });
    c("resize", function() {
        b.Ce.qd(b.Zsa);
    });
    p.$i.addEventListener("visibilitychange", function() {
        e !== p.$i.hidden && (e = p.$i.hidden,
        b.Ce.qd(b.Qs));
    });
});
(function() {
    Da.addEventListener("error", function(c) {
        b.Ce.qd(b.Ysa, c);
        return !0;
    });
}
)();


// Detected exports: Ysa, Qs, Zsa, gM, Dn, Ce