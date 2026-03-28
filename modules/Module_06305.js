/**
 * Netflix Cadmium Playercore - Module 6305
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Adaptive bitrate selection
 * Exports: Q6c, MediaStream
 */

// Webpack module 6305
// Parameters: t (module), b (exports), a (require)

var p, c, g;
function d(f, e, h, k, l, m, n, q, r, u, v) {
    this.track = f;
    this.type = e;
    this.ob = h;
    this.bitrate = k;
    this.Wb = l;
    this.size = m;
    this.KSa = n;
    this.Zc = q;
    this.framerate = r;
    this.Nk = u;
    this.gl = v;
    this.Bj = {
        Type: e,
        Bitrate: k,
        DownloadableId: h
    };
}
export const MediaStream = undefined;
export function Q6c(f, e, h, k, l) {
    if (f == p.Rka || f === g.mj.audio)
        return e;
    if (f == p.B7 || f === g.mj.video)
        return h;
    if (f == g.mj.zJ)
        return k;
    if (f == g.mj.R7a)
        return l;
}
;
p = a(33096);  // import from Module_33096
c = a(32687);  // import from Module_32687
g = a(51344);  // import from Module_51344
d.prototype.toJSON = function() {
    return this.Bj;
}
;
d.prototype.fYc = function(f, e, h, k) {
    (0,
    c.gd)(f) && (0,
    c.gd)(e) && (this.width = f,
    this.height = e,
    (0,
    c.wc)(h) && (0,
    c.wc)(k) && (this.width = Math.round(h / k * f)),
    this.Bj.Resolution = (this.width || "") + ":" + (this.height || ""));
}
;
d.prototype.jXc = function(f, e, h, k, l, m) {
    (0,
    c.gd)(f) && (0,
    c.gd)(e) && (0,
    c.gd)(h) && (0,
    c.gd)(k) && (this.ORa = f,
    this.rwb = e,
    this.qwb = h,
    this.pwb = k);
    (0,
    c.gd)(l) && (0,
    c.gd)(m) && (this.FNb = l,
    this.GNb = m);
}
;
b.MediaStream =

// Detected exports: Q6c, MediaStream
