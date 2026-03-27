/**
 * Netflix Cadmium Playercore - Module 28847
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 28847
// Parameters: t (module), b (exports), a (require)

var d;
export function Zrc(p, c, g) {
    var f, e, h;
    f = 0;
    if (g) {
        p.some(function(k) {
            var l;
            l = k.b;
            k = k.m;
            if (c <= l)
                return (f = h && l !== e ? h + (k - h) / (l - e) * (c - e) : k,
                true);
            e = l;
            f = h = k;
            return false;
        });
    } else
        p.some(function(k) {
            f = k.m;
            return c <= k.b;
        });
    return f;
}
;
export function jOb(p, c, g) {
    var f;
    c = (null === (f = c.sb) || undefined === f ? undefined : f.Fa) || 0;
    return p.Ksb ? (p = (0,
    d.zTa)(p.Jsb, g.yl - g.Ld, 1),
    c * (1 - p)) : c * p.MV / 100;
}
;
export function Orb(p, c) {
    return p < 2 * c ? p / 2 : p - c;
}
;
d = a(65167);

// Detected exports: Zrc, jOb, Orb