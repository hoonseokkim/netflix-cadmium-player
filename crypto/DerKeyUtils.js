/**
 * Netflix Cadmium Player - DerKeyUtils
 * Original: Webpack Module 69763
 *
 * ASN.1 DER encoding/decoding utilities for RSA key manipulation.
 * Converts between DER, SPKI, PKCS8, and JWK key formats.
 *
 * @module DerKeyUtils
 */

import * as Base64Utils from '../msg/MessageHeader.js'; // base64url encode/decode
// Key format constants (previously imported from Module_11475):
// { raw: "raw", jwk: "jwk", spki: "spki", pkcs8: "pkcs8" }
// Inlined as string literals where used.

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * RSA PKCS#1 OID: 1.2.840.113549.1.1.1
 * Encoded as DER object identifier bytes.
 * @type {Uint8Array}
 */
const RSA_OID = new Uint8Array([42, 134, 72, 134, 247, 13, 1, 1, 1]);

/**
 * Valid Web Crypto key operations.
 * @type {string[]}
 */
const VALID_KEY_OPS = [
    'sign', 'verify', 'encrypt', 'decrypt',
    'wrapKey', 'unwrapKey', 'deriveKey', 'deriveBits',
];

/**
 * Supported RSA JWK algorithm identifiers.
 * @type {string[]}
 */
const SUPPORTED_RSA_ALGORITHMS = [
    'RSA1_5', 'RSA-OAEP', 'RSA-OAEP-256', 'RSA-OAEP-384',
    'RSA-OAEP-512', 'RS256', 'RS384', 'RS512',
];

/**
 * ASN.1 tag type constants (universal class).
 * Maps standard ASN.1 tag numbers to symbolic names.
 *
 * @enum {number}
 */
export const ASN1_TAGS = {
    EOC: 0,               // End-of-Content
    BOOLEAN: 1,           // BOOLEAN
    INTEGER: 2,           // INTEGER
    BIT_STRING: 3,        // BIT STRING
    OCTET_STRING: 4,      // OCTET STRING
    NULL: 5,              // NULL
    OBJECT_IDENTIFIER: 6, // OBJECT IDENTIFIER
    OBJECT_DESCRIPTOR: 7, // ObjectDescriptor
    EXTERNAL: 8,          // EXTERNAL
    REAL: 9,              // REAL
    ENUMERATED: 10,       // ENUMERATED
    EMBEDDED_PDV: 11,     // EMBEDDED PDV
    UTF8_STRING: 12,      // UTF8String
    RELATIVE_OID: 13,     // RELATIVE-OID
    SEQUENCE: 16,         // SEQUENCE / SEQUENCE OF
    SET: 17,              // SET / SET OF
    NUMERIC_STRING: 18,   // NumericString
    PRINTABLE_STRING: 19, // PrintableString
    T61_STRING: 20,       // T61String (TeletexString)
    TELETEX_STRING: 20,   // alias for T61_STRING
    VIDEOTEX_STRING: 21,  // VideotexString
    IA5_STRING: 22,       // IA5String
    UTC_TIME: 23,         // UTCTime
    GENERALIZED_TIME: 24, // GeneralizedTime
    GRAPHIC_STRING: 25,   // GraphicString
    VISIBLE_STRING: 26,   // VisibleString (ISO646String)
    ISO646_STRING: 26,    // alias for VISIBLE_STRING
    GENERAL_STRING: 27,   // GeneralString
    UNIVERSAL_STRING: 28, // UniversalString
    CHARACTER_STRING: 29, // CHARACTER STRING
    BMP_STRING: 30,       // BMPString
};

// ---------------------------------------------------------------------------
// DerStream - byte-level reader/writer over a Uint8Array buffer
// ---------------------------------------------------------------------------

/**
 * A simple byte stream backed by a Uint8Array.
 * Supports sequential reads, writes, and random-access operations.
 */
class DerStream {
    /**
     * @param {Uint8Array|DerStream} source - backing buffer or another stream to clone
     * @param {number} [offset=0] - initial position when source is a Uint8Array
     */
    constructor(source, offset) {
        if (source instanceof DerStream) {
            this.buffer = source.buffer;
            this.position = source.position;
        } else {
            this.buffer = source;
            this.position = offset || 0;
        }
    }

    /**
     * Read the next byte and advance the position.
     * @returns {number}
     */
    readByte() {
        return this.buffer[this.position++];
    }

    /**
     * Write a byte at the current position and advance.
     * @param {number} value
     */
    writeByte(value) {
        this.buffer[this.position++] = value;
    }

    /**
     * Peek at a byte at an arbitrary position without advancing.
     * @param {number} index
     * @returns {number}
     */
    peekByte(index) {
        return this.buffer[index];
    }

    /**
     * Copy `length` bytes from `src` (starting at `srcOffset`) into this
     * stream's buffer at the current position, then advance.
     *
     * @param {Uint8Array} src
     * @param {number} srcOffset
     * @param {number} length
     */
    copyBytes(src, srcOffset, length) {
        const dst = new Uint8Array(this.buffer.buffer, this.position, length);
        const srcView = new Uint8Array(src.buffer, srcOffset, length);
        dst.set(srcView);
        this.position += length;
    }

