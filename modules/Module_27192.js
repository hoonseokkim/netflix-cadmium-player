/**
 * Netflix Cadmium Playercore - Module 27192
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: HJc, Urb, Vrb, Wrb, XY, bPa, cPa, dPa, ePa, flatten, hLb, hn, i0, jic, kc, kdd, lgd, np, pcc, qcc, xdd
 * Dependencies: 22970
 * Purpose: Utility module
 */

// import dep_22970 from './Module_22970.js';

// Webpack module 27192
// Parameters: t (module), b (exports), a (require)

var g;
function d(f) {
    return f.filter(function(e, h) {
        return f.indexOf(e) === h;
    });
}
function p(f, e, h) {
    return h ? f.filter(function(k) {
        return !e.some(function(l) {
            return h(k, l);
        });
    }) : f.filter(function(k) {
        return -1 === e.indexOf(k);
    });
}
function c(f, e, h) {
    return f.length < e.length ? h ? c(e, f, function(k, l) {
        return h(l, k);
    }) : c(e, f) : h ? f.map(function(k, l) {
        return h(k, e[l]) ? -1 : l;
    }).filter(function(k) {
        return -1 !== k;
    }) : f.map(function(k, l) {
        return k === e[l] ? -1 : l;
    }).filter(function(k) {
        return -1 !== k;
    });
}

export function kc(f, e) {
    for (var h = 0; h < f.length; h++)
        if (e(f[h], h, f))
            return f[h];
}
;
export function cPa(f, e) {
    for (var h = f.length - 1; 0 <= h; --h)
        if (e(f[h], h, f))
            return f[h];
}
;
export function hn(f, e) {
    var h;
    h = -1;
    return f.some(function(k, l, m) {
        h = l;
        return e(k, l, m);
    }) ? h : -1;
}
;
export function qcc(f, e) {
    var h, k, l;
    h = [];
    for (k = 0; k < f.length; k++) {
        l = e(f[k], k, f);
        if (Array.isArray(l))
            for (var m = 0; m < l.length; m++)
                h.push(l[m]);
        else
            h.push(l);
    }
    return h;
}
;
export function Vrb(f, e) {
    for (var h = f.length - 1; 0 <= h; h--)
        if (e(f[h], h, f))
            return h;
    return -1;
}
;
export const bPa = d;
export function dPa(f, e) {
    return f.filter(function(h, k) {
        return f.indexOf(h) === k && -1 !== e.indexOf(h);
    });
}
;
export function ePa(f, e) {
    e = f.indexOf(e);
    if (-1 === e)
        return false;
    f.splice(e, 1);
    return true;
}
;
export const np = p;
export const Urb = c;
export function XY(f, e) {
    return d(f.concat(e));
}
;
export function kdd(f) {
    return function(e, h) {
        return f(e) - f(h);
    }
    ;
}
;
export function HJc(f) {
    return function(e, h) {
        return f(e) < f(h) ? e : h;
    }
    ;
}
;
export function flatten(f) {
    var e;
    return (e = []).concat.apply(e, g.__spreadArray([], g.__read(f), false));
}
;
export function xdd(f, e) {
    undefined === e && (e = function(h) {
        return h;
    }
    );
    return f.reduce(function(h, k) {
        k = e(k);
        return (undefined === h[k] ? h[k] = 1 : ++h[k],
        h);
    }, {});
}
;
export function lgd(f, e) {
    return f.reduce(function(h, k) {
        var l;
        l = e(k);
        return (undefined === h[l] ? h[l] = [k] : h[l].push(k),
        h);
    }, {});
}
;
export function hLb(f) {
    return null !== f && undefined !== f;
}
;
export function pcc(f) {
    var e, k;
    e = [];
    if (Array.isArray(f))
        for (var h = 0; h < f.length; h++) {
            k = f[h];
            Array.isArray(k) ? e = e.concat(k.filter(function(l) {
                return undefined !== l;
            })) : undefined !== k && e.push(k);
        }
    return e;
}
;
export function jic(f, e, h) {
    var k;
    k = p(f, e, h);
    e = p(e, f, h);
    f = p(f, k);
    return {
        dga: k,
        krb: e,
        qya: f,
        result: f.concat(e)
    };
}
;
export function i0(f, e) {
    for (var h = f.length - 1; 0 <= h; --h)
        e(f[h], h, f);
}
;
g = a(22970);
export function Wrb(f, e, h) {
    if (h) {
        if (h >= f.length)
            return false;
        0 > h && (h = Math.max(0, f.length + h));
    }
    return -1 !== f.indexOf(e, h);
}
;

// Detected exports: HJc, Urb, Vrb, Wrb, XY, bPa, cPa, dPa, ePa, flatten, hLb, hn, i0, jic, kc, kdd, lgd, np, pcc, qcc, xdd
