// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { config } from "src/config";

export const environment = {
  production: false,
  apiURL: config.apiUrl,
  apiUrlBase: config.apiUrlBase,
  cloudName: config.upload_config.cloud_name,
  presets: config.upload_config.uploadPreset,
  recaptcha: {
    siteKey: '6LfcgW8dAAAAAIJQpxtqibE30_7ByB0cDtWcRwhD',
  },
  API_URL:'http://localhost:4200/',
  APP_LOCALE_ID: config.APP_LOCALE_ID
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