    /**
     * Set the position to an absolute offset.
     * @param {number} pos
     */
    seek(pos) {
        this.position = pos;
    }

    /**
     * Skip forward by `count` bytes.
     * @param {number} count
     */
    skip(count) {
        this.position += count;
    }

    /**
     * Alias for seek (legacy compat).
     * @param {number} pos
     */
    setPosition(pos) {
        this.position = pos;
    }

    /**
     * Number of bytes remaining from the current position to end of buffer.
     * @returns {number}
     */
    remaining() {
        return this.buffer.length - this.position;
    }

    /**
     * Total size of the backing buffer.
     * @returns {number}
     */
    size() {
        return this.buffer.length;
    }

    /**
     * Debug string representation.
     * @returns {string}
     */
    toString() {
        return `DerStream: pos ${this.position} of ${this.size()}`;
    }
}

// ---------------------------------------------------------------------------
// DerNode - a single node in an ASN.1 DER tree
// ---------------------------------------------------------------------------

/**
 * Represents a single node in a parsed ASN.1 DER structure.
 * Nodes form a tree via `firstChild` / `nextSibling` links and carry
 * a reference back into the original byte buffer.
 */
class DerNode {
    /**
     * @param {Uint8Array|null} sourceData - the raw DER byte buffer
     * @param {DerNode|undefined} [parentNode] - parent in the tree
     * @param {boolean} [constructed=false] - whether this is a constructed type
     * @param {number} [tagNumber=0] - ASN.1 tag number
     * @param {number} [dataOffset=0] - byte offset into sourceData where value begins
     * @param {number} [dataLength=0] - length of the value region in bytes
     */
    constructor(sourceData, parentNode, constructed, tagNumber, dataOffset, dataLength) {
        /** @type {Uint8Array|null} */
        this.sourceData = sourceData;
        /** @type {DerNode|undefined} */
        this._parent = parentNode || undefined;
        /** @type {boolean} */
        this._constructed = constructed || false;
        /** @type {number} Tag class (0 = universal, 1 = application, 2 = context, 3 = private) */
        this._tagClass = 0;
        /** @type {number} */
        this._tagNumber = tagNumber || 0;
        /** @type {number} */
        this._dataOffset = dataOffset || 0;
        /** @type {number} */
        this._dataLength = dataLength || 0;
        /** @private @type {DerNode|undefined} */
        this._firstChild = undefined;
        /** @private @type {DerNode|undefined} */
        this._nextSibling = undefined;
    }

    // -- Data access --------------------------------------------------------

    /**
     * Extract a copy of this node's raw value bytes.
     * @returns {Uint8Array}
     */
    get data() {
        return new Uint8Array(
            this.sourceData.buffer.slice(this._dataOffset, this._dataOffset + this._dataLength),
        );
    }

    /**
     * The full raw DER buffer that backs this node.
     * @returns {Uint8Array}
     */
    get rawBuffer() {
        return this.sourceData;
    }

    // -- Constructed flag ---------------------------------------------------

    /** @returns {boolean} */
    get constructed() {
        return this._constructed;
    }

    /** @param {number|boolean} value */
    set constructed(value) {
        this._constructed = value !== 0 ? true : false;
    }

    // -- Tag class ----------------------------------------------------------

    /** @returns {number} */
    get tagClass() {
        return this._tagClass;
    }

    /** @param {number} value */
    set tagClass(value) {
        this._tagClass = value;
    }

    // -- Tag alias using internal_Dna name ----------------------------------

    /** @returns {number} */
    get tag() {
        return this._tagNumber;
    }

    /** @param {number} value */
    set tag(value) {
        this._tagNumber = value;
    }

    // -- error property (legacy alias for tagNumber) used during parsing -----

    /** @returns {number} */
    get error() {
        return this._tagNumber;
    }

    /** @param {number} value */
    set error(value) {
        this._tagNumber = value;
    }

    // -- Data offset / length accessors (NA / XD in original) ---------------

    /** @returns {number} */
    get dataOffset() {
        return this._dataOffset;
    }

    /** @param {number} value */
    set dataOffset(value) {
        this._dataOffset = value;
    }

    /** @returns {number} */
    get dataLength() {
        return this._dataLength;
    }

    /** @param {number} value */
    set dataLength(value) {
        this._dataLength = value;
    }

    // -- Tree navigation ----------------------------------------------------

    /** @returns {DerNode|undefined} */
    get firstChild() {
        return this._firstChild;
    }

    /** @param {DerNode} node */
    set firstChild(node) {
        this._firstChild = node;
        this._firstChild.parent = this;
    }

    /** @returns {DerNode|undefined} */
    get nextSibling() {
        return this._nextSibling;
    }

    /** @param {DerNode} node */
    set nextSibling(node) {
        this._nextSibling = node;
    }

    /** @returns {DerNode|undefined} */
    get parent() {
        return this._parent;
    }

    /** @param {DerNode} node */
    set parent(node) {
        this._parent = node;
    }

