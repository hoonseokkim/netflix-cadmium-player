/**
 * Netflix Cadmium Playercore - Module 53754
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: Ygb
 */

// Webpack module 53754
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l;
function d(m) {
    var q, r;
    function n() {
        q.n9 = new k.Gmb();
        return q.n9;
    }
    (0,
    p.An)("MediaSourceASE").trace("Inside MediaSourceASE");
    q = this;
    r = m.Kxc();
    q.apb = r;
    q.readyState = l.he.CLOSED;
    q.addSourceBuffer = function(u) {
        return u === h.l.Ea ? n() : r.addSourceBuffer(u);
    }
    ;
    q.I9 = function(u) {
        u.includes(h.l.Ea) && n();
        return r.I9(u);
    }
    ;
    q.removeSourceBuffer = function(u) {
        if (u.mediaType === h.l.Ea)
            q.n9 = undefined;
        else
            return ((0,
            e.ta)(u.mediaType === h.l.Ea, "Unexpected removeSourceBuffer. Only TEXT is expected to ever be removed."),
            r.removeSourceBuffer(u));
    }
    ;
    q.Hh = function(u) {
        q.n9 = undefined;
        r.Hh(u);
    }
    ;
    q.duration = undefined;
    this.readyState = l.he.OPEN;
    this.Fg = c.Za.get(g.Um).Hea(l.Fg, {});
    m = new f.EventEmitter();
    m.on("subtitleData", function(u) {
        (0,
        e.ta)(r.j.oa.yc, "Unexpected AseSubtitleEvent. No current timedTextTrack.");
        r.j.oa.yc.v3a(u);
    });
    this.events = m;
}
export const Ygb = undefined;
p = a(31276);  // import from Module_31276
c = a(31276);  // import from Module_31276
g = a(74870);  // import from Module_74870
f = a(90745);  // import from Module_90745
e = a(45146);  // import from Module_45146
h = a(45247);  // import from Module_45247
k = a(91515);  // import from Module_91515
Object.defineProperty(d.prototype, "sourceBuffers", {
    get: function() {
        return this.n9 ? this.apb.sourceBuffers.concat(this.n9) : this.apb.sourceBuffers;
    }
});
Object.defineProperty(d.prototype, "duration", {
    get: function() {
        return this.D8;
    },
    set: function(m) {
        var n;
        this.D8 = m || Infinity;
        n = Math.floor(1E3 * m) || Infinity;
        this.sourceBuffers.forEach(function(q) {
            q.D8 = n;
        });
    }
});
l = {
    he: {
        CLOSED: 0,
        OPEN: 1,
        Ix: 2,
        name: ["CLOSED", "OPEN", "ENDED"]  /* config: CLOSED = "OPEN", "ENDED" */
    },
    Fg: {
        cic: true,
        oKc: true
    }
};
b.Ygb = Object.assign(d,

// Detected exports: Ygb
