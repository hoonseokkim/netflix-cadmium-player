/**
 * Netflix Cadmium Playercore - Module 15410
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Network / HTTP
 * Exports: nIb, b5b, MDb, Zhd
 */

// Webpack module 15410
// Parameters: t (module), b (exports), a (require)

var g, f;
function d(e) {
    var h, k, l;
    h = e.zPa;
    k = e.sxa;
    l = e.version;
    e = e.filename;
    null !== h && undefined !== h ? h : h = "https://occ.a.nflxso.net/genc/nrdp/$packageName/$version/$filename";
    null !== e && undefined !== e ? e : e = "index.release.js";
    return h.replace("$packageName", k).replace("$version", l).replace("$filename", e);
}
function p(e) {
    return new Promise(function(h, k) {
        globalThis.Nwa.sAc.load({
            url: e,
            qld: false,
            async: true
        }, function(l) {
            0 !== l.Yrc ? k(new f(("network error: ").concat(l.Ned, " (errorcode: ").concat(l.Yrc, ", nativeErrorCode: ").concat(l.Ajd, ")"),e)) : 200 > l.TTb || 300 <= l.TTb ? k(new f(("non-2xx response: ").concat(l.TTb),e)) : l.data ? h(l.data.toString()) : k(new f("response contained no data",e));
        });
    }
    );
}
function c(e) {
    return g.__awaiter(this, undefined, undefined, function() {
        var h, k;
        return g.__generator(this, function(l) {
            switch (l.label) {
            case 0:
                return [4, p(e)];
            case 1:
                return (h = l.T(),
                k = ("(function() { ").concat(h, "; return module.default; })();"),
                [2, globalThis.Nwa.sAc.eval(k, e)]);
            }
        });
    });
}
export const b5b = undefined;
export function nIb(e) {
    return g.__awaiter(this, undefined, undefined, function() {
        var h, k, l, m, n, q;
        return g.__generator(this, function(r) {
            switch (r.label) {
            case 0:
                h = null !== (q = e.oTb) && undefined !== q ? q : false;
                k = d(e);
                if (!globalThis.Nwa)
                    throw new f("nrdp is not available on globalThis. nf-package-loader only works on NRD devices",k);
                return [4, c(k)];
            case 1:
                l = r.T();
                m = l.Tnb;
                if (m !== e.sxa)
                    throw new f(("unexpected package name: expected '").concat(e.sxa, "', got '").concat(m, "'"),k);
                if (!h && (n = l.Ama,
                n !== e.version))
                    throw new f(("unexpected version: expected '").concat(e.version, "', got '").concat(n, "'. Consider passing skipVersionCheck or -j ellaCdnSkipVersionCheck=true"),k);
                return [2, l];
            }
        });
    });
}
;
export const MDb = d;
export const Zhd = c;
g = a(22970);  // import from Module_22970
f = (function(e) {
    function h(k, l) {
        var m;
        m = this.constructor;
        k = ("nf-package-loader error: ").concat(k, " (failed to load ").concat(l, ").");
        k = e.call(this, k) || this;
        k.name = "PackageLoaderError";
        Object.setPrototypeOf(k, m.prototype);
        return k;
    }
    g.__extends(h, e);
    return h;
}
)(Error);
b.b5b =

// Detected exports: nIb, b5b, MDb, Zhd
