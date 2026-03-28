/**
 * Netflix Cadmium Playercore - Module 97361
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Logging / telemetry
 * Exports: RLa
 */

// Webpack module 97361
// Parameters: t (module), b (exports), a (require)

var p, c;
function d(g) {
    this.log = g.zb("ZuulRetryPolicyParser");
}
export const RLa = undefined;
t = a(22970);  // import from Module_22970
p = a(22674);  // import from Module_22674
a = a(87386);  // import from Module_87386
d.prototype.dzc = function(g) {
    var f, e;
    try {
        f = g["x-netflix.retry.server.policy"];
        if (f) {
            e = JSON.parse(f);
            this.Z3c(e);
            return {
                I4a: e.retryAfterSeconds,
                T1: e.maxRetries
            };
        }
    } catch (h) {
        false;
    }
}
;
d.prototype.Z3c = function(g) {
    if (undefined !== g.retryAfterSeconds && "number" !== typeof g.retryAfterSeconds)
        throw Error("retryAfterSeconds is not a number");
    if (undefined !== g.maxRetries && "number" !== typeof g.maxRetries)
        throw Error("maxRetries is not a number");
}
;
c = d;
export const RLa = c;
b.RLa = c = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.Bb))],

// Detected exports: RLa
