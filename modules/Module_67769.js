/**
 * Netflix Cadmium Playercore - Module 67769
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: EIb, nid
 * Dependencies: 89707
 * Purpose: UI components
 */

// import dep_89707 from './Module_89707.js';

// Webpack module 67769
// Parameters: t (module), b (exports), a (require)

var f, e;
function d(h) {
    return e[h >> 6] + e[h & 63];
}
function p(h, k) {
    (0,
    f.assert)(0 < k && 8 > k);
    return d((k - 1 << 8) + h);
}
function c(h) {
    return d(1792 + h[0]) + d((h[1] << 4) + (h[2] >>> 4)) + d((h[2] << 8 & 3840) + h[3]);
}
function g(h) {
    return 43 === h ? 62 : 47 === h ? 63 : 58 > h ? h - 48 + 52 : 91 > h ? h - 65 : h - 71;
}
export function nid(h, k) {
    var n, q, r, u, v, w;
    function l(x, y) {
        var A;
        A = n;
        x = q - y - x;
        (0,
        f.assert)(1 <= x);
        (0,
        f.assert)(16384 > x - 1);
        (0,
        f.assert)(2 <= y && 512 > y - 2);
        y = d(2048 + (x - 1 >>> 3)) + d(((x - 1 & 7) << 9) + (y - 2));
        n = A + y;
        r = q;
        u = 0;
    }
    function m(x, y, A) {
        return h.subarray(x, x + A).every(function(z, B) {
            return z === h[y + B];
        });
    }
    n = "";
    q = k || 0;
    r = q;
    u = 0;
    for (k = 0; q < h.byteLength; ) {
        v = r;
        w = u;
        if (0 !== u && 513 > u && h[q] === h[r + u])
            (++u,
            ++q);
        else if (513 === u)
            (l(v, w),
            k = 0);
        else {
            for (--r; 0 <= r && r >= q - u - 16384 && (h[v] !== h[r] || 0 < u && !m(q - u, r, u + 1)); )
                --r;
            if (0 <= r && r >= q - u - 16384)
                (++u,
                ++q);
            else if (v === q || 1 === w) {
                q -= w;
                for (v = 1; 7 > v && h[q + v] === h[q]; )
                    ++v;
                n += p(h[q], v);
                q += v;
                k = 1 < v ? 0 : k + 1;
                4 === k && (n = n.slice(0, n.length - 8),
                n += c(h.subarray(q - 4, q)));
                r = q;
                u = 0;
            } else
                (l(v, w),
                k = 0);
        }
    }
    1 === u ? n += p(h[r], 1) : 1 < u && l(r, u);
    return n;
}
;
export function EIb(h, k) {
    var v, w;
    function l(y, A) {
        n(A);
        if (y + A <= u)
            q.set(q.subarray(y, y + A), u);
        else
            for (var z = 0; z < A; ++z)
                q[u + z] = q[y + z];
        u += A;
    }
    function m() {
        var y;
        y = h.slice(r, r += 2);
        return (g(y.charCodeAt(0)) << 6) + g(y.charCodeAt(1));
    }
    function n(y) {
        u + y > q.byteLength && (y = new Uint8Array(2 * q.byteLength),
        y.set(q, 0),
        q = y);
    }
    for (var q = k || new Uint8Array(4096), r = 0, u = k ? k.byteLength : 0; r < h.length; ) {
        v = m();
        if (v & 2048) {
            w = m();
            l(u - (((v & 2047) << 3) + (w >>> 9) + 1), (w & 511) + 2);
        } else if (1792 === (v & 3840))
            (n(4),
            q[u++] = v & 255,
            w = m(),
            v = m(),
            q[u++] = w >>> 4,
            q[u++] = (w << 4 & 240) + (v >>> 8),
            q[u++] = v & 255);
        else {
            w = v & 255;
            v = (v >>> 8) + 1;
            n(v);
            for (var x = 0; x < v; ++x)
                q[u++] = w;
        }
    }
    return q.subarray(k ? k.byteLength : 0, u);
}
;
f = a(89707);
e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

// Detected exports: EIb, nid
