import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { Response } from 'src/app/models/response.model';
import { LanguageService } from 'src/app/services/language.service';
import { LayoutService } from 'src/app/services/layout.service';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { config } from 'src/config';
import { Language } from 'src/app/models/language.model';

@Component({
   selector: 'app-memberships-form',
   templateUrl: './memberships-form.component.html',
   styleUrls: ['./memberships-form.component.scss']
})
export class MembershipsFormComponent implements OnInit {
   form: FormGroup;
   sel: any = [];
   available_langs: any = [];
   tabs: Language[] = [this.lang.user_lang];

   constructor(
      public router: Router,
      public master: MasterService,
      public layout: LayoutService,

      private ls: LocalStoreService,
      private lang: LanguageService,
      private formBuilder: FormBuilder,
      private provider: ProviderService,
      private activatedRoute: ActivatedRoute,
      private manager: CloudinaryWidgetManager
   ) {
      this.form = this.formBuilder.group({
         id: [null],
         id_membership: [null],
         name: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         short_name: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         limit_users: [0],
         limit_products: [0],
         cost: [0],
         tax: [0],
         months: [0],
         image_url: [null],
         active: [null],
         hidden: [null],
         first_section: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         second_section: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         third_section: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         create_date: [null],
         last_update: [null],
      })
   }

   ngOnInit(): void {
      this.get();
   }

   get() {
      this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => {
            if (!languages.error) {
               this.available_langs = languages.msg
               if (this.router.url.includes('detail')) {
                  console.log(atob(this.__id));

                  this.provider.BD_ActionAdminGet('membership', 'get_membership_by_id', { membership_id: atob(this.__id) }).subscribe(
                     (membership: Response) => {
                        console.log(membership.msg);
                        if (!membership.error) {
                           this.master.patch(membership.msg, this.form, this.tabs)
                           this.master.empty_translations(['name', 'short_name', 'first_section', 'second_section', 'third_section'], this.form, this.tabs)
                           this.ls.update('bc', [
                              {
                                 item: 'Membresías',
                                 link: '/m/membership'
                              },
                              {
                                 item: membership.msg.name?.[0].text,
                                 link: null
                              }
                           ])

                        }
                     }
                  )
               } else {
                  this.ls.update('bc', [
                     {
                        item: 'Membresías',
                        link: '/m/membership'
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

   save() {
      this.form.value.id_membership = this.form.value.id

      if (this.router.url.includes('detail'))
         this.master.save('membership', 'update_membership', this.form.value)
      else
         this.master.save('membership', 'insert_membership', this.form.value)
   }

   delete() {
      this.master.delete('membership', 'delete_membership', { id_membership: atob(this.__id) })
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

   get __id() {
      let m = ''
      this.activatedRoute.params.subscribe(params => {

         m = params['id'];
      });


      return m
   }

}
