/**
 * @module LogBatcherSymbols
 * @description IoC injection tokens for the log batching subsystem.
 *              Original: Module_45118
 */

/** @type {string} Injection token for log batcher configuration */
export const LogBatcherConfigSymbol = "LogBatcherConfigSymbol";

/** @type {string} Injection token for the log batcher instance */
export const LogBatcherSymbol = "LogBatcherSymbol";

/** @type {string} Injection token for the log batcher provider */
export const LogBatcherProviderSymbol = "LogBatcherProviderSymbol";

export default {
    LogBatcherConfigSymbol,
    LogBatcherSymbol,
    LogBatcherProviderSymbol,
};
