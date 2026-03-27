/**
 * @module msg/MessageCapabilities
 * @description Represents and serializes/deserializes MSL (Message Security Layer)
 *              message capabilities. Capabilities include:
 *              - Compression algorithms supported by both sender and receiver
 *              - Languages for localized error messages
 *              - Encoder formats (e.g., JSON, CBOR) for message encoding
 *
 *              The `intersectCapabilities` function computes the intersection of
 *              two capability sets (e.g., client vs server) to find a common set.
 *
 * @see Module_68480
 */

import * as tslib from '../utils/tslib.js';                                    // Module 22970
import { fp as BaseSerializable } from '../msg/MessageBase.js';                // Module 48235
import { default as encodeAsync } from '../msl/AsyncEncoder.js';               // Module 42979
import { default as ArrayUtils } from '../utils/ArrayCompare.js';              // Module 14945
import { UJ as CompressionAlgorithms } from '../msl/CompressionAlgorithms.js'; // Module 51411
import { EncoderFormats as EncoderFormats } from '../msl/EncoderFormats.js';     // Module 65630
import { default as MslEncoderError } from '../msl/MslEncoderError.js';        // Module 6838
import { default as MslMessageError } from '../msl/MslMessageError.js';        // Module 88257
import { default as MslErrorCodes } from '../msl/MslErrorCodes.js';            // Module 36114

/**
 * Computes the intersection of two arrays preserving the order of the second array.
 * @param {Array} a - First array
 * @param {Array} b - Second array (order preserved)
 * @returns {Array} Elements present in both arrays
 * @private
 */
function intersect(a, b) {
  const lookup = {};
  const result = [];
  for (let i = 0; i < a.length; ++i) {
    lookup[a[i]] = true;
  }
  for (let i = 0; i < b.length; ++i) {
    if (lookup[b[i]]) {
      result.push(b[i]);
    }
  }
  return result;
}

/**
 * Computes the intersection of two MessageCapabilities objects.
 *
 * @param {MessageCapabilities} local - Local capabilities
 * @param {MessageCapabilities} remote - Remote capabilities
 * @returns {MessageCapabilities|null} Intersected capabilities, or null if either is missing
 */
function intersectCapabilities(local, remote) {
  if (!local || !remote) return null;

  const commonAlgorithms = intersect(local.compressionAlgorithms, remote.compressionAlgorithms);
  const commonLanguages = intersect(local.languages, remote.languages);
  const commonFormats = intersect(local.encoderFormats, remote.encoderFormats);

  return new MessageCapabilities(commonAlgorithms, commonLanguages, commonFormats);
}

/**
 * MSL message capabilities: compression algorithms, languages, and encoder formats.
 * @extends BaseSerializable
 */
class MessageCapabilities extends BaseSerializable {
  /**
   * @param {Array<string>} compressionAlgorithms - Supported compression algorithms
   * @param {Array<string>} languages - Supported languages
   * @param {Array<Object>} encoderFormats - Supported encoder formats
   */
  constructor(compressionAlgorithms, languages, encoderFormats) {
    super();
    compressionAlgorithms = compressionAlgorithms || [];
    languages = languages || [];
    encoderFormats = encoderFormats || [];
    compressionAlgorithms.sort();

    /** @type {Array<string>} */
    this.compressionAlgorithms = compressionAlgorithms;
    /** @type {Array<string>} */
    this.languages = languages;
    /** @type {Array<Object>} */
    this.encoderFormats = encoderFormats;
  }

  /**
   * Serializes capabilities into an MSL encoder object.
   * @param {Object} encoder - MSL encoder instance
   * @param {Object} format - Encoding format
   * @param {Function} callback - Completion callback
   */
  processData(encoder, format, callback) {
    encodeAsync(callback, () => {
      const obj = encoder.zf();
      obj.put("compressionalgos", encoder.W$(this.compressionAlgorithms));
      obj.put("languages", this.languages);

      const formatsArray = encoder.W$();
      for (let i = 0; i < this.encoderFormats.length; ++i) {
        formatsArray.put(-1, this.encoderFormats[i].name);
      }
      obj.put("encoderformats", formatsArray);

      encoder.cryptoFunction(obj, format, callback);
    });
  }

  /**
   * Checks equality with another MessageCapabilities instance.
   * @param {MessageCapabilities} other
   * @returns {boolean}
   */
  equals(other) {
    if (this === other) return true;
    if (!(other instanceof MessageCapabilities)) return false;
    return (
      ArrayUtils.T$(this.compressionAlgorithms, other.compressionAlgorithms) &&
      ArrayUtils.T$(this.languages, other.languages) &&
      ArrayUtils.T$(this.encoderFormats, other.encoderFormats)
    );
  }

  /**
   * Returns a string representation for caching/comparison.
   * @returns {string}
   */
  serialize() {
    return (
      this.compressionAlgorithms.join(":") +
      "|" +
      this.languages.join(":") +
      "|" +
      this.encoderFormats.join(":")
    );
  }
}

/**
 * Deserializes a MessageCapabilities from an MSL decoder object.
 *
 * @param {Object} decoder - MSL decoder/parser object
 * @returns {MessageCapabilities} Parsed capabilities
 * @throws {MslMessageError} If the data cannot be parsed
 */
function parseMessageCapabilities(decoder) {
  try {
    const algorithms = [];
    const algosArray = decoder.oxa("compressionalgos");
    for (let i = 0; algosArray && i < algosArray.size(); ++i) {
      const algo = algosArray.writeUint16(i);
      if (algo in CompressionAlgorithms) {
        algorithms.push(algo);
      }
    }

    const languages = [];
    const langsArray = decoder.oxa("languages");
    for (let i = 0; langsArray && i < langsArray.size(); ++i) {
      languages.push(langsArray.writeUint16(i));
    }

    const formats = [];
    const formatsArray = decoder.oxa("encoderformats");
    for (let i = 0; formatsArray && i < formatsArray.size(); ++i) {
      const formatName = formatsArray.writeUint16(i);
      const format = EncoderFormats.uVa(formatName);
      if (format) formats.push(format);
    }

    return new MessageCapabilities(algorithms, languages, formats);
  } catch (error) {
    if (error instanceof MslEncoderError) {
      throw new MslMessageError(MslErrorCodes.lf, "capabilities " + decoder, error);
    }
    throw error;
  }
}

export {
  intersectCapabilities,    // qYa
  MessageCapabilities,      // ehb
  parseMessageCapabilities, // ZMb
};