    // -- Computed properties -------------------------------------------------

    /**
     * Compute the DER content length for serialization.
     * For constructed types this is the sum of all children's total lengths.
     * For primitives it depends on the tag type and value bytes.
     * @returns {number}
     */
    get contentLength() {
        let len = 0;
        if (this._firstChild) {
            // Constructed: sum all child total lengths
            for (let child = this._firstChild; child; child = child.nextSibling) {
                len += child.totalLength;
            }
            // BIT STRING constructed adds a leading unused-bits byte
            if (this._tagNumber === ASN1_TAGS.BIT_STRING) {
                len++;
            }
        } else {
            // Primitive leaf
            switch (this._tagNumber) {
                case ASN1_TAGS.INTEGER:
                    len = this._dataLength;
                    // Prepend 0x00 padding if high bit is set (positive integer convention)
                    if (this.sourceData[this._dataOffset] >> 7) {
                        len++;
                    }
                    break;
                case ASN1_TAGS.BIT_STRING:
                    len = this._dataLength + 1; // +1 for unused-bits byte
                    break;
                case ASN1_TAGS.OCTET_STRING:
                    len = this._dataLength;
                    break;
                case ASN1_TAGS.NULL:
                    len = 0;
                    break;
                case ASN1_TAGS.OBJECT_IDENTIFIER:
                    if (isRsaOid(this.sourceData, this._dataOffset, this._dataLength)) {
                        len = 9;
                    }
                    break;
            }
        }
        return len;
    }

    /**
     * Total serialized length of this node (tag + length field + content).
     * @returns {number}
     */
    get totalLength() {
        let len = this.contentLength;
        // Long-form length encoding adds extra bytes
        if (len > 127) {
            for (let tmp = len; tmp; tmp >>= 8) {
                ++len;
            }
        }
        return len + 2; // +1 tag byte, +1 short-form length byte (minimum)
    }

    /**
     * Serialize this entire node (and its subtree) into a new Uint8Array.
     * @returns {Uint8Array|undefined}
     */
    get derEncoded() {
        const size = this.totalLength;
        if (size) {
            const out = new Uint8Array(size);
            const stream = new DerStream(out);
            if (serializeNode(this, stream)) {
                return out;
            }
        }
        return undefined;
    }

    /**
     * Count the number of direct children.
     * @returns {number}
     */
    get childCount() {
        let count = 0;
        for (let child = this._firstChild; child; child = child.nextSibling) {
            count++;
        }
        return count;
    }
}

// -- Aliases used by the original obfuscated code that are referenced
//    within the parsing/serialization helpers. We keep compatibility by
//    mapping via getters defined above. The code below uses the clean names.

// ---------------------------------------------------------------------------
// DerTreeBuilder - constructs a DER tree programmatically
// ---------------------------------------------------------------------------

/**
 * Helper for constructing ASN.1 DER node trees.
 * Maintains a cursor (`currentNode`) and allows appending children
 * or siblings at the current or parent level.
 */
class DerTreeBuilder {
    /**
     * @param {DerNode} rootNode - the root SEQUENCE node to build into
     */
    constructor(rootNode) {
        /** @type {DerNode} */
        this.currentNode = rootNode;
    }

    /**
     * Append `child` as a child of `currentNode` (descend into current).
     * @param {DerNode} child
     */
    addChild(child) {
        this._appendTo(this.currentNode, child);
    }

    /**
     * Append `sibling` as a sibling of `currentNode` (add to parent).
     * @param {DerNode} sibling
     */
    addSibling(sibling) {
        this._appendTo(this.currentNode.parent, sibling);
    }

    /**
     * Navigate back to `targetAncestor` and append `child` there.
     * Only succeeds if `targetAncestor` is actually an ancestor of `currentNode`.
     * @param {DerNode} targetAncestor
     * @param {DerNode} child
     */
    addToAncestor(targetAncestor, child) {
        if (this._isAncestor(targetAncestor)) {
            this._appendTo(targetAncestor, child);
        }
    }

    /**
     * Internal: append `node` as the last child of `parent`, updating cursor.
     * @private
     * @param {DerNode} parent
     * @param {DerNode} node
     */
    _appendTo(parent, node) {
        this.currentNode = node;
        this.currentNode.parent = parent;

        if (parent.firstChild) {
            let last = parent.firstChild;
            while (last.nextSibling) {
                last = last.nextSibling;
            }
            last.nextSibling = node;
        } else {
            parent.firstChild = node;
        }
    }

    /**
     * Check whether `target` is an ancestor of `currentNode`.
     * @private
     * @param {DerNode} target
     * @returns {boolean}
     */
    _isAncestor(target) {
        for (let node = this.currentNode; node; node = node.parent) {
            if (target === node) return true;
        }
        return false;
    }
}

// ---------------------------------------------------------------------------
// RSA key data classes
// ---------------------------------------------------------------------------

/**
 * Holds RSA private key components.
 */
