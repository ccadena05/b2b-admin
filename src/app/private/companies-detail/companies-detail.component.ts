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
import { LanguageService } from 'src/app/services/language.service';
import { Language } from 'src/app/models/language.model';

declare var google: any;

@Component({
   selector: 'app-companies-detail',
   templateUrl: './companies-detail.component.html',
   styleUrls: ['./companies-detail.component.scss']
})
export class CompaniesDetailComponent implements OnInit {
   private typingTimer: any;
   tabs: Language[] = [this.lang.user_lang];
   available_langs: any = [];
   all_countries: any = [];
   selected_all: any = [];
   selected_all_name: any = [];
   form: FormGroup;
   sel: any = [];
   selectedCountry: any;
   selectedState: any;
   fullLanguage: any;
   comp: any;
   readonly separatorKeysCodes = [ENTER, COMMA] as const;
   @ViewChild('a') slide_dia!: MatSlideToggle;
   @ViewChild('consi') consi!: MatRadioButton
   @ViewChild('ping') ping!: ElementRef;
   clusters: any = [{
      id: '1',
      name: 'Cluster Automotriz de San Luis Potosí'
   },
   {
      id: '2',
      name: 'Clúster Automotriz Zona Centro'
   },
   {
      id: '3',
      name: 'Cluster Automotriz de Querétaro'
   },
   {
      id: '4',
      name: 'Cluster de la Industria Automotriz de Coahuila'
   },
   {
      id: '5',
      name: 'Cluster Automotriz del Estado de México'
   },
   {
      id: '6',
      name: 'Cluster Automotriz de Nuevo León'
   },
   {
      id: '7',
      name: 'Cluster de Tecnologías de la Información Guanajuato'
   },
   {
      id: '20230912103352cRmDysiSvk6oXDbEPV',
      name: 'Cluster Automotriz de Guanajuato, A.C. (CLAUGTO)'
   },
   {
      id: '9',
      name: 'Cluster Logístico y Movilidad Guanajuato'
   },
   {
      id: '10',
      name: 'Cluster Aeroespacial del Bajío'
   },
   {
      id: '11',
      name: 'Cluster Automotriz de Jalisco'
   },
   {
      id: '12',
      name: 'Red Nacional de Clusters de la Industria Automotriz'
   },
   {
      id: '13',
      name: 'Cluster Automotriz de Chihuahua'
   },
   {
      id: '14',
      name: 'Clúster Industrial'
   },
   {
      id: '15',
      name: 'Clúster Industrial de Aguascalientes'
   },
   {
      id: '16',
      name: 'Clúster de la Industria de Manufactura Avanzada y Automotriz de la Laguna A.C'
   },
   {
      id: '17',
      name: 'Asociación de Parques Industriales Privados del Estado de Guanajuato (APIPEG).'
   }]

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

   company_clusters: any = [];
   company_categories: any = [];
   company_categories_name: any = [];

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
      public router: Router,
      public ls: LocalStoreService,
      public master: MasterService,
      public provider: ProviderService,

