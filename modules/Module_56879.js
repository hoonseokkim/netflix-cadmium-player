/**
 * Netflix Cadmium Playercore - Module 56879
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 56879
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.Ukc = function(c) {
    var h, k;
    function g(l) {
        (0,
        p.Ts)(l.newValue) && !(0,
        p.Ts)(l.oldValue) ? (null === k || void 0 === k ? void 0 : k.La(),
        k = h.uu.apply(h, d.__spreadArray([], d.__read(f), !1))) : null === k || void 0 === k ? void 0 : k.La();
    }
    for (var f = [], e = 1; e < arguments.length; e++)
        f[e - 1] = arguments[e];
    e = c.kg;
    h = c.Lj;
    e.state.addListener(g);
    g({
        oldValue: p.Yd.Wt,
        newValue: e.state.value
    });
}
;
d = a(22970);
p = a(65161);


// Detected exports: Ukc