/**
 * Netflix Cadmium Playercore - Module 54923
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Utility module
 */

// Webpack module 54923
// Parameters: t (module), b (exports), a (require)

var d, p;
Object.defineProperties(b, {
    __esModule: {
        value: true
    }
});
b.Z$a = undefined;
d = a(22970);  // import from Module_22970
p = a(91176);  // import from Module_91176
t = (function() {
    function c(g, f, e) {
        this.vIc = g;
        this.mZc = f;
        this.console = e;
        this.name = "BatchRequestThrottler";
        this.dRb = new p.klb();
        this.reset();
    }
    c.prototype.process = function(g) {
        return d.__awaiter(this, undefined, undefined, function() {
            var f;
            f = this;
            return d.__generator(this, function(e) {
                switch (e.label) {
                case 0:
                    this.dRb.AEc || (this.Koa = p.I.ia);
                    this.dRb.LZc();
                    if (g.done)
                        return [3, 3];
                    if (!this.Koa.$f(this.vIc))
                        return [3, 2];
                    false;
                    return [4, new Promise(function(h) {
                        return setTimeout(h, f.mZc);
                    }
                    )];
                case 1:
                    (e.T(),
                    e.label = 2);
                case 2:
                    (this.Koa = this.Koa.add(g.value.value.Ob),
                    e.label = 3);
                case 3:
                    return [2, g];
                }
            });
        });
    }
    ;
    c.prototype.reset = function() {}
    ;
    c.prototype.f1a = function() {
        false;
        this.Koa = p.I.ia;
    }
    ;
    return c;
}
)();
b.Z$a =