class RsaPrivateKey {
    /**
     * @param {Uint8Array} n  - modulus
     * @param {Uint8Array} e  - public exponent
     * @param {Uint8Array} d  - private exponent
     * @param {Uint8Array} p  - first prime factor
     * @param {Uint8Array} q  - second prime factor
     * @param {Uint8Array} dp - d mod (p-1)
     * @param {Uint8Array} dq - d mod (q-1)
     * @param {Uint8Array} qi - (inverse of q) mod p
     * @param {string} [alg]  - JWK algorithm identifier
     * @param {string[]} [keyOps] - allowed key operations
     * @param {boolean} [ext] - extractable flag
     */
    constructor(n, e, d, p, q, dp, dq, qi, alg, keyOps, ext) {
        this.n = n;
        this.e = e;
        this.d = d;
        this.p = p;
        this.q = q;
        this.dp = dp;
        this.dq = dq;
        this.qi = qi;
        this.alg = alg;
        this.keyOps = keyOps;
        this.ext = ext;
    }
}

/**
 * Holds RSA public key components.
 */
class RsaPublicKey {
    /**
     * @param {Uint8Array} n  - modulus
     * @param {Uint8Array} e  - public exponent
     * @param {boolean} [ext] - extractable flag
     * @param {string[]} [keyOps] - allowed key operations
     */
    constructor(n, e, ext, keyOps) {
        this.n = n;
        this.e = e;
        this.ext = ext;
        this.keyOps = keyOps;
    }
}

/**
 * Wraps a DER-encoded key together with its type and metadata.
 */
class DerKeyWrapper {
    /**
     * @param {Uint8Array} der - raw DER bytes
     * @param {string} type - key format ("spki" | "pkcs8")
     * @param {string[]} keyOps - allowed key operations
     * @param {boolean} extractable
     */
    constructor(der, type, keyOps, extractable) {
        this.der = der;
        this.type = type;
        this.keyOps = keyOps;
        this.extractable = extractable;
    }

    /** @returns {Uint8Array} */
    getDer() {
        return this.der;
    }

    /** @returns {string} */
    getType() {
        return this.type;
    }

    /** @returns {string[]} */
    getKeyOps() {
        return this.keyOps;
    }

    /** @returns {boolean} */
    getExtractable() {
        return this.extractable;
    }
}

// ---------------------------------------------------------------------------
// DER node factory helpers
// ---------------------------------------------------------------------------

/**
 * Factory functions for creating DerNode primitives used when building
 * DER trees programmatically.
 */
export const derNodeFactory = {
    /**
     * Create a constructed SEQUENCE node.
     * @returns {DerNode}
     */
    sequence() {
        return new DerNode(null, null, true, ASN1_TAGS.SEQUENCE, null, null);
    },

    /**
     * Create an OBJECT IDENTIFIER node.
     * @param {Uint8Array} oidBytes
     * @returns {DerNode}
     */
    objectIdentifier(oidBytes) {
        return new DerNode(oidBytes, null, false, ASN1_TAGS.OBJECT_IDENTIFIER, 0, oidBytes ? oidBytes.length : 0);
    },

    /**
     * Create a NULL node.
     * @returns {DerNode}
     */
    nullValue() {
        return new DerNode(null, null, false, ASN1_TAGS.NULL, null, null);
    },

    /**
     * Create a BIT STRING node.
     * @param {Uint8Array|null} data
     * @returns {DerNode}
     */
    bitString(data) {
        return new DerNode(data, null, false, ASN1_TAGS.BIT_STRING, 0, data ? data.length : 0);
    },

    /**
     * Create an INTEGER node.
     * @param {Uint8Array} data
     * @returns {DerNode}
     */
    integer(data) {
        return new DerNode(data, null, false, ASN1_TAGS.INTEGER, 0, data ? data.length : 0);
    },

    /**
     * Create an OCTET STRING node.
     * @param {Uint8Array|null} data
     * @returns {DerNode}
     */
    octetString(data) {
        return new DerNode(data, null, false, ASN1_TAGS.OCTET_STRING, 0, data ? data.length : 0);
    },
};

// ---------------------------------------------------------------------------
// Internal parsing / serialization helpers
// ---------------------------------------------------------------------------

/** Recursion depth guard for DER parsing. */
let parseDepth = 0;

/**
 * Check whether `length` bytes at `buffer[offset]` match the RSA OID.
 * @param {Uint8Array} buffer
 * @param {number} offset
 * @param {number} length
 * @returns {boolean}
 */
function isRsaOid(buffer, offset, length) {
    if (length !== 9) return false;
    for (let i = 0; i < 9; i++) {
        if (buffer[offset++] !== RSA_OID[i]) return false;
    }
    return true;
}

/**
 * Read a DER length field from the stream.
 * Supports short-form (single byte <=127) and long-form (up to 3 extra bytes).
 *
 * @param {DerStream} stream
 * @returns {number} decoded length, or -1 on error
 */
function readDerLength(stream) {
    const firstByte = stream.readByte();
    const shortLength = firstByte & 0x7F;

    // Short form: high bit not set
    if (shortLength === firstByte) return shortLength;

    // Long form: shortLength encodes the number of subsequent length bytes
    if (shortLength > 3 || shortLength === 0) return -1;

    let length = 0;
    for (let i = 0; i < shortLength; i++) {
        length = (length << 8) | stream.readByte();
    }
    return length;
}

