/**
 * Netflix Cadmium Playercore - Module 77737
 * Extracted from cadmium-playercore-6.0055.939.911.js
 * Original signature: function(t, b, a)
 *
 * Purpose: Error handling
 * Exports: xka
 */

// Webpack module 77737
// Parameters: t (module), b (exports), a (require)

var d, p, c;
export const xka = undefined;
d = a(27912);  // import from Module_27912
p = [d.jdb, d.mdb, d.ndb, d.odb, d.pdb, d.qdb, d.rdb, d.sdb, d.tdb, d.kdb, d.ldb];
c = [false, false, true, true, false, false, true, true, true, true, true];
b.xka = (function() {
    function g() {}
    g.hAb = function(f, e) {
        var h, n, q;
        h = e.table;
        e = e.width;
        for (var k = 0, l = h[0], m = f.read(l); m !== h[k + 1]; ) {
            k += e;
            n = h[k];
            q = n - l;
            l = n;
            m <<= q;
            m |= f.read(q);
        }
        return k;
    }
    ;
    g.kTb = function(f) {
        for (var e = 4; f.read(1); )
            ++e;
        f.advance(e);
    }
    ;
    g.mTb = function(f, e) {
        for (; e--; )
            g.hAb(f, d.udb);
    }
    ;
    g.kZc = function(f, e) {
        var h, k;
        h = p[e - 1];
        k = h.table;
        h = this.hAb(f, h);
        if (11 > e)
            c[e - 1] && (e = k[h + 2]) && f.advance(e);
        else if (11 === e || 15 < e)
            (h += 2,
            (e = k[h]) && f.advance(e),
            (k = k[h + 1]) && this.kTb(f),
            1 < k && this.kTb(f));
        else
            throw Error("Huffman: unknown spectral codebook: " + e);
    }
    ;
    return g;
}
)

// Detected exports: xka
