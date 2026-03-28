/**
 * Netflix Cadmium Playercore - Module 74528
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: wlb
 * Dependencies: 4574, 18797, 22970, 60514
 * Purpose: Logging, Error handling, Playback control, Class definition
 */

// import dep_4574 from './Module_4574.js';
// import dep_18797 from './Module_18797.js';
// import dep_22970 from './Module_22970.js';
// import dep_60514 from './Module_60514.js';

// Webpack module 74528
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(18797);
c = a(60514);
g = a(4574);
t = (function() {
    class f {
    constructor(e, h) {
        this.ya = e;
        this.FQ = h;
    }
    X1a(e, h) {
        return d.__awaiter(this, undefined, undefined, function() {
            var k, l, m, n, q, r, u, v, w;
            w = this;
            return d.__generator(this, function() {
                k = this;
                l = 0;
                m = [];
                n = h.defaultStyle ? [h.defaultStyle] : [];
                q = h.lang ? [h.lang] : [];
                r = e.xml.lastIndexOf("/p>") + 3;
                u = e.xml.slice(e.NS, r);
                k.ya.debug(u);
                v = c.We(true);
                return [2, new Promise(function(x, y) {
                    v.onerror = function(A) {
                        A.xml = u;
                        y(A);
                    }
                    ;
                    v.onend = function() {
                        x(m);
                    }
                    ;
                    v.ontext = function(A) {
                        ("" !== A.trim() || A.match(/ +/)) && (0,
                        p.Ud)((0,
                        p.Ud)(m).blocks).textNodes.push({
                            text: A.match(/ +/) ? A : A.trim(),
                            style: (0,
                            p.Ud)(n),
                            lang: (0,
                            p.Ud)(q),
                            lineBreaks: l
                        });
                        l = 0;
                    }
                    ;
                    v.onclosetag = function() {
                        var A;
                        A = v.tag;
                        "undefined" !== typeof A.attributes.style && n.pop();
                        "undefined" !== typeof A.attributes["xml:lang"] && q.pop();
                    }
                    ;
                    v.onopentag = function(A) {
                        var z, B;
                        z = A.attributes;
                        A = A.name;
                        if ("p" === A) {
                            l = 0;
                            A = e.M.toString() + "_" + z["xml:id"];
                            z.style && n.push(z.style);
                            z["xml:lang"] && q.push(z["xml:lang"]);
                            B = (0,
                            g.wL)(z.begin);
                            0 === m.length || (0,
                            p.Ud)(m).displayTime !== B ? (z = w.wRa(A, 0, z, e.iz),
                            z.segId = e.M,
                            m.push(z)) : (0,
                            p.Ud)(m).blocks.push({
                                textNodes: [],
                                region: z.region,
                                id: A,
                                extent: z["tts:extent"] || null,
                                origin: z["tts:origin"] || null
                            });
                        } else
                            "span" === A ? (n.push(z.style),
                            z["xml:lang"] && q.push(z["xml:lang"]),
                            A = h.styles[z.style],
                            z.style && A && A.ruby && 0 <= ["container", "baseContainer", "textContainer"] /* container */.indexOf(A.ruby) && (0,
                            p.Ud)((0,
                            p.Ud)(m).blocks).textNodes.push({
                                text: "",
                                style: (0,
                                p.Ud)(n),
                                lang: (0,
                                p.Ud)(q),
                                lineBreaks: 0
                            })) : "br" === A && l++;
                    }
                    ;
                    v.write("<entries>").write(u).write("</entries>").close();
                }
                )];
            });
        });
    }
    psa(e, h) {
        return p.psa.call(this, e, h);
    }
    tqa(e, h) {
        return p.tqa.call(this, e, h);
    }
    wRa(e, h, k, l) {
        var m;
        m = {};
        m.id = e;
        m.startTime = (0,
        g.wL)(k.begin || "") - l;
        m.endTime = (0,
        g.wL)(k.end || "") - l;
        m.style = k.style;
        m.region = k.region;
        m.displayTime = m.startTime;
        m.duration = m.endTime - m.startTime;
        m.extent = k["tts:extent"] || null;
        m.origin = k["tts:origin"] || null;
        m.latestEndSoFar = h > m.endTime ? h : m.endTime;
        m.blocks = [{
            textNodes: [],
            region: m.region,
            id: e,
            extent: m.extent || null,
            origin: m.origin || null
        }];
        return m;
    }
}
return f;
}
)();
export const wlb = t;

// Detected exports: wlb
