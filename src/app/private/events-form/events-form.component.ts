import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { Response } from 'src/app/models/response.model';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { config } from 'src/config';
import { COMMA, ENTER, X } from '@angular/cdk/keycodes';

// import 'src/assets/scripts/quill.js'
import { LocalStoreService } from 'src/app/services/local-store.service';
// declare var Quill: any;
import { ImageHandler, Options } from 'ngx-quill-upload';
Quill.register('modules/imageHandler', ImageHandler);


import Quill from 'quill';
import { ActivatedRoute, Router } from '@angular/router';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
   selector: 'app-events-form',
   templateUrl: './events-form.component.html',
   styleUrls: ['./events-form.component.scss']
})
export class EventsFormComponent implements OnInit {
   _id: any;
   sel: any = [];
   form: FormGroup;
   tabs: any = [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }];
   available_langs: any = []
   readonly separatorKeysCodes = [ENTER, COMMA] as const;

   // _ql: typeof Quill;

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
      private formBuilder: FormBuilder,
      private provider: ProviderService,
      private manager: CloudinaryWidgetManager,
      private activatedRoute: ActivatedRoute,


   ) {
      this.form = this.formBuilder.group({
         id: [null],
         title: this.formBuilder.array([this.master.createTranslation('1')]),
         description: this.formBuilder.array([this.master.createTranslation('1')]),
         image_url: [null, Validators.required],
         cost: [null, Validators.required],
         coin: [null, Validators.required],
         event_type: [null],
         image_gallery: [null],
         video_gallery: [null, Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)[a-zA-Z0-9_-]+(\/)?(\?[\w=&]*)?(#([\w-]+))?$/i)],
         public_gallery: [null],
         start_date: [null, Validators.required],//yyyy-mm-dd 2023-01-23
         end_date: [null, Validators.required],//yyyy-mm-dd 2023-01-23
         event_summary: [null],
         profile_company_id: ['20230424174025ZN7LCeF3DKH9DnAxTx'],
         file_url: [null],
         blog_id: [null],
         organizer: ['PARQUE TECNOLÓGICO SANMIGUELENSE'],
         tags: [null],
         web_page: [null],
         url_form: [null],
         form: [null, Validators.required],
         released: [null],
         released_date: [null],
         event_privacy: [null],
         active: [null],
         create_date: [null],
         last_update: [null],
         category: [633]
      })

      console.log(this.form.value);

      this.activatedRoute.params.subscribe(params => {

         this._id = params['id']
      })

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
      let section = null
      this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => {
            // console.log(languages.msg);
            if (!languages.error) {
               this.available_langs = languages.msg;

               this.sel['event_type'] = [{ name: 'Presencial', id: 0 }, { name: 'Virtual', id: 1 },]
               this.sel['coin'] = [{ name: 'MXN', id: 0 }, { name: 'USD', id: 1 }]
               this.sel['event_privacy'] = [{ name: 'Público', id: 0 }, { name: 'Registrado', id: 1 }, { name: 'Premium', id: 2 }]

               this.provider.BD_ActionGet('general', 'get_category_events', { tree_size: -1 }).subscribe(
                  (category: Response) => {
                     console.log(category);
                     if (!category.error) {
                        /* category.msg[0]['children'].forEach((child: any) => {
                           child = this.master?.changeKey({ 'ES': 'name' }, child)
                        });
                        this.sel['category'] = category.msg[0]['children']
                        log */
                        if (this.router.url.includes('detail')) {
                           let id = atob(this.__id)

                           this.provider.BD_ActionAdminGet('events', 'get_event_by_id', { event_id: id }).subscribe(
                              (event: Response) => {
                                 if (!event.error) {
                                    console.log(event.msg);
                                    event?.msg?.description.forEach((element: any) => {

                                       if (element.languages_id != 1) {
                                          this.master.createTranslation(element.languages_id)
                                          this.addTab(this.language_index(element.languages_id))
                                       }

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

                                       this.master.patchForm(event.msg, this.form)

                                    });
                                 }
                              }
                           )
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

   save() {
      if (this.router.url.includes('detail')) {
         this.provider.BD_ActionAdminPut('events', 'update_event', this.form.value).subscribe(
            data => console.log(data)
         )
      } else {
         this.provider.BD_ActionAdminPost('events', 'insert_event', this.form.value).subscribe(
            data => console.log(data)
         )
      }
      console.log(this.form.value)

   }

   // deltaToHtml(delta: any): string {
   //    this._ql = new Quill(document.createElement('div'));
   //    this._ql.setContents(delta);
   //    return this._ql?.root.innerHTML;
   //  }

   addTab(language: any) {
      if (!this.tabs.some((item: any) => item.id == language.id) && (language.id != '1' || language.id != 1)) {
         this.tabs.push(language);
         Object.keys(this.form.controls).forEach(element => {
            if (this.form.controls[element] instanceof FormArray)
               this.master.getterA(this.form.controls[element]).push(this.master.createTranslation(language.id))
         })
      }
   }

   deleteTab(index: any, languages_id: any) {
      if (this.tabs.length > 1) {
         this.tabs.splice(index, 1)

         Object.keys(this.form.controls).forEach(element => {
            if (this.form.controls[element] instanceof FormArray) {
               const formArray = this.master.getterA(this.form.controls[element]);
               const indexToRemove = formArray.controls.findIndex(
                  control => control.value.languages_id == languages_id
               )
               if (indexToRemove >= 0) {
                  formArray.at(indexToRemove).get('active')?.patchValue('0')
               }
               // formArray.removeAt(indexToRemove)
            }
         });
      }
   }

   uploadGallery(control: any) {
      let images: any[] = []
      this.manager.open(config.upload_config).subscribe(
         data => {
            if (data.event == 'success') {
               images.push(data.info.secure_url)
            }
         }
      )
      control?.patchValue(images)
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

      if (value)
         this.form.value.tags = this.form.value.tags + ', ' + value

      event.chipInput!.clear();
   }

   removeTag(tag: any): void {
      const tagToRemove = tag + ', ';
      this.form.value.tags = this.form.value.tags.replace(tagToRemove, '');
   }

}
