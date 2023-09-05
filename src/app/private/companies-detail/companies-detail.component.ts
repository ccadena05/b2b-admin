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
   all_countries: any = [];

   form: FormGroup;
   sel: any = [];
   selectedCountry: any;
   selectedState: any;
   fullLanguage: any;
   readonly separatorKeysCodes = [ENTER, COMMA] as const;
   @ViewChild('a') slide_dia!: MatSlideToggle;
   @ViewChild('consi') consi!: MatRadioButton
   @ViewChild('ping') ping!: ElementRef;
   cat: any[] = [
      "Components, parts and systems",
      "Smart manufacturing and Industry 4.0",
      "Manufacturing and fabrication processes",
      "Original equipment assembly/manufacturing",
      "Products",
      "Raw Materials",
      "Services",
      "Levels",
   ]

   certifications: any = []

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
   ]
   cert: any;
   @ViewChild('map') mapaElement!: ElementRef;
   map!: any;
   lat: any = 19.4326806;
   lng: any = -99.1332704;
   location: any;

   products: any = [
      {
         '01_NOMBRE': 'Caretas con diadema inyectada Modelo CCtr',
         '02_DESC_BREVE': 'Careta protectora ante contingencia COVID19.',
         '03_DESC_DETALLADA': 'Una careta protectora es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante la contingencia del COVID-19. Está diseñada para cubrir la cara completa y se usa comúnmente en combinación con otros equipos de protección personal, como mascarillas faciales y guantes, para proporcionar una protección adicional contra el virus.'
      },
      {
         '01_NOMBRE': 'Careta con soporte Modelo FKI',
         '02_DESC_BREVE': 'Careta con diadema inyectada, fabricada en PET transparente, reutilizable y sanitizable.',
         '03_DESC_DETALLADA': 'La careta con diadema inyectada es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante situaciones como la pandemia del COVID-19.'
      },
      {
         '01_NOMBRE': 'Mascarilla Termoformada Modelo MC',
         '02_DESC_BREVE': 'Mascarilla termoformada, fabricada en PET transparente, reutilizable y sanitizable.',
         '03_DESC_DETALLADA': 'La mascarilla termoformada es un tipo de mascarilla facial que se utiliza como equipo de protección personal durante situaciones como la pandemia del COVID-19. Está fabricada en PET transparente, lo que permite una visibilidad clara sin comprometer la seguridad de la persona que la usa.'
      },
      {
         '01_NOMBRE': 'Caretas con diadema inyectada Modelo CCtr',
         '02_DESC_BREVE': 'Careta protectora ante contingencia COVID19.',
         '03_DESC_DETALLADA': 'Una careta protectora es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante la contingencia del COVID-19. Está diseñada para cubrir la cara completa y se usa comúnmente en combinación con otros equipos de protección personal, como mascarillas faciales y guantes, para proporcionar una protección adicional contra el virus.'
      },
      {
         '01_NOMBRE': 'Careta con soporte Modelo FKI',
         '02_DESC_BREVE': 'Careta con diadema inyectada, fabricada en PET transparente, reutilizable y sanitizable.',
         '03_DESC_DETALLADA': 'La careta con diadema inyectada es un tipo de equipo de protección personal que se utiliza para proteger la cara de una persona de posibles riesgos durante situaciones como la pandemia del COVID-19.'
      },
      {
         '01_NOMBRE': 'Mascarilla Termoformada Modelo MC',
         '02_DESC_BREVE': 'Mascarilla termoformada, fabricada en PET transparente, reutilizable y sanitizable.',
         '03_DESC_DETALLADA': 'La mascarilla termoformada es un tipo de mascarilla facial que se utiliza como equipo de protección personal durante situaciones como la pandemia del COVID-19. Está fabricada en PET transparente, lo que permite una visibilidad clara sin comprometer la seguridad de la persona que la usa.'
      }
   ];

   requierements = [
      {
         'ID': 'PTS130620I48202307111519489289C',
         '01_TITLE': 'HDMIaaa',
         '02_EXPIRATION DATE': '2023-12-11',
         '03_RFQ STATUS': 1,
         '04_APROVED': 1,
         '05_FRIENDLY NAME': 'PARQUE TECNOLÓGICO SANMIGUELENSE'
      },
      {
         'ID': 'PTS130620I48202307111519489289C',
         '01_TITLE': 'HDMI',
         '02_EXPIRATION DATE': '2023-12-11',
         '03_RFQ STATUS': 1,
         '04_APROVED': 1,
         '05_FRIENDLY NAME': 'PARQUE TECNOLÓGICO SANMIGUELENSE'
      },
      {
         'ID': 'PTS130620I48202307111519489289C',
         '01_TITLE': 'HDMI',
         '02_EXPIRATION DATE': '2023-12-11',
         '03_RFQ STATUS': 1,
         '04_APROVED': 1,
         '05_FRIENDLY NAME': 'PARQUE TECNOLÓGICO SANMIGUELENSE'
      }
   ];

   constructor(
      public master: MasterService,
      public provider: ProviderService,
      public ls: LocalStoreService,
      private formBuilder: FormBuilder,
      private output: OutputService,
      private manager: CloudinaryWidgetManager,
      private activatedRoute: ActivatedRoute,
      public router: Router
   ) {
      this.form = this.formBuilder.group({
         // profile_company_id: [this.__id],
         id: [this.__id],
         legal_name: this.formBuilder.array([this.master.createTranslation('1')]),
         friendly_name: [null],
         rfc: [null, Validators.required], //QUITAR TRADUCCION
         email_company: [null, [Validators.required, Validators.email]],
         phone_code: [null],
         phone: [null],
         ext: [null],
         phone_switch: [null],
         phone_fax: [null],
         main_activity: this.formBuilder.array([this.master.createTranslation('1')]),
         start_year: [null],
         type_company_id: [null],
         country_origin: [null],
         country: [null],
         state: [null],
         city: [null],
         zip: [null],
         address_1: [null], // Calle
         address_2: [null], // Colonia
         latitude: [null],
         longitude: [null],
         branch: [null],
         web_page: [null],
         tags: [null],
         brochure_name: [null],
         brochure_url: [null],
         description: this.formBuilder.array([this.master.createTranslation('1')]),
         description_detail: this.formBuilder.array([this.master.createTranslation('1')]),
         schedule_week: this.formBuilder.group({
            sunday: [null],
            monday: [null],
            tuesday: [null],
            wednesday: [null],
            thursday: [null],
            friday: [null],
            saturday: [null],
            sunday_tg: [null],
            monday_tg: [null],
            tuesday_tg: [null],
            wednesday_tg: [null],
            thursday_tg: [null],
            friday_tg: [null],
            saturday_tg: [null],
         }),
         consi: [null],
         pisi: [null],
         categories_company: this.formBuilder.array([]),
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
         linkedin: [null, Validators.pattern(/^https?:\/\/(?:www\.)?linkedin\.com\/company\/.+$/)],
         youtube: [null, Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)[a-zA-Z0-9_-]+(\/)?(\?[\w=&]*)?(#([\w-]+))?$/i)],
         number_employees: [null],
         turnover: [null],
         specialization: this.formBuilder.array([this.master.createTranslation('1')]),
         another_sector: this.formBuilder.array([this.master.createTranslation('1')]),
         relevant_products: this.formBuilder.array([this.master.createTranslation('1')]),
         image_url: [null],
         hidden: [null],
         validated: [null],
         membership: [null],
         membership_start_date: [null],
         membership_end_date: [null],
         user_limit: [0],
         product_limit: [0],
         active_user_limit: [0],
      })


      // this.output.image_url.subscribe(
      //    data => {
      //       this.form.patchValue({ image_url: data })
      //       this.ls.setItem('B2B_IMAGE_URL', data)
      //    }
      // )

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
               isos_array.push(this.createCertificate(iso, this.findCert(iso).name))

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
      this.output.table_ready.next(false)
      this.countries();
      this.provider.BD_ActionGet('general', 'get_languages').subscribe(
         (languages: Response) => {
            // console.log(languages.msg);
            this.available_langs = languages.msg

            this.provider.BD_ActionGet('general', 'get_isos').subscribe(
               (isos: Response) => {
                  // console.log(isos);
                  this.cert = this.certifications = isos?.msg

                  this.provider.BD_ActionGet('general', 'get_type_company').subscribe(
                     (type_company: Response) => {
                        // console.log(type_company);

                        if (!type_company.error)
                           this.sel['type_company'] = type_company.msg

                        this.provider.BD_ActionAdminGet('companies', 'get_company_by_id', { id: atob(this.__id) }).subscribe(
                           (company: Response) => {
                              console.log('Viene de DB', company);
                              if (!company.error) {
                                 let comp = company?.msg;
                                 comp.state = comp.state.toString()
                                 comp.city = comp.city.toString()
                                 // comp = this.ls.getItem('COMPANY_FORM');
                                 let _isos: any = []
                                 comp?.isos?.forEach((element: any) => {
                                    _isos?.push(element?.name_id.toString())
                                    let qawards = this.master.getterA(this.form.controls['isos']);
                                    qawards.push(this.createCertificate(null))
                                 })
                                 // console.log();

                                 // comp.tags = comp.tags.split(',')

                                 this.form.get('cert')?.patchValue(_isos)
                                 /* comp?.legal_name?.forEach((element: any) => {

                                    if (element.languages_id != 1) {
                                       this.master.createTranslation(element.languages_id)
                                       this.addTab(this.language_index(element.languages_id))
                                    }
                                 }); */

                                 comp?.categories_company?.forEach((element: any) => {
                                    this.master.getterA(this.form.controls['categories_company']).push(this.master.createSimpleTranslation())
                                 });

                                /*  if (this.ls.getItem('COMPANY_FORM'))
                                    this.master.patch(this.master.compare_object(comp, this.ls.getItem('COMPANY_FORM')), this.form, this.tabs)
                                 else */
                                    this.master.patch(comp, this.form, this.tabs)

                                 console.log(this.form.value);

                                 // console.log('FORM VALUE', this.form.value);

                                 this.createPIN((comp.latitude || this.lat), (comp.longitude || this.lng))
                                 Object.keys(this.master.getterG(this.form.controls['schedule_week']).controls).forEach(element => {
                                    this.slideHasValue('schedule_week', element)
                                 });

                                 // this.form.controls['consi']?.patchValue(this.master.turn_check([this.master.getterC(this.form.controls['support_clients']), this.master.getterC(this.form.controls['service_cluster'])]) || this.ls.getItem('COMPANY_FORM')?.consi)
                                 // this.form.controls['pisi']?.patchValue(this.master.turn_check_array([this.master.getterA(this.form.controls['main_processes']), this.master.getterA(this.form.controls['production_capacity'])]) || this.ls.getItem('COMPANY_FORM')?.pisi)

                                 this.output.ready.next(true)
                                 this.output.table_ready.next(true)
                              }
                           }
                        )
                     }
                  )
               }

            )
         }
      )
   }

   countries() {
      this.provider.BD_ActionGet('general', 'get_countries').subscribe(
         (countries: any) => {
            console.log(countries.msg)
            if (!countries.error)
               this.sel['countries'] = this.master.concat(countries?.msg, ['e', 'n'], 'name');

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
            if (this.form.controls[element] instanceof FormArray && element !== 'isos' && element !== 'schedule_week' && element != 'categories_company')
               this.master.getterA(this.form.controls[element]).push(this.master.createTranslation(language.id))
         })
      }
   }

   deleteTab(index: any, languages_id: any) {
      if (this.tabs.length > 1) {
         this.tabs.splice(index, 1)

         Object.keys(this.form.controls).forEach(element => {
            if (this.form.controls[element] instanceof FormArray && element !== 'isos' && element !== 'schedule_week' && element != 'categories_company') {
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

   save() {
      // console.log(this.form.value.tags.toString());

      this.ping.nativeElement.classList.remove('animate-ping');
      this.form.value.schedule_week = JSON.stringify(this.form.value.schedule_week)

      if (this.form.valid) {
         this.provider.BD_ActionAdminPut('companies', 'update_company', this.form.value).subscribe(
            (data: Response) => {
               console.log(data);

               if (!data.error) {
                  this.ls.setItem('COMPANY_FORM', this.form.value)
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
      // this.form.value.tags = this.form.value.tags.toString()
      // console.log(this.form.value);
      /*  
 
       ) */
   }

   /*    createTranslation(languages_id: any): FormGroup {
         return this.formBuilder.group({
            id: [null, Validators.required],
            identifier: [null, Validators.required],
            languages_id: [languages_id, Validators.required],
            text: [null, Validators.required],
            active: ['1', Validators.required],
         });
      } */

   createCertificate(name_id: any, name?: any): FormGroup {
      return this.formBuilder.group({
         id: [null],
         name: [name, Validators.required],
         name_id: [name_id, Validators.required],
         // file_name: [''],
         url: [null, Validators.required],
         active: ['1', Validators.required]
      });
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

   uploadPDF(control: any) {
      this.manager.open(config.upload_config).subscribe(
         data => {
            if (data.event == 'success') {
               control?.patchValue(data.info.secure_url)
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

   /* 
      toggleCertification(event: any, name: any) {
         let qawards = this.master.getterA(this.form.controls['isos']);
   
         if (event.source._selected) {
            qawards.push(this.createCertificate(name))
         } else {
            let qawards = this.master.getterA(this.form.controls['isos']);
   
            const indexToRemove = qawards.controls.findIndex(
               control => control.value.name == name
            )
            // qawards.removeAt(indexToRemove)
               console.log(name, indexToRemove);
            
               qawards.at(indexToRemove).get('active')?.patchValue('0')
         }
      } */

   findCert(name_id: string) {
      return this.certifications.find((cert: any) => cert.name_id == name_id)
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
   /* 
      filterSelect(v: any) {
         console.log(v);
         this.cert = this.certifications.filter((row: any) => (row.name).toLowerCase().includes(v.toLowerCase()))
      } */

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

   edit(row?: any): void {
      this.router.navigate(['/m/rfq', 'detail', btoa(row.ID)])
   }

   get __id() {
      let m = ''
      this.activatedRoute.params.subscribe(params => {

         m = params['id'];
      });


      return m
   }

   addrfq() {
      this.router.navigate(['/m/rfq', 'add'])
   }
}