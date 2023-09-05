import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { Response } from 'src/app/models/response.model';
import { LanguageService } from 'src/app/services/language.service';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { icons } from 'src/assets/icons/icons';
import { config } from 'src/config';

@Component({
   selector: 'app-static-form',
   templateUrl: './static-form.component.html',
   styleUrls: ['./static-form.component.scss']
})
export class StaticFormComponent implements OnInit {
   article: FormGroup;
   // carousel: FormGroup;
   // card: FormGroup;
   available_langs: any = []
   tabs: any = [this.lang.user_lang];
   i_section = 0;
   filtered_icons = icons.slice(0,25);
   _icons = icons;

   @ViewChild('cc') cc!: ElementRef;

   constructor(
      public router: Router,
      public master: MasterService,

      private lang: LanguageService,
      private formBuilder: FormBuilder,
      private provider: ProviderService,
      private manager: CloudinaryWidgetManager,

   ) {
      this.article = this.formBuilder.group({
         title: this.formBuilder.array([master.createTranslation(lang.user_lang.id, null)]),
         description: this.formBuilder.array([master.createTranslation(lang.user_lang.id, null)]),
         children: this.formBuilder.array([])
      })

      

   }

   ngOnInit(): void {
      console.log(this.tabs);
      
      
      console.log(this.article.value/* , this.section.value, this.carousel.value, this.card.value */);
      this.get();
      
   }

   get() {
      this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => {
            if (!languages.error) {
               this.available_langs = languages.msg;
            }
         }
      )
   }

   save() {

   }

   delete() {

   }

   add_section() {
      this.master.arr(this.article, 'children').push(this.master.createSection(this.lang.user_lang.id,this.tabs))
      console.log(this.article.value);
      
   }

   add_carousel() {
      this.master.arr(this.article, 'children').push(this.master.fullCarousel(this.lang.user_lang.id,this.tabs))
      console.log(this.article.value);
   }

   add_card() {
      this.master.arr(this.article, 'children').push(this.master.fullCard(this.lang.user_lang.id,this.tabs))
      console.log(this.article.value);
   }

   add_carousel_item(carousel: FormArray) {
      carousel.push(this.master.createCarousel(this.lang.user_lang.id,this.tabs))
   }

   add_cards_item(cards: FormArray) {
      cards.push(this.master.createCard(this.lang.user_lang.id,this.tabs))
   }

   stringify(form: any, control: any) {
      return JSON.stringify(form.value?.[control]!)
   }

   get field_width() {
      if (this.cc?.nativeElement?.offsetWidth <= 640)
         return 'col-span-1'
      else if (this.cc?.nativeElement?.offsetWidth > 640 && this.cc?.nativeElement?.offsetWidth < 768)
         return 'col-span-2'
      return 'col-span-3'
   }

   
   upload(control: any) {
      this.manager.open(config.upload_config).subscribe(
         data => {
            if (data.event == 'success') {
               control?.patchValue(data.info.secure_url)
            }
         }
      )
   }

   filter_icons(val: any) {
      this.filtered_icons = this._icons.filter((icon: any) => icon.tags.includes(val) || icon.filename.includes(val)).slice(0,25)
   }
}
