/**
 * Netflix Cadmium Playercore - Module 33579
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: l2c
 * Dependencies: 22365
 * Purpose: Utility module
 */

// import dep_22365 from './Module_22365.js';

// Webpack module 33579
// Parameters: t (module), b (exports), a (require)

var d;
export function l2c(p, c) {
    function g(h, k, l) {
        var r, v, w, x, y;
        if (h && 1 < h.length) {
            for (var m = [], n = [], q = 0; q < h.length; q++)
                (m[q] = 0,
                n[q] = 0);
            r = false;
            for (q = 0; q < h.length; q++)
                for (var u = q + 1; u < h.length; u++) {
                    v = h[q];
                    w = h[u];
                    if (0 > v.width || 0 > w.width || w.left > v.left + v.width || w.left + w.width < v.left || w.top > v.top + v.height ? 0 : w.top + w.height >= v.top) {
                        x = (0,
                        d.Tz)(v.left, w.left);
                        y = (0,
                        d.Tz)(v.top, w.top);
                        x = {
                            width: (0,
                            d.Tz)((0,
                            d.kG)(v.left + v.width, w.left + w.width) - x, 0),
                            height: (0,
                            d.Tz)((0,
                            d.kG)(v.top + v.height, w.top + w.height) - y, 0),
                            x: x,
                            y: y
                        };
                    } else
                        x = undefined;
                    if (x && 1 < x.width && 1 < x.height)
                        if ((y = x.width <= x.height,
                        v = f(h[q]),
                        w = f(h[u]),
                        y && k || !y && !k))
                            (x = (0,
                            d.Tz)(x.width / 2, .25),
                            v.x <= w.x ? (n[q] -= x,
                            n[u] += x) : (n[u] -= x,
                            n[q] += x));
                        else if (y && !k || !y && k)
                            (v = (0,
                            d.Tz)(x.height / 2, .25),
                            m[q] -= v,
                            m[u] += v);
                }
            for (q = 0; q < h.length; q++) {
                if (-.25 > n[q] && 0 <= h[q].left + n[q] || .25 < n[q] && h[q].left + h[q].width + n[q] <= l.width)
                    (h[q].left += n[q],
                    r = true);
                if (-.25 > m[q] && 0 <= h[q].top + m[q] || .25 < m[q] && h[q].top + h[q].height + m[q] <= l.height)
                    (h[q].top += m[q],
                    r = true);
            }
            return r;
        }
    }
    function f(h) {
        return {
            x: h.left + h.width / 2,
            y: h.top + h.height / 2
        };
    }
    p = p.map(function(h) {
        return {
            top: h.top,
            left: h.left,
            width: h.width,
            height: h.height
        };
    });
    (function(h, k) {
        h.forEach(function(l) {
            0 > l.left && l.left + l.width < k.width ? l.left += (0,
            d.kG)(-l.left, k.width - (l.left + l.width)) : l.left + l.width > k.width && 0 < l.left && (l.left -= (0,
            d.kG)(l.left + l.width - k.width, l.left));
            0 > l.top && l.top + l.height < k.height ? l.top += (0,
            d.kG)(-l.top, k.height - (l.top + l.height)) : l.top + l.height > k.height && 0 < l.top && (l.top -= (0,
            d.kG)(l.top + l.height - k.height, l.top));
        });
    }
    )(p, c);
    for (var e = 0; 50 > e && g(p, true, c); e++)
        ;
    for (e = 0; 50 > e && g(p, false, c); e++)
        ;
    return p;
}
;
d = a(22365);

// Detected exports: l2c
