import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { Response } from 'src/app/models/response.model';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { config } from 'src/config';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
   selector: 'app-categories-form',
   templateUrl: './categories-form.component.html',
   styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {
   form: FormGroup;
   save_button: boolean = false;
   sel: any = [];
   selected_all: any = [];
   readonly separatorKeysCodes = [ENTER, COMMA] as const;

   constructor(
      public router: Router,
      public master: MasterService,
      private formBuilder: FormBuilder,
      private provider: ProviderService,
      private manager: CloudinaryWidgetManager
   ) {
      this.form = this.formBuilder.group({
         title_en: [null, Validators.required],
         title_es: [null, Validators.required],
         tags: [null, Validators.required],
         parent_id: [null, Validators.required],
         category: [null, Validators.required],
         image_url: [null, Validators.required],
      })
   }

   ngOnInit(): void {
      this.get();

   }

   get() {
      this.provider.BD_ActionGet('general', 'get_category_searcher', { tree_size: 0 }).subscribe(
         (category_searcher: Response) => {
            this.sel['category'] = category_searcher.msg;
         }
      )
   }

   delete() {

   }

   save() {
      if (!this.form.value.parent_id)
         this.form.value.parent_id = 0
      console.log(this.form.value);

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

   onCategorySelected(category: any): void {
      if (this.form.value['category']?.[category.generation] != category.id) {
         this.selected_all[category.generation] = category.id;
         while (this.selected_all[category.generation + 1])
            this.selected_all.pop()

         this.form.controls['category'].patchValue(this.selected_all)
      }
      this.form.controls['parent_id'].patchValue(this.selected_all[this.selected_all.length - 1])

      const categoryId = category.id;

      this.provider.BD_ActionGet('general', 'get_category_searcher', { tree_size: 0, id_category: categoryId })
         .subscribe((category_blogs: Response) => {

            category.children = category_blogs.msg;
         });
      console.log(this.form.value);

   }

   addTag(event: MatChipInputEvent): void {
      const value = (event.value || '').trim();

      if (value) {
         if (this.form.value.tags != null)
            this.form.controls['tags'].patchValue(this.form.value.tags + ', ' + value);
         else
            this.form.controls['tags'].patchValue(value);
      }
      event.chipInput!.clear();
   }

   removeTag(tag: any): void {
      const tagToRemove = tag + ', ';
      this.form.value.tags = this.form.value.tags.replace(tagToRemove, '');
   }

}
