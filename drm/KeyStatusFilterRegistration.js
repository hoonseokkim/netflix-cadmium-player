/**
 * @file KeyStatusFilterRegistration.js
 * @description Registers a key status filter with the DRM subsystem.
 *              When key status filtering is enabled in the config, this module
 *              creates a KeyStatusFilter instance that monitors and filters
 *              EME key status change events during playback.
 * @module drm/KeyStatusFilterRegistration
 * @original Module_2898
 */

import { internal_Vka as registerDrmPlugin } from '../drm/DrmSessionManager'; // Module 59032
import { config as drmConfig } from '../drm/DrmScheme'; // Module 29204
import { disposableList, debugManager, playerCore } from '../core/MetadataReader'; // Module 31276
import { gfb as KeyStatusFilter } from '../drm/KeyProvisionValidator'; // Module 25357
import { SC as KeyStatusFilterToken } from '../drm/EmeSession'; // Module 23563

/**
 * Self-executing registration that hooks into the DRM plugin system.
 * Only activates when keyStatusFilterEnabled is true in the DRM config.
 */
registerDrmPlugin((context, session) => {
  if (drmConfig.keyStatusFilterEnabled) {
    const keyStatusService = disposableList.key(KeyStatusFilterToken);
    return new KeyStatusFilter(context, session, debugManager, playerCore, keyStatusService.VVb);
  }
});
