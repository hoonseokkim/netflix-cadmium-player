/**
 * Netflix Cadmium Playercore - Module 42087
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b)
 *
 * Purpose: Error handling
 * Exports: rnb
 */

// Webpack module 42087
// Parameters: t, b

function a(d, p) {
    var c;
    c = this;
    this.j = d;
    this.va = p;
    this.IHb = -1;
    this.GBa = 0;
    this.XAb = [];
    this.k4c = function(g, f) {
        var e, h, k;
        c.RRa = undefined;
        g = null !== (h = null === (e = c.j.jc) || undefined === e ? undefined : e.XA(false)) && undefined !== h ? h : 0;
        c.IHb === f.mediaTime ? c.GBa++ : c.GBa = 0;
        c.IHb = f.mediaTime;
        if (0 === f.mediaTime)
            return c.requestVideoFrameCallback();
        3 < c.GBa && g >= 1E3 * f.mediaTime + c.B1a && (c.XAb.push(f.mediaTime),
        c.GBa = 0,
        f = c.j.jc.XA(false),
        e = f + c.B1a,
        c.va.error("freeze detected, seek forward", {
            currentTime: f,
            newMediaTime: e,
            oneFrameInMs: c.B1a
        }),
        null === (k = c.j.jc) || undefined === k ? undefined : k.seek(e, true));
        c.requestVideoFrameCallback();
    }
    ;
}
export const rnb = undefined;
a.prototype.SZc = function() {
    this.requestVideoFrameCallback();
}
;
a.prototype.requestVideoFrameCallback = function() {
    var d, p;
    p = null === (d = this.j.jc) || undefined === d ? undefined : d.Ja;
    p && undefined !== this.RRa && p.cancelVideoFrameCallback && p.cancelVideoFrameCallback(this.RRa);
    p && p.requestVideoFrameCallback && (this.RRa = p.requestVideoFrameCallback(this.k4c));
}
;
Ha.Object.defineProperties(a.prototype, {
    B1a: {
        configurable: true,
        enumerable: true,
        get: function() {
            var d, p;
            if (this.CUa)
                return this.CUa;
            if (null === (d = this.j.ig.value) || undefined === d ? 0 : d.framerate)
                this.CUa = Math.ceil(1E3 / this.j.ig.value.framerate);
            return null !== (p = this.CUa) && undefined !== p ? p : 0;
        }
    }
});
export const rnb = a;

// Detected exports: rnb
