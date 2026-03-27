/**
 * Netflix Cadmium Playercore - Module 81214
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 */

// Webpack module 81214
// Parameters: t (module), b (exports), a (require)


var c, g, f;
function d(e) {
    return e == c.default.kf ? 1 : e + 1;
}
function p(e) {
    if (0 === Object.keys(e.$m).length)
        return 0;
    for (var h = d(e.bi); !e.$m[h]; )
        h = d(h);
    return h;
}
Object.defineProperty(b, "__esModule", {
    value: !0
});
b.xlb = void 0;
t = a(22970);
c = t.__importDefault(a(51411));
g = t.__importDefault(a(79804));
f = t.__importDefault(a(10690));
a = (function() {
    function e(h) {
        this.j9b = this.fY = h;
        this.$m = {};
        this.M8 = this.bi = 0;
    }
    e.prototype.cancel = function(h) {
        this.$m[h] && (this.$m[h].call(this, !1),
        delete this.$m[h],
        h == this.bi && (this.bi = p(this)));
    }
    ;
    e.prototype.gpa = function() {
        for (; 0 !== this.bi; )
            this.cancel(this.bi);
    }
    ;
    e.prototype.wait = function(h, k) {
        var l, m;
        l = this;
        if (0 < this.fY)
            return (--this.fY,
            setTimeout(function() {
                k.result(!0);
            }, 0),
            0);
        m = d(this.M8);
        this.M8 = m;
        g.default(k, function() {
            var n;
            -1 != h && (n = setTimeout(function() {
                delete l.$m[m];
                m == l.bi && (l.bi = p(l));
                k.timeout();
            }, h));
            l.$m[m] = function(q) {
                clearTimeout(n);
                if (q) {
                    if (0 >= l.fY) {
                        setTimeout(function() {
                            k.error(new f.default("Semaphore waiter signaled without any available resources."));
                        }, 0);
                        return;
                    }
                    --l.fY;
                }
                setTimeout(function() {
                    k.result(q);
                }, 0);
            }
            ;
            l.bi || (l.bi = m);
        });
        return m;
    }
    ;
    e.prototype.signal = function() {
        var h;
        if (this.fY == this.j9b)
            throw new f.default("Semaphore signaled despite all resources being already available.");
        ++this.fY;
        if (this.bi) {
            h = this.$m[this.bi];
            delete this.$m[this.bi];
            this.bi = p(this);
            h.call(this, !0);
        }
    }
    ;
    return e;
}
)();
b.xlb = a;


// Detected exports: xlb