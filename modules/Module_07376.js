/**
 * Netflix Cadmium Playercore - Module 7376
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: fmb
 * Dependencies: 22970
 * Purpose: Encryption/Decryption, Parsing/Serialization, Error handling, Class definition
 */

// import dep_22970 from './Module_22970.js';

// Webpack module 7376
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h, k, l, m, n;

d = a(22970);
p = d.__importDefault(a(11946));
c = ("start center end spaceAround spaceBetween withBase").split(" ");
g = ["before", "after", "both", "outside"] /* before */;
f = ["before", "after", "outside"] /* before */;
e = ["filled", "open"] /* filled */;
h = ["circle", "dot", "sesame"] /* circle */;
k = ["none", "auto"] /* none */;
l = ["before", "after", "outside"] /* before */;
m = ("container base baseContainer text textContainer delimiter").split(" ");
n = ["characterStyle", "characterSize"] /* characterStyle */;
t = (function() {
    class q {
    constructor(r, u, v, w) {
        this.Eb = r;
        this.Mv = u;
        this.H8b = w;
        this.Qv = this.iAc(v);
    }
    rmc(r, u) {
        var v, w, x;
        v = (0,
        p.default)(this.Qv.characterSize, this.Mv.characterSize, "MEDIUM");
        w = (0,
        p.default)(this.Qv.characterStyle, this.Rtc(r.fontFamily), this.Mv.characterStyle, "PROPORTIONAL_SANS_SERIF");
        x = this.oOc(r.fontSize);
        return {
            characterUnderline: "underline" === r.textDecoration,
            characterItalic: "italic" === r.fontStyle,
            characterStyle: w,
            windowOpacity: this.E1a((0,
            p.default)(this.Qv.windowOpacity, this.Mv.windowOpacity, "OPAQUE")),
            characterOpacity: this.E1a((0,
            p.default)(this.Qv.characterOpacity, this.Mv.characterOpacity, "OPAQUE")),
            backgroundOpacity: this.E1a((0,
            p.default)(this.Qv.backgroundOpacity, r.opacity, this.Mv.backgroundOpacity, "OPAQUE")),
            characterColor: this.G$((0,
            p.default)(this.Qv.characterColor, r.color, this.Mv.characterColor, "#ffffff")),
            backgroundColor: this.G$((0,
            p.default)(this.Qv.backgroundColor, r.backgroundColor, this.Mv.backgroundColor, null)),
            windowColor: this.G$((0,
            p.default)(this.Qv.windowColor, r.windowColor, this.Mv.windowColor, null)),
            characterEdgeAttributes: (0,
            p.default)(this.Qv.characterEdgeAttributes, this.Mv.characterEdgeAttributes, null),
            characterSize: this.Jgc(v, w, x),
            characterTracking: this.Kgc(v, w),
            characterEdgeWidth: (0,
            p.default)(this.ufc(r.textOutline), 0),
            characterEdgeBlur: (0,
            p.default)(this.sfc(r.textOutline), 0),
            characterEdgeColor: this.G$((0,
            p.default)(this.Qv.characterEdgeColor, this.tfc(r.textOutline), this.Mv.characterEdgeColor, "#000000")),
            direction: (0,
            p.default)(this.Qv.direction, r.direction, this.Mv.direction, "ltr"),
            ruby: (0,
            p.default)(this.Dxa(r.ruby, m), null),
            rubyAlign: (0,
            p.default)(this.Dxa(r.rubyAlign, c), null),
            rubyPosition: (0,
            p.default)(this.Dxa(r.rubyPosition, f), null),
            rubyReserve: (0,
            p.default)(this.Dxa(r.rubyReserve, g), null),
            textEmphasis: this.KOc(r.textEmphasis),
            shear: r.shear ? .01 * parseFloat(r.shear) : null,
            textCombine: r.textCombine ? r.textCombine : null,
            lineHeight: r.lineHeight ? this.tOc(r.lineHeight, u) : null
        };
    }
    tOc(r, u) {
        var v;
        v = r.match(/^([\d\.]+)([a-z%]*)$/i);
        if (!v)
            return null;
        r = parseFloat(v[1]);
        switch (v[2]) {
        case "rh":
            (null === u || undefined === u ? 0 : u.height) ? (r *= u.height,
            u = "px") : u = v[2];
            break;
        case "rw":
            (null === u || undefined === u ? 0 : u.width) ? (r *= u.width,
            u = "px") : u = v[2];
            break;
        default:
            u = v[2];
        }
        return {
            value: r,
            Yh: u
        };
    }
    E1a(r) {
        return this.Eb.nMb[r];
    }
    Rtc(r) {
        return "string" !== typeof r ? null : this.Eb.GAb[r];
    }
    Jgc(r, u, v) {
        var w;
        v *= this.Eb.Qtb[r] || 1;
        w = 1;
        this.Eb.sizeScaleMap[r] && (w = this.Eb.sizeScaleMap[r][u] || 1);
        return 1 / 19 * v * w;
    }
    Kgc(r, u) {
        var v;
        v = 0;
        this.Eb.I7a[r] && (v = this.Eb.I7a[r][u] || 0);
        return v;
    }
    ufc(r) {
        return "string" !== typeof r ? null : this.c2a(r).width;
    }
    sfc(r) {
        return "string" !== typeof r ? null : this.c2a(r).blur;
    }
    tfc(r) {
        return "string" !== typeof r ? null : this.c2a(r).color;
    }
    c2a(r) {
        var u, v, w;
        r = (r || "").split(" ");
        u = (/^[0-9]/).test(r[0]);
        v = u ? 0 : 1;
        w = parseInt(r[v]);
        v = parseInt(r[v + 1]);
        return {
            color: u ? "#000000" : this.G$(r[0]),
            width: 0 < w ? w : 0,
            blur: 0 < v ? v : 0
        };
    }
    oOc(r) {
        r = (r || "").split(" ")[0] || "";
        return -1 < r.indexOf("%") ? parseInt(r, 10) / 100 : -1 < r.indexOf("em") ? parseFloat(r) : 1;
    }
    Dxa(r, u) {
        if (-1 < u.indexOf(r))
            return r;
    }
    KOc(r) {
        var u, v;
        if (!r)
            return null;
        r = r.split(" ");
        if (0 === r.length)
            return null;
        u = this.esa(r, l);
        u = u.length ? u[0] : "outside";
        v = this.esa(r, k);
        if (v.length)
            return this.M5a(v[0], "", u);
        v = this.esa(r, e);
        r = this.esa(r, h);
        return r.length || v.length ? this.M5a(r.length ? r[0] : "circle", v.length ? v[0] : "filled", u) : this.M5a("auto", "", u);
    }
    esa(r, u) {
        return r.filter(function(v) {
            return -1 !== u.indexOf(v);
        });
    }
    M5a(r, u, v) {
        return {
            textEmphasisShape: r,
            textEmphasisFill: u,
            textEmphasisPosition: v
        };
    }
    zYa(r) {
        return r && 0 === Object.keys(r).length;
    }
    iAc(r) {
        var u, v, y;
        if (this.H8b) {
            v = {};
            try {
                for (var w = d.__values(n), x = w.next(); !x.done; x = w.next()) {
                    y = x.value;
                    undefined !== r[y] && (v[y] = r[y]);
                }
            } catch (z) {
                var A;
                A = {
                    error: z
                };
            } finally {
                try {
                    x && !x.done && (u = w.return) && u.call(w);
                } finally {
                    if (A)
                        throw A.error;
                }
            }
            return v;
        }
        return r;
    }
}
q.prototype.G$ = function(r) {
        return "string" !== typeof r || "#" === r[0] && 7 === r.length ? r : "#" === r[0] && 4 === r.length ? "#" + r[1] + r[1] + r[2] + r[2] + r[3] + r[3] : this.Eb.Pub[r.toLowerCase()];
    }
    ;
    return q;
}
)();
export const fmb = t;

// Detected exports: fmb
