import { Injectable } from '@angular/core';
import { ProviderService } from './provider/provider.service';
import { Response } from '../models/response.model';
import { LocalStoreService } from './local-store.service';
import { config } from 'src/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
   providedIn: 'root'
})
export class LanguageService {
   _languages: any = [];
   lang_url = 'http://b2b.ptsanmiguelense.com.mx/b2b-ws/controllers/general/_api.php?opcion=get_languages';
  browser_language = navigator.language.slice(0,2).toLocaleUpperCase()

   constructor(
      private http: HttpClient,
      private ls: LocalStoreService,
   ) {
      this.get_languages();
   }

   get_languages() {
      this.http.get<Response>(this.lang_url, { headers: this.headers }).subscribe(
         (languages: Response) => {this._languages = languages.msg}
      )
   }

   get_full_lang(key: any, value: any): any {
      this.get_languages()
      return this._languages.find((lang: any) => lang[key] == value)
   }

   get_text(object: any) { // [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }];
      if (object) {
         let keys = Object.keys(Array.isArray(object) ? object[0] : object)
         let app_languages = this._languages?.map((_lang: any) => _lang.language);

         if (keys.includes('text') && keys.includes('languages_id')) {// {"id": "","text": "","identifier": "","languages_id": ""}
            return (object.find((txt: any) => {
               return txt.languages_id == (this.user_lang?.id ?? this.get_full_lang('language', this.browser_language)?.id ?? 2)
            }) ?? object[0])?.text;
         }
         
         else if (keys.some(key => app_languages.includes(key))) {// {"EN": "","ES": ""}       
            return object[this.user_lang.language] ?? object[this.browser_language ?? 'ES'] ?? object['ES'] ?? object['EN'];
         }

         return object;
      }
   }

   get headers() {
      return new HttpHeaders().set('Simpleauthb2b', '4170ae818f2e146c48cf824667947b25')
   }

   get user_lang() {
      return this.ls.getItem(config.APP_LANG) ?? this.get_full_lang('language', this.browser_language)
   }
}
