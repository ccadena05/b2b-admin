import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStoreService } from "../local-store.service";
import { environment } from 'src/environments/environment';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { DomSanitizer } from '@angular/platform-browser';
import { config } from 'src/config';
import { JwtAuthService } from '../auth/jwt-auth.service';
import { Response } from 'src/app/models/response.model';
import { from, lastValueFrom, map, take } from 'rxjs';

@Injectable({
   providedIn: 'root'
})

export class ProviderService {
/*    JWT_TOKEN = "B2B_TOKEN";
   APP_USER = "B2B_TOKEN_USER"; */
   public _url = '/_api.php?opcion=';
   public _urlMobile = '/_api.php?Funcion=';
   public mentores: any;
   countriesHeaders = new Headers();
   urlAdmin = config.apiAdminProdUrl;
   url = config.apiProdUrl;

   resultadoHTML: any;   

   
   constructor(
      private http: HttpClient,
      //private cookies: CookieService,
      private ls: LocalStoreService,
      private sanitizer: DomSanitizer,
      private jwt: JwtAuthService
   ) { }

   BD_ActionPost( modelo: any, action: any, data?: any ) {
      // console.log(this.url + modelo + this._url + action, data, {headers: this.headers()});
      return this.http.post(this.url + modelo + this._url + action, data, {
         headers: this.headers()
      });
   }

   BD_ActionGet( modelo: any, action: any, params?: any ) {
      console.log(this.url + modelo + this._url + action, { headers: this.headers(), params: this.params(params)});
      let get = this.http.get<Response>(this.url + modelo + this._url + action, { headers: this.headers(), params: this.params(params)})

      return get;
   }

   BD_ActionPut( modelo: any, action: any, data?: any ) {
      console.log(this.url + modelo + this._url + action, data, { headers: this.headers()});
      let put = this.http.put(this.url + modelo + this._url + action, data, { headers: this.headers()})

      return put;
   }

   BD_ActionAdminPost( modelo: any, action: any, data?: any ) {
      console.log(this.urlAdmin + modelo + this._url + action, data, {headers: this.headers()});
      return this.http.post(this.urlAdmin + modelo + this._url + action, data, {
         headers: this.headers()
      });
   }

   BD_ActionAdminGet( modelo: any, action: any, params?: any ) {
      console.log(this.urlAdmin + modelo + this._url + action, { headers: this.headers(), params: this.params(params)});
      let get = this.http.get<Response>(this.urlAdmin + modelo + this._url + action, { headers: this.headers(), params: this.params(params)})

      return get;
   }

   BD_ActionAdminPut( modelo: any, action: any, data?: any ) {
      console.log(this.urlAdmin + modelo + this._url + action, data, { headers: this.headers()});
      let put = this.http.put(this.urlAdmin + modelo + this._url + action, data, { headers: this.headers()})

      return put;
   }

   BD_ActionAdminDel( modelo: any, action: any, params: any ) {
      console.log(this.urlAdmin + modelo + this._url + action, { headers: this.headers(), params: this.params(params)});
      let put = this.http.delete(this.urlAdmin + modelo + this._url + action, { headers: this.headers(), params: this.params(params)})
      return put;
   }

   Prod_ActionPost(url: any, data?: any) {
      //   console.log(this.url + modelo + this._url + action, data);
      return this.http.get(url, data);
   }

/*    Geocoding(lat: any, lon: any){
      return this.http.get('https://geocode.maps.co/reverse?lat=' + lat + '&lon=' + lon);
   } */

   BD_ActionUpload(data: any) {
      //console.log(this.url + modelo + this._url + action);
      //console.log(data);
      return this.http.post(this.url + '/quill/upload.php', data
      );
   }

   BD_ActionGetMobile(modelo: any, action: any, data: any) {
      return this.http.get(this.url + modelo + this._urlMobile + action + '&' + data, {
         //headers: new HttpHeaders().set('Authorization', this.getJwtToken())
      });
   }

   BD_ActionGetInfo(modelo: any, action: any, data: any) {
      return this.http.get(this.url + modelo + this._url + action + data, {
      });
   }

   BD_ActionGetGeolocalizacion(lat: any, lng: any) {
      const token = 'b73cf933-89f0-410a-94be-2fd256d7c2a8';
      return this.http.get('https://api.copomex.com/query/info_cp_geocoding_reverse?lat=' + lat + '&lng=' + lng + '&token=' + token);
   }

   getJwtToken() {
      //console.log(this.ls.getItem(this.JWT_TOKEN));
      return this.ls.getItem(config.APP_TOKEN);
   }

   getUser() {
      return this.ls.getItem(config.APP_USER);
   }

   location(url: any) {
      console.log(url);

      let headers = new HttpHeaders;
      headers = headers.set("X-CSCAPI-KEY", "OWFneHR0OXduYVZIMTYxbTlENzUxQjg5SnhaeEZleWhZR1FyWXJ2QQ==")
      return this.http.get(url, { headers: headers })
   }

   headers() {
      return new HttpHeaders().set('Authorization', this.jwt.getJwtToken()).set('Simpleauthb2b', '4170ae818f2e146c48cf824667947b25')
   }

   params(params: any) {
      return new HttpParams().set('params', encodeURIComponent(JSON.stringify(params)))
   }
}
