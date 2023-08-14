import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Response } from 'src/app/models/response.model';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';

@Component({
   selector: 'app-memberships-form',
   templateUrl: './memberships-form.component.html',
   styleUrls: ['./memberships-form.component.scss']
})
export class MembershipsFormComponent implements OnInit {
   form: FormGroup;
   sel: any = [];
   available_langs: any = [];
   tabs: any = [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }];

   constructor(
      public router: Router,
      public master: MasterService,
      private formBuilder: FormBuilder,
      private provider: ProviderService,
   ) {
      this.form = this.formBuilder.group({
         title_EN: [],
         title_ES: [],
         short_title_EN: [],
         short_title_ES: [],
         user_limit: [0],
         product_limit: [0],
         price: [0],
         enabled: [],
         first_section: this.formBuilder.array([this.master.createTranslation('1')]),
         second_section: this.formBuilder.array([this.master.createTranslation('1')]),
         third_section: this.formBuilder.array([this.master.createTranslation('1')]),
      })
    }

   ngOnInit(): void {
      this.get();
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

}
