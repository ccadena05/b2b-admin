import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { scheduled } from 'rxjs';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { config } from 'src/config';
import { google } from 'google-maps';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { OutputService } from 'src/app/services/output.service';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { MasterService } from 'src/app/services/master.service';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatOptionSelectionChange } from '@angular/material/core';
import { Response } from 'src/app/models/response.model';
import { MatRadioButton } from '@angular/material/radio';
import { cloneDeep } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';

declare var google: any;

@Component({
   selector: 'app-companies-detail',
   templateUrl: './companies-detail.component.html',
   styleUrls: ['./companies-detail.component.scss']
})
export class CompaniesDetailComponent implements OnInit {
   private typingTimer: any;
   tabs: any = [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }];
   available_langs: any = [];
   all_countrys: any = [];

   form: FormGroup;
   sel: any = [];
   selectedCountry: any;
   selectedState: any;
   fullLanguage: any;
   readonly separatorKeysCodes = [ENTER, COMMA] as const;

   @ViewChild('a') slide_dia!: MatSlideToggle;
   @ViewChild('consi') consi!: MatRadioButton
   @ViewChild('ping') ping!: ElementRef;

   products: any = [
      {
         '01_NOMBRE': 'Caretas con diadema inyectada Modelo CCtr',
         '02_DESCRIPCIÓN BREVE': 'Careta protectora ante contingencia COVID19.',
         '03_DESCRIPCIÓN DETALLADA': 'Una careta protectora es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante la contingencia del COVID-19. Está diseñada para cubrir la cara completa y se usa comúnmente en combinación con otros equipos de protección personal, como mascarillas faciales y guantes, para proporcionar una protección adicional contra el virus.'
      },
      {
         '01_NOMBRE': 'Careta con soporte Modelo FKI',
         '02_DESCRIPCIÓN BREVE': 'Careta con diadema inyectada, fabricada en PET transparente, reutilizable y sanitizable.',
         '03_DESCRIPCIÓN DETALLADA': 'La careta con diadema inyectada es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante situaciones como la pandemia del COVID-19.'
      },
      {
         '01_NOMBRE': 'Mascarilla Termoformada Modelo MC',
         '02_DESCRIPCIÓN BREVE': 'Mascarilla termoformada, fabricada en PET transparente, reutilizable y sanitizable.',
         '03_DESCRIPCIÓN DETALLADA': 'La mascarilla termoformada es un tipo de mascarilla facial que se utiliza como equipo de protección personal durante situaciones como la pandemia del COVID-19. Está fabricada en PET transparente, lo que permite una visibilidad clara sin comprometer la seguridad de la persona que la usa.'
      },
      {
         '01_NOMBRE': 'Caretas con diadema inyectada Modelo CCtr',
         '02_DESCRIPCIÓN BREVE': 'Careta protectora ante contingencia COVID19.',
         '03_DESCRIPCIÓN DETALLADA': 'Una careta protectora es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante la contingencia del COVID-19. Está diseñada para cubrir la cara completa y se usa comúnmente en combinación con otros equipos de protección personal, como mascarillas faciales y guantes, para proporcionar una protección adicional contra el virus.'
      },
      {
         '01_NOMBRE': 'Careta con soporte Modelo FKI',
         '02_DESCRIPCIÓN BREVE': 'Careta con diadema inyectada, fabricada en PET transparente, reutilizable y sanitizable.',
         '03_DESCRIPCIÓN DETALLADA': 'La careta con diadema inyectada es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante situaciones como la pandemia del COVID-19.'
      },
      {
         '01_NOMBRE': 'Mascarilla Termoformada Modelo MC',
         '02_DESCRIPCIÓN BREVE': 'Mascarilla termoformada, fabricada en PET transparente, reutilizable y sanitizable.',
         '03_DESCRIPCIÓN DETALLADA': 'La mascarilla termoformada es un tipo de mascarilla facial que se utiliza como equipo de protección personal durante situaciones como la pandemia del COVID-19. Está fabricada en PET transparente, lo que permite una visibilidad clara sin comprometer la seguridad de la persona que la usa.'
      },
      {
         '01_NOMBRE': 'Caretas con diadema inyectada Modelo CCtr',
         '02_DESCRIPCIÓN BREVE': 'Careta protectora ante contingencia COVID19.',
         '03_DESCRIPCIÓN DETALLADA': 'Una careta protectora es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante la contingencia del COVID-19. Está diseñada para cubrir la cara completa y se usa comúnmente en combinación con otros equipos de protección personal, como mascarillas faciales y guantes, para proporcionar una protección adicional contra el virus.'
      },
      {
         '01_NOMBRE': 'Careta con soporte Modelo FKI',
         '02_DESCRIPCIÓN BREVE': 'Careta con diadema inyectada, fabricada en PET transparente, reutilizable y sanitizable.',
         '03_DESCRIPCIÓN DETALLADA': 'La careta con diadema inyectada es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante situaciones como la pandemia del COVID-19.'
      },
      {
         '01_NOMBRE': 'Mascarilla Termoformada Modelo MC',
         '02_DESCRIPCIÓN BREVE': 'Mascarilla termoformada, fabricada en PET transparente, reutilizable y sanitizable.',
         '03_DESCRIPCIÓN DETALLADA': 'La mascarilla termoformada es un tipo de mascarilla facial que se utiliza como equipo de protección personal durante situaciones como la pandemia del COVID-19. Está fabricada en PET transparente, lo que permite una visibilidad clara sin comprometer la seguridad de la persona que la usa.'
      },
   ];

   requierements = [
      {
         '01_TITULO': 'Titulo del Requerimiento',
         '02_DESCRIPCION': 'Descripción del Requerimiento',
         '03_FECHA': '2023-06-10'
      },
      {
         '01_TITULO': 'Titulo del Requerimiento',
         '02_DESCRIPCION': 'Descripción del Requerimiento',
         '03_FECHA': '2023-06-10'
      },
      {
         '01_TITULO': 'Titulo del Requerimiento',
         '02_DESCRIPCION': 'Descripción del Requerimiento',
         '03_FECHA': '2023-06-10'
      },
      {
         '01_TITULO': 'Titulo del Requerimiento',
         '02_DESCRIPCION': 'Descripción del Requerimiento',
         '03_FECHA': '2023-06-10'
      },
      {
         '01_TITULO': 'Titulo del Requerimiento',
         '02_DESCRIPCION': 'Descripción del Requerimiento',
         '03_FECHA': '2023-06-10'
      },
      {
         '01_TITULO': 'Titulo del Requerimiento',
         '02_DESCRIPCION': 'Descripción del Requerimiento',
         '03_FECHA': '2023-06-10'
      },
      {
         '01_TITULO': 'Titulo del Requerimiento',
         '02_DESCRIPCION': 'Descripción del Requerimiento',
         '03_FECHA': '2023-06-10'
      },
      {
         '01_TITULO': 'Titulo del Requerimiento',
         '02_DESCRIPCION': 'Descripción del Requerimiento',
         '03_FECHA': '2023-06-10'
      },
   ];



   certifications: any = [];

   days: any[] = [
      {
         id: 'sunday',
         name: 'Domingo'
      },
      {
         id: 'monday',
         name: 'Lunes'
      },
      {
         id: 'tuesday',
         name: 'Martes'
      },
      {
         id: 'wednesday',
         name: 'Miércoles'
      },
      {
         id: 'thursday',
         name: 'Jueves'
      },
      {
         id: 'friday',
         name: 'Viernes'
      },
      {
         id: 'saturday',
         name: 'Sábado'
      }
   ];
   cert: any;
   @ViewChild('map') mapaElement!: ElementRef;
   map!: any;
   lat: any = 19.4326806;
   lng: any = -99.1332704;
   location: any
   _id: any;
   constructor(
      public master: MasterService,
      public provider: ProviderService,
      public ls: LocalStoreService,
      private router: Router,
      private output: OutputService,
      private formBuilder: FormBuilder,
      private manager: CloudinaryWidgetManager,
      private activatedRoute: ActivatedRoute
   ) {
      this.activatedRoute.params.subscribe(params => this._id = params['id'])

      this.form = this.formBuilder.group({
         profile_company_id: [this._id ? atob(this._id) : null, Validators.required],
         legal_name: this.formBuilder.array([this.master.createTranslation('1')]),
         friendly_name: [null, Validators.required],
         rfc: [null, Validators.required],
         email_company: [null, [Validators.required, Validators.email]],
         phone_code: [null, Validators.required],
         phone: [null, Validators.required],
         ext: [null],
         phone_switch: [null],
         phone_fax: [null],
         main_activity: this.formBuilder.array([this.master.createTranslation('1')]),
         start_year: [null, Validators.required],
         type_company_id: [null, Validators.required],
         country_origin: [null, Validators.required],
         country: [null, Validators.required],
         state: [null, Validators.required],
         city: [null, Validators.required],
         zip: [null, Validators.required],
         address_1: [null, Validators.required],
         address_2: [null, Validators.required],
         latitude: [null, Validators.required],
         longitude: [null, Validators.required],
         branch: [null, Validators.required],
         web_page: [null, Validators.required],
         tags: [null],
         brochure_name: [null],
         brochure_url: [null],
         description: this.formBuilder.array([this.master.createTranslation('1')]),
         description_detail: this.formBuilder.array([this.master.createTranslation('1')]),
         schedule_week: this.formBuilder.group({
            sunday: [null, Validators.required],
            monday: [null, Validators.required],
            tuesday: [null, Validators.required],
            wednesday: [null, Validators.required],
            thursday: [null, Validators.required],
            friday: [null, Validators.required],
            saturday: [null, Validators.required],
            sunday_tg: [null, Validators.required],
            monday_tg: [null, Validators.required],
            tuesday_tg: [null, Validators.required],
            wednesday_tg: [null, Validators.required],
            thursday_tg: [null, Validators.required],
            friday_tg: [null, Validators.required],
            saturday_tg: [null, Validators.required],
         }),
         consi: [null],
         pisi: [null],
         company_payment: this.formBuilder.array([this.master.createTranslation('1')]),
         support_clients: [null],
         service_cluster: [null],
         main_processes: this.formBuilder.array([this.master.createTranslation('1')]),
         production_capacity: this.formBuilder.array([this.master.createTranslation('1')]),
         machinery: this.formBuilder.array([this.master.createTranslation('1')]),
         guarantees_offered: this.formBuilder.array([this.master.createTranslation('1')]),
         quality_awards: [null],
         cert: [],
         isos: this.formBuilder.array([]),
         facebook: [null, Validators.pattern(/^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9.]+(\/)?$/)],
         twitter: [null, Validators.pattern(/^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9_]+(\/)?$/)],
         linkedin: [null, Validators.pattern(/^(https?:\/\/)?(www\.)?linkedin.com\/company\/[a-zA-Z0-9-]+(\/)?$/)],
         youtube: [null, Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)[a-zA-Z0-9_-]+(\/)?(\?[\w=&]*)?(#([\w-]+))?$/i)],
         number_employees: [null, Validators.required],
         turnover: [null, Validators.required],
         specialization: this.formBuilder.array([this.master.createTranslation('1')]),
         another_sector: this.formBuilder.array([this.master.createTranslation('1')]),
         relevant_products: this.formBuilder.array([this.master.createTranslation('1')]),
      });

      this.get()

      this.typingTimer = null;
   }

   ngOnInit(): void {
   }

   ngAfterViewInit() {
      this.cargarMapa();
   }

   toggle_iso(event: any) {
      const _cert = this.form.value.cert;
      const _isos: any = []
      const isos_array = this.master.getterA(this.form.controls['isos'])

      this.form.value.isos.forEach((element: any) => {
         _isos?.push(element?.name_id)
      })

      if (_cert.length > _isos.length) { // Se añadió un nuevo ISO
         for (const iso of _cert) {
            if (!_isos.includes(iso))  // No estaba antes, hacer push
               isos_array.push(this.master.createCertificate(iso, this.findCert(iso).name))

         }
      } else if ((_cert.length < _isos.length)) { // Se quitó un ISO
         let iso_index: any;

         for (const iso of _isos) {
            if (!_cert.includes(iso))
               iso_index = isos_array.value.findIndex((isos: any) => isos.name_id == iso)
         }

         let iso_to_del: FormGroup = this.master.getterG(isos_array.at(iso_index));
         if (iso_to_del?.value?.url != null && iso_to_del?.value?.url != undefined && iso_to_del?.value?.url != "")  // Tiene valor, cambia active a '0'
            iso_to_del.controls['active'].patchValue('0')
         else  // Borrar
            isos_array.removeAt(iso_index);
      } else { // Se desmarcó y se marcó un ISO
         for (const iso of _isos) {
            let iso_index: any;
            iso_index = isos_array.value.findIndex((isos: any) => isos.name_id == iso && isos.active == '0')
            if (iso_index != -1) {
               let iso_to_patch: FormGroup = this.master.getterG(isos_array.at(iso_index));
               iso_to_patch.controls['active'].patchValue('1')
            }
         }
      }
      // console.log(this.form.value);

   }

   get() {
      this.output.ready.next(false)
      this.countries();
      this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => {
            this.available_langs = languages.msg

            this.provider.BD_ActionGet('general', 'get_isos').subscribe(
               (isos: Response) => {
                  this.cert = this.certifications = isos?.msg

                  this.provider.BD_ActionGet('general', 'get_type_company').subscribe(
                     (type_company: Response) => {
                        if (!type_company.error) {
                           this.sel['type_company'] = type_company.msg

                           if (this.router.url.includes('detail')) {
                              this.provider.BD_ActionGet('profile_company', 'get_profile', { profile_company_id: atob(this._id), user_id: this.ls.getItem("B2B_USER") }).subscribe(
                                 (company: Response) => {
                                    console.log('Viene de DB', company);
                                    if (!company.error) {
                                       let comp = company?.msg;

                                       let _isos: any = []
                                       comp?.isos?.forEach((element: any) => {
                                          _isos?.push(element?.name_id.toString())
                                       })

                                       this.form.get('cert')?.patchValue(_isos)

                                       /* comp?.categories_company?.forEach((element: any) => {
                                          this.master.getterA(this.form.controls['categories_company'])?.push(this.master.createSimpleTranslation())
                                       }); */

                                       this.master.patch(comp, this.form, this.tabs)

                                       Object.keys(this.master.getterG(this.form.controls['schedule_week']).controls).forEach(element => this.slideHasValue('schedule_week', element));

                                       this.form.controls['consi']?.patchValue(this.master.turn_check(this.form, ['support_clients', 'service_cluster']))
                                       this.form.controls['pisi']?.patchValue(this.master.turn_check_array(this.form, ['main_processes', 'production_capacity']))

                                       this.ls.update('bc', [
                                          {
                                             item: 'Empresas',
                                             link: '/m/companies'
                                          },
                                          {
                                             item: comp.friendly_name.toLowerCase(),
                                             link: null
                                          }
                                       ])

                                       this.output.ready.next(true)
                                       this.createPIN((comp.latitude || this.lat), (comp.longitude || this.lng))

                                    }
                                 }
                              )
                           } else {
                              this.ls.update('bc', [
                                 {
                                    item: 'Empresas',
                                    link: '/m/companies'
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
      )
   }

   language_index(language_id: string) {
      return this.available_langs[this.available_langs.findIndex((obj: any) => obj.id == language_id)]
   }

   slideHasValue(control: any, control2?: any) {
      const horario = this.form.get([control, control2]);
      const slide = this.form.get([control, control2 + '_tg']);
      if (horario && slide && horario.value)
         slide.setValue(true)
   }

   addTab(language: any) {
      if (!this.tabs.some((item: any) => item.id == language.id) && (language.id != '1' || language.id != 1)) {
         this.tabs.push(language);
         Object.keys(this.form.controls).forEach(element => {
            if (this.form.controls[element] instanceof FormArray && element !== 'isos' && element !== 'schedule_week')
               this.master.getterA(this.form.controls[element]).push(this.master.createTranslation(language.id))
         })
      }
   }

   deleteTab(index: any, languages_id: any) {
      if (this.tabs.length > 1) {
         this.tabs.splice(index, 1);
         Object.keys(this.form.controls).forEach(element => {
            if (this.form.controls[element] instanceof FormArray && element !== 'isos' && element !== 'schedule_week') {
               const formArray = this.master.getterA(this.form.controls[element]);
               const indexToRemove = formArray.controls.findIndex(
                  control => control.value.languages_id == languages_id
               );
               if (indexToRemove >= 0) {
                  formArray.at(indexToRemove).get('active')?.patchValue('0')
               }
            }
         });
      }
   }

   save() {
      this.ping.nativeElement.classList.remove('animate-ping');
      this.form.value.schedule_week = JSON.stringify(this.form.value.schedule_week)

      if (this.form.valid) {
         this.provider.BD_ActionPut('profile_company', 'update_profile', this.form.value).subscribe(
            (data: Response) => {
               console.log(data);

               if (!data.error) {
                  setTimeout(() => {
                     this.form.reset()
                     setTimeout(() => {
                        this.master.snack(2)
                        this.get()
                     }, 500);
                  }, 500);

               }
               else
                  this.master.snack(0)

            }
         )
      } else {
         this.master.invalid_form('company-form')
      }
   }

   countries() {
      this.provider.BD_ActionGet('general', 'get_all_countrys').subscribe(
         (all_countrys: any) => {
            if (!all_countrys.error)
               this.sel['all_countrys'] = this.sel['all_countrys'] = this.master.concat(all_countrys.msg, ['e', 'n'], 'name');
         }
      )
   }

   order(object: any) {
      return object.sort((a: any, b: any) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
   }

   createPIN(lat: string, long: string) {
      const latLng = new google.maps.LatLng(parseFloat(lat), parseFloat(long));

      const marcador = new google.maps.Marker({
         draggable: true,
         map: this.map,
         position: latLng,
         animation: google.maps.Animation.DROP,
      });
      // aqui asignamos a nuestras variables la latitud y longitud
      marcador.addListener('drag', () => {
         this.lat = marcador?.getPosition()?.lat();
         this.lng = marcador?.getPosition()?.lng();
      });
      this.map.setCenter(latLng);
      this.map.setZoom(16);
   }

   cargarMapa() {
      const options = {
         mapId: '9e4275548a62443e',
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         disableDefaultUI: true,
         zoomControl: true,
         fullscreenControl: true
      };

      this.map = new google.maps.Map(this.mapaElement?.nativeElement, options);
   }

   getLocation() {
      this.provider.BD_ActionGetGeolocalizacion(this.lat, this.lng).subscribe(
         (location: any) => {
            let r = this.location = location.response;
            this.form.patchValue({
               zip: r.cp ?? '',
               address1: (r.calle ?? '') + ' ' + (r.numero ?? ''),
               address2: r.asentamiento ?? '',
               latitude: r.lat ?? '',
               longitude: r.lng ?? '',
            })
         }
      )
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

   uploadPDF(control: any, name_control?: any) {
      this.manager.open(config.upload_config).subscribe(
         data => {
            if (data.event == 'success') {
               control?.patchValue(data.info.secure_url)
               name_control?.patchValue(data.info.original_filename)
            }
         }
      )
   }

   changeCheck(event: any) {
      let el = event.source._elementRef.nativeElement.classList;
      if (event.checked) {
         el?.remove('bg-slate-100/10')
         el?.add('bg-slate-100/50')
      } else {
         el?.remove('bg-slate-100/50')
         el?.add('bg-slate-100/10')
      }
   }

   findCert(id: string) {
      return this.certifications.find((cert: any) => cert.id == id)
   }

   toogleValidators(action: boolean, controls: string[]) {
      controls.forEach(control => {
         if (action)
            this.form.controls[control].setValidators(Validators.required)
         else
            this.form.controls[control].removeValidators(Validators.required)
         this.form.controls[control].updateValueAndValidity()
      });
   }


   @HostListener('document:keyup', ['$event'])
   backup_form(event: KeyboardEvent) {
      JSON.stringify((this.master.getterC(this.form.controls['tags'])).value).replace(/\\/g, '\\\\');
      this.ls.setItem('COMPANY_FORM', this.form.value)
   }

   @HostListener('document:keydown', ['$event'])
   @HostListener('document:keyup', ['$event'])
   onKey(event: KeyboardEvent) {
      this.ping.nativeElement.classList.remove('animate-ping');
      clearTimeout(this.typingTimer);

      this.typingTimer = setTimeout(() => {
         this.ping.nativeElement.classList.add('animate-ping');
      }, 5000);
   }
}