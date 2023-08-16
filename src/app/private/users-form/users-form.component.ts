import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from 'src/app/models/response.model';
import { MasterService } from 'src/app/services/master.service';
import { OutputService } from 'src/app/services/output.service';
import { ProviderService } from 'src/app/services/provider/provider.service';

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
      private formBuilder: FormBuilder,
      private provider: ProviderService,
      private activatedRoute: ActivatedRoute,
      private output: OutputService
   ) {
      this.form = this.formBuilder.group({
         user_id: [this.__id, Validators.required],
         username: [null],
         first_name: [null, Validators.required],
         last_name: [null, Validators.required],
         email: [null, [Validators.required, Validators.email]],
         country: [null, [Validators.required, Validators.email]],
         state: [null, [Validators.required, Validators.email]],
         city: [null, [Validators.required, Validators.email]],
         phone_code: [null],
         phone: [null, Validators.required],
         job: [null, Validators.required],
         departament: [null, Validators.required],
         languages: [null, Validators.required],
         profile_user_id: [null, Validators.required],
         hidden: [null],
         active: [null],
         confirmed: [null],
         permission: [null],
         profile_company_id: [null]
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
                              this.sel['companies'] = this.master?.changeKey({ 'ID': 'id', '01_TITLE': 'name' }, companies.msg.approved)
                              this.output.ready.next(true)
                              this.output.table_ready.next(true)
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

   }

   delete() {

   }

   get __id() {
      let m = ''
      this.activatedRoute.params.subscribe(params => {

         m = params['id'];
      });


      return m
   }

}
