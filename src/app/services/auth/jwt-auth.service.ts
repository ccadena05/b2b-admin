import { Injectable, NgZone } from "@angular/core";
import { LocalStoreService } from "../local-store.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { map, catchError, delay } from "rxjs/operators";
import { User } from "../../models/user.model";
import { of, BehaviorSubject, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { config } from "src/config";

// ================= only for demo purpose ===========
// const DEMO_TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjhkNDc4MDc4NmM3MjE3MjBkYzU1NzMiLCJlbWFpbCI6InJhZmkuYm9ncmFAZ21haWwuY29tIiwicm9sZSI6IlNBIiwiYWN0aXZlIjp0cnVlLCJpYXQiOjE1ODc3MTc2NTgsImV4cCI6MTU4ODMyMjQ1OH0.dXw0ySun5ex98dOzTEk0lkmXJvxg3Qgz4ed";

// const DEMO_USER: User = {
//   id: "5b700c45639d2c0c54b354ba",
//   displayName: "Watson Joyce",
//   role: "SA",
// };
// ================= you will get those data from server =======

@Injectable({
   providedIn: "root",
})
export class JwtAuthService {
   token: any;
   isAuthenticated: Boolean;
   user: User = {};
   user$ = (new BehaviorSubject<User>(this.user));
   signingIn: Boolean;
   return: string;
   
   constructor(
      private ls: LocalStoreService,
      private http: HttpClient,
      private router: Router,
      private zone: NgZone,
      private route: ActivatedRoute
   ) {

      this.return = "";
      this.isAuthenticated = false;
      this.signingIn = false;

      this.route.queryParams
         .subscribe(params => this.return = params['return'] || '/');

   }

   public get userId() {
      return this.ls.getItem(config.APP_USER)._id
   }

   public signinBack(username: any, password: any) {

      this.signingIn = true;
      console.log(`${environment.apiURL}auth/_api.php?opcion=auth`, { username, password });
      return this.http.post(`${environment.apiURL}/auth/_api.php?opcion=auth`, { username, password })
         .pipe(
            map((res: any) => {
               console.log(res);
               this.setUserAndToken(res);
               this.setUserPhoto(res.msg.image_url);
               this.setColor(res.msg.colortheme);
               this.signingIn = false;
               return res;
            }),
            catchError((error) => {
               console.log(error);
               return throwError(error);
            })
         );
   }

   public signin(username: any, password: any) {
      this.signingIn = true;
      const headers: HttpHeaders = new HttpHeaders({
         'Simpleauthb2b': '4170ae818f2e146c48cf824667947b25',
      })
      console.log(`https://b2b.ptsanmiguelense.com.mx/b2b-ws/controllers/auth/_api.php?opcion=sign_in`, { email: username, password: password });
      return this.http.post(`https://b2b.ptsanmiguelense.com.mx/b2b-ws/controllers/auth/_api.php?opcion=sign_in`, { email: username, password: password }, { headers })
         .pipe(
            map((res: any) => {
               console.log(res);
               this.setUserAndToken(res);
                this.setUserPhoto(res.image_url);
               //  this.setColor(res.colortheme);
               this.signingIn = false;
               return res;
            }),
            catchError((error) => {
               console.log(error);
               return throwError(error);
            })
         );
   }

   signUp(username: any, auth_key: any) {
      console.log(`${environment.apiURL}/users/_api.php?opcion=create`, { username: username, auth_key: auth_key });
      return this.http.post(`${environment.apiURL}/users/_api.php?opcion=create`, { username: username, auth_key: auth_key }).pipe(
         map((data: any) => {
            console.log(data);
            return data
         }),
         catchError((error: any) => {
            console.log(error);
            return error
         })
      )
   }

   public checkTokenIsValid() {
/*       return this.http.get(`${environment.apiURL}auth/_api.php?opcion=authCheck`)
         .pipe(
            map((profile: User) => {
               this.setUserAndToken(this.getJwtToken(), profile, '', true);
               this.signingIn = false;
               return profile;
            }),
            catchError((error) => {
               this.signout();
               return of(error);
            })
         ); */
   }

   public signout() {
      this.setUserAndToken("null");
      this.ls.clear();

      this.router.navigate(["/login"]);
   }

   isLoggedIn(): Boolean {
      return !!this.getJwtToken();
   }

   getJwtToken() {
      return this.ls.getItem(config.APP_TOKEN);
   }
   getUser() {
      return this.ls.getItem(config.APP_USER);
   }

   getUserPhoto() {
      return this.ls.getItem(config.APP_USER_PHOTO);
   }

   setUserAndToken(user: any) {
      const u = user.msg
      console.log(u);
      
      this.isAuthenticated = !!user.error;
      this.token = u.token;
      this.user = user;
      // this.user$.next(user);
      this.ls.setItem(config.APP_TOKEN, u.token);
      this.ls.setItem(config.APP_USER, u.user_id);
      if (typeof u.languages == 'number')
         this.ls.setItem(config.APP_LANG, this.ls.getItem('languages')?.find((lang: any) => lang.id == u.languages))
      else
         this.ls.setItem(config.APP_LANG, u.languages)
      this.ls.setItem(config.APP_PROFILE, u.profile_user_id);
      this.ls.setItem(config.APP_COMPANY, u.profile_company_id);
   }

   setUserPhoto(photo: String) {
      this.ls.setItem(config.APP_USER_PHOTO, photo ?? null);
   }

   changeUserPhoto(photo: String) {
      this.ls.setItem(config.APP_USER_PHOTO, photo ?? null);
   }
   setColor(color: String) {
      this.ls.setItem(config.APP_COLOR, color ?? null);
   }

   changeColor(color: String) {
      this.ls.setItem(config.APP_COLOR, color ?? null);
   }

   getColor() {
      return this.ls.getItem(config.APP_COLOR);
   }

   getLang() {
      return this.ls.getItem(config.APP_LANG)
   }

}
