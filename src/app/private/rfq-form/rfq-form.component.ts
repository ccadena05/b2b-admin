import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { Response } from 'src/app/models/response.model';
import { LanguageService } from 'src/app/services/language.service';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { MasterService } from 'src/app/services/master.service';
import { OutputService } from 'src/app/services/output.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { config } from 'src/config';
import { Language } from 'src/app/models/language.model';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
   selector: 'app-rfq-form',
   templateUrl: './rfq-form.component.html',
   styleUrls: ['./rfq-form.component.scss']
})
export class RfqFormComponent implements OnInit {
   form: FormGroup;
   tabs: Language[] = [this.lang.user_lang];
   total_req: any;
   available_langs: any = [];
   sel: any = [];
   _is_rfq: boolean = false;
   _is_public: boolean = false;

   constructor(
      public master: MasterService,
      public layout: LayoutService,

      private router: Router,
      private ls: LocalStoreService,
      private lang: LanguageService,
      private output: OutputService,
      private formBuilder: FormBuilder,
      private provider: ProviderService,
      private manager: CloudinaryWidgetManager,
   ) {
      this.form = this.formBuilder.group({
         req: this.formBuilder.array([this.requirements_form(null, null, null, null)])
      })
      this.total_req = Object.keys(this.form.value.req)

   }

   ngOnInit(): void {
      this.get();
   }

   add_requirement() {
      this.master.getterA(this.form.controls['req']).push(this.requirements_form(this.get_value().city, this.get_value().state, this.get_value().country, this.get_value().expiration_date))
      this.total_req = Object.keys(this.form.value.req)
      console.log(this.form.value.req);

   }

   requirements_form(city: any, state: any, country: any, expiration_date: any) {
      return this.formBuilder.group({
         id: [null],
         profile_company_id: [null],
         approved: [1],
         rfc: [this.ls.getItem("COMPANY_FORM")?.rfc],
         title: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         description: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         country: [country],
         state: [state],
         city: [city],
         expiration_date: [expiration_date],
         image_url: [null],
         is_rfq: [0],
         activity: [null],
         materials: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         volumes: [null],
         budget: [null],
         isos: [null],
         date: [null],
         url: [null],
         is_public: [0]

      })
   }

   get() {
      this.output.ready.next(false)
      this.output.table_ready.next(false)
      this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => {
            console.log(languages.msg);
            this.available_langs = languages.msg
            console.log(this.available_langs);
            this.provider.BD_ActionGet('general', 'get_isos').subscribe(
               (isos: Response) => {
                  if (!isos.error) {
                     this.sel['isos'] = isos.msg
                     this.provider.BD_ActionAdminGet('companies', 'get').subscribe(
                        (companies: Response) => {
                           if (!companies.error) {
                              console.log(companies.msg);
                              console.log(this.master?.changeKey({ 'ID': 'id', '01_TITLE': 'name' }, companies.msg.approved));
                              this.sel['companies'] = this.master?.changeKey({ 'ID': 'id', '01_TITLE': 'name' }, companies.msg.approved)
                              this.output.ready.next(true)
                              this.output.table_ready.next(true)
                           }
                        }
                     )
                  }
               }
            )

         }
      )
   }


   /*    addTab(language: any) {
        if (!this.tabs.includes(language.name)) {
           this.tabs.push({ id: language.id, name: language.name, abbr: language.abbr, flag: language.flag });
   
           Object.keys(this.form.controls).forEach(element => {
              if (this.form.controls[element] instanceof FormArray)
                 this.master.getterA(this.form.controls[element]).push(this.master.translation(language.id))
           })
        }
     } */

   /*    deleteTab(index: any, languages_id: any) {
        console.log(this.total_req);
        console.log(languages_id);
        
   
     } */


   save() {
      console.log(this.form.value.req);
      this.provider.BD_ActionAdminPost('rfq', 'insert_rfq', this.form.value.req).subscribe(
         (data: Response) =>
            console.log(data)

      )

      console.log('save', this.form.value)

   }

   uploadPDF(control: any) {
      this.manager.open(config.upload_config).subscribe(
         data => {
            if (data.event == 'success') {
               control?.patchValue(data.info.secure_url)
            }
         }
      )
   }

   get_value() {
      return this.master.getterA(this.form.controls['req']).at(0).value
   }




}
