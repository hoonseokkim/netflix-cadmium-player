/**
 * Netflix Cadmium Playercore - Module 15531
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Fcd, Hed, Ied, Jed, Ked, Lrc, Mrc, Nrc, Pfd, Yyb, udd, ujd
 * Dependencies: 3887, 22365, 52569
 * Purpose: Parsing/Serialization, Playback control
 */

// import dep_3887 from './Module_3887.js';
// import dep_22365 from './Module_22365.js';
// import dep_52569 from './Module_52569.js';

// Webpack module 15531
// Parameters: t (module), b (exports), a (require)

var m, n, q, r, u, v, w, x;
function d(y, A, z, B, C) {
    var D;
    D = {};
    "right" == y.horizontalAlignment ? D.right = 100 * (z - A.left - A.width - C) / z + "%" : D.left = 100 * (A.left - C) / z + "%";
    "bottom" == y.verticalAlignment ? D.bottom = 100 * (B - A.top - A.height - C) / B + "%" : D.top = 100 * (A.top - C) / B + "%";
    return D;
}
function p(y, A) {
    var z;
    if (y && A) {
        40 === A.x && 19 === A.y ? z = 4 / 3 / (40 / 19) : 52 === A.x && 19 === A.y && (z = 16 / 9 / (52 / 19));
        if (z)
            return y.width / y.fontSize / z;
    }
}
function c(y, A, z, B, C, D, E) {
    for (var G = y.style, F = (0,
    n.CXa)(y.text), H = y.lineBreaks; H--; )
        F = "<br />" + F;
    return g(F, G, A, z, B, C, D, y.lang, E);
}
function g(y, A, z, B, C, D, E, G, F) {
    var H;
    H = A.characterStyle;
    C = C[H];
    H = 0 <= H.indexOf("MONOSPACE") ? p(C, A.cellResolution) || C.lineHeight : C.lineHeight;
    B = A.characterSize * B.height / (H || 1);
    G && "ja" === G.slice(0, 2) && A.ruby && "text" === A.ruby && (B /= 2);
    B = 0 < D ? (0,
    q.uX)(B * D) : (0,
    q.Tt)(B);
    D = {
        "font-size": B + "px",
        "line-height": "normal",
        "font-weight": "normal"
    };
    A.characterItalic && (D["font-style"] = "italic");
    A.characterUnderline && (D["text-decoration"] = "underline");
    A.characterColor && (D.color = A.characterColor);
    A.backgroundColor && 0 !== A.backgroundOpacity && (D["background-color"] = f(A.backgroundColor, A.backgroundOpacity));
    if (G && "ja" === G.slice(0, 2)) {
        if (A.textEmphasis) {
            B = A.textEmphasis;
            switch (B.textEmphasisShape) {
            case "auto":
                D["text-emphasis"] = "vertical-lr" === E || "vertical-rl" === E ? "filled sesame" : "filled circle";
                break;
            default:
                D["text-emphasis"] = B.textEmphasisFill + " " + B.textEmphasisShape;
            }
            F = h(B.textEmphasisPosition, F);
            switch (E) {
            case "vertical-rl":
                D["text-emphasis-position"] = w[F];
                break;
            case "vertical-lr":
                D["text-emphasis-position"] = x[F];
                break;
            default:
                D["text-emphasis-position"] = v[F];
            }
        }
        A.textCombine && (D["text-combine-upright"] = A.textCombine);
    }
    E = A.characterEdgeColor || "#000000";
    switch (A.characterEdgeAttributes) {
    case "DROP_SHADOW":
        D["text-shadow"] = E + " 0px 0px 7px";
        break;
    case "UNIFORM":
        D["text-shadow"] = "-1px 0px " + E + ",0px 1px " + E + ",1px 0px " + E + ",0px -1px " + E;
        break;
    case "RAISED":
        D["text-shadow"] = "-1px -1px white, 0px -1px white, -1px 0px white, 1px 1px black, 0px 1px black, 1px 0px black";
        break;
    case "DEPRESED":
        D["text-shadow"] = "1px 1px white, 0px 1px white, 1px 0px white, -1px -1px black, 0px -1px black, -1px 0px black";
    }
    E = (0,
    m.X$)(D);
    (z = z[A.characterStyle || "PROPORTIONAL_SANS_SERIF"]) && (E += ";" + z);
    z = A.characterOpacity;
    0 < z && 1 > z && (y = '<span style="opacity:' + z + '">' + y + "</span>");
    G && "ja" === G.slice(0, 2) ? (y = '<span lang="ja" style="' + E + '">' + y + "</span>",
    A.ruby && "text" === A.ruby && (y = "<rt>" + y + "</rt>")) : y = '<span style="' + E + '">' + y + "</span>";
    return y;
}
function f(y, A) {
    y = y.substring(1);
    y = parseInt(y, 16);
    return "rgba(" + (y >> 16 & 255) + "," + (y >> 8 & 255) + "," + (y & 255) + "," + (undefined !== A ? A : 1) + ")";
}
function e(y, A, z, B) {
    var C;
    C = "";
    y && "text" === y && (C = '<ruby style="ruby-position: ' + ("before" === A || "over" === A || "outside" === A && 0 === z ? "over" : "under") + "; " + B + '">');
    return C;
}
function h(y, A) {
    return y === u[0] || "outside" === y && 0 === A ? u[0] : u[1];
}
function k(y) {
    return y.replace(/(<ruby[\s\S]*?)(<br\s*\/?>+)([\s\S]*?<\/ruby>)/g, "$2$1$3");
}
function l(y) {
    return (y = y.match(/(font-size:\d+px)/)) ? y[0] : "";
}
export function Yyb(y, A, z, B, C) {
    var D, E, G, F, H, J, M;
    D = "";
    E = "";
    G = 0;
    F = "";
    H = false;
    J = "";
    M = "";
    y.textNodes.forEach(function(K) {
        var L, O, I, N;
        G += K.lineBreaks;
        I = c(K, z, A, B, C, y.region.writingMode, G);
        if (K.lang && "ja" === K.lang.slice(0, 2)) {
            if (K.style && K.style.ruby && "" != K.style.ruby && (K.style.ruby === r.zs && (M = l(I)),
            K.style.ruby !== r.Fb && (J += I),
            I = "",
            K.style.ruby === r.text)) {
                N = e(K.style.ruby, null !== (L = K.style.rubyPosition) && undefined !== L ? L : "outside", G, M);
                H = "" !== N;
                J = N + J;
            }
            !F || "" === F || K.style.ruby && "" !== K.style.ruby && K.style.ruby !== r.Fb || (J = k(J + (H ? "</ruby> " : "")),
            I = J + I,
            H = false,
            J = "");
        }
        D += I;
        F = null !== (O = K.style.ruby) && undefined !== O ? O : "";
        "" === E && K.style && K.style.shear && (E = "font-style: oblique " + -90 * parseFloat(K.style.shear) + "deg;");
    });
    "" !== J && (D += J + (H ? "</ruby> " : ""));
    y.region && y.region.multiRowAlignment && (D = '<span style="display:inline-block;' + E + "text-align:" + y.region.multiRowAlignment + '">' + D + "</span>");
    return D;
}
;
export function Nrc(y, A, z, B, C) {
    var D, E, F, H, J;
    D = "";
    E = C.width;
    C = C.height;
    for (var G = A.length; G--; ) {
        F = A[G];
        H = y[G];
        H = H && H.region;
        J = "position:absolute;background:" + B + ";width:" + (0,
        q.Tt)(F.width + 2 * z) + "px;height:" + (0,
        q.Tt)(F.height + 2 * z) + "px;";
        F = d(H, F, E, C, z);
        (0,
        n.Qi)(F, function(M, K) {
            J += M + ":" + K + ";";
        });
        D += '<div style="' + J + '"></div>';
    }
    return D;
}
;
export const Mrc = d;
export const Ied = p;
export const Ked = c;
export const Hed = g;
export const Jed = f;
export function Lrc(y) {
    var A;
    y = y.region;
    A = {
        display: "block",
        "white-space": "nowrap"
    };
    switch (y.horizontalAlignment) {
    case "left":
        A["text-align"] = "left";
        break;
    case "right":
        A["text-align"] = "right";
        break;
    default:
        A["text-align"] = "center";
    }
    "vertical-lr" === y.writingMode || "vertical-rl" === y.writingMode ? A["writing-mode"] = y.writingMode : "horizontal-tb" === y.writingMode && y.direction && (A.direction = y.direction);
    return (0,
    m.X$)(A);
}
;
export const Fcd = e;
export const udd = h;
export const ujd = k;
export const Pfd = l;
m = a(52569);
n = a(3887);
q = a(22365);
r = {
    Fb: "container",
    text: "text",
    zs: "base"
};
u = ["before", "after"] /* before */;
v = {
    before: "over right",
    after: "under right"
};
w = {
    before: "over right",
    after: "over left"
};
x = {
    before: "over left",
    after: "over right"
};

// Detected exports: Fcd, Hed, Ied, Jed, Ked, Lrc, Mrc, Nrc, Pfd, Yyb, udd, ujd
