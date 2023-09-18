import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { Response } from 'src/app/models/response.model';
import { LanguageService } from 'src/app/services/language.service';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { _icons } from 'src/assets/icons/_icons';
import { config } from 'src/config';
import { PreviewComponent } from './preview/preview.component';
import { routes } from '../routes';
import { Language } from 'src/app/models/language.model';

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
   tabs: Language[] = [this.lang.user_lang];
   i_section = 0;
   filtered_icons = _icons.slice(0, 50);
   _icons = _icons;
   id = 'our-valu';
   @ViewChild('cc') cc!: ElementRef;
   sel: any = [];

   constructor(
      public router: Router,
      public master: MasterService,

      private lang: LanguageService,
      private formBuilder: FormBuilder,
      private provider: ProviderService,
      private bottomsheet: MatBottomSheet,
      private manager: CloudinaryWidgetManager,

   ) {
      this.article = this.formBuilder.group({
         title: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         description: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         children: this.formBuilder.array([])
      })

      this.sel['routes'] = routes;

   }

   ngOnInit(): void {
      console.log(this.tabs);


      console.log(this.article.value/* , this.section.value, this.carousel.value, this.card.value */);
      this.get();
      if (this.id == 'our-value')
         this.master.arr(this.article, 'children').push(this.master.numberCard(this.lang.user_lang.id, this.tabs))

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
      this.delete_nulls(this.article.value)
      

   }

   delete() {

   }

   add(type: string) {
      this.master.arr(this.article, 'children').push(this.master[(type += '_section') as keyof MasterService](this.tabs))
      console.log(this.article.value);
      
   }

   add_item(array: any, type: string) {
      array.push(this.master[(type += '_item') as keyof MasterService](this.tabs))
   }

   delete_section(index: any) {
      console.log(index);
      this.master.arr(this.article, 'children').removeAt(index)
   }

   delete_item(child: FormArray, index: any) {
      child.removeAt(index)
   }

   preview() {
      this.bottomsheet.open(PreviewComponent, { data: this.article.value, })
   }

   stringify(form: any, control: any) {
      return JSON.stringify(form.value?.[control]!)
   }

   get field_width() {
      if (this.cc?.nativeElement?.offsetWidth <= 640)
         return 'col-span-1'
      else if (this.cc?.nativeElement?.offsetWidth > 640 && this.cc?.nativeElement?.offsetWidth <= 768)
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
      this.filtered_icons = this._icons.filter((icon: any) => icon.tags.includes(val) || icon.filename.includes(val)).slice(0, 50)
   }

   delete_nulls(form: any) {
      let form_2 = form;
      for (const key in form_2) {
         if ((!form_2[key] || form_2[key].length == 0 || key == 'active') && key != 'text' && key != 'languages_id')
            delete form_2[key]
         if (Array.isArray(form_2[key]))
            form_2[key].forEach((sub_key: any) => {
               this.delete_nulls(sub_key)
            });
      }
      console.log(form_2);
      
   }

}
