import { Component, OnInit, AfterContentInit } from '@angular/core';
import {
   FormBuilder,
   FormControl,
   FormGroup,
   Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { JwtAuthService } from 'src/app/services/auth/jwt-auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfigDialogComponent } from '../../config-dialog/config-dialog.component';
import { LocalStoreService } from 'src/app/services/local-store.service';


@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
   //email = new FormControl('', [Validators.required, Validators.email]);
   hide: boolean;
   signinForm: FormGroup;
   constructor(
      public jwtAuth: JwtAuthService,
      private router: Router,
      private _snackBar: MatSnackBar,
      private dialog: MatDialog,
      private ls: LocalStoreService,
      private formBuilder: FormBuilder,

   ) {
      this.signinForm = new FormGroup({
         // email: new FormControl('', [Validators.required, Validators.email]),
         email: new FormControl('', [Validators.required]),
         password: new FormControl('', Validators.required),
         //password: new FormControl(true)
      });
      this.hide = true;
   }

   ngOnInit(): void {

   }

   ngAfterContentInit() {

      // // Add event listener
      document.addEventListener("mousemove", parallax);

      const scene = document.getElementById("parallax");

      // Magic happens here
      function parallax(e: any) {
         let _w = window.innerWidth / 2;
         let _h = window.innerHeight / 2;
         let _mouseX = e.clientX;
         let _mouseY = e.clientY;
         let _depth1 = `${50 - (_mouseX - _w) * 0.01}% ${50 - (_mouseY - _h) * 0.01}%`;
         let _depth2 = `${50 - (_mouseX - _w) * 0.02}% ${50 - (_mouseY - _h) * 0.02}%`;
         let _depth3 = `${50 - (_mouseX - _w) * 0.06}% ${50 - (_mouseY - _h) * 0.06}%`;
         let x = `${_depth3}, ${_depth2}, ${_depth1}`;
         // console.log(x);
         scene!.style!.backgroundPosition = x;
      }

      if (this.ls.getItem('openDialog') == false && this.ls.getItem('openDialog') != true) {
         this.configDialog();
      }
   }

   getErrorMessage() {
      // if (this.signinForm.controls['email'].hasError('required')) {
      //   return 'Debes ingresar un valor';
      // }

      return this.signinForm.controls['email'].hasError('email')
         ? 'No es un correo electrónico válido'
         : '';
   }

   configDialog() {
      this.dialog.open(ConfigDialogComponent, {
         autoFocus: false,
         maxHeight: '90vh',
         maxWidth: '90vw'
      })
   }

   signin() {
      const signinData = this.signinForm.value;
      // this.submitButton.disabled = true;
      //this.progressBar.mode = 'indeterminate';
      // console.log(signinData);
      // console.log(signinData.password);
      this.jwtAuth.signin(signinData.email, signinData.password).subscribe(
         {
            next: (response) => {
               console.log(response);
               if (response['auth'] === '0') {
                  this._snackBar.open('Revise su contraseña e intentelo de nuevo.', '', {
                     duration: 5000
                  });
               } else {
                  this.router.navigateByUrl(this.jwtAuth.return);
                  //this._snackBar.dismiss();
               }
            },
            error: (err) => {
               this._snackBar.open('Error de comunicación.', 'Cerrar', {
                  duration: 5000
               });
               console.log(err);
            },
         }
      );
   }
}
