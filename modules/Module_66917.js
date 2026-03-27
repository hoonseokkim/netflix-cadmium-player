/**
 * Netflix Cadmium Playercore - Module 66917
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 66917
// Parameters: t (module), b (exports), a (require)


Object.defineProperties(b, {
    __esModule: {
        value: !0
    }
});
b.QP = void 0;
new (a(66164).platform.Console)("ASEJS_PACING_FILTER","media|asejs");
t = (function() {
    function d(p, c) {
        this.config = p;
        this.filter = c;
    }
    d.prototype.su = function() {
        return new d(this.config,this.filter);
    }
    ;
    d.prototype.IYc = function(p, c, g, f) {
        var e, h, k;
        k = f.ZN;
        if (!k || !k.jua())
            return !0;
        switch (this.config.hCc) {
        case "requested":
            return !1;
        case "requested-low":
            return (k = k.R4a(this.config.VSa),
            k.iKb() > ((null === (e = f.uz) || void 0 === e ? void 0 : e.HN) || 0));
        case "inferred":
            k = k.R4a(this.config.VSa);
            p = k.F_a(p, c, g, this.config.ifa);
            if (!p)
                break;
            return k.iKb() > ((null === (h = f.uz) || void 0 === h ? void 0 : h.HN) || 0);
        case "inferred-strict":
            if ((k = k.R4a(this.config.VSa),
            k.F_a(p, c, g, this.config.ifa)))
                return !1;
        }
        return !0;
    }
    ;
    d.prototype.add = function(p, c, g, f) {
        this.IYc(p, c, g, f) && this.filter.add(p, c, g, f);
    }
    ;
    d.prototype.get = function(p) {
        if (this.filter.get)
            return this.filter.get(p);
    }
    ;
    d.prototype.start = function(p) {
        this.filter.start && this.filter.start(p);
    }
    ;
    d.prototype.stop = function(p) {
        this.filter.stop && this.filter.stop(p);
    }
    ;
    d.prototype.flush = function() {
        this.filter.flush && this.filter.flush();
    }
    ;
    d.prototype.reset = function(p) {
        this.filter.reset && this.filter.reset(p);
    }
    ;
    return d;
}
)();
b.QP = t;


// Detected exports: QP