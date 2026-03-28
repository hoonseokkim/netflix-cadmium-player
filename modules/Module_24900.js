/**
 * Netflix Cadmium Playercore - Module 24900
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: BLa
 * Dependencies: 6405, 22365, 22674, 22970, 42207
 * Purpose: Parsing/Serialization, Dependency injection, Class definition
 */

// import dep_6405 from './Module_6405.js';
// import dep_22365 from './Module_22365.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_42207 from './Module_42207.js';

// Webpack module 24900
// Parameters: t (module), b (exports), a (require)

var p, c, g, f;
class d {
    constructor(e, h) {
    this.is = e;
    this.dm = h;
}
    Hea(e, h, k) {
    var l, m, n, q;
    l = this;
    if (h)
        if (k) {
            m = k.aea;
            n = k.prefix;
            q = k.jxa;
            this.$R(h, function(r, u) {
                if (!q || l.is.Mi(u))
                    e[(n || "") + (m ? r.toLowerCase() : r)] = u;
            });
        } else
            this.$R(h, function(r, u) {
                e[r] = u;
            });
    return e;
}
    Tic(e, h) {
    if (e.length != h.length)
        return false;
    e.sort();
    h.sort();
    for (var k = e.length; k--; )
        if (e[k] !== h[k])
            return false;
    return true;
}
    Yj(e) {
    var h, k, l;
    if (e) {
        h = e.stack;
        k = e.number;
        l = e.message;
        l || (l = "" + e);
        h ? (e = "" + h,
        0 !== e.indexOf(l) && (e = l + "\n" + e)) : e = l;
        k && (e += "\nnumber:" + k);
        return e;
    }
}
    getFunctionName(e) {
    return (e = (/function (.{1,})\(/).exec(e.toString())) && 1 < e.length ? e[1] : "";
}
    HBb(e) {
    return this.getFunctionName(e.constructor);
}
    DLb(e) {
    var h, k;
    h = this;
    k = "";
    this.is.SQ(e) || this.is.zrb(e) ? k = Array.prototype.reduce.call(e, function(l, m) {
        return l + (32 <= m && 128 > m ? String.fromCharCode(m) : ".");
    }, "") : this.is.du(e) ? k = e : this.$R(e, function(l, m) {
        k += (k ? ", " : "") + "{" + l + ": " + (h.is.Hna(m) ? h.getFunctionName(m) || "function" : m) + "}";
    });
    return "[" + this.HBb(e) + " " + k + "]";
}
    createElement(e, h, k, l) {
    var m;
    m = f.$i.createElement(e);
    h && (m.style.cssText = h);
    k && (m.innerHTML = k);
    l && this.$R(l, function(n, q) {
        m.setAttribute(n, q);
    });
    return m;
}
    Tsc(e, h) {
    return function(k) {
        return k[e] === h;
    }
    ;
}
    Cxa(e) {
    var h;
    h = {};
    (e || "").split("&").forEach(function(k) {
        var l, m;
        k = k.trim();
        l = k.indexOf("=");
        if (0 <= l) {
            m = decodeURIComponent(k.substr(0, l)).toLowerCase();
            h[m] = decodeURIComponent(k.substr(l + 1));
        } else
            h[k.toLowerCase()] = undefined;
    });
    return h;
}
}
t = a(22970);
p = a(22674);
a(36129);
c = a(42207);
g = a(6405);
f = a(22365);
d.prototype.$R = function(e, h) {
    for (var k in e)
        e.hasOwnProperty(k) && h(k, e[k]);
}
;
d.prototype.K$ = function(e, h) {
    if (e.length == h.length) {
        for (var k = e.length; k--; )
            if (e[k] != h[k])
                return false;
        return true;
    }
    return false;
}
;
a = d;
export const BLa = a;
export const BLa = a = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(c.Zi)), t.__param(1, (0,
p.v)(g.dP))], a);

// Detected exports: BLa