/**
 * Serialize a DerNode (and its subtree) into the given DerStream.
 *
 * @param {DerNode} node
 * @param {DerStream} stream
 * @returns {boolean} true on success
 */
function serializeNode(node, stream) {
    // Write the tag byte: class (2 bits) | constructed (1 bit) | tag number (5 bits)
    stream.writeByte((node.tagClass << 6) | (node.constructed << 5) | node.error);

    // Write the length field
    const contentLen = node.contentLength;
    if (contentLen < 128) {
        stream.writeByte(contentLen);
    } else {
        // Determine how many bytes needed to encode the length
        let numLenBytes = 0;
        for (let tmp = contentLen; tmp; tmp >>= 8) {
            numLenBytes++;
        }
        stream.writeByte(0x80 | numLenBytes);
        for (let i = 0; i < numLenBytes; i++) {
            stream.writeByte((contentLen >> (8 * (numLenBytes - i - 1))) & 0xFF);
        }
    }

    // Write the content
    if (node.firstChild) {
        // Constructed: recurse into children
        if (node.error === ASN1_TAGS.BIT_STRING) {
            stream.writeByte(0); // unused bits byte
        }
        let child = node._firstChild;
        while (child) {
            if (!serializeNode(child, stream)) return false;
            child = child.nextSibling;
        }
    } else {
        // Primitive: write value bytes depending on tag type
        switch (node.error) {
            case ASN1_TAGS.INTEGER:
                // Pad with 0x00 if high bit set to keep positive
                if (node.rawBuffer[node.dataOffset] >> 7) {
                    stream.writeByte(0);
                }
                stream.copyBytes(node.rawBuffer, node.dataOffset, node.dataLength);
                break;
            case ASN1_TAGS.BIT_STRING:
                stream.writeByte(0); // unused bits = 0
                stream.copyBytes(node.rawBuffer, node.dataOffset, node.dataLength);
                break;
            case ASN1_TAGS.OCTET_STRING:
                stream.copyBytes(node.rawBuffer, node.dataOffset, node.dataLength);
                break;
            case ASN1_TAGS.OBJECT_IDENTIFIER:
                stream.copyBytes(node.rawBuffer, node.dataOffset, node.dataLength);
                break;
        }
    }

    return true;
}

/**
 * Recursively parse DER bytes into a DerNode tree.
 *
 * @param {DerNode} node - the node to populate (already created)
 * @param {number} startOffset - byte offset into rawBuffer to begin parsing
 * @param {number} length - number of bytes to parse
 * @returns {DerNode|undefined}
 */
function parseDerTree(node, startOffset, length) {
    const rawData = node.rawBuffer;
    const stream = new DerStream(rawData, startOffset);
    const endOffset = startOffset + length;
    let current = node;

    // Guard against excessive recursion
    if (++parseDepth > 8) return undefined;

    while (stream.position < endOffset) {
        // Read the identifier byte
        let identifier = stream.readByte();

        // Handle long-form tag numbers (tag = 31 in low 5 bits)
        if ((identifier & 0x1F) === 31) {
            let longTag = 0;
            while (identifier & 0x80) {
                longTag <<= 8;
                longTag |= (identifier & 0x7F);
            }
            identifier = longTag;
        }

        const fullByte = identifier;
        const tagNumber = fullByte & 0x1F;

        // Validate tag number range
        if (tagNumber < 0 || tagNumber > 30) return undefined;

        // Read the length
        const valueLength = readDerLength(stream);
        if (valueLength < 0 || valueLength > stream.remaining()) return undefined;

        // Set node properties
        current.constructed = fullByte & 0x20;
        current.tagClass = (fullByte & 0xC0) >> 6;
        current.error = tagNumber;
        current.dataLength = valueLength;
        current.dataOffset = stream.position;

        // Determine if this node contains sub-structures
        let hasChildren;
        if (fullByte & 0x20) {
            // Explicitly constructed
            hasChildren = true;
        } else if (fullByte < ASN1_TAGS.BIT_STRING || fullByte > ASN1_TAGS.OCTET_STRING) {
            // Primitive and not BIT_STRING/OCTET_STRING: no children
            hasChildren = false;
        } else {
            // BIT_STRING or OCTET_STRING: check if they actually contain DER sub-structures
            const probe = new DerStream(stream);
            if (fullByte === ASN1_TAGS.BIT_STRING) probe.skip(1); // skip unused-bits byte
            if ((probe.readByte() >> 6) & 1) {
                hasChildren = false;
            } else {
                const innerLength = readDerLength(probe);
                hasChildren = (probe.position - stream.position + innerLength === valueLength);
            }
        }

        if (hasChildren) {
            let childStart = stream.position;
            let childLen = valueLength;
            if (current.error === ASN1_TAGS.BIT_STRING) {
                current.dataOffset++;
                current.dataLength--;
                childStart++;
                childLen--;
            }
            current.firstChild = new DerNode(rawData, current);
            parseDerTree(current.firstChild, childStart, childLen);
        }

        // Strip leading zero-padding on INTEGER values
        if (current.error === ASN1_TAGS.INTEGER) {
            const pos = stream.position;
            if (stream.peekByte(pos) === 0 && (stream.peekByte(pos + 1) >> 7)) {
                current.dataOffset++;
                current.dataLength--;
            }
        }

        // Advance past the value bytes
        stream.skip(valueLength);

        // If there is more data, create a sibling node
        if (stream.position < endOffset) {
            current.nextSibling = new DerNode(rawData, current.parent);
            current = current.nextSibling;
        }
    }

    parseDepth--;
    return node;
}

