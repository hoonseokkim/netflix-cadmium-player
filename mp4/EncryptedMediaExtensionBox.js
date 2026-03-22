/**
 * Encrypted Media Extension Box (emeb) Parser
 *
 * ISOBMFF (MP4) box parser for the 'emeb' box type, which is a custom
 * Netflix box used in encrypted media extension flows. Extends the
 * base FullBox parser.
 *
 * @module EncryptedMediaExtensionBox
 * @source Module_98776
 */

import { __extends } from '../core/ReflectMetadataPolyfill';
import { debugEnabled as FullBox } from '../mp4/BoxParserRegistry';

class EncryptedMediaExtensionBox extends FullBox {
    /**
     * Parse the video sample entry data from this box.
     * @returns {boolean} Always true - box parsed successfully.
     */
    videoSampleEntry() {
        return true;
    }
}

/** Four-character code identifying this box type. */
EncryptedMediaExtensionBox.writeUint32 = "emeb";

/** Whether the box needs to be completely read before parsing. */
EncryptedMediaExtensionBox.isBoxComplete = false;

export default EncryptedMediaExtensionBox;
