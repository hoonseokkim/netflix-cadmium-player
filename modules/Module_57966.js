/**
 * Netflix Cadmium Playercore - Module 57966
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 57966
// Parameters: t (module), b (exports), a (require)

var d, p, c, g, f;

d = a(79048);
p = a(66164);
c = a(91176);
g = a(48170);
f = a(52571);
t = (function() {
    function e(h, k, l, m, n, q, r) {
        this.config = h;
        this.console = k;
        this.za = l;
        this.od = m;
        this.cn = n;
        this.Eh = q;
        this.t4c = r;
        this.console = (0,
        c.Nf)(p.platform, this.console, "ADBREAKHYDRATIONPOLICY");
    }
    e.prototype.asc = function(h) {
        var k, l, m, n, q, r, u, v;
        k = this;
        l = false;
        if (!this.od.Gw())
            return {
                fW: l,
                xF: h
            };
        m = true;
        n = [];
        q = [];
        u = this.za.TS.Ib;
        h.SL(function(w, x) {
            var y, A, z, B, C, D;
            if (!(x || !w.K.IYa || k.CEc() && k.od.XSb(k.za.Fm)))
                return (k.console.trace("Hydration: Not checking root segment"),
                true);
            A = u.get(w.K.id);
            (0,
            f.assert)(A, "Hydration: Segment must be present in innermost playgraph");
            z = A.J;
            B = false;
            if (A.type && -1 < [d.ed.vc, d.ed.padding].indexOf(A.type))
                B = true;
            else {
                C = u.zI(A.id);
                C && (C = k.za.Ib.get(C)) && C.J !== A.J && (k.console.trace("Hydration: segment evaluated is a content playgraph modification, get viewableId from equivalent segment. " + ("auxiliary viewableId: ").concat(A.J, ", ") + ("main content viewableId: ").concat(C.J)),
                z = C.J);
            }
            if (B) {
                if ((B = k.XWa(A),
                C = k.za.Ib.z_a({
                    offset: c.I.ia,
                    M: A.id
                }),
                g.u && k.console.log("Checking Parent location for adBreak", {
                    M: A.id,
                    startTime: A.Va,
                    knd: null === B || undefined === B ? undefined : B.id,
                    Xmd: null === C || undefined === C ? undefined : C.offset.ca()
                }),
                B && C)) {
                    z = B.J;
                    D = k.Eh.OUa(z, C.offset.add(B.nb));
                }
            } else
                (g.u && k.console.log("Checking current location for adbreak", {
                    M: A.id,
                    startTime: A.Va
                }),
                D = k.Eh.OUa(z, A.nb));
            D && g.u && k.console.log("Found adbreak at location", {
                startTime: A.Va,
                M: A.id,
                sj: D.sj,
                De: D.De,
                ah: D.ah
            });
            if (D && !D.ah) {
                g.u && k.console.log("Found adbreak at location", {
                    startTime: A.Va,
                    M: A.id,
                    sj: D.sj,
                    De: D.De
                });
                B = k.Uwc(D, A);
                C = B.MB;
                g.u && k.console.log("Got hydration context", {
                    M: A.id,
                    context: B
                });
                if (B.sj)
                    if (D.k4)
                        k.console.trace("Hydration: Ignore skippable unhydrated ad break");
                    else if ((A = null === (y = null === x || undefined === x ? undefined : x.ma) || undefined === y ? undefined : y.duration,
                    k.od.KFc && A && 5E3 > A))
                        (k.console.trace("Hydration: Skipping unhydrated ad break too close to previous"),
                        C = true);
                    else {
                        if (m && 0 === q.length || r === x)
                            (q.push({
                                J: z,
                                Sa: D,
                                cda: B.cda
                            }),
                            r = x);
                        if (B.cda)
                            return (n.push(w),
                            false);
                    }
                C && (g.u && k.console.log("marking MissedOpportunity"),
                D.MB = true);
                g.u && k.console.log("Not Blocking branch progression");
                m = false;
                if (B.cda)
                    return (g.u && k.console.log("Hydration: Blocking further branches"),
                    false);
            } else
                g.u && k.console.log("Could not find adbreak for segment", {
                    startTime: A.Va,
                    M: A.id
                });
            return true;
        });
        l || (l = 0 < n.length);
        n.forEach(function(w) {
            return h.remove(w);
        });
        this.cn.Aza(q);
        if (this.config.CTc && h.root) {
            v = u.get(h.root.K.id);
            (0,
            f.assert)(v, "root segment must exist in innermost playgraph");
            (v = this.Eh.OUa(v.J, v.nb)) && v.k4 && (v.k4 = false);
        }
        return {
            fW: l,
            xF: h
        };
    }
    ;
    e.prototype.XWa = function(h) {
        h = this.za.Ib.$M(h.id);
        return this.za.Ib.QI.get(h);
    }
    ;
    e.prototype.Uwc = function(h, k) {
        var l, m, n, q, r, u;
        n = this.za.Io;
        q = h.ZSb;
        r = h.ZSb;
        u = false;
        (k = this.XWa(k)) && q && (k = this.t4c.get(k.J),
        (0,
        f.assert)(k, "AdBreakHydrationPolicy::getHydratableContext: main aseViewable should exist"),
        k.Ab && (null === (m = null === (l = k.S) || undefined === l ? undefined : l.wd) || undefined === m ? 0 : m.Uj) && (r && (r = n),
        this.config.fgc || r || (m = k.Ic,
        l = c.I.Ca(m.Al(true)),
        m = m.Jpa(l),
        n = l.G - h.Ga.G,
        n < this.config.IGc && (r = q = false,
        u = true,
        g.u && this.console.log("Hydration: Too close to live edge", {
            m_a: new Date(m.G),
            Vhd: n,
            did: l.ca(),
            Sa: h.Ga.ca()
        })))));
        return {
            sj: q,
            cda: r,
            MB: u
        };
    }
    ;
    e.prototype.CEc = function() {
        return !this.za.player.Hw && this.za.Io;
    }
    ;
    return e;
}
)();
export const A9a = t;

// Detected exports: A9a