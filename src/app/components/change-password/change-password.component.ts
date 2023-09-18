import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';

@Component({
   selector: 'app-change-password',
   templateUrl: './change-password.component.html',
   styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
   form: FormGroup;
   subject: any

   constructor(
      private dialog: MatDialog,
      private master: MasterService,
      private formBuilder: FormBuilder,
      private provider: ProviderService,
      private dialogRef: MatDialogRef<ChangePasswordComponent>,


      @Inject(MAT_DIALOG_DATA) data: any,
   ) {
      this.subject = data;

      this.form = this.formBuilder.group({
         user_id: [data],
         new_password: ['', Validators.required],
         confirm_password: ['', Validators.required]
      }, { validator: this.match_validator });
   }

   ngOnInit(): void {

   }

   save() {
      this.master.save('users', 'update_password', this.form.value).then(
         (result: any) => {
            if (result)
               this.dialogRef.close()
         })
   }

   match_validator(form: FormGroup) {
      const pwd = form.get('new_password')?.value;
      const confirm_pwd = form.get('confirm_password')?.value;

      if (pwd !== confirm_pwd) {
         form.get('confirm_password')?.setErrors({ 'mismatch': true });
      } else {
         form.get('confirm_password')?.setErrors(null);
      }
   }

}