// ---------------------------------------------------------------------------
// Public API: structure detection
// ---------------------------------------------------------------------------

/**
 * Determine whether a parsed DER tree represents a PKCS#1 (SPKI-wrapped)
 * RSA public key.
 *
 * Structure expected:
 *   SEQUENCE (2 children)
 *     SEQUENCE (2 children) -> first child is the RSA OID
 *     BIT STRING -> SEQUENCE (2 children: n, e)
 *
 * @param {DerNode} root
 * @returns {boolean}
 */
export function isPkcs1PublicKey(root) {
    if (!(root && root.firstChild && root.firstChild.nextSibling &&
          root.firstChild.firstChild && root.firstChild.nextSibling.firstChild)) {
        return false;
    }
    const oidNode = root.firstChild.firstChild;
    return isRsaOid(oidNode.rawBuffer, oidNode.dataOffset, oidNode.dataLength) &&
           root.childCount === 2 &&
           root.firstChild.childCount === 2 &&
           root.firstChild.nextSibling.firstChild.childCount === 2;
}

/**
 * Determine whether a parsed DER tree represents a PKCS#8 RSA private key.
 *
 * Structure expected:
 *   SEQUENCE (3 children)
 *     INTEGER (version = 0)
 *     SEQUENCE (2 children) -> first child is RSA OID
 *     OCTET STRING -> SEQUENCE (9 children: version, n, e, d, p, q, dp, dq, qi)
 *
 * @param {DerNode} root
 * @returns {boolean}
 */
export function isPkcs8PrivateKey(root) {
    if (!(root && root.firstChild && root.firstChild.nextSibling &&
          root.firstChild.nextSibling.firstChild &&
          root.firstChild.nextSibling.nextSibling &&
          root.firstChild.nextSibling.nextSibling.firstChild)) {
        return false;
    }
    const oidNode = root.firstChild.nextSibling.firstChild;
    return isRsaOid(oidNode.rawBuffer, oidNode.dataOffset, oidNode.dataLength) &&
           root.childCount === 3 &&
           root.firstChild.nextSibling.childCount === 2 &&
           root.firstChild.nextSibling.nextSibling.firstChild.childCount === 9;
}

// ---------------------------------------------------------------------------
// Public API: DER building
// ---------------------------------------------------------------------------

/**
 * Build a SubjectPublicKeyInfo (SPKI) DER structure from an RSA public key.
 *
 * @param {RsaPublicKey} publicKey
 * @returns {DerNode} root SEQUENCE node (use `.derEncoded` to get bytes)
 */
export function buildSpkiDer(publicKey) {
    const root = derNodeFactory.sequence();
    const builder = new DerTreeBuilder(root);

    // AlgorithmIdentifier SEQUENCE
    builder.addChild(derNodeFactory.sequence());
    builder.addChild(derNodeFactory.objectIdentifier(RSA_OID));
    builder.addSibling(derNodeFactory.nullValue());

    // SubjectPublicKey BIT STRING containing SEQUENCE { n, e }
    builder.addToAncestor(root, derNodeFactory.bitString(null));
    builder.addChild(derNodeFactory.sequence());
    builder.addChild(derNodeFactory.integer(publicKey.n));
    builder.addSibling(derNodeFactory.integer(publicKey.e));

    return root;
}

/**
 * Build a PKCS#8 PrivateKeyInfo DER structure from an RSA private key.
 *
 * @param {RsaPrivateKey} privateKey
 * @returns {DerNode} root SEQUENCE node (use `.derEncoded` to get bytes)
 */
export function buildPkcs8Der(privateKey) {
    const root = derNodeFactory.sequence();
    const builder = new DerTreeBuilder(root);

    // Version INTEGER (0)
    builder.addChild(derNodeFactory.integer(new Uint8Array([0])));

    // AlgorithmIdentifier SEQUENCE
    builder.addSibling(derNodeFactory.sequence());
    builder.addChild(derNodeFactory.objectIdentifier(RSA_OID));
    builder.addSibling(derNodeFactory.nullValue());

    // PrivateKey OCTET STRING containing SEQUENCE { version, n, e, d, p, q, dp, dq, qi }
    builder.addToAncestor(root, derNodeFactory.octetString(null));
    builder.addChild(derNodeFactory.sequence());
    builder.addChild(derNodeFactory.integer(new Uint8Array([0])));
    builder.addSibling(derNodeFactory.integer(privateKey.n));
    builder.addSibling(derNodeFactory.integer(privateKey.e));
    builder.addSibling(derNodeFactory.integer(privateKey.d));
    builder.addSibling(derNodeFactory.integer(privateKey.p));
    builder.addSibling(derNodeFactory.integer(privateKey.q));
    builder.addSibling(derNodeFactory.integer(privateKey.dp));
    builder.addSibling(derNodeFactory.integer(privateKey.dq));
    builder.addSibling(derNodeFactory.integer(privateKey.qi));

    return root;
}

