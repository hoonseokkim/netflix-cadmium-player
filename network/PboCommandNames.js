/**
 * @module PboCommandNames
 * @description Constants for PBO (Playback Orchestration) command names, HTTP header names,
 * and query parameter names used in communication with Netflix backend services.
 *
 * @original Module_19114
 */

/**
 * PBO command/endpoint names.
 * @enum {string}
 */
export const PboCommands = Object.freeze({
  LOGBLOB: 'logblob',
  MANIFEST: 'manifest',
  LICENSED_MANIFEST: 'licensedmanifest',
  LICENSE: 'license',
  EVENTS: 'events',
  BIND: 'bind',
  PING: 'ping',
  CONFIG: 'config',
  PREFETCH_LIVE_ADS: 'prefetchLiveAds',
  ALE_PROVISION: 'aleProvision',
});

/**
 * HTTP header names used in PBO requests.
 * @enum {string}
 */
export const PboRequestHeaders = Object.freeze({
  REQUEST_ID: 'X-Netflix.Request.id',
  REQUEST_ATTEMPT: 'X-Netflix.Request.Attempt',
  CLIENT_REQUEST_NAME: 'X-Netflix.Client.Request.name',
  BROWSER_NAME: 'x-netflix.browsername',
  BROWSER_VERSION: 'x-netflix.browserversion',
  OS_NAME: 'x-netflix.osname',
  OS_VERSION: 'x-xetflix.osversion',
  CLIENT_TYPE: 'x-netflix.clienttype',
  UI_VERSION: 'x-netflix.uiversion',
});

/**
 * Query/body parameter names for PBO requests.
 * @enum {string}
 */
export const PboRequestParams = Object.freeze({
  REQUEST_ID: 'reqId',
  REQUEST_ATTEMPT: 'reqAttempt',
  REQUEST_NAME: 'reqName',
  BROWSER_NAME: 'browsername',
  BROWSER_VERSION: 'browserversion',
  OS_NAME: 'osname',
  OS_VERSION: 'osversion',
  CLIENT_TYPE: 'clienttype',
  UI_VERSION: 'uiversion',
  MAIN_CONTENT_VIEWABLE_ID: 'mainContentViewableId',
});
