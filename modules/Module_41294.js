/**
 * Netflix Cadmium Playercore - Module 41294
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Dependencies: 22970, 44127
 * Purpose: Parsing/Serialization, Error handling, UI components, Class definition
 */

// import dep_22970 from './Module_22970.js';
// import dep_44127 from './Module_44127.js';

// Webpack module 41294
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l;
function d(m, n) {
    m = k[m & 63];
    if (n) {
        if ("+" == m)
            return "-";
        if ("/" == m)
            return "_";
    }
    return m;
}
b.Y$a = undefined;
p = a(22970);
t = a(44127);
c = String.fromCharCode(9);
g = String.fromCharCode(10);
f = String.fromCharCode(13);
e = String.fromCharCode(32);
h = String.fromCharCode(127);
k = (function() {
    var m, n;
    n = [];
    for (m = 0; 26 > m; m++)
        n[m] = String.fromCharCode(65 + m);
    for (m = 26; 52 > m; m++)
        n[m] = String.fromCharCode(97 + (m - 26));
    for (m = 52; 62 > m; m++)
        n[m] = String.fromCharCode(48 + (m - 52));
    n[62] = ;
    n[63] = "/";
    return n;
}
)();
l = (function() {
    var m, n;
    n = [];
    for (m = 0; 128 > m; m++)
        n[m] = -1;
    for (m = 65; 90 >= m; m++)
        n[m] = m - 65;
    for (m = 97; 122 >= m; m++)
        n[m] = m - 97 + 26;
    for (m = 48; 57 >= m; m++)
        n[m] = m - 48 + 52;
    n[43] = 62;
    n[47] = 63;
    n[61] = h;
    return n;
}
)();
t = (function(m) {
    class n extends m {
    constructor() {
        return null !== m && m.apply(this, arguments) || this;
    }
    encode(q, r) {
        var u, v, w;
        u = "";
        v = q.length;
        for (w = 0; 3 <= v; (v -= 3,
        w += 3))
            u += d(q[w] >> 2) + d((q[w] & 3) << 4 | q[w + 1] >> 4 & 15) + d((q[w + 1] & 15) << 2 | q[w + 2] >> 6 & 3) + d(q[w + 2] & 63);
        1 == v ? (u += d(q[w] >> 2) + d((q[w] & 3) << 4),
        r || (u += "==")) : 2 == v && (u += d(q[w] >> 2) + d((q[w] & 3) << 4 | q[w + 1] >> 4 & 15) + d((q[w + 1] & 15) << 2),
        r || (u += "="));
        return u;
    }
    decode(q, r) {
        var C, D;
        for (var u = false, v = q.length, w = Array(Math.floor(3 * v / 4)), x = 0, y = Array(4), A = 0, z = false, B = 0; B < v; ++B) {
            C = q[B];
            D = C.charCodeAt(0);
            isNaN(D) ? D = undefined : (D = l[D],
            r && ("-" == D ? D =  : "_" == D && (D = "/")));
            if (undefined === D || -1 == D)
                C != e && C != c && C != g && C != f && (u = true);
            else if ((z && (u = true),
            y[A++] = D,
            4 == A)) {
                if (y[0] == h || y[1] == h)
                    u = true;
                if (y[2] == h || y[3] == h)
                    z = true;
                w[x++] = y[0] << 2 | y[1] >> 4;
                y[2] != h && (w[x++] = y[1] << 4 | y[2] >> 2);
                y[3] != h && (w[x++] = y[2] << 6 | y[3]);
                A = 0;
            }
        }
        r && 2 <= A && (w[x++] = y[0] << 2 | y[1] >> 4,
        3 == A && y[2] != h && (w[x++] = y[1] << 4 | y[2] >> 2),
        A = 0);
        0 != A && (u = true);
        if (u)
            throw Error("Invalid Base64 encoded string: " + q);
        q = new Uint8Array(x);
        for (v = u = 0; u < w.length; ++u)
            r && w[u] == h || (q[u] = w[v++]);
        return q;
    }
}
p.return n;
}
)(t.X$a);
b.Y$a = t;

