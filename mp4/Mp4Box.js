/**
 * Netflix Cadmium Player - MP4 Box Parser
 *
 * Parses ISO Base Media File Format (ISOBMFF / MP4) box structures.
 * Provides tree traversal, child box lookup, field reading, and
 * content manipulation for media container parsing.
 *
 * This is the foundational class for all MP4 parsing in the player,
 * handling moov, moof, mdat, and all nested box types.
 *
 * @module mp4/Mp4Box
 */

/** @type {boolean} Debug flag for verbose box parsing output. */
export const DEBUG_ENABLED = false;

/**
 * Represents a parsed MP4/ISOBMFF box (atom).
 */
export class Mp4Box {
  /**
   * @param {Object} reader - Binary data reader with positional access.
   * @param {string} type - Four-character box type code (e.g. "moov", "mdat").
   * @param {number} offset - Byte offset of the box in the stream.
   * @param {number} size - Total size of the box in bytes.
   * @param {Mp4Box|null} parent - Parent box reference (null for root).
   */
  constructor(reader, type, offset, size, parent) {
    /** @type {Object} */
    this.reader = reader;
    /** @type {string} */
    this.type = type;
    /** @type {number} */
    this.byteOffset = offset;
    /** @type {number} */
    this.byteLength = size;
    /** @type {Mp4Box|null} */
    this.parent = parent;
    /** @type {Object<string, Array<Mp4Box>>} */
    this.childrenMap = {};
    /** @private @type {number} */
    this._originalSize = size;
  }

  /**
   * Recursively finds all descendant boxes of a given type.
   *
   * @param {Mp4Box} box - Root box to search from.
   * @param {string} type - Box type to find.
   * @returns {Array<Mp4Box>}
   */
  static findAll(box, type) {
    let results = [];
    if (box.type === type) results.push(box);

    if (box.childrenMap) {
      for (const key in box.childrenMap) {
        const children = box.childrenMap[key];
        if (Array.isArray(children)) {
          children.forEach((child) => {
            if (child?.findAll) {
              const found = child.findAll(type);
              if (found.length) results = results.concat(found);
            }
          });
        }
      }
    }
    return results;
  }

  /**
   * Adds a child box to a parent's children map.
   */
  static addChild(parent, child) {
    if (parent.childrenMap[child.type] === undefined) {
      parent.childrenMap[child.type] = [];
    }
    parent.childrenMap[child.type].push(child);
  }

  /**
   * Finds the first descendant box of the given type.
   */
  static findFirst(box, type) {
    return Mp4Box.findAll(box, type)[0];
  }

  /** @returns {number} Starting byte offset. */
  get startOffset() { return this.byteOffset; }

  /** @returns {number} Total size in bytes. */
  get length() { return this.byteLength; }

  /** Reads the full box header (version + flags). */
  readFullBoxHeader() {
    const headerWord = this.reader.readUint32();
    this.version = headerWord >> 24;
    this.flags = headerWord & 0xffffff;
  }

  /** Adds a child box. */
  addChild(child) { Mp4Box.addChild(this, child); }

  /** Recursively finds all descendant boxes of a type. */
  findAll(type) { return Mp4Box.findAll(this, type); }

  /** Finds the first descendant box of a type. */
  findFirst(type) { return Mp4Box.findFirst(this, type); }

  /**
   * Finds a single unique child box by type.
   * @returns {Mp4Box|undefined}
   */
  findBox(type) {
    const children = this.childrenMap[type];
    if (children && Array.isArray(children) && children.length === 1) {
      return children[0];
    }
    return undefined;
  }

  /**
   * Reads typed fields from the box data.
   *
   * @param {string} type - "int8", "int16", "int32", "int64", "string".
   * @param {number} [maxLength]
   * @param {number} [count=1]
   * @returns {*}
   */
  readField(type, maxLength, count) {
    if (count > 1) {
      const results = [];
      while (count-- > 0) results.push(this._readSingleField(type, maxLength));
      return results;
    }
    return this._readSingleField(type, maxLength);
  }

  /**
   * Reads a structured set of fields using descriptors.
   * @param {Array<Object>} descriptors
   * @returns {Object}
   */
  readFields(descriptors) {
    const result = {};
    descriptors.forEach((descriptor) => {
      if (descriptor.type === 'offset') {
        const bitOffset = descriptor.offset;
        if (bitOffset % 8 !== 0) {
          throw new Error(`Offset ${descriptor.offset} is not byte-aligned`);
        }
        this.reader.offset += bitOffset / 8;
      } else {
        for (const key in descriptor) {
          const spec = descriptor[key];
          result[key] = typeof spec === 'string'
            ? this.readField(spec)
            : this.readField(spec.type, spec.length, spec.count);
        }
      }
    });
    return result;
  }

  /** @private */
  _readSingleField(type, maxLength) {
    const remaining = this.byteLength - this.reader.offset + this.startOffset;
    if (maxLength === undefined) maxLength = remaining;

    switch (type) {
      case 'int8': return this.reader.readUint8();
      case 'int64': return this.reader.readInt64();
      case 'int32': return this.reader.readUint32();
      case 'int16': return this.reader.readUint16();
      case 'string': return this.reader.readString(Math.min(maxLength, remaining));
      default: throw new Error(`Invalid type: ${type}`);
    }
  }
}
