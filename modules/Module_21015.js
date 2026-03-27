/**
 * Netflix Cadmium Playercore - Module 21015
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 21015
// Parameters: t (module), b (exports), a (require)


var p, c, g, f, e;
function d(h, k) {
    h = f.Yf.call(this, h, "SocketRouterConfigImpl") || this;
    h.config = k;
    return h;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.IKa = b.JKa = void 0;
t = a(22970);
p = a(22674);
c = a(4203);
g = a(12501);
f = a(64174);
a = a(83767);
b.JKa = "SocketRouterConfigSymbol";
Ia(d, f.Yf);
Ha.Object.defineProperties(d.prototype, {
    enabled: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return !0;
        }
    },
    url: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return "wss://" + (this.config().bE ? "web.ws.test.cloud.netflix.com" : "web.ws.prod.cloud.netflix.com") + "/playexchange";
        }
    },
    BN: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return 24E4;
        }
    },
    nxa: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return 1E4;
        }
    },
    G3: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return 15E3;
        }
    },
    groupName: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return this.config().groupName;
        }
    },
    BH: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return !1;
        }
    },
    LYc: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return !0;
        }
    },
    KYc: {
        configurable: !0,
        enumerable: !0,
        get: function() {
            return !0;
        }
    }
});
e = d;
b.IKa = e;
t.__decorate([g.config(g.zd, "socketRouterEnabled")], e.prototype, "enabled", null);
t.__decorate([g.config(g.string, "socketRouterURL")], e.prototype, "url", null);
t.__decorate([g.config(g.Ez, "socketRouterPingInterval")], e.prototype, "BN", null);
t.__decorate([g.config(g.Ez, "socketRouterOpenTimeout")], e.prototype, "nxa", null);
t.__decorate([g.config(g.Ez, "socketRouterRequestTimeout")], e.prototype, "G3", null);
t.__decorate([g.config(g.string, "socketRouterGroupName")], e.prototype, "groupName", null);
t.__decorate([g.config(g.zd, "socketRouterDisableOnSuspend")], e.prototype, "BH", null);
t.__decorate([g.config(g.zd, "socketRouterShouldSendLogblobs")], e.prototype, "LYc", null);
t.__decorate([g.config(g.zd, "socketRouterShouldSendEvents")], e.prototype, "KYc", null);
b.IKa = e = t.__decorate([(0,
p.aa)(), t.__param(0, (0,
p.v)(a.gp)), t.__param(1, (0,
p.v)(c.Pc))], e);


// Detected exports: IKa, JKa