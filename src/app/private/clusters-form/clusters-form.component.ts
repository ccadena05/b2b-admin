import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Response } from 'src/app/models/response.model';
import { LanguageService } from 'src/app/services/language.service';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { Language } from 'src/app/models/language.model';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-clusters-form',
  templateUrl: './clusters-form.component.html',
  styleUrls: ['./clusters-form.component.scss']
})
export class ClustersFormComponent implements OnInit {
  form: FormGroup;
  sel: any = [];
  available_langs: any = [];
  tabs: Language[] = [this.lang.user_lang];

  constructor(
     public router: Router,
     public master: MasterService,
     public layout: LayoutService,
     
     private lang: LanguageService,
     private formBuilder: FormBuilder,
     private provider: ProviderService,
  ) {
     this.form = this.formBuilder.group({
      title: [],
      order: [],
      facebook: [],
      twitter: [],
      instagram: [],
      web_page: [],
      email: [],
      phone_code: [],
      phone: [],
      short_title_EN: [],
      limit_products: [],
      price: [],
      enabled: [],
      description: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
/*          title: [],
        title_ES: [],
        short_title_EN: [],
        short_title_ES: [],
        limit_users: [0],
        limit_products: [0],
        price: [0],
        enabled: [],
        first_section: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
        second_section: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
        third_section: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]), */
     })
   }

  ngOnInit(): void {
     this.get();
     this.countries();
  }

  get() {
     this.provider.BD_ActionGet('general', 'get_languages').subscribe(
        (languages: Response) => this.available_langs = languages.msg
     )
  }

  save() {

  }

  delete() {

  }

  countries() {
   this.provider.BD_ActionGet('general', 'get_countries').subscribe(
      (countries: any) => {
         console.log(countries.msg)
         if (!countries.error)
            this.sel['countries'] = this.master.concat(countries?.msg, ['e', 'n'], 'name');

      }
   )
}
}
