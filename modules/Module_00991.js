/**
 * Netflix Cadmium Playercore - Module 991
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 * Exports: Ahd, Bhd, ymd
 */

// Webpack module 991
// Parameters: t (module), b (exports), a (require)

var g, f, e, h;
function d(k, l, m, n) {
    var q, r, u;
    (0,
    g.ta)((0,
    h.sB)(k) && !(0,
    h.isArray)(k));
    n = n || "";
    q = "";
    r = k.hasOwnProperty(e.$ia) && k[e.$ia];
    r && (0,
    f.Qi)(r, function(v, w) {
        q && (q += " ");
        q += v + '="' + c(w) + '"';
    });
    m = (l ? l + ":" : "") + m;
    r = n + "<" + m + (q ? " " + q : "");
    u = k.hasOwnProperty(e.RF) && k[e.RF].trim && "" !== k[e.RF].trim() && k[e.RF];
    if (u)
        return r + ">" + c(u) + "</" + m + ">";
    k = p(k, l, n + "  ");
    return r + (k ? ">\n" + k + "\n" + n + "</" + m + ">" : "/>");
}
function p(k, l, m) {
    var n;
    (0,
    g.ta)((0,
    h.sB)(k) && !(0,
    h.isArray)(k));
    m = m || "";
    n = "";
    (0,
    f.Qi)(k, function(q, r) {
        var w;
        if ("$" != q[0])
            for (var u = (0,
            f.YM)(r), v = 0; v < u.length; v++)
                if ((r = u[v],
                n && (n += "\n"),
                (0,
                h.sB)(r)))
                    n += d(r, l, q, m);
                else {
                    w = (l ? l + ":" : "") + q;
                    n += m + "<" + w + ">" + c(r) + "</" + w + ">";
                }
    });
    return n;
}
function c(k) {
    if ((0,
    h.Ri)(k))
        return (0,
        f.CXa)(k);
    if ((0,
    h.wc)(k))
        return ((0,
        g.iaa)(k, "Convert non-integer numbers to string for xml serialization."),
        "" + k);
    if (null === k || undefined === k)
        return "";
    (0,
    g.ta)(false, "Invalid xml value.");
    return "";
}
export const Ahd = d;
export const Bhd = p;
export const ymd = c;
g = a(45146);  // import from Module_45146
f = a(3887);  // import from Module_03887
e = a(62604);  // import from Module_62604
h = a(32687)

// Detected exports: Ahd, Bhd, ymd
