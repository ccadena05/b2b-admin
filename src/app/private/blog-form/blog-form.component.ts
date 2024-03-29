import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { config } from 'src/config';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from 'src/app/models/response.model';
import { JwtAuthService } from 'src/app/services/auth/jwt-auth.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, X } from '@angular/cdk/keycodes';
import { OutputService } from 'src/app/services/output.service';
import { LanguageService } from 'src/app/services/language.service';
import { Language } from 'src/app/models/language.model';
import { LayoutService } from 'src/app/services/layout.service';

declare var Quill: any;

@Component({
   selector: 'app-blog-form',
   templateUrl: './blog-form.component.html',
   styleUrls: ['./blog-form.component.scss']
})
export class BlogFormComponent implements OnInit {
   _id: any;
   form: FormGroup;
   tabs: Language[] = [this.lang.user_lang];
   available_langs: any = []
   _ql: typeof Quill;
   sel: any = [];
   readonly separatorKeysCodes = [ENTER, COMMA] as const;
   selected_all: any = [];
   changes: boolean = false;

   comments: Object[] = [
      {
         '01_USUARIO': 'Angel Antonio Zapatero Díaz',
         '02_COMENTARIO': 'Muy interesante!',
         '03_FECHA': '2023-06-10'
      },
      {
         '01_USUARIO': 'Roberto Navarro Rodriguez',
         '02_COMENTARIO': 'Me ha encantado',
         '03_FECHA': '2023-06-10'
      },
      {
         '01_USUARIO': 'Eduardo Ramírez Navarrp',
         '02_COMENTARIO': 'Bastante bueno',
         '03_FECHA': '2023-06-10'
      },
   ]

   constructor(
      public router: Router,
      public master: MasterService,
      public layout: LayoutService,

      private formBuilder: FormBuilder,
      private manager: CloudinaryWidgetManager,
      private ls: LocalStoreService,
      private provider: ProviderService,
      private activatedRoute: ActivatedRoute,
      private jwt: JwtAuthService,
      private output: OutputService,
      private lang: LanguageService
   ) {
      this.form = this.formBuilder.group({
         id: [null],
         user_update: [this.jwt.getUser()],
         user_create: [this.jwt.getUser()],
         title: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         summary: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         description: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         image_url: [null, Validators.required],
         image_gallery: this.formBuilder.array([]),
         video_url: [null],
         file_url: [null],
         tags: [null, Validators.required],
         // parent_id: [null, Validators.required],
         category: [null, Validators.required],
         sub_category: [null, Validators.required],
         categories: [null, Validators.required],
         profile_company_id: [null],
         released: [null]
      });
   }

   ngOnInit(): void {
      this.get();
   }

   ngAfterViewInit() {
   }

   uploadPDF(control: any,) {
      this.manager.open(config.upload_config).subscribe(
         data => {
            if (data.event == 'success')
               control?.patchValue(data.info.secure_url)
         }
      )
   }

   uploadGallery(control: any) {
      this.manager.open(config.upload_config).subscribe(
         data => {
            if (data.event == 'success')
               this.master.getterA(this.form.controls['image_gallery']).push(this.master.createGallery(data.info.secure_url, this.form.value?.['image_gallery']?.[0]?.['identifier'] ?? null))
         }
      )
   }


   drop(event: any) {
      moveItemInArray(this.form.value.img, event.previousIndex, event.currentIndex);
   }

   get() {
      this.output.ready.next(false)
      this.output.table_ready.next(false)

      this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => {
            if (!languages.error) {
               this.available_langs = languages.msg;
               this.provider.BD_ActionGet('blogs', 'get_category_blogs', { tree_size: 0 }).subscribe(
                  (category_blogs: Response) => {
                     console.log(category_blogs.msg);
                     
                     this.sel['category_blogs'] = category_blogs.msg;
                     this.provider.BD_ActionAdminGet('companies', 'get').subscribe(
                        (companies: Response) => {
                           if (!companies.error) {
                              this.sel['companies'] = this.master?.changeKey({ 'ID': 'id', '01_TITLE': 'name' }, companies.msg.approved)
                              if (this.router.url.includes('detail')) {
                                 this.provider.BD_ActionAdminGet('blogs', 'get_blog_by_id', { blog_id: atob(this.__id) }).subscribe(
                                    (blog: Response) => {
                                       console.log(blog.msg);
                                       
                                       if (!blog.error) {
                                          blog.msg.categories = blog.msg.categories.reverse()
                                          this.ls.update('bc', [
                                             {
                                                item: 'Blog',
                                                link: '/m/blogs'
                                             },
                                             {
                                                item: blog.msg.title[0].text,
                                                link: null
                                             }
                                          ])
                                          this.master.patch(blog.msg, this.form, this.tabs)
                                          this.empty_translations(['title', 'summary', 'description'])
                                          this.selected_all = blog.msg.categories
                                          this.output.ready.next(true)
                                          this.output.table_ready.next(true)   
                                          console.log(this.form.value);
                                                                     
                                       }
                                    }
                                 )
                              } else {
                                 this.ls.update('bc', [
                                    {
                                       item: 'Blog',
                                       link: '/m/blogs'
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
               )
            }
         }
      )
   }

   onCategorySelected(category: any): void {
      if (this.form.value['categories']?.[category.generation] != category.id) {
         this.selected_all[category.generation] = category.id;
         while (this.selected_all[category.generation + 1])
            this.selected_all.pop()

         this.form.controls['categories'].patchValue(this.selected_all)
      }
      console.log(this.selected_all);
      
      // this.form.controls['parent_id'].patchValue(this.selected_all[this.selected_all.length - 1])
      this.form.controls['category'].patchValue(this.selected_all[0])
      this.form.controls['sub_category'].patchValue(this.selected_all[this.selected_all.length - 1])

      const categoryId = category.id;

      this.provider.BD_ActionGet('blogs', 'get_category_blogs', { tree_size: 0, id_category: categoryId })
         .subscribe((category_blogs: Response) => {

            category.children = category_blogs.msg;
         });
      // console.log(this.form.value);
   }


   save() {
      if(!this.form.value.user_update)
         this.form.controls['user_update'].patchValue(this.jwt.getUser())

         this.form.controls['category'].patchValue(this.selected_all[0])
      this.master.save('blogs', this.router.url.includes('detail') ? 'update_blog' : 'insert_blog', this.form.value)
   }

   delete() {
      this.master.delete('blogs', 'delete_blog', { id: this.form.value.id })
   }

   draft() {
      if (this.router.url.includes('detail')) {
         this.provider.BD_ActionAdminPut('blogs', 'update_draft_blog', this.form.value).subscribe(
            (data: Response) => console.log(data)
         )
      } else {
         this.provider.BD_ActionAdminPost('blogs', 'insert_draft_blog', this.form.value).subscribe(
            (data: Response) => console.log(data)
         )
      }
      console.log('draft', this.form.value)
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

   stringify(control: any) {
      return JSON.stringify(this.form.value?.[control]!)
   }

   empty_translations(controls: string[]){
      controls.forEach((control: string) => {
         if(JSON.stringify(this.form.value?.[control]) == '[]')
            this.master.getterA(this.form.controls[control]).push(this.master.translation(this.lang.user_lang.id, null))
      });
   }
}
