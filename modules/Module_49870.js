/**
 * Netflix Cadmium Playercore - Module 49870
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Configuration
 * Exports: Bfb
 */

// Webpack module 49870
// Parameters: t (module), b (exports), a (require)

var d, p, c;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const Bfb = undefined;
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
c = a(40666);  // import from Module_40666
t = (function() {
    function g(f, e) {
        this.ka = f;
        this.console = e;
    }
    g.prototype.PCb = function(f) {
        return f.lessThan(p.I.ia) ? {
            ng: {
                type: "immediate"
            },
            reason: "Invoking Panic"
        } : {
            ng: {
                type: "player",
                when: c.ie.Jm(f)
            },
            reason: "Panic"
        };
    }
    ;
    g.prototype.OHc = function(f, e) {
        var h, k, l, m;
        k = f.L;
        if (!k.Ab || e)
            return {
                reason: "not live or multi-choice"
            };
        if (!k.cg)
            return {
                reason: "no media events store",
                ng: {
                    type: "immediate"
                }
            };
        e = k.Ic.Cwb;
        k = null === (h = this.ka.Ib.get(f.K.id)) || undefined === h ? undefined : h.Oc;
        h = this.ka.Ib.get(k);
        k = p.I.uh;
        h && (k = h.$b.da(f.wa).add(f.Sb));
        e = k.da(e.AGc);
        k = f.K.type;
        l = this.ka.config;
        m = this.ka.Rd.add(e);
        l = f.Sb.da(p.I.Ca(l.UGb));
        false;
        return h ? f.K.type !== h.type && "adBreak" === k ? {
            ng: {
                type: "immediate"
            },
            reason: "transition from adBreak"
        } : f.K.type === h.type && "adBreak" !== k ? {
            ng: {
                type: "immediate"
            },
            reason: "transition to like segments"
        } : h.Ob.isFinite() ? e.lessThan(p.I.ia) ? {
            ng: {
                type: "immediate"
            },
            reason: "successor end beyond live edge end"
        } : l.lessThan(m) ? this.PCb(l) : {
            ng: {
                type: "player",
                when: c.ie.Jm(m)
            },
            reason: "waiting till live edge beyond successor end"
        } : d.__assign(d.__assign({}, this.PCb(l)), {
            reason: "successor not finite"
        }) : {
            reason: "successor not found"
        };
    }
    ;
    return g;
}
)();
b.Bfb =

// Detected exports: Bfb
