/**
 * Netflix Cadmium Playercore - Module 31485
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 31485
// Parameters: t (module), b (exports), a (require)


var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.amb = void 0;
d = a(22970);
p = a(91176);
t = (function() {
    function c(g, f) {
        this.console = g;
        this.events = f;
        this.I6a = !1;
    }
    c.prototype.My = function() {
        return this.I6a;
    }
    ;
    c.prototype.dg = function(g) {
        void 0 === g.t2a ? this.vyb(g.ej, g.cE, {
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
        this.vyb(g.message, void 0, d.__assign(d.__assign({}, g.QA), {
            err: p.VC.wy(null === (f = g.QA) || void 0 === f ? void 0 : f.context, {
                includeStack: !1
            })
        }));
    }
    ;
    c.prototype.vyb = function(g, f, e) {
        void 0 === f && (f = void 0);
        void 0 === e && (e = {});
        this.I6a || (e.temporaryFailure || (this.I6a = !0),
        g = d.__assign({
            type: "error",
            error: null !== f && void 0 !== f ? f : "NFErr_MC_StreamingFailure",
            errormsg: g,
            temporaryFailure: !1
        }, e),
        this.console.error("notifyStreamingError:", g),
        this.events.emit("error", g));
    }
    ;
    return c;
}
)();
b.amb = t;


// Detected exports: amb