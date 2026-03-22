/**
 * @module core/DataSizeUnits
 * @description Defines data size units (bits, bytes, kilobytes, megabytes) as a
 *              unit conversion hierarchy. Each unit extends a base TimeUnitClass
 *              and provides factory methods for creating typed size values.
 *
 *              Unit hierarchy:
 *              - BITS:      1 bit (base unit)
 *              - BYTES:     8 bits
 *              - KILOBYTES: 1024 bytes (8192 bits)
 *              - MEGABYTES: 1024 kilobytes (8388608 bits)
 *
 * @see Module_72574
 */

import { TimeUnitClass, s8 as DataSizeUnitBase } from '../core/TimeUnitBase.js'; // Module 35201

/**
 * Extends the base data size unit class.
 * @class DataSizeUnit
 */
class DataSizeUnit extends DataSizeUnitBase {}

/** @type {DataSizeUnit} The bits unit (base unit, value = 1) */
const BITS = new DataSizeUnit(1, "b");

/** @type {DataSizeUnit} The bytes unit (8 bits) */
const BYTES = new DataSizeUnit(8 * BITS.unitName, "B", BITS);

/** @type {DataSizeUnit} The kilobytes unit (1024 bytes) */
const KILOBYTES = new DataSizeUnit(1024 * BYTES.unitName, "KB", BITS);

/** @type {DataSizeUnit} The megabytes unit (1024 kilobytes) */
const MEGABYTES = new DataSizeUnit(1024 * KILOBYTES.unitName, "MB", BITS);

/** @type {TimeUnitClass} Zero bytes constant */
const ZERO_BYTES = createBitValue(0);

/**
 * Creates a data size value in bits.
 * @param {number} value - The value in bits
 * @returns {TimeUnitClass} Typed data size value
 */
function createBitValue(value) {
  return new TimeUnitClass(value, BITS);
}

/**
 * Creates a data size value in bytes.
 * @param {number} value - The value in bytes
 * @returns {TimeUnitClass} Typed data size value
 */
function createByteValue(value) {
  return new TimeUnitClass(value, BYTES);
}

/**
 * Creates a data size value in kilobytes.
 * @param {number} value - The value in kilobytes
 * @returns {TimeUnitClass} Typed data size value
 */
function createKilobyteValue(value) {
  return new TimeUnitClass(value, KILOBYTES);
}

/**
 * Creates a data size value in megabytes.
 * @param {number} value - The value in megabytes
 * @returns {TimeUnitClass} Typed data size value
 */
function createMegabyteValue(value) {
  return new TimeUnitClass(value, MEGABYTES);
}

export {
  DataSizeUnit,
  BITS,          // fetchPayload
  BYTES,         // unitConversion
  KILOBYTES,     // oGa
  MEGABYTES,     // bhb
  ZERO_BYTES,    // seekToSample
  createBitValue as bitBuffer,
  createByteValue as la,
  createKilobyteValue as internal_Hhd,
  createMegabyteValue as $id,
};
