/**
 * Play Prediction Validator
 *
 * Validates the result object returned by the play-prediction model.
 * Asserts that the result is a properly-shaped object with the required
 * numeric fields: `requiredBufferingLength` and `predictedRebufferCount`.
 * These fields may be absent only if the mediaSource is null.
 *
 * Used as a sanity check on ABR (adaptive bitrate) prediction outputs
 * before they are consumed by the stream selection logic.
 *
 * @module abr/PlayPredictionValidator
 * @original Module_71915
 */

// import { assert } from './Assert'; // Module 52571

/**
 * Validates a play-prediction result object.
 *
 * @param {Object} result - The prediction result to validate.
 * @param {number|null} result.mediaSource - The media source (null if unavailable).
 * @param {number} [result.requiredBufferingLength] - Required buffering length in ms.
 * @param {number} [result.predictedRebufferCount] - Predicted number of rebuffer events.
 * @throws {Error} If the result is not an object or required fields are wrong type.
 */
export function validatePlayPredictionResult(result) {
  assert(typeof result === "object", "Result is not an object");

  if (result && result.mediaSource !== null) {
    assert(
      typeof result.requiredBufferingLength === "number",
      "Result required buffering length is not a number"
    );
    assert(
      typeof result.predictedRebufferCount === "number",
      "Result number of predicted rebuffers is not a number"
    );
  }
}
