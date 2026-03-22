/**
 * @module StringFormatter
 * @description String formatting pipeline utility using a compose pattern.
 * Applies a series of formatting transformations to produce a final string.
 * Used internally for constructing formatted MSL/crypto identifiers.
 *
 * @original Module 11341
 */

import createWrapper from '../utils/FunctionWrapper.js';
import assignProperties from '../utils/AssignProperties.js';
import validate from '../utils/Validate.js';
import getDefaults from '../utils/StringFormatDefaults.js';
import getImplementation from '../utils/StringFormatImpl.js';
import getResetConfig from '../utils/StringFormatReset.js';

/**
 * Creates a string formatter that validates input and applies
 * the default formatting pipeline.
 *
 * @param {string} input - The string to format
 * @returns {string} The formatted string
 */
const applyFormat = createWrapper(getDefaults());

function formatString(input) {
    validate(input);
    return applyFormat(input);
}

assignProperties(formatString, {
    defaults: getDefaults,
    implementation: getImplementation,
    reset: getResetConfig
});

export default formatString;
