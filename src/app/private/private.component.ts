import { Component, OnInit, ViewChild } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { delay, filter } from 'rxjs/operators';
import { JwtAuthService } from '../services/auth/jwt-auth.service';
import { LocalStoreService } from '../services/local-store.service';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { ProviderService } from '../services/provider/provider.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { NgwWowService } from 'ngx-wow';
import { slideInAnimation } from 'src/app/components/animations';
import { menu } from "src/app/private/menu";
import { OutputService } from '../services/output.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


export interface Menu {
   link: string;
   icon: string;
}

@UntilDestroy()
@Component({
   selector: 'app-private',
   templateUrl: './private.component.html',
   styleUrls: ['./private.component.scss'],
   animations: [slideInAnimation]
})
export class PrivateComponent implements OnInit {

   sideMenu = menu;
   panelOpenState = false;
   showFiller = false;
   @ViewChild('sidenav') sidenav!: MatSidenav;
   @ViewChild('sidenav2') sidenav2!: MatSidenav;
   email: string;
   displayName: string;
   avatar: string;
   avatarPreCarga: string;
   menu: Menu[];
   logoChange: any;
   ready = new BehaviorSubject(false)
   hola: boolean = false;
   // location: any;

   constructor(
      private jwtAuth: JwtAuthService,
      private observer: BreakpointObserver,
      private router: Router,
      private manager: CloudinaryWidgetManager,
      private provider: ProviderService,
      private _snackBar: MatSnackBar,
      private wowService: NgwWowService,
      private activatedRoute: ActivatedRoute,
      private output: OutputService
   ) {



      this.wowService.init();



      this.menu = [
         {
            link: '/dashboard',
            icon: 'dashboard',
         },
      ];
      this.email = this.jwtAuth.getUser()?.email;
      this.displayName = this.jwtAuth.getUser()?.displayName;
      this.avatar = this.jwtAuth.getUserPhoto()
         ? this.jwtAuth.getUserPhoto()
         : 'assets/img/avatardefault.png';
      this.avatarPreCarga = 'assets/img/avatardefault.png';
      this.logoChange = this.jwtAuth.getColor();

      this.output.ready.subscribe((data: any) => {
         this.hola = data;
         // console.log(this.hola);

      })
   }

   logout() {
      return this.jwtAuth.signout();
   }
   ngOnInit(): void {
      // --------
      /* let themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
      let themeToggleLightIcon = document.getElementById(
         'theme-toggle-light-icon'
      );

      // Change the icons inside the button based on previous settings
      if (this.jwtAuth.getColor() === 'dark') {
         themeToggleLightIcon?.classList.remove('hidden');
      } else {
         themeToggleDarkIcon?.classList.remove('hidden');
      } */

      this.observer
         .observe(['(max-width: 768px)'])
         .pipe(delay(1), untilDestroyed(this))
         .subscribe((res) => {
            if (res?.matches && this.sidenav != undefined) {
               this.sidenav.mode = 'over';
               this.sidenav?.close();
            } else {
               if (this.sidenav != undefined) {
                  this.sidenav.mode = 'side';
                  this.sidenav?.open();
               }
            }
         });

      // this.router.events
      //   .pipe(
      //     untilDestroyed(this),
      //     filter((e) => e instanceof NavigationEnd)
      //   )
      //   .subscribe(() => {
      //     if (this.sidenav.mode === 'over') {
      //       this.sidenav.close();
      //     }
      //   });


   }



   // onOpen(): void {
   //   this.manager.open({ uploadPreset: environment.presets }).subscribe({
   //     next: (resp: any) => {
   //       if (resp.event === 'success') {
   //         this.avatarPreCarga = resp.info.secure_url;
   //         this.provider
   //           .BD_ActionPostHeder('perfil', 'updateFoto', {
   //             foto: resp.info.secure_url,
   //           })
   //           .subscribe({
   //             next: (data: any) => {
   //               if (data['Mensaje'] === '1') {
   //                 this.jwtAuth.changeUserPhoto(this.avatarPreCarga);
   //                 this.avatar = this.avatarPreCarga;
   //                 this._snackBar.open('Proceso ejecutado con éxito', 'Cerrar', {
   //                   duration: 3000,
   //                 });
   //               } else {
   //                 this._snackBar.open('Error', 'Cerrar', {
   //                   duration: 3000,
   //                 });
   //               }
   //             },
   //             error: (err) => {
   //               //console.log(err.message);
   //               //this.jwtAuth.signout();
   //             },
   //           });
   //       }
   //     },
   //     error: (err) => {
   //       console.log(err.message);
   //     },
   //   });
   // }



}
