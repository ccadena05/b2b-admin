import { Component, Inject, OnInit } from '@angular/core';
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

              this.provider.BD_ActionAdminGet('companies', 'get_rfq_by_id', { rfq_id: atob(this.__id) }).subscribe(
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


  save() {
    console.log(this.form.value.req);
    this.provider.BD_ActionPost('profile_company', 'insert_rfq', this.form.value.req).subscribe(
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