// ---------------------------------------------------------------------------
// Public API: DER parsing
// ---------------------------------------------------------------------------

/**
 * Parse raw DER bytes into a DerNode tree.
 *
 * @param {Uint8Array} derBytes
 * @returns {DerNode|undefined}
 */
export function parseDerBytes(derBytes) {
    parseDepth = 0;
    return parseDerTree(new DerNode(derBytes), 0, derBytes.length);
}

/**
 * Parse an SPKI DER structure and extract the RSA public key components.
 *
 * @param {Uint8Array} derBytes
 * @returns {RsaPublicKey|undefined}
 */
function parseSpkiPublicKey(derBytes) {
    const root = parseDerBytes(derBytes);
    if (isPkcs1PublicKey(root)) {
        return extractPublicKey(root);
    }
    return undefined;
}

/**
 * Parse a PKCS#8 DER structure and extract the RSA private key components.
 *
 * @param {Uint8Array} derBytes
 * @returns {RsaPrivateKey|undefined}
 */
function parsePkcs8PrivateKey(derBytes) {
    const root = parseDerBytes(derBytes);
    if (isPkcs8PrivateKey(root)) {
        return extractPrivateKey(root);
    }
    return undefined;
}

/**
 * Extract an RsaPublicKey from a parsed SPKI DER tree.
 * @param {DerNode} root
 * @returns {RsaPublicKey}
 */
function extractPublicKey(root) {
    // Navigate: root -> child[1] (BIT STRING) -> firstChild (SEQUENCE) -> firstChild (n)
    let node = root.firstChild.nextSibling.firstChild.firstChild;
    const n = node.data;
    node = node.nextSibling;
    const e = node.data;
    return new RsaPublicKey(n, e, null, null);
}

/**
 * Extract an RsaPrivateKey from a parsed PKCS#8 DER tree.
 * @param {DerNode} root
 * @returns {RsaPrivateKey}
 */
function extractPrivateKey(root) {
    const fields = [];
    // Navigate: root -> child[2] (OCTET STRING) -> firstChild (SEQUENCE) -> child[1] (skip version)
    let node = root.firstChild.nextSibling.nextSibling.firstChild.firstChild.nextSibling;
    for (let i = 0; i < 8; i++) {
        fields.push(node.data);
        node = node.nextSibling;
    }
    return new RsaPrivateKey(
        fields[0], fields[1], fields[2], fields[3],
        fields[4], fields[5], fields[6], fields[7],
    );
}

// ---------------------------------------------------------------------------
// Public API: JWK conversion
// ---------------------------------------------------------------------------

/**
 * Convert an RSA key object to JWK format.
 *
 * @param {RsaPublicKey|RsaPrivateKey} rsaKey
 * @param {string} alg - JWK algorithm identifier (e.g. "RS256")
 * @param {string[]} [keyOps] - allowed key operations
 * @param {boolean} [extractable=false]
 * @returns {object|undefined} JWK object, or undefined on invalid input
 */
export function rsaKeyToJwk(rsaKey, alg, keyOps, extractable) {
    if (!(rsaKey instanceof RsaPublicKey || rsaKey instanceof RsaPrivateKey)) {
        return undefined;
    }

    // Validate key operations
    if (keyOps) {
        for (let i = 0; i < keyOps.length; i++) {
            if (VALID_KEY_OPS.indexOf(keyOps[i]) === -1) return undefined;
        }
    }

    const jwk = {
        kty: 'RSA',
        alg,
        key_ops: keyOps || [],
        ext: extractable === undefined ? false : extractable,
        n: Base64Utils.stringifyFn(rsaKey.n, true),
        e: Base64Utils.stringifyFn(rsaKey.e, true),
    };

    if (rsaKey instanceof RsaPrivateKey) {
        jwk.d = Base64Utils.stringifyFn(rsaKey.d, true);
        jwk.p = Base64Utils.stringifyFn(rsaKey.p, true);
        jwk.q = Base64Utils.stringifyFn(rsaKey.q, true);
        jwk.dp = Base64Utils.stringifyFn(rsaKey.dp, true);
        jwk.dq = Base64Utils.stringifyFn(rsaKey.dq, true);
        jwk.qi = Base64Utils.stringifyFn(rsaKey.qi, true);
    }

    return jwk;
}

/**
 * Convert a JWK object to an RSA key instance.
 *
 * @param {object} jwk - JWK with kty="RSA"
 * @returns {RsaPublicKey|RsaPrivateKey|undefined}
 */
