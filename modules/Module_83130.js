/**
 * Netflix Cadmium Playercore - Module 83130
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: taa
 */

// Webpack module 83130
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;
d = this && this.__assign || (function() {
    d = Object.assign || (function(f) {
        for (var e, h = 1, k = arguments.length; h < k; h++) {
            e = arguments[h];
            for (var l in e)
                Object.prototype.hasOwnProperty.call(e, l) && (f[l] = e[l]);
        }
        return f;
    }
    );
    return d.apply(this, arguments);
}
);
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function taa(f) {
    var e, h, k, l, m, n;
    e = f.zta;
    h = f.name;
    k = f.yF;
    l = f.tR;
    m = f.config;
    f = f.when;
    n = (0,
    c.Dq)({
        yF: k,
        tR: l,
        name: h,
        zta: e,
        config: m,
        data: {},
        when: f
    });
    return d(d({}, n), {
        type: "COMPONENT",
        wE: false,
        gwb: function(q) {
            return (0,
            g.Evb)(d({
                context: p.W7
            }, q), n, q.i3);
        }
    });
}
;
p = a(39090);  // import from Module_39090
c = a(27851);  // import from Module_27851
g = a(335

// Detected exports: taa
