/**
 * Netflix Cadmium Player - Prefetch Playgraph Factory
 *
 * Creates playgraph descriptors for prefetch items. Resolves the appropriate
 * playgraph structure based on the viewable key type (branch, supplemental,
 * or direct playgraph reference).
 *
 * @module prefetch/PrefetchPlaygraphFactory
 */

/**
 * Factory that resolves prefetch item contexts into playgraph descriptors.
 */
export class PrefetchPlaygraphFactory {
  /**
   * Resolve a prefetch item context into a playgraph descriptor.
   *
   * For branch/supplemental keys, loads the manifest and creates the
   * appropriate playgraph type. For direct keys, returns the embedded
   * playgraph reference.
   *
   * @param {Object} itemContext - The prefetch item context.
   * @param {Object} itemContext.wishListItem - The wish list item with key and manifest cache.
   * @returns {Promise<Object>} The resolved playgraph descriptor.
   */
  async resolvePlaygraph(itemContext) {
    const key = itemContext.wishListItem.key;

    if (isBranchKey(key) || isSupplementalKey(key)) {
      const trackIndex = getTrackIndex(key);
      const cacheEntry =
        itemContext.wishListItem.manifestCache.getManifestCacheEntry(trackIndex);
      const viewableData = await Promise.resolve(cacheEntry.viewablePromise);
      const manifestRef = viewableData.manifestRef;

      if (manifestRef.choiceMap) {
        return createChoiceMapPlaygraph(manifestRef.choiceMap, {
          config: viewableData.config,
        });
      }

      return createSimplePlaygraph(trackIndex, 'ps0');
    }

    // Direct playgraph reference embedded in the key
    return key.playgraph;
  }
}
