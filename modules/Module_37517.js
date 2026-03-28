/**
 * Netflix Cadmium Playercore - Module 37517
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: z
 * Dependencies: 29204, 31276, 36129, 51344, 61726, 85001, 94025
 * Purpose: Encryption/Decryption, Logging, Event handling, Configuration
 */

// import dep_29204 from './Module_29204.js';
// import dep_31276 from './Module_31276.js';
// import dep_36129 from './Module_36129.js';
// import dep_51344 from './Module_51344.js';
// import dep_61726 from './Module_61726.js';
// import dep_85001 from './Module_85001.js';
// import dep_94025 from './Module_94025.js';

// Webpack module 37517
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k;
class d {
    constructor(l, m, n, q, r, u, v, w, x, y) {
    var A;
    A = this;
    this.S1c = l;
    this.j = m;
    this.id = n;
    this.height = q;
    this.width = r;
    this.hPc = u;
    this.iPc = v;
    this.size = w;
    this.iB = x;
    this.urls = y;
    this.type = p.mj.R7a;
    this.retry = true;
    this.state = e.dA.dla;
    this.Bj = {};
    this.yoa = {};
    this.Kfa = function(z) {
        if (z.success)
            try {
                A.data = A.S1c.parse(z.content);
                A.state = e.dA.EP;
                A.log.trace("TrickPlay parsed", {
                    Images: A.data.images.length
                }, A.Bj);
                A.j.fireEvent(h.ja.lia);
            } catch (B) {
                A.state = e.dA.fib;
                A.log.error("TrickPlay parse failed.", B);
            }
        else
            (A.state = e.dA.dla,
            A.log.error("TrickPlay download failed.", (0,
            k.eG)(z), A.Bj));
    }
    ;
    this.log = (0,
    g.Fo)(m, "TrickPlay");
}
    Mwc(l) {
    if (this.data && (this.iB && (l += this.iB),
    l = Math.floor(l / this.data.header.cVb),
    0 <= l && l < this.data.images.length))
        return {
            image: this.data.images[l],
            time: l * this.data.header.cVb,
            height: this.height,
            width: this.width,
            pixelAspectHeight: this.hPc,
            pixelAspectWidth: this.iPc
        };
}
    N0() {
    switch (this.state) {
    case e.dA.EP:
        return "downloaded";
    case e.dA.LOADING:
        return "loading";
    case e.dA.s7:
        return "downloadfailed";
    case e.dA.fib:
        return "parsefailed";
    default:
        return "notstarted";
    }
}
    download() {
    var l;
    l = this.MDb();
    l ? (this.state = e.dA.LOADING,
    this.Yoc(l)) : this.retry = false;
}
    getState() {
    return this.state;
}
    MDb() {
    var l, m, n;
    l = this;
    m = Object.keys(this.urls).find(function(q) {
        return (l.yoa[l.urls[q]] || 0) <= c.config.O1c;
    });
    if (m) {
        n = this.urls[m];
        (n in this.yoa) ? this.yoa[n]++ : this.yoa[n] = 1;
        return {
            url: n,
            Gk: m
        };
    }
}
    Yoc(l) {
    var m, n;
    this.log.trace("Downloading", l.url, this.Bj);
    n = this.csa(l.Gk);
    l = {
        responseType: f.Lca,
        Yc: n,
        url: l.url,
        track: {
            type: this.type,
            ob: this.id
        },
        ox: null !== (m = null === n || undefined === n ? undefined : n.type) && undefined !== m ? m : "unknown",
        EL: "trickplay"
    };
    this.j.tta.download(l, this.Kfa);
}
    csa(l) {
    return this.j.di.find(function(m) {
        return m && m.id === l;
    });
}
}
p = a(51344);
c = a(29204);
g = a(31276);
f = a(61726);
e = a(94025);
h = a(85001);
k = a(36129);
export const z = d;

// Detected exports: z
