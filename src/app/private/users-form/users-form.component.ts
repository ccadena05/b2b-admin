import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from 'src/app/models/response.model';
import { MasterService } from 'src/app/services/master.service';
import { OutputService } from 'src/app/services/output.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { PermissionsComponent } from './permissions/permissions.component';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
   selector: 'app-users-form',
   templateUrl: './users-form.component.html',
   styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit {
   form: FormGroup;
   sel: any = [];

   constructor(
      public router: Router,
      public master: MasterService,
      public layout: LayoutService,

      private dialog: MatDialog,
      private ls: LocalStoreService,
      private output: OutputService,
      private formBuilder: FormBuilder,
      private provider: ProviderService,
      private activatedRoute: ActivatedRoute,
   ) {
      this.form = this.formBuilder.group({
         user_id: [atob(this.__id), Validators.required],
         username: [null, Validators.required],
         first_name: [null, Validators.required],
         last_name: [null, Validators.required],
         email: [null, [Validators.required, Validators.email]],
         country: [null, [Validators.required, Validators.email]],
         state: [null, [Validators.required, Validators.email]],
         city: [null, [Validators.required, Validators.email]],
         phone_code: [null, Validators.required],
         phone: [null, Validators.required],
         job: [null, Validators.required],
         department: [null, Validators.required],
         // languages: [null, Validators.required],
         profile_user_id: [null, Validators.required],
         company: [null, Validators.required],
         hidden: [null],
         // active: [null],
         valid_email: [null],
         approved: [null],
         // permission: [null],
         type_user_id: [null, Validators.required],
         rfc: [null, Validators.required],
         profile_company_id: [null, Validators.required]
      })
   }

   ngOnInit(): void {
      this.get();
   }

   get() {
      this.output.ready.next(false)
      this.output.table_ready.next(false)
      this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => {
            console.log(languages.msg);
            if (!languages.error) {
               this.sel['languages'] = languages.msg;
               this.provider.BD_ActionGet('general', 'get_countries').subscribe(
                  (countries: Response) => {
                     this.sel['countries'] = countries.msg
                     this.provider.BD_ActionAdminGet('companies', 'get').subscribe(
                        (companies: Response) => {
                           console.log(companies.msg);

                           if (!companies.error) {
                              this.sel['companies'] = this.master?.changeKey({ 'ID': 'id', '01_TITLE': 'name' }, companies.msg.approved);
                              if (this.router.url.includes('detail')) {
                                 this.provider.BD_ActionAdminGet('users', 'get_user_by_id', { user_id: atob(this.__id) }).subscribe(
                                    (user: Response) => {
                                       console.log(user.msg);
                                       user.msg.state = user.msg.state.toString()
                                       user.msg.city = user.msg.city.toString()
                                       this.master.patch(user.msg, this.form)
                                       this.ls.update('bc', [
                                          {
                                             item: 'Usuarios',
                                             link: '/m/users'
                                          },
                                          {
                                             item: user.msg.first_name + ' ' + user.msg.last_name,
                                             link: null
                                          }
                                       ])
                                       this.output.ready.next(true)
                                       this.output.table_ready.next(true)
                                    }
                                 )
                              } else {
                                 this.ls.update('bc', [
                                    {
                                       item: 'Usuarios',
                                       link: '/m/users'
                                    },
                                    {
                                       item: 'Agregar',
                                       link: null
                                    }
                                 ])
                              }
                           }
                        }
                     )
                  }
               )
            }
         }
      )
   }

   save() {
      this.master.save('users', 'update_user', this.form.value, true)
   }

   delete() {
      this.master.delete('users', 'delete_user', { user_id: atob(this.__id) })
   }

   permissions() {
      this.dialog.open(PermissionsComponent, {
         data: atob(this.__id)
      })
   }

   change_password() {
      this.dialog.open(ChangePasswordComponent, {
         data: atob(this.__id)
      })
   }

   get __id() {
      let m = ''
      this.activatedRoute.params.subscribe(params => {

         m = params['id'];
      });


      return m
   }

}