export function jwkToRsaKey(jwk) {
    if (!jwk.kty || jwk.kty !== 'RSA' || !jwk.n || !jwk.e) {
        return undefined;
    }

    if (jwk.alg && SUPPORTED_RSA_ALGORITHMS.indexOf(jwk.alg) === -1) {
        return undefined;
    }

    // Derive key_ops from "use" field if present, otherwise use key_ops directly
    let keyOps = [];
    if (jwk.use) {
        if (jwk.use === 'enc') {
            keyOps = ['encrypt', 'decrypt', 'wrap', 'unwrap'];
        } else if (jwk.use === 'sig') {
            keyOps = ['sign', 'verify'];
        }
    } else {
        keyOps = jwk.key_ops;
    }

    const ext = jwk.ext;
    const n = Base64Utils.decodeBase64(jwk.n, true);
    const e = Base64Utils.decodeBase64(jwk.e, true);

    if (jwk.d) {
        // Private key
        const d = Base64Utils.decodeBase64(jwk.d, true);
        const p = Base64Utils.decodeBase64(jwk.p, true);
        const q = Base64Utils.decodeBase64(jwk.q, true);
        const dp = Base64Utils.decodeBase64(jwk.dp, true);
        const dq = Base64Utils.decodeBase64(jwk.dq, true);
        const qi = Base64Utils.decodeBase64(jwk.qi, true);
        return new RsaPrivateKey(n, e, d, p, q, dp, dq, qi, jwk.alg, keyOps, ext);
    }

    return new RsaPublicKey(n, e, ext, keyOps);
}

/**
 * Parse DER bytes, detect whether it is SPKI or PKCS#8, and convert to JWK.
 *
 * @param {Uint8Array} derBytes
 * @param {string} alg - JWK algorithm identifier
 * @param {string[]} [keyOps]
 * @param {boolean} [extractable]
 * @returns {object|undefined} JWK object
 */
export function derBytesToJwk(derBytes, alg, keyOps, extractable) {
    const root = parseDerBytes(derBytes);
    if (!root) return undefined;

    let rsaKey;
    if (isPkcs1PublicKey(root)) {
        rsaKey = extractPublicKey(root);
    } else if (isPkcs8PrivateKey(root)) {
        rsaKey = extractPrivateKey(root);
    } else {
        return undefined;
    }

    return rsaKeyToJwk(rsaKey, alg, keyOps, extractable);
}

/**
 * Convert a JWK to a DerKeyWrapper containing the appropriate DER encoding.
 * Public keys produce SPKI format; private keys produce PKCS#8.
 *
 * @param {object} jwk
 * @returns {DerKeyWrapper|undefined}
 */
export function jwkToDerKeyWrapper(jwk) {
    const rsaKey = jwkToRsaKey(jwk);
    if (!rsaKey) return undefined;

    let type, derBytes;
    if (rsaKey instanceof RsaPublicKey) {
        type = 'spki';
        derBytes = buildSpkiDer(rsaKey).derEncoded;
    } else if (rsaKey instanceof RsaPrivateKey) {
        type = 'pkcs8';
        derBytes = buildPkcs8Der(rsaKey).derEncoded;
    } else {
        return undefined;
    }

    return new DerKeyWrapper(derBytes, type, rsaKey.keyOps, rsaKey.ext);
}

/**
 * Normalize Web Crypto key operations: translate "wrapKey"/"unwrapKey" to
 * the shortened "wrap"/"unwrap" form used internally.
 *
 * @param {string[]} ops
 * @returns {string[]}
 */
export function normalizeKeyOps(ops) {
    return ops.map(op => {
        if (op === 'wrapKey') return 'wrap';
        if (op === 'unwrapKey') return 'unwrap';
        return op;
    });
}

/**
 * Map a Web Crypto algorithm descriptor to its JWK "alg" string.
 *
 * @param {object} algorithm - e.g. { name: "RSASSA-PKCS1-v1_5", hash: { name: "SHA-256" } }
 * @returns {string|undefined}
 */
export function algorithmToJwkAlg(algorithm) {
    if (algorithm.name === 'RSAES-PKCS1-v1_5') {
        return 'RSA1_5';
    }
    if (algorithm.name === 'RSASSA-PKCS1-v1_5') {
        if (algorithm.hash.name === 'SHA-256') return 'RS256';
        if (algorithm.hash.name === 'SHA-384') return 'RS384';
        if (algorithm.hash.name === 'SHA-512') return 'RS512';
    }
    return undefined;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

// Named exports (already exported inline above via `export function`):
//   ASN1_TAGS, derNodeFactory, isPkcs1PublicKey, isPkcs8PrivateKey,
//   buildSpkiDer, buildPkcs8Der, parseDerBytes, rsaKeyToJwk, jwkToRsaKey,
//   derBytesToJwk, jwkToDerKeyWrapper, normalizeKeyOps, algorithmToJwkAlg

export {
    DerStream,
    DerNode,
    DerTreeBuilder,
    RsaPrivateKey,
    RsaPublicKey,
    DerKeyWrapper,
    parseSpkiPublicKey,
    parsePkcs8PrivateKey,
};
