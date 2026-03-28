/**
 * Netflix Cadmium Playercore - Module 72160
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: qCa
 * Dependencies: 4203, 5021, 22674, 22970, 30869, 49917, 80966, 81918
 * Purpose: Encryption/Decryption, Logging, Event handling, Configuration
 */

// import dep_4203 from './Module_4203.js';
// import dep_5021 from './Module_5021.js';
// import dep_22674 from './Module_22674.js';
// import dep_22970 from './Module_22970.js';
// import dep_30869 from './Module_30869.js';
// import dep_49917 from './Module_49917.js';
// import dep_80966 from './Module_80966.js';
// import dep_81918 from './Module_81918.js';

// Webpack module 72160
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k;
class d {
    constructor(l, m, n, q, r, u, v) {
    this.context = l;
    this.log = m;
    this.Qa = n;
    this.config = q;
    this.$a = r;
    this.oac = u;
    this.iac = v;
    this.u5a = {};
    this.nr = new Set();
    this.TZa = Math.floor(Math.random() * this.config().TZa);
}
    DWc(l, m, n) {
    var q, r, u, v, w;
    q = this;
    u = l.event;
    if (Object.values(k.z9a).includes(u)) {
        v = m.kI ? m.kI.na(f.Ba) : -1;
        w = {
            href: m.S.Kp.A0("events").href,
            rf: m.S.Aa.rf,
            Ia: this.context.Ia.toString(),
            event: u,
            ay: l.ay,
            hb: l.hb,
            Wv: l.Wv,
            LH: l.LH,
            lOa: l.eu,
            position: l.ii.offset.G,
            al: v,
            XB: {},
            sH: this.Qa.kJ.na(f.Ba),
            appId: this.config().appId || this.$a.id,
            sessionId: this.config().sessionId || this.$a.id,
            gOa: l.gOa,
            vfa: l.vfa,
            fOa: l.fOa,
            q_a: null === (r = m.S) || undefined === r ? undefined : r.Aa.de,
            vn: l.vn,
            Xe: m.Xe.value
        };
        this.jzb(m, n, function() {
            q.iac.ef({
                log: q.log,
                J: m.R
            }, w).catch(function(x) {
                q.log.error("Failed to send event", {
                    eventKey: u,
                    xid: m.Ia,
                    error: x
                });
            });
        });
    } else
        this.log.debug("Ignoring unsupported event " + l.event);
}
    EWc(l, m, n, q) {
    var r, u, v, w, x, y;
    r = this;
    v = l.event;
    if (Object.values(k.pCa).includes(v)) {
        w = l.S.links.events.href;
        x = l.S.rf;
        this.u5a[l.al] || (this.u5a[l.al] = this.Qa.rbc((0,
        f.pc)(l.al)).na(f.Ba));
        y = {
            href: w,
            rf: x,
            Ia: this.context.Ia.toString(),
            event: v,
            ay: l.ay,
            hb: l.hb,
            Wv: l.Wv,
            LH: l.LH,
            lOa: l.eu,
            position: l.ii.offset.G,
            oOa: l.oOa,
            al: this.u5a[l.al],
            XB: l.XB,
            sH: this.Qa.kJ.na(f.Ba),
            appId: this.config().appId || this.$a.id,
            sessionId: this.config().sessionId || this.$a.id,
            q_a: null === (u = m.S) || undefined === u ? undefined : u.Aa.de,
            Y0c: null !== n && undefined !== n ? n : undefined,
            vn: l.vn,
            Xe: m.Xe.value
        };
        this.jzb(m, q, function() {
            r.oac.ef({
                log: r.log,
                J: m.R
            }, y).catch(function(A) {
                r.log.error("Failed to send event", {
                    eventKey: v,
                    xid: r.context.Ia,
                    error: A
                });
            });
        });
    } else
        this.log.debug("Ignoring unsupported event " + l.event);
}
    Ptc() {
    this.nr.forEach(function(l) {
        l();
    });
}
    jzb(l, m, n) {
    var q, r, u;
    q = this;
    l = l.Hc.Da && !m ? this.TZa : 0;
    if (0 < l) {
        r = function() {
            Da.clearTimeout(u);
            q.nr.delete(r);
            n();
        }
        ;
        u = Da.setTimeout(r, l);
        this.nr.add(r);
    } else
        n();
}
}
t = a(22970);
p = a(22674);
c = a(81918);
g = a(30869);
f = a(5021);
e = a(4203);
h = a(49917);
k = a(80966);
a = d;
export const qCa = a;
export const qCa = a = t.__decorate([t.__param(2, (0,
p.v)(g.Yi)), t.__param(3, (0,
p.v)(e.Pc)), t.__param(4, (0,
p.v)(c.re)), t.__param(5, (0,
p.v)(h.oCa)), t.__param(6, (0,
p.v)(h.mCa))], a);

// Detected exports: qCa
