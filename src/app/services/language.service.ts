import { Injectable } from '@angular/core';
import { ProviderService } from './provider/provider.service';
import { Response } from '../models/response.model';
import { LocalStoreService } from './local-store.service';
import { config } from 'src/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormGroup } from '@angular/forms';
import { MasterService } from './master.service';

@Injectable({
   providedIn: 'root'
})
export class LanguageService {
   browser_language = navigator.language.slice(0, 2).toLocaleUpperCase()
   logged_in: boolean = this.ls.getItem(config.APP_TOKEN); // Verifica si el usuario ha iniciado sesión

   constructor(
      private http: HttpClient,
      private master: MasterService,
      private ls: LocalStoreService,
   ) {
      // this.get_languages();
   }

   get_full_lang(key: any, value: any): any {
      return this.ls.getItem('languages')?.find((lang: any) => lang[key] == value) ?? 2;
   }

   // Obtiene el texto correspondiente para un objeto dado
   get_text(object: any) { // [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }];
      if (object) {
         let keys = Object.keys(Array.isArray(object) ? object[0] : object);
         let app_languages = this.ls.getItem('languages')?.map((_lang: any) => _lang.language);

         if (keys.includes('text') && keys.includes('languages_id')) { // {"id": "","text": "","identifier": "","languages_id": ""}
            // Devuelve el texto en el idioma del usuario o el primer idioma si no se encuentra
            return object.find((text: any) => text.languages_id == this.user_lang?.id)?.text ?? object[0]?.text;
            /* 
            if (this.logged_in)                
               return object?.find((txt: any) => txt.languages_id == (this.user_lang?.id))?.['text']

            else if (!this.logged_in) 
               return object?.find((txt: any) => txt.languages_id == (this.user_lang?.id))?.['text']

            else 
               return object?.['ES']
            return (object?.find((txt: any) => txt.languages_id == (this.user_lang?.id ?? this.get_full_lang('language', this.translate.getBrowserLang()?.toLocaleUpperCase())?.id ?? 2)
            ) ?? object[0])?.text;
            */
         }
         else if (keys.some(key => app_languages.includes(key)) || (keys.includes('EN') || keys.includes('ES'))) { // {"EN": "","ES": ""}
            // Devuelve el texto en el idioma del usuario o en español si no se encuentra
            // let text = ''
            if (typeof object[this.user_lang?.language] == 'string' && object?.[this.user_lang?.language].length > 1)
               return object?.[this.user_lang?.language]
            else if (typeof object['ES'] == 'string' && object?.['ES'].length > 1)
               return object?.['ES']
            else if (typeof object['EN'] == 'string' && object?.['EN'].length > 1)
               return object?.['EN']

            return object?.['ES']
         }
         return object;
      }
   }

   // Obtiene el idioma del usuario
   get user_lang() {
      if (this.logged_in)
         return this.ls.getItem(config.APP_LANG);

      else if (!this.logged_in)
         return this.get_full_lang('language', this.browser_language);

      else
         return { id: 2, language: "ES", name: "Spanish", emoji: "🇲🇽" };
   }
}
