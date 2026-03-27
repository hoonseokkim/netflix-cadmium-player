/**
 * @module abr/StreamSelectionAssertions
 * @description Validation assertions for stream selection inputs. Verifies that
 *              buffer capacity, stream lists, playback rate, and player state
 *              are consistent before performing ABR stream selection.
 *
 * @see Module_79321
 */

import { assert } from '../assert/Assert.js';                   // Module 52571
import { playerPhase } from '../core/PlayerPhaseConstants.js';   // Module 65161

/**
 * Validates preconditions for stream selection.
 *
 * Checks:
 * 1. Buffer capacity must be defined and > 0
 * 2. Stream list must not be empty
 * 3. Each stream must be ready for selection (isUsable)
 * 4. Playback rate must be positive
 * 5. If no prior selection exists, player must be in STARTING state
 * 6. If a prior selection exists, player must NOT be in STARTING state
 *
 * @param {Object} context - Selection context with buffer, playbackRate, state
 * @param {Object} streamList - Available stream list with iteration methods
 * @param {Object} [priorSelection] - Previous selection result, if any
 */
function validateStreamSelectionInputs(context, streamList, priorSelection) {
  assert(
    context.buffer.ru !== undefined && context.buffer.ru > 0,
    "Buffer capacity must be > 0"
  );

  streamList.TL((streams) => {
    assert(streams.length > 0, "Stream list is empty");
  });

  streamList.JAb((stream) => {
    assert(stream.isReadyForSelection, "Stream isUsable is false");
  });

  assert(context.playbackRate > 0, "invalid playback rate");

  assert(
    (typeof priorSelection === "undefined") === (context.state === playerPhase.STARTING),
    "player must be in starting state when there is no prior selection"
  );

  assert(
    (typeof priorSelection !== "undefined") === (context.state !== playerPhase.STARTING),
    "player cannot be in starting state when there is a prior selection"
  );
}

export { validateStreamSelectionInputs };
