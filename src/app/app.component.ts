import { Component, HostBinding, AfterContentInit } from '@angular/core';
import { JwtAuthService } from './services/auth/jwt-auth.service';
declare var FinisherHeader: any;
import '../assets/finisher-header.es5.min.js'
import { ProviderService } from './services/provider/provider.service';
import { Response } from './models/response.model';
import { LocalStoreService } from './services/local-store.service';

// @Component({
//   selector: 'body',
//   template: `<child></child>`
// })
@Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {










   // mode:string;
   constructor(
      private ls: LocalStoreService,
      private jwtAuth: JwtAuthService,
      private provider: ProviderService
   ) {
      // if(this.jwtAuth.getUser()?.mode){
      // this.mode= this.jwtAuth.getColor();
      // }else{
      // this.mode= "light";
      // }

      // @HostBinding('class') public cssClass = 'class1';
      this.get();
   }

   ngAfterContentInit() {
      // this.finisher()

      /*  if(this.jwtAuth.getColor() !== undefined)
          document.body.classList.add(this.jwtAuth.getColor() ?? ""); */

   }
   get() {
      this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => this.ls.setItem('languages', languages.msg)
      )
   }


   finisher() {
      new FinisherHeader({
         "count": 12,
         "size": {
            "min": 1300,
            "max": 1500,
            "pulse": 0
         },
         "speed": {
            "x": {
               "min": 0.6,
               "max": 3
            },
            "y": {
               "min": 0.6,
               "max": 3
            }
         },
         "colors": {
            "background": "#f1f5f9",
            "particles": [
               "#f1f5f9",
               "#f1f5f9",
               "#0076ef",
               "#0076ef",
               "#0076ef"
            ]
         },
         "blending": "lighten",
         "opacity": {
            "center": 0.6,
            "edge": 0
         },
         "skew": 0,
         "shapes": [
            "c"
         ]
      });
   }
}
