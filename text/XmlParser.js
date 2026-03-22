/**
 * XML Parser Utility
 *
 * Parses XML strings into DOM documents with error handling.
 * Uses DOMParser and validates for parser errors before returning.
 *
 * @module XmlParser
 * @source Module_78857
 */
export default function XmlParser(module, exports, require) {
    var LogModule, StringUtils;

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    /**
     * Parses an XML string into a DOM Document.
     * Throws an error if the string is not valid XML or not a string.
     *
     * @param {string} xmlString - Raw XML text to parse
     * @returns {Document} Parsed XML DOM document
     * @throws {Error} "xml parser error" if the XML is malformed
     * @throws {Error} "bad xml text" if the input is not a string
     */
    exports.h5c = function parseXml(xmlString) {
        var doc, parserErrors;

        if ((0, StringUtils.n1)(xmlString)) {
            doc = new DOMParser().parseFromString(xmlString, "text/xml");
            parserErrors = doc.getElementsByTagName("parsererror");

            if (parserErrors && parserErrors[0]) {
                try {
                    LogModule.log.error("parser error details", {
                        errornode: new XMLSerializer().serializeToString(parserErrors[0]),
                        xmlData: xmlString.slice(0, 300),
                        fileSize: xmlString.length
                    });
                } catch (e) {}
                throw Error("xml parser error");
            }

            return doc;
        }

        throw Error("bad xml text");
    };

    LogModule = require(31276);
    StringUtils = require(32687);
}
