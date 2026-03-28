/**
 * Netflix Cadmium Playercore - Module 22097
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 */

// Webpack module 22097
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g, f, e, h, k, l, m) {
    this.level = g;
    this.Cd = f;
    this.timestamp = e;
    this.message = h;
    this.Uc = k;
    this.prefix = l;
    this.index = undefined === m ? 0 : m;
    this.M_c = this.P_c();
}
b.n$a = undefined;
p = a(5021);  // import from Module_05021
c = {
    0: "F",
    1: "E",
    2: "W",
    3: "I",
    4: "T",
    5: "D"
};
d.prototype.eBa = function(g) {
    g = (this.prefix.length ? "" + this.prefix.join(" ") + " " : "") + this.message + (g ? "" : " " + this.M_c);
    return (this.timestamp.na(p.Ba) / 1E3).toFixed(3) + "|" + this.index + "|" + (c[this.level] || this.level) + "|" + this.Cd + "| " + g;
}
;
d.prototype.P_c = function() {
    var h;
    for (var g = this.Uc.length, f = "", e = 0; e < g; ++e) {
        h = this.Uc[e].fC;
        e && f.length && (f += " ");
        if ("object" === typeof h) {
            if (null === h)
                f += "null";
            else if (h instanceof Error)
                f += this.O_c(h);
            else
                try {
                    f += JSON.stringify(h);
                } catch (k) {
                    f += this.N_c(h);
                }
        } else
            f += h;
    }
    return f;
}
;
d.prototype.O_c = function(g) {
    return g.toString() + (g.stack ? "\n" + g.stack : "") + "\n";
}
;
d.prototype.N_c = function(g) {
    var f;
    f = [];
    return JSON.stringify(g, function(e, h) {
        if ("object" === typeof h && null !== h) {
            if (-1 !== f.indexOf(h))
                return "<cycle>";
            f.push(h);
        }
        return h;
    });
}
;
b.n$a =

