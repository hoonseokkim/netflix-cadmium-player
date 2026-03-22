/**
 * @module MediaEventParser
 * @description Parses binary-encoded media events from Netflix streams.
 * Reads a binary buffer containing a header (with length prefix) and body,
 * decodes the header as JSON, and returns the structured event.
 *
 * @original Module 11526
 */

import { BitReader } from '../mp4/BitReader.js';

/**
 * Parses binary media event messages from Netflix stream data.
 * Events follow the "urn:netflix:media_event:v1" schema.
 */
export class MediaEventParser {
    /**
     * URN identifier for the Netflix media event format.
     * @type {string}
     */
    static URN = "urn:netflix:media_event:v1";

    /**
     * @param {ArrayBuffer} buffer - The raw binary buffer containing the event
     * @param {Function} decoder - Function to decode bytes to string (e.g., UTF-8 decoder)
     * @param {Object} console - Console/logger for error reporting
     */
    constructor(buffer, decoder, console) {
        this.buffer = buffer;
        this._decoder = decoder;
        this.console = console;

        /** @type {BitReader} Reader for parsing binary data */
        this.bitReader = new BitReader(buffer, console);
    }

    /**
     * Parses the media event from the buffer.
     * Reads a length-prefixed header (decoded as JSON) followed by the raw body bytes.
     *
     * @returns {{ header: Object, body: Uint8Array }|undefined}
     *   The parsed event with header and body, or undefined if parsing fails
     */
    parse() {
        const headerLength = this.bitReader.readUint32();

        try {
            const headerBytes = this.bitReader.readBytes(headerLength);
            const headerString = this._decoder(headerBytes);
            var header = JSON.parse(headerString);
        } catch (error) {
            this.console.error("Invalid event header:", error);
            return undefined;
        }

        const body = this.bitReader.readBytes(
            this.buffer.byteLength - this.bitReader.offset
        );

        return { header, body };
    }
}
