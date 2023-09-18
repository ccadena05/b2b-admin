import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Response } from 'src/app/models/response.model';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';

@Component({
   selector: 'app-permissions',
   templateUrl: './permissions.component.html',
   styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
   __id: any;
   permissions_user_k: any;
   actions = {
      c: 'Crear',
      r: 'Leer',
      u: 'Actualizar',
      d: 'Borrar'
   }
   form: FormGroup;

   constructor(
      public master: MasterService,

      private formBuilder: FormBuilder,
      private provider: ProviderService,
      private dialogRef: MatDialogRef<PermissionsComponent>,

      @Inject(MAT_DIALOG_DATA) public data: string,
   ) {
      this.__id = data
      this.form = this.formBuilder.group({})
   }

   ngOnInit(): void {
      this.get();
   }

   get() {
      this.provider.BD_ActionAdminGet('permissions', 'get_permissions_user', { user_id: this.__id }).subscribe(
         (permissions_user: any) => {
            this.permissions_user_k = Object.keys(permissions_user)
            this.permissions_user_k.forEach((type_user: any) => {
               this.form.addControl(type_user, this.formBuilder.array(Array(permissions_user[type_user].length).fill(this.permission())))
            });
            this.master.patch(permissions_user, this.form)
         }
      )
   }

   save() {
      let array: any[] = [];
      for (const key of Object.keys(this.form.value)) {
         if (this.form.value[key].length > 0) {
            array?.push(...this.form.value[key])
         }
      }

      array.forEach((k: any) => {
         k['c'] = (k['c'] == true || k['c'] == 1) ? 1 : 0
         k['r'] = (k['r'] == true || k['r'] == 1) ? 1 : 0
         k['u'] = (k['u'] == true || k['u'] == 1) ? 1 : 0
         k['d'] = (k['d'] == true || k['d'] == 1) ? 1 : 0
      });

      let data = {
         user_id: this.__id,
         permissions: array
      }

      this.master.save('permissions', 'set_permissions', data, true).then(
         (result: any) => {
            if (result)
               this.dialogRef.close()
         })
   }

   permission(): FormGroup {
      return this.formBuilder.group({
         id: [null, Validators.required],
         entity_id: [null, Validators.required],
         c: [null, Validators.required],
         r: [null, Validators.required],
         u: [null, Validators.required],
         d: [null, Validators.required],
         active: [null, Validators.required]
      })
   }
}
