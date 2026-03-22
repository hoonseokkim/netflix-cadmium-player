/**
 * @module IdentityTransformer
 * @description A no-op transformer that returns data unchanged.
 * Used as a default/passthrough in data processing pipelines
 * where transformation is optional.
 *
 * @original Module_603
 */

/**
 * @class IdentityTransformer
 */
export class IdentityTransformer {
  /**
   * Returns the input data unchanged.
   *
   * @param {*} data - The data to transform.
   * @returns {*} The same data, unmodified.
   */
  transform(data) {
    return data;
  }
}
