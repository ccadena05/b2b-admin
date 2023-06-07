import { config } from "src/config";
export const environment = {
  production: true,
  apiURL: config.apiUrl,
  apiUrlBase: config.apiUrlBase,
  cloudName: config.upload_config.cloud_name,
  presets: config.upload_config.uploadPreset,
  recaptcha: {
    siteKey: '6LfcgW8dAAAAAIJQpxtqibE30_7ByB0cDtWcRwhD',
  },
  API_URL:'http://localhost:4200/'
};