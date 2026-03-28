/**
 * Netflix Cadmium Playercore - Module 98561
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: Cfb
 * Dependencies: 2415, 22970, 48170, 91176, 99548
 * Purpose: Buffer/Segment management, Logging, Configuration, Error handling
 */

// import dep_2415 from './Module_2415.js';
// import dep_22970 from './Module_22970.js';
// import dep_48170 from './Module_48170.js';
// import dep_91176 from './Module_91176.js';
// import dep_99548 from './Module_99548.js';

// Webpack module 98561
// Parameters: t (module), b (exports), a (require)

var d, p, c, g;

d = a(22970);
p = a(91176);
c = a(48170);
t = a(2415);
g = a(99548);
a = (function(f) {
    class e extends f {
    constructor(h) {
        return f.call(this, h) || this;
    }
    dTb() {
        return this.splice ? true : this.K ? 0 !== this.K.Va : false;
    }
    VN(h, k) {
        c.u && this.console.trace("LivePipelineNormalizer.renormalize:", this.wa);
        (0,
        p.assert)(this.qM, "expected to be called init() before renormalize");
        k = (0,
        g.Hga)(this.console, this.config, this.L, k) || k;
        return f.prototype.VN.call(this, h, k);
    }
    E0a() {
        var h, k, l, m, n, q, r, w, x;
        c.u && this.console.trace(("LivePipelineNormalizer.normalizePipelines ").concat(this.qa.ca(), " ") + ("- ").concat(null === (k = this.wa) || undefined === k ? undefined : k.ca()));
        this.config.tV && undefined !== this.L.Rh.endTime && (k = null === (l = this.oe.wr) || undefined === l ? undefined : l.ma,
        (null === k || undefined === k ? 0 : k.parent) || this.L.K5a(this.qa.G));
        l = this.dTb() ? p.I.uh : this.L.Cn();
        this.qa = (0,
        g.zza)(this.console, l, this.L, this.qa);
        this.wa = (0,
        g.Hga)(this.console, this.config, this.L, this.wa);
        if ((l = this.oe.wr) && l.track.pB) {
            l = l.track.pB;
            k = l.track.Qo;
            q = l.track.Tj.Rc(l.O);
            k += Math.floor(this.qa.Af(q));
            k = l.track.Du(k);
            l = k.qa;
            k = k.wa;
            r = [];
            null === (m = this.L.cg) || undefined === m ? undefined : m.model.Il.forEach(function(A) {
                A.Yk && r.push(A.Yk.Ga);
                A.Xk && r.push(A.Xk.Ga);
            });
            null === (n = this.L.cg) || undefined === n ? undefined : n.model.cc.forEach(function(A) {
                var z;
                z = A.Ga;
                A = A.duration;
                r.push(z);
                r.push(z.add(A));
            });
            r.sort(function(A, z) {
                return A.xl(z);
            });
            m = p.I.uh;
            n = undefined;
            try {
                for (var u = d.__values(r), v = u.next(); !v.done; v = u.next()) {
                    w = v.value;
                    if (w.equal(this.qa)) {
                        n = w;
                        break;
                    }
                    if (w.$f(k))
                        break;
                    if (w.$f(l)) {
                        x = p.I.abs(w.da(this.qa));
                        x.lessThan(m) && (m = x,
                        n = w);
                    }
                }
            } catch (A) {
                var y;
                y = {
                    error: A
                };
            } finally {
                try {
                    v && !v.done && (h = u.return) && h.call(u);
                } finally {
                    if (y)
                        throw y.error;
                }
            }
            n ? (c.u && this.console.trace("LivePipelineNormalizer.normalizePipelines normalize contentStartTimestamp to SCTE marker, " + ("original: ").concat(this.qa.ca(), ", ") + ("SCTE marker: ").concat(n.ca())),
            this.qa = n) : (c.u && this.console.trace("LivePipelineNormalizer.normalizePipelines normalize contentStartTimestamp to segmentContentStartTimestamp (no SCTE marker in the segment), " + ("original: ").concat(this.qa.ca(), ", ") + ("segmentContentStartTimestamp: ").concat(l.ca())),
            this.qa = l);
        }
        return f.prototype.E0a.call(this);
    }
    F0a() {
        var h, k, l;
        c.u && this.console.trace("LivePipelineNormalizer.normalizeSegment");
        (0,
        p.assert)(this.K, "missing segment");
        k = this.dTb() ? p.I.uh : this.L.Cn();
        l = (0,
        g.zza)(this.console, k, this.L, this.K.nb);
        c.u && this.console.trace("normalizeSegment, " + ("segment.startTimestamp: ").concat(null === (h = this.K) || undefined === h ? undefined : h.nb.ca(), ", ") + ("liveEdgeConstraint: ").concat(k, ", ") + ("segmentStartTimestamp: ").concat(l.ca()));
        return this.Rxb(l);
    }
}
d.return e;
}
)(t.bJa);
export const Cfb = a;

// Detected exports: Cfb
