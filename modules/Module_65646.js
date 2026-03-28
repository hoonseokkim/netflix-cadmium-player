/**
 * Netflix Cadmium Playercore - Module 65646
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: DRM / content protection
 * Exports: bgb
 */

// Webpack module 65646
// Parameters: t (module), b (exports), a (require)

var d;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
export const bgb = undefined;
d = a(22970);  // import from Module_22970
t = (function() {
    function p(c) {
        var g, f;
        g = this;
        this.vUb = {
            logblob: 0,
            events: 0,
            manifest: 0,
            license: 0,
            ntlBatch: 0,
            ntlSendImmediate: 0,
            laser: 0,
            laserNtl: 0
        };
        this.pd = {
            logblob: 0,
            events: 0,
            manifest: 0,
            license: 0,
            ntlBatch: 0,
            ntlSendImmediate: 0,
            laser: 0,
            laserNtl: 0
        };
        this.options = d.__assign({}, c);
        f = this.options.client.va.Bdc(function() {
            return {
                connection: g.options.Rk.connection
            };
        });
        c.rg.on("sending", function(e) {
            var h, k;
            h = e.request;
            k = h.id;
            h = h.type;
            e = e.size;
            f.v2("sending-request", {
                message: ("Sending ").concat(h, " of size ").concat(e),
                type: h,
                correlationId: k,
                size: e
            });
        }).on("succeeded", function(e) {
            return g.vUb[e.request.type]++;
        }).on("failed", function(e) {
            var h;
            h = e.error;
            g.pd[e.request.type]++;
            f.error("sending-request", h);
        });
        c.Ni.visible.on("yes", function() {
            f.v2("stats", {
                stats: g.stats()
            });
        }).on("no", function() {
            c.BH && f.v2("disable-on-suspend", "Stopping on suspend");
        });
        c.Ni.events.on("application-shutdown", function() {
            f.v2("stats", {
                stats: g.stats()
            });
        });
    }
    p.woa = function(c) {
        d.__awaiter(this, undefined, undefined, function() {
            return d.__generator(this, function(g) {
                switch (g.label) {
                case 0:
                    return [4, c.Ni.visible.zxb];
                case 1:
                    return (g.T(),
                    new p(c),
                    [2]);
                }
            });
        });
    }
    ;
    p.prototype.stats = function() {
        return {
            success: this.vUb,
            failure: this.pd,
            correlationId: this.options.Rk.correlationId
        };
    }
    ;
    return p;
}
)();
b.bgb =

// Detected exports: bgb