      private lang: LanguageService,
      private output: OutputService,
      private formBuilder: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private manager: CloudinaryWidgetManager,
   ) {
      console.log(this.lang.user_lang);

      this.form = this.formBuilder.group({
         profile_company_id: [null],
         id: [null],
         legal_name: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         friendly_name: [null],
         rfc: [null, Validators.required], 
         email_company: [null, Validators.email],
         phone_code: [null],
         phone: [null],
         ext: [null],
         phone_switch: [null],
         phone_fax: [null],
         main_activity: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         start_year: [null],
         type_company_id: [null, Validators.required],
         country_origin: [null],
         country: [null, Validators.required],
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
         description: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         description_detail: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
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
         company_payment: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         support_clients: [null],
         service_cluster: [null],
         main_processes: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         production_capacity: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         machinery: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         guarantees_offered: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         quality_awards: [null],
         cert: [],
         isos: this.formBuilder.array([]),
         facebook: [null, Validators.pattern(/^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9.]+(\/)?$/)],
         twitter: [null, Validators.pattern(/^(https?:\/\/)?(www\.)?twitter.com\/[a-zA-Z0-9_]+(\/)?$/)],
         linkedin: [null, Validators.pattern(/^https?:\/\/(?:www\.)?linkedin\.com\/company\/.+$/)],
         youtube: [null, Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)[a-zA-Z0-9_-]+(\/)?(\?[\w=&]*)?(#([\w-]+))?$/i)],
         number_employees: [null],
         turnover: [null],
         specialization: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         another_sector: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         relevant_products: this.formBuilder.array([this.master.translation(this.lang.user_lang.id, null)]),
         image_url: [null],
         hidden: [null],
         approved: [null],
         type_membership_id: [null, Validators.required],
         membership_creation_date: [null],
         membership_expiration_date: [null],
         limit_users: [0, Validators.required],
         limit_products: [0],
         active_user_limit: [0],
         clusters: this.formBuilder.array([]),
         approved_from_db: [null],
         first_category: [null],
         first_categories: [null],
         first_sub_categories: [null],
         user_create: [this.ls.getItem(config.APP_USER)]
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
               isos_array.push(this.master.certificate(iso, this.findCert(iso).name))

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
            this.available_langs = languages.msg

            this.provider.BD_ActionGet('general', 'get_isos').subscribe(
               (isos: Response) => {
                  this.cert = this.certifications = isos?.msg

                  this.provider.BD_ActionGet('general', 'get_type_company').subscribe(
                     (type_company: Response) => {

                        if (!type_company.error) {
                           this.sel['type_company'] = type_company.msg
                           this.provider.BD_ActionGet('searcher', 'get_category_searcher', { tree_size: 0 }).subscribe(
                              (category_searcher: Response) => {
                                 console.log(category_searcher.msg);
                                 this.sel['category_searcher'] = category_searcher.msg

                                 if (this.router.url.includes('detail')) {
                                    this.provider.BD_ActionAdminGet('companies', 'get_company_by_id', { profile_company_id: atob(this.__id) }).subscribe(
                                       (company: Response) => {
                                          console.log('Viene de DB', company);
                                          if (!company.error) {
                                             this.comp = company?.msg;
                                             this.comp.state = this.comp?.state?.toString()
                                             this.comp.city = this.comp?.city?.toString()
                                             this.comp.type_company_id = this.comp?.type_company_id?.toString()
                                             // comp = this.ls.getItem('COMPANY_FORM');
                                             let _isos: any = []
                                             this.comp?.isos?.forEach((element: any) => {
                                                _isos?.push(element?.name_id.toString())
                                                let qawards = this.master.getterA(this.form.controls['isos']);
                                                qawards.push(this.master.certificate(null))
                                             })

                                             this.form.get('cert')?.patchValue(_isos)
                                             this.comp?.categories_company?.forEach((element: any) => {
                                                this.master.getterA(this.form.controls['categories_company']).push(this.master.createSimpleTranslation())
                                             });

                                             /*  if (this.ls.getItem('COMPANY_FORM'))
                                                 this.master.patch(this.master.compare_object(comp, this.ls.getItem('COMPANY_FORM')), this.form, this.tabs)
                                              else */
                                             this.master.patch(this.comp, this.form, this.tabs)

                                             console.log(this.form.value);

                                             // console.log('FORM VALUE', this.form.value);

                                             this.createPIN((this.comp.latitude || this.lat), (this.comp.longitude || this.lng))
                                             Object.keys(this.master.getterG(this.form.controls['schedule_week']).controls).forEach(element => {
                                                this.slideHasValue('schedule_week', element)
                                             });

                                             this.comp.clusters?.forEach((cluster: any) => {
                                                if (cluster.active == 1)
                                                   this.company_clusters.push(cluster.cluster_id)
                                             });

                                             // this.form.controls['consi']?.patchValue(this.master.turn_check([this.master.getterC(this.form.controls['support_clients']), this.master.getterC(this.form.controls['service_cluster'])]) || this.ls.getItem('COMPANY_FORM')?.consi)
                                             // this.form.controls['pisi']?.patchValue(this.master.turn_check_array([this.master.getterA(this.form.controls['main_processes']), this.master.getterA(this.form.controls['production_capacity'])]) || this.ls.getItem('COMPANY_FORM')?.pisi)
                                             this.ls.update('bc', [
                                                {
                                                   item: 'Empresas',
                                                   link: '/m/companies'
                                                },
                                                {
                                                   item: this.comp.friendly_name,
                                                   link: null
                                                }
                                             ])
                                             this.output.ready.next(true)
                                             this.output.table_ready.next(true)
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
                              })
                        }
                     }
                  )
               }

            )
      console.log(this.form.value);

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

   onCategorySelected(category: any): void {
      if (this.form.value['first_categories']?.[category.generation] != category.id) {
         this.selected_all[category.generation] = category.id;
         this.selected_all_name[category.generation] = category['ES'] ?? category['EN'];
         while (this.selected_all[category.generation + 1])
            this.selected_all.pop()
            // this.selected_all_name.pop()

         this.form.controls['first_categories'].patchValue(this.selected_all)
      }

      // this.form.controls['parent_id'].patchValue(this.selected_all[this.selected_all.length - 1])
      this.form.controls['first_category'].patchValue(this.selected_all[0])
      this.form.controls['first_sub_categories'].patchValue(this.selected_all[this.selected_all.length - 1])

      const categoryId = category.id;

      this.provider.BD_ActionGet('searcher', 'get_category_searcher', { tree_size: 0, id_category: categoryId })
         .subscribe((category_blogs: Response) => {

            category.children = category_blogs.msg;
         });
      // console.log(this.form.value);
   }

   push_category() {
      if (this.router.url.includes('detail')){
         this.master.arr(this.form, 'categories_company').push(this.master.category(atob(this.__id), this.selected_all[this.selected_all.length - 1]))
      }
      else{
         this.company_categories.push(this.selected_all[this.selected_all.length - 1]);
         this.company_categories_name.push({id: this.selected_all[this.selected_all.length - 1], name: this.selected_all_name[this.selected_all_name.length - 1]})
         this.selected_all_name = []
      }
   }

   pop_category(i: any) {
      if (this.router.url.includes('detail')){
         this.master.arr(this.form, 'categories_company').removeAt(i)
      }
      else{
         this.company_categories.splice(i, 1)
         this.company_categories_name.splice(i, 1)
      }
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

   save() {
      // console.log(this.form.value.tags.toString());

      this.ping.nativeElement.classList.remove('animate-ping');
      this.form.value.schedule_week = JSON.stringify(this.form.value?.schedule_week)
      this.form.value.approved_from_db = this.form.value?.approved
      if(this.router.url.includes('detail'))
         this.form.value.profile_company_id = atob(this.__id);
      else{
         this.form.value.categories_company = this.company_categories;
         this.form.value.clusters = this.company_clusters;
      }
      console.log(this.form.value);
      
      // this.master.save('companies', 'update_company', this.form.value, true)

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

   add_cluster(event: any, c_id: any) {
      if (event.checked) { // Se añadió un cluster
         if (this.router.url.includes('detail')){
            this.master.arr(this.form, 'clusters').push(this.master.create_cluster(c_id, atob(this.__id)))
         } else {
            this.company_clusters.push(c_id);
         }
      } else { // Se quitó un cluster
         let index = this.form.value.clusters.findIndex((cluster: any) => cluster.cluster_id == c_id)

         if (index != -1) {
            if (this.master.arr(this.form, 'clusters').at(index).value.id) // Ya existía en DB
               this.master.arr(this.form, 'clusters').at(index).get('active')?.patchValue('0')
            else //Se seleccionó y desseleccionó
               this.master.arr(this.form, 'clusters').removeAt(index)
         }
      }
      console.log(this.form.value.clusters);
   }
}