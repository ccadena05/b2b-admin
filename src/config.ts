const PROTOCOL = window.location.protocol;
const DOMINIO = window.location.hostname;
const PORD_DOMINIO = 'b2b.ptsanmiguelense.com.mx';
//const DOMINIO = 'valledelamentefactura.com';
const WSERVICE = 'b2b-ws';

const cloudName = 'conexionb2b';
const presets = 'conexion_b2b';
const cloud_api_key = "635696783638373";
const cloud_api_secret = "NMRbL4YO3Oh5WbTMLDLhGQ0cJAE";
const geocoding_key = '0990fe8e9f14f1145f89bede40218b7b';
export const config = {
   apiUrlBase: PROTOCOL + '//' + DOMINIO + '/' + WSERVICE + '/',
   apiUrl: PROTOCOL + '//' + DOMINIO + '/' + WSERVICE + '/controllers/',
   apiProdUrl:  PROTOCOL + '//' + PORD_DOMINIO + '/' + WSERVICE + '/controllers/',
   apiUrlMobile: PROTOCOL + '//' + DOMINIO + '/' + WSERVICE + '/controllers/',

   apiAdminUrl: PROTOCOL + '//' + DOMINIO + '/' + WSERVICE + '/controllers_admin/',
   apiAdminProdUrl:  PROTOCOL + '//' + PORD_DOMINIO + '/' + WSERVICE + '/controllers_admin/',
   apiAdminUrlMobile: PROTOCOL + '//' + DOMINIO + '/' + WSERVICE + '/controllers_admin/',

   APP_TOKEN: "B2B_ADMN_TOKEN",
   APP_USER: "B2B_ADMN_USER",
   APP_PROFILE: "B2B_ADMN_PROFILE_USER",
   APP_COMPANY: "B2B_ADMN_PROFILE_COMPANY",
   APP_USER_PHOTO: "B2B_ADMN_USER_PHOTO",
   APP_COLOR: "B2B_ADMN_COLOR",
   APP_LANG: "B2B_ADMN_LANG",

   authRoles: {
      sa: ['SA'], // Only Super Admin has access
      admin: ['SA', 'Admin'], // Only SA & Admin has access
      editor: ['SA', 'Admin', 'Editor'], // Only SA & Admin & Editor has access
      user: ['SA', 'Admin', 'Editor', 'User'], // Only SA & Admin & Editor & User has access
      guest: ['SA', 'Admin', 'Editor', 'User', 'Guest'] // Everyone has access
   },
   APP_LOCALE_ID: "es-es",
   geocoding_key: geocoding_key,
   upload_config: {
      uploadPreset: presets,
      // resource_type: 'raw',
      cloud_name: cloudName,
      api_key: cloud_api_key,
      api_secret: cloud_api_secret,
      styles: {
         palette: {
            window: "#000259",
            sourceBg: "#0F172A",
            windowBorder: "#BBBDC3",
            tabIcon: "#F1F5F9",
            inactiveTabIcon: "#BBBDC3",
            menuIcons: "#F1F5F9",
            link: "#F1F5F9",
            action: "#F1F5F9",
            inProgress: "#0194c7",
            complete: "#149443",
            error: "#941443",
            textDark: "#000000",
            textLight: "#FFFFFF"
         },
         fonts: {
            default: null,
            "'Poppins', sans-serif": {
               url: "https://fonts.googleapis.com/css?family=Poppins",
               active: true
            }
         }
      }
   },
   langs: [
      { //Abreviación del idioma que estará en la librería ngx-translate
         id: 1,
         name: 'English', // Nombre del idioma (preferiblemente, en su propio idioma)
         flag: 'us', // Código de la bandera, de acuerdo a https://flagicons.lipis.dev/
         abbr: 'en'
      },
      {
         id: 2,
         name: 'Español',
         flag: 'mx',
         abbr: 'es'
      },
      {
         id: 3,
         name: 'Deutsch',
         flag: 'de',
         abbr: 'de'
      },
      {
         id: 4,
         name: 'Français',
         flag: 'fr',
         abbr: 'fr'
      }
   ]
}
