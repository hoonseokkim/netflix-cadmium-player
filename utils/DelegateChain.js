/**
 * @module DelegateChain
 * @description Implements a chain-of-responsibility pattern for delegate functions.
 *              Each delegate in the chain can process a value and optionally pass
 *              it to the next delegate by calling next(). The last delegate must
 *              not invoke next().
 *              Original: Module_62613
 */

/**
 * Executes a chain of delegate functions in sequence.
 * Each delegate receives the current value and a `next` callback.
 */
class DelegateChain {
    /**
     * Runs a value through a chain of delegates.
     *
     * Each delegate has the signature: `(value, next) => result`
     * - `value`: the current value being processed
     * - `next`: callback to invoke the next delegate in the chain
     *
     * The last delegate must NOT call `next()` or an error is thrown.
     *
     * @static
     * @param {*} initialValue - The initial value to pass to the first delegate
     * @param {Function[]} delegates - Array of delegate functions to execute in order
     * @returns {*} The result from the chain
     * @throws {Error} If the last delegate calls next()
     */
    static execute(initialValue, delegates) {
        let currentIndex = 0;

        function next(value) {
            return getDelegate(currentIndex++)(value, next);
        }

        function getDelegate(index) {
            if (index >= delegates.length) {
                return () => {
                    throw Error(`The last delegate in the chain should not invoke next() nextDelegateIndex ${index}`);
                };
            }
            return delegates[index];
        }

        return next(initialValue);
    }
}

export { DelegateChain };
export default DelegateChain;
