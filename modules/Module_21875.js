/**
 * Netflix Cadmium Playercore - Module 21875
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 */

// Webpack module 21875
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
d = a(22970);  // import from Module_22970
t = a(66164);  // import from Module_66164
p = a(91176);  // import from Module_91176
c = a(13550);  // import from Module_13550
a = a(75498);  // import from Module_75498
f = [];
e = [];
t.platform.zgc && (t.platform.zgc.bq = {
    Gb: function() {
        g = undefined;
        f = [];
        e = [];
    },
    Y3: function(h) {
        g = h;
    },
    ggd: function() {
        return {
            all: f,
            XWb: e
        };
    }
});
a = (function(h) {
    function k() {
        return null !== h && h.apply(this, arguments) || this;
    }
    d.__extends(k, h);
    k.prototype.Uf = function(l) {
        var m;
        m = l.rn;
        f = l = l.el.first;
        if (undefined === g)
            return (m = (0,
            c.e0)(l),
            g = l[m].bitrate,
            new c.ih(l[m]));
        if (!l.length)
            return new c.ih();
        m = (0,
        p.kc)(l, function(n) {
            return n.bitrate === g;
        });
        return undefined === m ? (c.console.log("Defaulting to first stream due to unvalid bitrate requested: " + g),
        new c.ih(l[0])) : new c.ih(m);
    }
    ;
    return k;
}
)(a.cA);
b["default"] =

