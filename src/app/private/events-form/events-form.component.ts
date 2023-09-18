import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { Response } from 'src/app/models/response.model';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { config } from 'src/config';
import { COMMA, ENTER, X } from '@angular/cdk/keycodes';
import { Language } from 'src/app/models/language.model';

// import 'src/assets/scripts/quill.js'
import { LocalStoreService } from 'src/app/services/local-store.service';
// declare var Quill: any;
import { ImageHandler, Options } from 'ngx-quill-upload';
Quill.register('modules/imageHandler', ImageHandler);


import Quill from 'quill';
import { ActivatedRoute, Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';
import { JwtAuthService } from 'src/app/services/auth/jwt-auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from 'src/app/components/dialogo-confirmacion/dialogo-confirmacion.component';
import { OutputService } from 'src/app/services/output.service';
import { LanguageService } from 'src/app/services/language.service';

@Component({
   selector: 'app-events-form',
   templateUrl: './events-form.component.html',
   styleUrls: ['./events-form.component.scss']
})
export class EventsFormComponent implements OnInit {
   _id: any;
   sel: any = [];
   form: FormGroup;
   tabs: Language[] = [this.lang.user_lang];
   available_langs: any = []
   readonly separatorKeysCodes = [ENTER, COMMA] as const;
   selected_all: any = [];
   save_button: boolean = false;
   // _ql: typeof Quill;
   video_rexexp: RegExp = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)[a-zA-Z0-9_-]+(\/)?(\?[\w=&]*)?(#([\w-]+))?$/i;
   modules = {
      toolbar: [
         ['bold', 'italic', 'underline', 'strike'],
         //   [{ font: [] }],
         //   [{ color: [] }, { background: [] }],
         //   [{ size: ['small', false, 'large', 'huge'] }],
         //   [{ header: [1, 2, 3, 4, 5, 6, false] }],
         [{ align: [] }],
         ['blockquote', 'code-block'],
         [{ list: 'ordered' }, { list: 'bullet' }],
         ['link', 'image', 'video']
      ],
      imageHandler: {
         upload: (file: any) => {
            return new Promise((resolve, reject) => {
               const uploadData = new FormData();
               uploadData.append('file', file, file.name);
               this.provider.BD_ActionUpload(uploadData).subscribe((data: any) => {
                  resolve(data.imageUrl);
               });
            });

         },
         accepts: ['png', 'jpg', 'jpeg', 'jfif'] // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
      } as Options
   };


   constructor(
      public master: MasterService,
      public router: Router,
      private ls: LocalStoreService,
      private jwt: JwtAuthService,
      private dialog: MatDialog,
      private lang: LanguageService,
      private formBuilder: FormBuilder,
      private provider: ProviderService,
      private manager: CloudinaryWidgetManager,
      private activatedRoute: ActivatedRoute,
      private output: OutputService
   ) {
      this.form = this.formBuilder.group({
         id: [null],
         
         title: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         description: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         image_url: [null, Validators.required],
         cost: [null, Validators.required],
         coin: [null],
         event_type: [null, Validators.required],
         image_gallery: this.formBuilder.array([]),
         video_gallery: this.formBuilder.array([]),
         public_gallery: [null],
         start_date: [null, Validators.required],//yyyy-mm-dd 2023-01-23
         end_date: [null, Validators.required],//yyyy-mm-dd 2023-01-23
         event_summary: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         profile_company_id: [null, Validators.required],
         blog_id: [null],
         organizer: [null, Validators.required],
         tags: [null, Validators.required],
         web_page: [null],
         url_form: [null],
         form: [null, Validators.required], //Saber si se registra internamente o externo
         released: [null],
         released_date: [null],
         event_privacy: [null],
         // active: [null],
         create_date: [null],
         last_update: [null],
         category: [null, Validators.required],
         sub_category: [null, Validators.required],
         categories: [null],
         user_update: [this.jwt.getUser()],
         user_create: [this.jwt.getUser()],
         parent_id: [null],
         url: [null]
      })
      this.activatedRoute.params.subscribe(params => {

         this._id = params['id']
      })

      this.form.controls['profile_company_id'].valueChanges.subscribe(
         (company: any) => this.form.controls['organizer'].setValue(this.get_company_name(company))
      )

   }

   ngOnInit(): void {
      this.get();

   }

   ngAfterViewInit() {
      // this._ql?.on('text-change', () => {
      //    this.patch_quill();
      //  });
   }



   get() {
      this.output.ready.next(false)
      this.output.table_ready.next(false)
      let section = null
      this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => {
            // console.log(languages.msg);
            if (!languages.error) {
               this.available_langs = languages.msg;

               this.sel['event_type'] = [{ name: 'Presencial', id: 0 }, { name: 'Virtual', id: 1 },]
               this.sel['coin'] = [{ name: 'MXN', id: 0 }, { name: 'USD', id: 1 }]
               this.sel['event_privacy'] = [{ name: 'Público', id: 0 }, { name: 'Registrado', id: 1 }, { name: 'Premium', id: 2 }]

               this.provider.BD_ActionGet('events', 'get_category_events', { tree_size: 0, id_category: 643 }).subscribe(
                  (category: Response) => {
                     console.log(category.msg);
                     this.sel['category_events'] = category.msg

                     if (!category.error) {
                        this.provider.BD_ActionAdminGet('companies', 'get').subscribe(
                           (companies: Response) => {
                              // console.log(companies.msg);

                              if (!companies.error) {
                                 this.sel['companies'] = this.master?.changeKey({ 'ID': 'id', '01_TITLE': 'name' }, companies.msg.approved)

                                 if (this.router.url.includes('detail')) {
                                    let id = atob(this.__id)
                                    console.log('obtener');
                                    
                                    this.provider.BD_ActionAdminGet('events', 'get_event_by_id', { event_id: id }).subscribe(
                                       (event: Response) => {
                                          console.log('DB', event.msg);
                                          if (!event.error) {
                                          // event.msg.categories = event.msg?.categories?.reverse()
                                             this.ls.update('bc', [
                                                {
                                                   item: 'Eventos',
                                                   link: '/m/events'
                                                },
                                                {
                                                   item: event.msg.title[0].text,
                                                   link: null
                                                }
                                             ])
                                             this.master.patch(event.msg, this.form, this.tabs)
                                            this.empty_translations(['title', 'event_summary', 'description'])
                                            this.selected_all = event.msg.categories
                                             this.output.ready.next(true)
                                             this.output.table_ready.next(true)
                                          }
                                       }
                                    )
                                    console.log('obtenido');

                                 } else {
                                    this.ls.update('bc', [
                                       {
                                          item: 'Eventos',
                                          link: '/m/events'
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
                  }
               )
            }
         }
      )
   }

   save() {
      this.save_button = true;
      this.form.controls['user_update'].patchValue(this.jwt.getUser())
      // console.log(this.selected_all,this.selected_all[this.selected_all.length - 1]);
      
      // this.form.controls['sub_category'].patchValue(this.selected_all[this.selected_all.length - 1])
      this.master.save('events', this.router.url.includes('detail') ? 'update_event' : 'insert_event', this.form.value)
   }

   delete() {
      this.master.delete('events', 'delete_event', { id: this.form.value.id })
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

      console.log(this.selected_all[0],
         this.selected_all[this.selected_all.length - 1]);
      
      const categoryId = category.id;

      this.provider.BD_ActionGet('events', 'get_category_events', { tree_size: 0, id_category: categoryId })
         .subscribe((category_blogs: Response) => {
            console.log(category_blogs.msg);
            
            category.children = category_blogs.msg;
         });
      // console.log(this.form.value);
   }

   uploadGallery(control: any) {
      this.manager.open(config.upload_config).subscribe(
         data => {
            if (data.event == 'success')
               this.master.getterA(this.form.controls['image_gallery']).push(this.master.createGallery(data.info.secure_url, this.form.value['image_gallery'][0]?.['identifier'] ?? null))
         }
      )
   }

   drop(event: any) {
      moveItemInArray(this.form.value.img, event.previousIndex, event.currentIndex);
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

   /* backup_form(event: KeyboardEvent) {
      JSON.stringify((this.master.getterC(this.form.controls['tags'])).value).replace(/\\/g, '\\\\');
      this.ls.setItem('COMPANY_FORM', this.form.value)
   } */

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

   get_company_name(id: any) {
      return this.sel['companies']?.filter((company: any) => company.id == id)[0]?.['name']
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
