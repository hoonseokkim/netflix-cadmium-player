/**
 * Netflix Cadmium Player — Transducer Filter
 *
 * A Ramda-compatible transducer filter implementation. Wraps a predicate
 * function into the transducer protocol (@@transducer/init, @@transducer/result,
 * @@transducer/step) for composable, lazy filtering of sequences.
 *
 * This is a functional programming utility used internally for efficient
 * stream/collection transformations (likely from the Ramda library bundled
 * in Cadmium).
 *
 * @module utils/TransducerFilter
 * @original Module_14128
 */

import _curry2 from '../modules/Module_31187.js'; // Ramda _curry2
import { data as xfInit, result as xfResult } from '../modules/Module_18610.js'; // transducer base methods

/**
 * Transducer that filters elements by a predicate.
 * Conforms to the @@transducer protocol.
 */
class XFilter {
  /**
   * @param {Function} predicate - Filter predicate function.
   * @param {object} xf - Downstream transducer to delegate to.
   */
  constructor(predicate, xf) {
    /** @private */
    this.f = predicate;
    /** @private */
    this.xf = xf;
  }

  /**
   * Initialize the transducer chain.
   * @returns {*}
   */
  ['@@transducer/init']() {
    return xfInit.call(this);
  }

  /**
   * Finalize the transducer chain.
   * @param {*} result
   * @returns {*}
   */
  ['@@transducer/result'](result) {
    return xfResult.call(this, result);
  }

  /**
   * Process one element: if the predicate passes, forward to the
   * downstream transducer; otherwise skip.
   *
   * @param {*} accumulator - Current accumulated result.
   * @param {*} input - Current element being processed.
   * @returns {*} Updated accumulator.
   */
  ['@@transducer/step'](accumulator, input) {
    return this.f(input) ? this.xf['@@transducer/step'](accumulator, input) : accumulator;
  }
}

/**
 * Curried transducer filter factory.
 *
 * @param {Function} predicate - Filter predicate.
 * @param {object} xf - Downstream transducer.
 * @returns {XFilter} A new filter transducer.
 */
const xfilter = _curry2((predicate, xf) => new XFilter(predicate, xf));

export default xfilter;
