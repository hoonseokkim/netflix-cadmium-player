/**
 * Netflix Cadmium Playercore - Module 45691
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: nja
 * Dependencies: 22970, 26388, 48170, 50247, 50468, 69575, 75539, 85254, 91176, 91562
 * Purpose: Logging, Configuration, Parsing/Serialization, Error handling
 */

// import dep_22970 from './Module_22970.js';
// import dep_26388 from './Module_26388.js';
// import dep_48170 from './Module_48170.js';
// import dep_50247 from './Module_50247.js';
// import dep_50468 from './Module_50468.js';
// import dep_69575 from './Module_69575.js';
// import dep_75539 from './Module_75539.js';
// import dep_85254 from './Module_85254.js';
// import dep_91176 from './Module_91176.js';
// import dep_91562 from './Module_91562.js';

// Webpack module 45691
// Parameters: t (module), b (exports), a (require)

var p, c, g, f, e, h, k, l, m, n;
function d(q, r, u) {
    return 2 === r.length ? r[1] : r.reduce(function(v, w) {
        return Math.abs(w - q) < Math.abs(v - q) ? w : v;
    }, u);
}

p = a(22970);
a(66164);
c = a(91562);
g = a(91176);
f = a(26388);
e = a(75539);
t = a(85254);
h = a(48170);
k = a(69575);
l = a(50247);
m = a(50468);
(function(q) {
    q[q.cp = 0] = "INITIAL";
    q[q.fdb = 1] = "HAVE_CONTENT_LENGTH";
    q[q.hdb = 2] = "HAVE_MOOF_LENGTH";
    q[q.gdb = 3] = "HAVE_MOOF";
}
)(n || (n = {}));
a = (function(q) {
    class r extends q {
    constructor(u, v, w, x, y, A, z, B) {
        w = u.mediaType === f.l.V ? p.__assign(p.__assign({}, w), {
            responseType: 0
        }) : w;
        v = q.call(this, u, v, "live-edit", w, x, y, A, z) || this;
        v.NB = false;
        v.XU = n.cp;
        v.Dxb = false;
        m.Xo.Gb(v, u, y, w, B);
        v.Mqa = true;
        (0,
        g.assert)(v.mediaType === f.l.V || v.mediaType === f.l.U);
        return v;
    }
    Ey() {
        return this.Uta() && q.prototype.Ey.call(this);
    }
    eQa() {
        return false;
    }
    yRa(u, v, w) {
        var x, y;
        x = w.offset;
        y = this.config.CGc;
        w = p.__assign(p.__assign({}, w), {
            tUa: this.config.fTa,
            responseType: 0
        });
        this.lF(u, v, w, {
            offset: x,
            la: y
        });
    }
    uN(u) {
        (undefined !== this.uo || this.ELc(u)) && this.s8a(u);
        this.XU === n.cp && undefined !== this.uo && (this.aU(u, this.uo, this.la),
        this.XU = n.fdb);
    }
    Ko(u, v) {
        if (!(this.state > e.Ah.Rm)) {
            h.u && this.console.trace(("AseLiveEditingRequest: onrequestcomplete, ").concat(this.toString(), ": ") + ("ID: ").concat(u.pg(), ", requestState: ").concat(this.XU, ", bytes: ").concat(v));
            this.XU !== n.gdb && (this.data = undefined === this.data ? u.response : (0,
            k.IA)(this.data, u.response));
            switch (this.XU) {
            case n.cp:
                (0,
                g.assert)(false, "Should not encounter request complete before obtaining content length");
            case n.fdb:
                if (!this.JLc())
                    break;
                this.XU = n.hdb;
            case n.hdb:
                this.ILc(u) && (this.XU = n.gdb);
            }
            q.prototype.Ko.call(this, u, v);
        }
    }
    ELc(u) {
        this.uo = u.IBb();
        h.u && this.console.debug(("AseLiveEditingRequest: ").concat(this.toString(), " setting contentLength to ").concat(this.uo, " from range"));
        return undefined === this.uo ? (this.YDb(u),
        false) : true;
    }
    JLc() {
        var u, v;
        (0,
        g.assert)(undefined !== this.uo, "Should have content length by now");
        (0,
        g.assert)(undefined !== this.data, "Should have some data by now");
        u = c.gK.path(new DataView(this.data), ["moof"]);
        v = u.offset;
        u = u.end;
        if (undefined === v || undefined === u)
            return (h.u && this.console.error("AseLiveEditingRequest: onrequestcomplete, failed to find moof in initial request"),
            v = this.offset + this.data.byteLength,
            u = this.config.eIb,
            this.lF(this.tb[0].FL, this.label, p.__assign(p.__assign({}, this.properties), {
                responseType: 0
            }), {
                offset: v,
                la: u
            }),
            false);
        this.m0a = v;
        this.V1 = this.offset + u + 8;
        h.u && this.console.trace(("AseLiveEditingRequest: obtainMoofLength, ").concat(this.toString(), ": ") + ("moofOffset: ").concat(this.m0a, ", mediaDataOffset: ").concat(this.V1));
        return true;
    }
    ILc(u) {
        var v, w, x;
        (0,
        g.assert)(undefined !== this.uo, "Should have content length by now");
        (0,
        g.assert)(undefined !== this.V1, "Should have sample offset by now");
        (0,
        g.assert)(undefined !== this.data, "Should have some data by now");
        v = this.data.byteLength;
        w = this.V1 > v;
        if (w) {
            x = this.V1 - v;
            h.u && this.console.trace("AseLiveEditingRequest: obtainMoof, request:", u.toString(), ("did not contain all of the moof, requesting ").concat(x, " more bytes"));
            this.lF(u.FL, this.label, p.__assign(p.__assign({}, this.properties), {
                responseType: 0
            }), {
                offset: v,
                la: x
            });
            v += x;
        }
        this.pa ? w || this.wOc(v, this.uo) : (w || (u = c.gK.uzb(new DataView(this.data))) && undefined !== u.vy && undefined !== u.Me && (h.u && this.console.trace("AseLiveEditingRequest: fragment times (unoptimized): " + ("tfdt: ").concat(u.X4, ", ") + ("ffco: ").concat(u.vy, ", ") + ("sampleCount: ").concat(u.Me)),
        this.xUa(this, u, false, false)),
        this.Dxb || (x = this.uo - v,
        0 < x && (h.u && this.console.trace(("AseLiveEditingRequest: obtainMoof with  on edits: offset ").concat(v, ", bytes ").concat(x, ", ") + ("contentLength ").concat(this.uo)),
        this.u3a(v, x, this.uo),
        this.Dxb = true)));
        return !w;
    }
    u3a(u, v, w) {
        this.V7a(u, v) || (this.WG = {
            offset: u,
            la: v,
            uo: w
        },
        this.yUa(this));
    }
    wOc(u, v) {
        var w, x, y, A, z, B, C, D, E, G, F;
        (0,
        g.assert)(undefined !== this.V1, "Should have sample offset by now");
        (0,
        g.assert)(undefined !== this.m0a, "Should have moof offset by now");
        (0,
        g.assert)(undefined !== this.data, "Should have some data by now");
        (0,
        g.assert)(this.data.byteLength >= this.V1, "Should have enough data for the whole moof by now");
        (0,
        g.assert)(undefined !== this.pa, "Should have an edit");
        x = this.stream.Os();
        (0,
        g.assert)(x, "Should have a header for the stream that is being edited");
        y = new c.Wz(this.console,{
            mediaType: this.mediaType
        },this.data);
        A = 0;
        if (y.parse({
            ce: null === x || undefined === x ? undefined : x.Lea
        }).done) {
            z = c.Om.path(y, ["moof", "traf"] /* moof */);
            x = c.Om.path(z, ["tfhd"]);
            y = c.Om.path(z, ["tfdt"]);
            B = c.Om.path(z, ["trun"]);
            if (undefined !== x && undefined !== y && undefined !== B && undefined !== B.zl) {
                x = B.ASc(x);
                y = y.fH;
                z = B.Ktc;
                C = x.length;
                h.u && this.console.trace(("AseLiveEditingRequest: fragment times: tfdt: ").concat(y, ", ") + ("firstFrameCompositionOffset: ").concat(z, ", sampleCount: ").concat(C));
                D = this.m0a + B.zl;
                E = false;
                if (null === this.pa.end && this.Df < C)
                    (h.u && this.console.warn(("AseLiveEditingRequest: null edit end for fragment with ").concat(this.Df, " ") + ("expected samples but actual fragment is longer (").concat(C, ") - extending")),
                    E = true,
                    this.d8a(x.length));
                else if (null === this.pa.end && this.Df > C || null !== this.pa.end && this.pa.end > C)
                    (h.u && this.console.warn(("AseLiveEditingRequest: edit end (").concat(this.pa.end, ", ").concat(this.Df, ") ") + ("is beyond actual samples (").concat(x.length, ") - truncating")),
                    E = true,
                    this.d8a(x.length));
                G = false;
                if (this.config.F4 && this.mediaType === f.l.U) {
                    B = B.wSc();
                    if (0 !== this.pa.start && -1 === B.indexOf(this.pa.start)) {
                        F = this.pa.start;
                        G = d(this.pa.start, B, this.Df);
                        h.u && this.console.warn(("AseLiveEditingRequest: ").concat(this.toString(), " edit start point ").concat(F, " is not an IDR, ") + ("nearest IDR is ").concat(G));
                        this.Nh({
                            start: G,
                            end: this.pa.end
                        });
                        G = true;
                    }
                    null !== this.pa.end && this.pa.end < this.Df && -1 === B.indexOf(this.pa.end) && (F = this.pa.end,
                    G = d(this.pa.end, B, this.Df),
                    h.u && this.console.warn(("AseLiveEditingRequest: ").concat(this.toString(), " edit end point ").concat(F, " is not an IDR, ") + ("nearest IDR is ").concat(G)),
                    this.Nh({
                        start: this.pa.start,
                        end: G
                    }),
                    G = true);
                }
                this.xUa(this, {
                    X4: y,
                    vy: z,
                    Me: C
                }, E, G);
                for (y = 0; y < this.pa.start && y < x.length; y++)
                    D += x[y];
                z = null !== (w = this.pa.end) && undefined !== w ? w : this.Df;
                for (y = this.pa.start; y < z && y < x.length; y++)
                    A += x[y];
                D < u && (A -= u - D,
                D = u);
                h.u && this.console.trace(("AseLiveEditingRequest: edit: ").concat(JSON.stringify(this.pa)) + (", samples expected ").concat(this.Df, ", actual ").concat(x.length, ", sample sizes: ").concat(x) + (", start: ").concat(this.pa.start, ", end: ").concat(this.pa.end) + (", requestOffset: ").concat(D, ", bytes: ").concat(A, ", contentLength: ").concat(v));
            } else
                h.u && this.console.error("AseLiveEditingRequest: failed to find trun or tfhd in moof");
            this.data = undefined;
        }
        undefined !== D ? 0 < A && (this.u3a(D, A, v),
        this.O2 = {
            offset: D,
            la: A
        }) : (A = v - u,
        0 < A && (this.u3a(u, A, v),
        this.O2 = {
            offset: u,
            la: A
        }));
        h.u && this.console.trace(("AseLiveEditingRequest: edit: ").concat(JSON.stringify(this.pa), ", ") + ("requestOffset: ").concat(D, ", bytes: ").concat(A, ", contentLength: ").concat(v, ", ") + ("optimizedRequest: ").concat(JSON.stringify(this.O2)));
    }
    toString() {
        return "ID: " + this.pg() + ("[").concat(this.Oa, ", ").concat(this.bitrate, "kbit/s, ") + ("c:").concat(this.qa.G, "-").concat(this.wa.G, ",") + ("p:").concat(this.Vb.G, "-").concat(this.Sb.G, ",d:").concat(this.Ob.G, "]");
    }
}
p.Object.defineProperties(r.prototype, {
        stream: {
            get: function() {
                return this.bf;
            },
            enumerable: false,
            configurable: true
        }
    });
    return r;
}
)(l.N5);
export const nja = a;
(0,
t.Ol)(m.Xo, a, false);

// Detected exports: nja
