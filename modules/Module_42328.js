/**
 * Netflix Cadmium Playercore - Module 42328
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 * Exports: TX, e8
 * Dependencies: 25337
 * Purpose: Logging, Event handling, Parsing/Serialization, Error handling
 */

// import dep_25337 from './Module_25337.js';

// Webpack module 42328
// Parameters: t (module), b (exports), a (require)

var d, p, c;

d = a(25337);
p = {
    16: "programstart",
    17: "programend",
    19: "programbreakaway",
    34: "breakstart",
    35: "breakend",
    50: "breakstart",
    51: "breakend",
    52: "breakstart",
    53: "breakend",
    54: "breakstart",
    55: "breakend",
    60: "breakstart",
    61: "breakend",
    62: "breakstart",
    63: "breakend",
    66: "breakstart",
    67: "breakend",
    68: "breakstart",
    69: "breakend",
    70: "breakstart",
    71: "breakend"
};
(function(g) {
    g[g.L$c = 16] = "ProgramStart";
    g[g.K$c = 17] = "ProgramEnd";
    g[g.J$c = 19] = "ProgramBreakaway";
    g[g.KZb = 34] = "BreakStart";
    g[g.C6c = 35] = "BreakEnd";
    g[g.v7c = 50] = "DistributorAdvertisementStart";
    g[g.u7c = 51] = "DistributorAdvertisementEnd";
    g[g.P$c = 52] = "ProviderPlacementOpportunityStart";
    g[g.O$c = 53] = "ProviderPlacementOpportunityEnd";
    g[g.x7c = 54] = "DistributorPlacementOpportunityStart";
    g[g.w7c = 55] = "DistributorPlacementOpportunityEnd";
    g[g.R$c = 60] = "ProviderPromoStart";
    g[g.Q$c = 61] = "ProviderPromoEnd";
    g[g.z7c = 62] = "DistributorPromoStart";
    g[g.y7c = 63] = "DistributorPromoEnd";
    g[g.V5c = 66] = "AlternateContentOpportunityStart";
    g[g.U5c = 67] = "AlternateContentOpportunityEnd";
    g[g.N$c = 68] = "ProviderAdBlockStart";
    g[g.M$c = 69] = "ProviderAdBlockEnd";
    g[g.t7c = 70] = "DistributorAdBlockStart";
    g[g.s7c = 71] = "DistributorAdBlockEnd";
}
)(c || (export const e8 = c = {}));
t = (function() {
    class g {
    constructor(f, e) {
        this.view = f;
        this.console = e;
        this.N = new d.uma(f,e);
    }
    parse() {
        var f, e, h, k, l, m, n, q;
        this.N.offset += 13;
        f = this.N.Hd();
        switch (f) {
        case 0:
            break;
        case 5:
            (e = this.IOc(),
            h = e.LNc);
            f = e.DZc;
            e = e.wec;
            return undefined === h || undefined === f ? undefined : h ? {
                event: "breakstart",
                JN: f,
                duration: e
            } : {
                event: "breakend",
                JN: f
            };
        case 6:
            h = this.eNb();
            break;
        case 4:
        case 7:
        case 255:
            return;
        default:
            throw Error(("Unknown splice_command_type: ").concat(f));
        }
        if (undefined !== h)
            for ((f = this.N.sg(),
            f = this.N.offset + f); this.N.offset < f; ) {
                e = this.N.Hd();
                k = this.N.Hd();
                if (2 === e) {
                    e = this.HOc(k);
                    k = e.Tga;
                    l = e.Uga;
                    m = e.X3;
                    n = e.CRb;
                    q = e.uWc;
                    if (undefined !== k)
                        return {
                            event: g.f5a[k],
                            Tga: k,
                            Uga: l,
                            X3: m,
                            JN: h,
                            id: n,
                            duration: q
                        };
                    if (e.BRb)
                        return {
                            event: "cancel",
                            JN: h,
                            id: n
                        };
                } else
                    this.N.offset += k;
            }
    }
    IOc() {
        var f, e, h, k, l, m;
        this.N.offset += 4;
        if (!(this.N.Hd() >> 7)) {
            f = undefined;
            e = undefined;
            h = this.N.ib(1);
            k = this.N.ib(1);
            if (!k)
                throw Error("Component splice mode is deprecated");
            l = this.N.ib(1);
            m = this.N.ib(1);
            this.N.ib(4);
            k && !m && (f = this.eNb());
            l && (e = this.mOc());
            return {
                LNc: h,
                DZc: f,
                wec: e
            };
        }
        return {};
    }
    eNb() {
        var f;
        if (this.N.ib(1)) {
            this.N.ib(6);
            f = this.N.ib(33);
        } else
            this.N.ib(7);
        return f;
    }
    mOc() {
        this.N.ib(1);
        this.N.ib(6);
        return this.N.ib(33);
    }
    HOc(f) {
        var e, h, k, l, m, n, q;
        h = this.N.offset;
        this.N.dc();
        k = this.N.dc();
        l = this.N.ib(1);
        this.N.ib(7);
        if (0 === l) {
            m = this.N.ib(1);
            n = this.N.ib(1);
            this.N.ib(1);
            this.N.ib(5);
            if (!m)
                throw Error("Component splice mode is deprecated");
            n && (e = this.N.ib(40));
            m = this.N.Hd();
            n = this.N.Hd();
            n = 0 < n ? this.N.s3(n) : undefined;
            q = this.N.Hd();
            this.N.offset = h + f;
            return {
                Tga: q,
                Uga: m,
                X3: n,
                CRb: k,
                BRb: l,
                uWc: e
            };
        }
        this.N.offset = h + f;
        return {
            CRb: k,
            BRb: l
        };
    }
}
g.eO = "urn:scte:scte35:2013:bin";
    g.f5a = p;
    return g;
}
)();
export const TX = t;

// Detected exports: TX, e8
