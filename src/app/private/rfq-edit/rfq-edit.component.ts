import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { Response } from 'src/app/models/response.model';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { config } from 'src/config';

@Component({
   selector: 'app-rfq-edit',
   templateUrl: './rfq-edit.component.html',
   styleUrls: ['./rfq-edit.component.scss']
})
export class RfqEditComponent implements OnInit {
   form: FormGroup;
   tabs: any = [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }];
   available_langs: any = [];
   sel: any = [];
   rfq_id: any;

   constructor(
      public master: MasterService,
      private formBuilder: FormBuilder,
      private manager: CloudinaryWidgetManager,
      private provider: ProviderService,
      private ls: LocalStoreService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
   ) {
      this.form = this.formBuilder.group({
         id: [null],
         approved: [null],
         profile_company_id: [null],
         rfc: [this.ls.getItem("B2B_RFC")],
         title: this.formBuilder.array([this.master.createTranslation('1', null)]),
         description: this.formBuilder.array([this.master.createTranslation('1', null)]),
         country: [null],
         state: [null],
         city: [null],
         expiration_date: [0],
         image_url: [null],
         is_rfq: [0],
         activity: [null],
         materials: this.formBuilder.array([this.master.createTranslation('1', null)]),
         volumes: [null],
         budget: [null],
         simple_isos: [null],
         isos: this.formBuilder.array([]),
         date: [null],
         url: [null],
         is_public: [0],
         rfq_status_id: [1]
      })

      /* this.form.controls['simple_isos'].valueChanges.subscribe(
         iso => console.log(iso);
         
      ) */
   }

   ngOnInit(): void {
      this.get();
   }



   get() {
      this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => {
            if (!languages.error) {
               this.available_langs = languages.msg
               this.provider.BD_ActionGet('general', 'get_isos').subscribe(
                  (isos: Response) => {
                     if (!isos.error) {
                        this.sel['isos'] = this.master?.changeKey({ 'name_id': 'id' }, isos?.msg)
                        this.provider.BD_ActionGet('rfq', 'get_rfq_status').subscribe(
                           (rfq_status: Response) => {
                              if (!rfq_status.error) {
                                 this.sel['rfq_status'] = rfq_status.msg
                                 this.provider.BD_ActionAdminGet('companies', 'get').subscribe(
                                    (companies: Response) => {
                                       if (!companies.error) {
                                          this.sel['companies'] = companies.msg
                                          this.provider.BD_ActionGet('rfq', 'get_rfq_by_id', { id: atob(this.__id) }).subscribe(
                                             (rfq: Response) => {
                                                if (!rfq.error) {
                                                   console.log(rfq.msg);
                                                   if (rfq.msg.is_rfq == 1 || rfq.msg.is_rfq == true) {
                                                      let simple_isos: any = []
                                                      rfq.msg.isos?.forEach((iso: any) => {
                                                         iso.library_isos_id = iso.library_isos_id.toString()
                                                         simple_isos.push(iso.library_isos_id)
                                                         this.master.getterA(this.form.controls['isos']).push(this.createISO(iso.library_isos_id))
                                                         rfq.msg.simple_isos = simple_isos;
                                                      });
                                                   }
                                                   rfq.msg.city = rfq.msg.city.toString()
                                                   rfq.msg.state = rfq.msg.state.toString()
                                                   rfq.msg.rfq_status_id = rfq.msg.rfq_status_id.toString()
                                                   this.master.patch(rfq.msg, this.form, this.tabs)
                                                   this.ls.update('bc', [
                                                      {
                                                         item: 'Requerimientos - RFQ',
                                                         link: '/m/rfq'
                                                      },
                                                      {
                                                         item: rfq.msg.title[0].text,
                                                         link: null
                                                      }
                                                   ])
                                                }
                                             }
                                          )
                                       }
                                    }
                                 )
                              }
                           }
                        )
                     }
                  }
               )
            }
         }
      )
   }


   /*    addTab(language: any) {
         if (!this.tabs.includes(language.name)) {
            this.tabs.push({ id: language.id, name: language.name, abbr: language.abbr, flag: language.flag });
   
            Object.keys(this.form.controls).forEach(element => {
               if (this.form.controls[element] instanceof FormArray)
                  this.master.getterA(this.form.controls[element]).push(this.master.createTranslation(language.id))
            })
         }
      } */

   /*    deleteTab(index: any, languages_id: any) {
         console.log(this.total_req);
         console.log(languages_id);
         
   
      } */

   approved_rfq() {
      let value = this.form.value.approved == 1 ? '0' : '1'
      console.log(value);

      this.form.controls['approved'].patchValue(value)
      this.provider.BD_ActionAdminPost('rfq', 'approved_rfq', { id: this.form.value.id, approved: this.form.value.approved }).subscribe(
         (data: Response) => {
            console.log(data);

            if (!data.error)
               this.get()
         }
      )
   }

   save() {
      console.log(this.form.value);
      this.provider.BD_ActionPut('rfq', 'update_rfq', this.form.value).subscribe(
         (data: Response) => {
            console.log(data)
         }
      )
   }

   delete() {
      this.master.delete('rfq', 'delete_rfq', { id: this.form.value.id })
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

   createISO(id: any) {
      return this.formBuilder.group({
         id: [null],
         active: ['1'],
         library_isos_id: [id],
      })
   }

   toggle_iso(event: any) {
      const _simple_isos = this.form.value.simple_isos;
      const _simple_isos_active = this.form.value.isos.filter((iso: any) => iso.active == '1' || iso.active == 1);
      const _isos: any = []
      const isos_array = this.master.getterA(this.form.controls['isos'])
      console.log(this.form.value.isos, _simple_isos_active);

      this.form.value.isos?.forEach((element: any) => {
         _isos?.push(element?.library_isos_id)
      })

      if (_simple_isos?.length >= _isos?.length) { // Se añadió un nuevo ISO
         for (const iso of _simple_isos) {
            console.log(_isos, iso);

            if (!_isos.includes(iso) || !_isos.includes(iso.toString()))  // No estaba antes, hacer push
               isos_array.push(this.createISO(iso))

         }
      } else if ((_simple_isos?.length < _isos?.length)) { // Se quitó un ISO
         let iso_index: any;

         for (const iso of _isos) {
            if (!_simple_isos.includes(iso))
               iso_index = isos_array.value.findIndex((isos: any) => isos.library_isos_id == iso)
         }

         let iso_to_del: FormGroup = this.master.getterG(isos_array.at(iso_index));
         // Cambia active a '0'
         console.log(iso_to_del, iso_to_del.value);

         iso_to_del.controls['active'].patchValue('0')
         console.log(iso_to_del, iso_to_del.value);


      }
      console.log(this.form.value);

   }

   get_value() {
      return this.master.getterA(this.form.controls['req']).at(0).value
   }

   language_index(language_id: string) {
      return this.available_langs[this.available_langs.findIndex((obj: any) => obj.id == language_id)]
   }

   findCert(name_id: string) {
      return this.sel['isos'].find((cert: any) => cert.name_id == name_id)
   }

   get __id() {
      let m = ''
      this.activatedRoute.params.subscribe(params => {

         m = params['id'];
      });


      return m
   }

}

