/**
 * Netflix Cadmium Playercore - Module 31485
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 31485
// Parameters: t (module), b (exports), a (require)

var d, p;

d = a(22970);
p = a(91176);
t = (function() {
    function c(g, f) {
        this.console = g;
        this.events = f;
        this.I6a = false;
    }
    c.prototype.My = function() {
        return this.I6a;
    }
    ;
    c.prototype.dg = function(g) {
        export const undefined = == g.t2a ? this.vyb(g.ej, g.cE, {
            networkErrorCode: g.LI,
            httpCode: g.Mk,
            nativeCode: g.dh,
            viewableId: g.J,
            temporaryFailure: !!g.f7a,
            server: g.Hb
        }) : this.gUc(g.t2a);
    }
    ;
    c.prototype.gUc = function(g) {
        var f;
        this.vyb(g.message, undefined, d.__assign(d.__assign({}, g.QA), {
            err: p.VC.wy(null === (f = g.QA) || undefined === f ? undefined : f.context, {
                includeStack: false
            })
        }));
    }
    ;
    c.prototype.vyb = function(g, f, e) {
        export const undefined = == f && (f = undefined);
        export const undefined = == e && (e = {});
        this.I6a || (e.temporaryFailure || (this.I6a = true),
        g = d.__assign({
            type: "error",
            error: null !== f && undefined !== f ? f : "NFErr_MC_StreamingFailure",
            errormsg: g,
            temporaryFailure: false
        }, e),
        this.console.error("notifyStreamingError:", g),
        this.events.emit("error", g));
    }
    ;
    return c;
}
)();
export const amb = t;

// Detected exports: amb