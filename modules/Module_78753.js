/**
 * Netflix Cadmium Playercore - Module 78753
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: Zra
 */

// Webpack module 78753
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e;
d = this && this.__extends || (function() {
    function h(k, l) {
        h = Object.setPrototypeOf || ({
            __proto__: []
        })instanceof Array && (function(m, n) {
            m.__proto__ = n;
        }
        ) || (function(m, n) {
            for (var q in n)
                Object.prototype.hasOwnProperty.call(n, q) && (m[q] = n[q]);
        }
        );
        return h(k, l);
    }
    return function(k, l) {
        function m() {
            this.constructor = k;
        }
        if ("function" !== typeof l && null !== l)
            throw new TypeError("Class extends value " + String(l) + " is not a constructor or null");
        h(k, l);
        k.prototype = null === l ? Object.create(l) : (m.prototype = l.prototype,
        new m());
    }
    ;
}
)();
p = this && this.__read || (function(h, k) {
    var l, m, n;
    l = "function" === typeof Symbol && h[Symbol.iterator];
    if (!l)
        return h;
    h = l.call(h);
    n = [];
    try {
        for (; (undefined === k || 0 < k--) && !(m = h.next()).done; )
            n.push(m.value);
    } catch (r) {
        var q;
        q = {
            error: r
        };
    } finally {
        try {
            m && !m.done && (l = h["return"]) && l.call(h);
        } finally {
            if (q)
                throw q.error;
        }
    }
    return n;
}
);
c = this && this.__spreadArray || (function(h, k, l) {
    if (l || 2 === arguments.length)
        for (var m = 0, n = k.length, q; m < n; m++)
            !q && (m in k) || (q || (q = Array.prototype.slice.call(k, 0, m)),
            q[m] = k[m]);
    return h.concat(q || Array.prototype.slice.call(k));
}
);
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export function Zra() {
    for (var h = new Set(), k = (0,
    f.taa)({
        name: "",
        yF: [],
        zta: (function(l) {
            function m() {
                var n;
                n = l.apply(this, c([], p(arguments), false)) || this;
                n.Gb = e.eh;
                n.Hh = e.eh;
                return n;
            }
            d(m, l);
            return m;
        }
        )(g.QW)
    }).gwb({}); k && k !== Object.prototype; )
        (Object.getOwnPropertyNames(k).forEach(function(l) {
            return h.add(l);
        }),
        k = Object.getPrototypeOf(k));
    return h;
}
;
g = a(70537);  // import from Module_70537
f = a(83130);  // import from Module_83130
e = a(1091

// Detected exports: Zra
