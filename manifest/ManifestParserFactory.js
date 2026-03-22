/**
 * Netflix Cadmium Player -- ManifestParserFactory
 *
 * Factory class (injectable via inversify) that creates parsed manifest
 * objects from raw manifest responses. Handles auxiliary manifests,
 * validates manifest type (rejects muxed/studio manifests), and
 * initializes link resolution for each manifest.
 *
 * @module manifest/ManifestParserFactory
 * @original Module_47930
 * @dependencies
 *   Module 22970 - tslib (__decorate, __param)
 *   Module 22674 - inversify (injectable, inject, multiInject)
 *   Module 81025 - link resolver symbol (internal_Rib)
 *   Module 60042 - manifest validator symbol (ugb)
 *   Module 31149 - error factory (we.T4c)
 *   Module 36129 - event type enums (MANIFEST, STUDIO_MUXED_MANIFEST)
 *   Module 91176 - manifest sort/normalize (UQb, XIb)
 *   Module 704   - manifest transformer multi-inject symbol (vgb)
 */

import { __decorate, __param } from '../utils/TsLibHelpers';
import { injectable, inject as injectDecorator, multiInject } from '../ioc/InversifyCore';
import { LinkResolverFactorySymbol } from '../symbols/LinkResolverFactorySymbol';       // Module 81025
import { ManifestValidatorSymbol } from '../symbols/ManifestValidatorSymbol';            // Module 60042
import { ErrorFactory } from '../core/ErrorFactory';                                      // Module 31149
import { EventCategory, EventTypeEnum } from '../core/EventTypes';                        // Module 36129
import { sortManifestStreams, defaultStreamSortOrder } from '../utils/ObjectUtils';        // Module 91176
import { ManifestTransformerSymbol } from '../symbols/ManifestTransformerSymbol';          // Module 704

/**
 * Factory that parses and wraps raw manifest responses into
 * structured manifest objects with link resolution.
 */
class ManifestParserFactory {
    /**
     * @param {Function} linkResolverFactory - Factory to create link resolver instances
     * @param {Object} manifestValidator - Validates manifest data
     * @param {Array<Object>} manifestTransformers - Array of manifest transformers to apply
     */
    constructor(linkResolverFactory, manifestValidator, manifestTransformers) {
        this.linkResolverFactory = linkResolverFactory;
        this.manifestValidator = manifestValidator;
        this.manifestTransformers = manifestTransformers;
    }

    /**
     * Create a parsed manifest wrapper from a raw manifest response.
     *
     * @param {Object} rawManifest - The raw manifest response
     * @returns {Object|undefined} Parsed manifest wrapper with links, or undefined if invalid
     * @throws {Error} If the manifest is a muxed/studio manifest type
     */
    create(rawManifest) {
        if (!rawManifest || this._isRuntimeManifest(rawManifest)) {
            return undefined;
        }

        if (this._isMuxedManifest(rawManifest)) {
            throw ErrorFactory.createError(
                EventCategory.MANIFEST,
                EventTypeEnum.STUDIO_MUXED_MANIFEST,
                rawManifest
            );
        }

        // Apply all registered manifest transformers
        this.manifestTransformers.forEach((transformer) => {
            transformer.transform(rawManifest);
            const auxiliaryManifests = rawManifest.auxiliaryManifests;
            if (auxiliaryManifests) {
                auxiliaryManifests.forEach((auxManifest) => {
                    transformer.transform(auxManifest);
                });
            }
        });

        // Sort/normalize manifest streams
        sortManifestStreams(rawManifest, defaultStreamSortOrder);

        // Create link resolver for primary manifest
        const links = this.linkResolverFactory();
        links.initialize(rawManifest.links);

        // Validate the manifest
        this.manifestValidator.validate(rawManifest);

        return {
            manifest: rawManifest,
            links: links,
            isExpired: false,
            auxiliaryManifests: rawManifest.auxiliaryManifests
                ? rawManifest.auxiliaryManifests.map((auxManifest) => {
                    const auxLinks = this.linkResolverFactory();
                    auxLinks.initialize(auxManifest.links);
                    return {
                        manifest: auxManifest,
                        links: auxLinks,
                        isExpired: false,
                        auxiliaryManifests: [],
                    };
                })
                : [],
        };
    }

    /**
     * Checks if the manifest is a muxed (studio) manifest type.
     * @param {Object} manifest
     * @returns {boolean}
     */
    _isMuxedManifest(manifest) {
        return ("type" in manifest) && manifest.type === "muxed";
    }

    /**
     * Checks if this is a runtime manifest (not a standard content manifest).
     * @param {Object} manifest
     * @returns {boolean}
     */
    _isRuntimeManifest(manifest) {
        return ("runtime" in manifest) && !!manifest.runtime;
    }
}

export { ManifestParserFactory };
