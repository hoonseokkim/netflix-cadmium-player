/**
 * Netflix Cadmium Playercore - Module 5483
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: mlb
 * Dependencies: 48170, 52571, 91176
 * Purpose: Audio handling, Logging, Configuration, Error handling
 */

// import dep_48170 from './Module_48170.js';
// import dep_52571 from './Module_52571.js';
// import dep_91176 from './Module_91176.js';

// Webpack module 5483
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(91176);
p = a(52571);
c = a(48170);
t = (function() {
    class g {
    constructor(f, e) {
        this.config = f;
        this.console = e;
        this.ku = d.I.ia;
    }
    yt(f) {
        (0,
        p.assert)(f.Ha, "SeamlessAudio: stream.frameDuration must exist.");
        this.Ha = f.Ha;
        f = f.profile;
        this.Vva = this.Mxc(f, this.Ha);
        this.Eva = this.Ixc(f, this.Ha);
        this.R0 = -1 !== this.config.nsb.indexOf(f);
    }
    append(f, e) {
        var h, k, l, m, n;
        if (f.Ih)
            return f;
        h = f.Na;
        k = f.offset;
        l = f.Sh;
        l = undefined === l ? [] : l;
        f = f.qf;
        m = e.b2;
        e = e.p0a;
        n = this.uNb || (this.MM ? m : undefined);
        n && (n = this.UJc(h, n),
        h.pa && !this.R0 && this.uPa(n) ? (c.u && this.console.trace("SeamlessAudio: dropping first frame"),
        h.PSa(1),
        this.ku = n) : (this.ku = n.add(this.Ha),
        this.Bsb(this.ku) || (c.u && this.console.trace("SeamlessAudio: cannot maintain seamlessness at " + h.Vb.ca() + " error would be " + this.ku.ca() + " (editing " + (h.pa ? "" : "not ") + "allowed)"),
        l.push({
            type: "logdata",
            target: "endplay",
            fields: {
                avsyncreset: {
                    type: "array",
                    value: {
                        id: h.Oa,
                        pts: h.qa.G
                    }
                }
            }
        }),
        this.ku = d.I.ia,
        f = false)),
        this.uNb = undefined);
        if (h.Si || h.AB)
            ((0,
            p.assert)(m, "SeamlessAudio.append(): mediaSplicePlayerTimestamp is undefined"),
            !h.pa || !e && h.AB || (n = this.VJc(h, m, e),
            e && this.R0 && n.$f(this.Ha) ? (c.u && this.console.trace("SeamlessAudio: dropping last two frames"),
            h.Kqa(2)) : n.$f(d.I.ia) && (c.u && this.console.trace("SeamlessAudio: dropping last frame"),
            h.Kqa(1))),
            this.uNb = m);
        (0,
        p.assert)(this.Bsb(this.ku));
        this.MM = h.Sb;
        c.u && this.console.trace("SeamlessAudio: splice: " + (null === m || undefined === m ? undefined : m.ca()) + " c: " + h.qa.ca() + " - " + h.wa.ca() + " av sync offset: " + this.ku.ca() + " pts offset: " + k.add(this.ku).ca() + " p: " + h.qa.add(k).add(this.ku).ca() + " - " + h.wa.add(k).add(this.ku).ca());
        return {
            Na: h,
            offset: k.add(this.ku),
            qf: f,
            Ih: 0 === h.Me,
            Sh: l.length ? l : undefined
        };
    }
    VJc(f, e, h) {
        var k;
        if (h)
            k = this.ku.add(f.Sb.da(h)).da(this.Ha);
        else
            (k = f.Sb.da(e),
            k = this.ku.add(k).da(this.Ha));
        c.u && this.console.trace("SeamlessAudio: fragment end: " + f.Sb.ca() + ", splice " + e.ca() + ", next start " + (null === h || undefined === h ? undefined : h.ca()) + ", error " + k.add(this.Ha).ca() + ", error with frame drop " + k.ca() + ", is" + (this.uPa(k) ? "" : " not") + " within bounds of [" + this.Vva.ca() + " and " + this.Eva.ca() + ")");
        return k;
    }
    UJc(f, e) {
        var h;
        (0,
        p.assert)(this.MM);
        h = this.ku.add(this.MM.da(f.Vb)).da(this.Ha);
        c.u && this.console.trace("SeamlessAudio: fragment start: " + f.Vb.ca() + ", splice " + e.ca() + ", last fragment end: " + this.MM.ca() + ", error " + h.add(this.Ha).ca() + ", error with frame drop " + h.ca() + ", is" + (this.uPa(h) ? "" : " not") + " within bounds of [" + this.Vva.ca() + " and " + this.Eva.ca() + ")");
        return h;
    }
    uPa(f) {
        return f.Hn(this.Eva) && f.$f(this.Vva);
    }
    Bsb(f) {
        return f.lessThan(this.Eva.add(d.I.bz)) && f.$f(this.Vva.da(d.I.bz));
    }
    Ixc(f, e) {
        return "object" === typeof this.config.$4a && undefined !== this.config.$4a[f] ? (f = new d.I(this.config.$4a[f],1E3).Rc(e.O).add(new d.I(1,e.O)),
        d.I.min(e, f)) : e;
    }
    Mxc(f, e) {
        var h;
        if ("object" === typeof this.config.a5a && undefined !== this.config.a5a[f]) {
            h = e.Af(-2);
            f = new d.I(this.config.a5a[f],1E3).Rc(e.O).da(new d.I(1,e.O));
            return d.I.max(h, f);
        }
        return new d.I(-12,1E3);
    }
}
return g;
}
)();
export const mlb = t;

// Detected exports: mlb