/* import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { Response } from 'src/app/models/response.model';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { config } from 'src/config';

@Component({
  selector: 'app-rfq-edit',
  templateUrl: './rfq-edit.component.html',
  styleUrls: ['./rfq-edit.component.scss']
})
export class RfqEditComponent implements OnInit {
  form: FormGroup;
  tabs: any = [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }];
  available_langs: any = [];
  sel: any = [];
  rfq_id: any;

  constructor(
    public master: MasterService,
    private formBuilder: FormBuilder,
    private manager: CloudinaryWidgetManager,
    private provider: ProviderService,
    private ls: LocalStoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      profile_company_id: [this.ls.getItem("B2B_PROFILE_COMPANY")],
      rfc: [this.ls.getItem("COMPANY_FORM").rfc],
      title: this.formBuilder.array([this.master.createTranslation('1')]),
      description: this.formBuilder.array([this.master.createTranslation('1')]),
      country: [null],
      state: [null],
      city: [null],
      expiration_date: [0],
      is_rfq: [0],
      activity: [null],
      materials: this.formBuilder.array([this.master.createTranslation('1')]),
      volumes: [null],
      budget: [null],
      isos: [null],
      date: [null],
      url: [null],
      is_public: [0]
    })
  }

  ngOnInit(): void {
    this.get();
  }



  get() {
    this.provider.BD_ActionGet('general', 'get_languages').subscribe(
      (languages: Response) => {
        console.log(languages.msg);
        this.available_langs = languages.msg
        console.log(this.available_langs);
        this.provider.BD_ActionGet('general', 'get_isos').subscribe(
          (isos: Response) => {
            if (!isos.error) {
              console.log(isos);

              this.sel['isos'] = this.master?.changeKey({ 'name_id': 'id' }, isos?.msg)
              // if(this.router.url.includes('detail')) {
              console.log(atob(this.__id));

              this.provider.BD_ActionAdminGet('rfq', 'get_rfq_by_id', { id: atob(this.__id) }).subscribe(
                (rfq: Response) => {
                  console.log(rfq);
                  rfq.msg?.title.forEach((element: any) => {

                    if (element.languages_id != 1) {
                      this.master.createTranslation(element.languages_id)
                      this.master.add_lang_tab(this.tabs, this.language_index(element.languages_id), this.form)
                    }
                  });
                  console.log(this.form.value);
                  this.master.patchForm(rfq.msg, this.form)
                  console.log(this.form.value);

                }
              )
              // }
            }
          }
        )

      }
    )
  }





  save() {
    console.log(this.form.value.req);
    this.provider.BD_ActionPost('rfq', 'insert_rfq', this.form.value.req).subscribe(
      (data: Response) =>
        console.log(data)

    )
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

  get __id() {
    let m = ''
    this.activatedRoute.params.subscribe(params => {

      m = params['id'];
    });


    return m
  }

  language_index(language_id: string) {
    return this.available_langs[this.available_langs.findIndex((obj: any) => obj.id == language_id)]
  }

}
 */