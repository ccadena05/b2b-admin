import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { config } from 'src/config';
import { ProviderService } from 'src/app/services/provider/provider.service';

declare var Quill: any;

@Component({
  selector: 'app-blog-form',
  templateUrl: './blog-form.component.html',
  styleUrls: ['./blog-form.component.scss']
})
export class BlogFormComponent implements OnInit {

  form: FormGroup;
  tabs: any = [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }];
  available_langs: any = []
  _ql: typeof Quill;

  constructor(
    public master: MasterService,
    private formBuilder: FormBuilder,
    private manager: CloudinaryWidgetManager,
    private ls: LocalStoreService,
    private provider: ProviderService
  ) {
    this.form = this.formBuilder.group({
      title: this.formBuilder.array([this.master.createTranslation('1')]),
      description: this.formBuilder.array([this.master.createTranslation('1')]),
      image_url: ['', Validators.required],
      link: '',
      file: ''
    })
  }

  ngOnInit(): void {
    this.get();
  }

  ngAfterViewInit() {
    this.quill()
  }

  uploadPDF(
    control: any,
    // name_control: any
  ) {
    this.manager.open(config.upload_config).subscribe(
      data => {
        if (data.event == 'success') {
          control?.patchValue(data.info.secure_url)
          // name_control?.patchValue(data.info.original_filename)
        }
      }
    )
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

  drop(event: any) {
    moveItemInArray(this.form.value.img, event.previousIndex, event.currentIndex);
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
    this.ls.update('bc', [
      {
        item: 'Blog',
        link: '/m/blog'
      },
      {
        item: 'Agregar',
        link: null
      }
    ])
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

  quill() {
    this._ql = new Quill('#editor', {
      theme: 'snow',
      placeholder: 'Descripción',
    })
  }

  save() {
    this.provider.BD_ActionAdminPost('blog', 'update_blog', this.form.value).subscribe(
      data => console.log(data)
    )
  }
}
