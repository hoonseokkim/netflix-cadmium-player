/**
 * Netflix Cadmium Playercore - Module 27265
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Nfb
 * Dependencies: 8149, 11758, 22970, 26388, 45691, 48170, 91176
 * Purpose: Video handling, Buffer/Segment management, Logging, Configuration
 */

// import dep_8149 from './Module_8149.js';
// import dep_11758 from './Module_11758.js';
// import dep_22970 from './Module_22970.js';
// import dep_26388 from './Module_26388.js';
// import dep_45691 from './Module_45691.js';
// import dep_48170 from './Module_48170.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 27265
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f, e, h;

d = a(22970);
p = a(26388);
c = a(91176);
g = a(48170);
f = a(11758);
e = a(8149);
h = a(45691);
t = (function(k) {
    class l extends k {
    constructor(m, n, q, r, u, v, w, x) {
        n = k.call(this, m, n, q, r, u, v, w, x) || this;
        n.me = m;
        return n;
    }
    sR(m, n, q) {
        var r;
        r = this.config;
        g.u && this.console.trace("LiveRequestManager: createRequest, params:", m);
        (0,
        c.assert)(!m.header);
        if (q.mediaType === p.l.Ea)
            return (m = new f.KCa(q,this.ma.wJ.track,m,this.Ta,this.ma.K,r,this.console,this.Csa),
            g.u && this.console.trace("created AseLiveTextRequest object:", m && m.toJSON(), "downloadTrack:", n.toString(), "movieId:", m.R, "streamId:", m.Oa, "offset:", m.offset, "bytes:", m.la, "contentStartTicks:", m.Cb, "contentEndTicks:", m.Pb, "ptsOffsetTicks:", m.Xp, "liveSegmentId:", m.ji),
            this.by(m),
            m);
        n = k.prototype.sR.call(this, m, n, q);
        n instanceof h.nja || this.me.BUa(n);
        return n;
    }
    C1a(m, n, q, r) {
        (0,
        c.assert)((0,
        e.dk)(m.stream), "LiveRequestManager: onfragmenttimes: stream is not live");
        m.xn && m.stream.track.b1a(this.ma, m.index, n) && m.Df !== n.Me && (this.console.warn("LiveRequestManager: onfragmenttimes: predicted fragment sample count incorrect", ("current = ").concat(m.Df, ", actual = ").concat(n.Me)),
        m.d8a(n.Me),
        q = true);
        r && ((0,
        c.assert)(this.mediaType === p.l.U, "LiveRequestManager: onfragmenttimes: fragmentEditChanged only expected for video"),
        (0,
        c.assert)(m.xn || m.Si, "LiveRequestManager: onfragmenttimes: fragmentEditChanged only expected for first or last request"),
        m.xn ? this.me.d3c(m) : m.Si && this.me.c3c(m));
        q && (n = this.Ta.indexOf(m),
        n + 1 < this.Ta.length && (n = this.Ta.get(n + 1)) && n.vWb(m.l0),
        this.Ta.update());
        this.me.BUa(m);
    }
    dW() {
        var m, n;
        m = this;
        g.u && this.console.trace(("LiveRequestManager: updateFragmentTimes ").concat(this.Ta.length, " fragments"));
        if (this.Ta.length) {
            n = this.Ta.get(0).stream.track;
            (0,
            c.assert)((0,
            e.Gn)(n), "LiveRequestManager: updateFragmentTimes: stream is not live");
            this.Ta.forEach(function(q) {
                var r, u;
                r = n.Du(q.index);
                u = r.qa;
                r = r.wa;
                g.u && m.console.trace("LiveRequestManager: update timestamps:", q, ("updating start ").concat(q.qa.ca(), " to ").concat(u.ca()), ("updating end ").concat(q.wa.ca(), " to ").concat(r.ca()));
                q.sia(u, r, false);
            });
            this.Ta.update();
        }
    }
}
d.return l;
}
)(a(99021).eKa);
export const Nfb = t;

// Detected exports: Nfb
