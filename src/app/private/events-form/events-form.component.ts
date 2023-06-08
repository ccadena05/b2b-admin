import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { Response } from 'src/app/models/response.model';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { config } from 'src/config';
import 'src/assets/scripts/quill.js'
declare var Quill: any;
@Component({
   selector: 'app-events-form',
   templateUrl: './events-form.component.html',
   styleUrls: ['./events-form.component.scss']
})
export class EventsFormComponent implements OnInit {
   form: FormGroup;
   tabs: any = [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }];
   available_langs: any = []

   constructor(
      private formBuilder: FormBuilder,
      private provider: ProviderService,
      public master: MasterService,
      private manager: CloudinaryWidgetManager,

   ) { 
      this.form = this.formBuilder.group({
         id: [ null ],
         title: this.formBuilder.array([this.master.createTranslation('1')]),
         description: this.formBuilder.array([this.master.createTranslation('1')]),
         image_url: [ null ],
         cost: [ null ],
         coin: [ null ],
         event_type: [ null ],
         image_gallery: [ null ],
         video_gallery: [ null ],
         public_gallery: [ null ],
         start_date: [ null ],
         end_date: [ null ],
         event_summary: [ null ],
         profile_company_id: [ null ],
         blog_id: [ null ],
         organizer: [ null ],
         tags: [ null ],
         web_page: [ null ],
         url_form: [ null ],
         released: [ null ],
         released_date: [ null ],
         event_privacy: [ null ],
         active: [ null ],
         create_date: [ null ],
         last_update: [ null ],
      })

      console.log(this.form.value);
      
   }

   ngOnInit(): void {
      this.get()
   }

   ngAfterViewInit() {
      this.quill()
   }

   

   get() {
      this.available_langs = [
         {
             "id": 1,
             "language": "EN",
             "name": "English",
             "emoji": "🇺🇸"
         },
         {
             "id": 2,
             "language": "ES",
             "name": "Spanish",
             "emoji": "🇲🇽"
         }
     ]
      /* this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => {
            console.log(languages.msg);
            this.available_langs = [
               {
                   "id": 1,
                   "language": "EN",
                   "name": "English",
                   "emoji": "🇺🇸"
               },
               {
                   "id": 2,
                   "language": "ES",
                   "name": "Spanish",
                   "emoji": "🇲🇽"
               }
           ]
         }
      ) */
   }

   save() {

   }

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

    quill( ) {
      new Quill('#editor', {
         theme: 'snow',
         placeholder: 'Descripción',
      })
    }
}
