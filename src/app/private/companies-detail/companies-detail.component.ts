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
  profile_company_id: string = this.ls.getItem("B2B_PROFILE_COMPANY");
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

  constructor(
    public master: MasterService,
    public provider: ProviderService,
    public ls: LocalStoreService,
    private formBuilder: FormBuilder,
    private output: OutputService,
    private manager: CloudinaryWidgetManager,
  ) {
    this.form = this.formBuilder.group({
      profile_company_id: [this.profile_company_id, Validators.required],
      legal_name: this.formBuilder.array([this.master.createTranslation('1')]),
      friendly_name: [null, Validators.required],
      rfc: [null, Validators.required], //QUITAR TRADUCCION
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
      address_1: [null, Validators.required], // Calle
      address_2: [null, Validators.required], // Colonia
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      branch: [null, Validators.required],
      web_page: [null, Validators.required],
      tags: [[]],
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

    //  this.output.image_name.subscribe(data => this.form.patchValue({ image_name: data }));

    this.get()

    this.form.controls['country'].valueChanges.subscribe(country => this.states(country));

    this.form.controls['state'].valueChanges.subscribe(country => this.cities(country));

    this.typingTimer = null;
    
    // this.form.get('cert')?.valueChanges.subscribe((selectedCertificaciones: any[]) => {
    //   this.actualizarCertificaciones(selectedCertificaciones);
    // });
   }

   ngOnInit(): void {
   }

  ngAfterViewInit() {
    this.cargarMapa();

    this.form.get('cert')?.valueChanges.subscribe(
      cert => {
        console.log(cert)
        // this._certChange(null, cert);
      }
    );
  }

  hola(event: any) {
    const _cert = this.form.value.cert;
    const _isos: any = []
    const isos_array = this.master.getterA(this.form.controls['isos'])

    this.form.value.isos.forEach((element: any) => {
      _isos?.push(element?.name_id)
    })

    if (_cert.length > _isos.length) { // Se añadió un nuevo ISO
      for (const iso of _cert) {
        if (!_isos.includes(iso)) { // No estaba antes, hacer push
          isos_array.push(this.createCertificate(iso))
        } 
      }
    } else if ((_cert.length < _isos.length)) { // Se quitó un ISO
      let iso_index: any;
      for (const iso of _isos) {
        if (!_cert.includes(iso)) {
          iso_index = isos_array.value.findIndex((isos: any) => isos.name_id == iso);
        }
      }
         
    let iso_to_del: FormGroup = this.master.getterG(isos_array.at(iso_index));
    if (iso_to_del?.value?.url != null && iso_to_del?.value?.url != undefined && iso_to_del?.value?.url != "") { // Tiene valor, cambia active a '0'
      iso_to_del.controls['active'].patchValue('0')
    } else { // Borrar
      isos_array.removeAt(iso_index);
    }
      
    } else { // Se desmarcó y se marcó un ISO
      for (const iso of _isos) {
      let iso_index: any;
      iso_index = isos_array.value.findIndex((isos: any) => isos.name_id == iso && isos.active == '0');
      if(iso_index != -1){
        let iso_to_patch: FormGroup = this.master.getterG(isos_array.at(iso_index));
        iso_to_patch.controls['active'].patchValue('1')
        }
      }       
    }
    console.log(this.form.value);
  }

  get() {
    this.output.ready.next(false)
    this.countries();
    this.provider.BD_ActionGet('general', 'get_languages').subscribe((languages: any) => {
      // console.log(languages.msg);
      this.available_langs = languages.msg
      this.provider.BD_ActionGet('general', 'get_isos').subscribe((isos: any) => {
        console.log(isos);
        this.cert = this.certifications = isos?.msg
        console.log(this.certifications);
        this.provider.BD_ActionGet('general', 'get_type_company').subscribe((type_company: Response) => {
          if (!type_company.error) this.sel['type_company'] = type_company.msg
        });
        this.provider.BD_ActionGet('profile_company', 'get_profile', { profile_company_id: this.profile_company_id }).subscribe((company: any) => {
          console.log(company.msg);
          if (!company.err) {
            let comp = company?.msg;
            // comp = this.ls.getItem('COMPANY_FORM');
            let _isos: any = []
            comp?.isos.forEach((element: any) => {
              _isos?.push(element?.name_id)
              let qawards = this.master.getterA(this.form.controls['isos']);
              qawards.push(this.createCertificate(null))
            });
            console.log();
            comp.tags = comp.tags.split(',')
            this.form.get('cert')?.patchValue(_isos)
            comp?.legal_name.forEach((element: any) => {
              if (element.languages_id != 1) {
                this.master.createTranslation(element.languages_id)
                this.addTab(this.language_index(element.languages_id))
              }
            });

            // if (this.ls.getItem('COMPANY_FORM')) {
            //   this.master.patchForm(this.master.compare_object(comp, this.ls.getItem('COMPANY_FORM')), this.form)
            // } else
            //   this.master.patchForm(comp, this.form)

            this.master.patchForm(comp, this.form)
            this.createPIN((comp.latitude || this.lat), (comp.longitude || this.lng))
            Object.keys(this.master.getterG(this.form.controls['schedule_week']).controls).forEach(element => {
              this.slideHasValue('schedule_week', element)
            });
              
            this.form.controls['consi'].patchValue(this.master.turn_check([this.master.getterC(this.form.controls['support_clients']), this.master.getterC(this.form.controls['service_cluster'])]) || this.ls.getItem('COMPANY_FORM').consi)
            this.form.controls['pisi'].patchValue(this.master.turn_check_array([this.master.getterA(this.form.controls['main_processes']), this.master.getterA(this.form.controls['production_capacity'])]) || this.ls.getItem('COMPANY_FORM').pisi)

            this.output.ready.next(true)
          }
        });
        // this.slideHasValue()
        // }
      });
    });
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
        // formArray.removeAt(indexToRemove)
        }
      });
    }
  }

  save() {
    this.ping.nativeElement.classList.remove('animate-ping');

    if (this.form.valid) { }
    // this.form.value.tags = this.form.value.tags.toString()
    this.form.value.schedule_week = JSON.stringify(this.form.value.schedule_week)
    console.log(this.form.value);

    // this.provider.BD_ActionPut('profile_company', 'update_profile', this.form.value).subscribe(
    //   (data: Response) => {
    //     console.log(data); 
    //     if (!data.error)
    //       this.master.snack(2)
    //     else
    //       this.master.snack(0)
    //   }
    // )
  }

  // createTranslation(languages_id: any): FormGroup {
  //   return this.formBuilder.group({
  //     id: [null, Validators.required],
  //     identifier: [null, Validators.required],
  //     languages_id: [languages_id, Validators.required],
  //     text: [null, Validators.required],
  //     active: ['1', Validators.required],
  //   });
  // }

  createCertificate(name_id: any): FormGroup {
    return this.formBuilder.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      name_id: [name_id, Validators.required],
      // file_name: [''],
      url: [null, Validators.required],
      active: ['1', Validators.required]
    });
  }

  countries() {
    this.provider.BD_ActionGet('general', 'get_all_countrys').subscribe(
      (all_countrys: any) => {
        // console.log(all_countrys.msg)
        if (!all_countrys.error)
          this.sel['all_countrys'] = this.sel['all_countrys'] = this.master.concat(all_countrys.msg, ['e', 'n'], 'name');
      }
    )
  }

  states(country_id: any) {
    this.provider.BD_ActionGet('general', 'get_states', { country_id }).subscribe(
      (all_states: any) => {
        // console.log(all_states);
        if (!all_states.error)
          this.sel['all_states'] = this.master?.changeKey({ 's': 'name' }, all_states?.msg)
      }
    )
  }

  cities(state_id: any) {
    this.provider.BD_ActionGet('general', 'get_cities', { state_id }).subscribe(
      (all_cities: any) => {
        // console.log(all_cities);
        if (!all_cities.error)
          this.sel['all_cities'] = this.master.changeKey({ 'name': 'number', 'c': 'name' }, all_cities?.msg)
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

    if (value)
      this.form.value.tags.push(value);
    
    event.chipInput!.clear();
  }

  removeTag(tag: any): void {
    const index = this.form.value.tags.indexOf(tag);
    if (index >= 0)
    this.form.value.tags.splice(index, 1);
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

  // toggleCertification(event: any, name: any) {
  //   let qawards = this.master.getterA(this.form.controls['isos']);

  //   if (event.source._selected) {
  //     qawards.push(this.createCertificate(name))
  //   } else {
  //     let qawards = this.master.getterA(this.form.controls['isos']);
  //     const indexToRemove = qawards.controls.findIndex(
  //       control => control.value.name == name
  //     )
  //     // qawards.removeAt(indexToRemove)
  //     console.log(name, indexToRemove);
  //     qawards.at(indexToRemove).get('active')?.patchValue('0')
  //   }
  // }

  removeFromCert(name: any) {
    console.log(this.master.getterA(this.form.controls['isos']).value);
    console.log(this.master.getterA(this.form.controls['isos']));
    console.log(this.master.getterA(this.form.controls['isos']).controls); const values = this.form.get('cert')!.value;
    console.log(values);
     
    const index = values.indexOf(name);
    if (index >= 0) {
      values.splice(index, 1);
      console.log(values);
      console.log(this.master.getterA(this.form.controls['isos']).value);
      console.log(this.master.getterA(this.form.controls['isos']));
      console.log(this.master.getterA(this.form.controls['isos']).controls);
      this.form.get('cert')!.setValue(values);
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

  filterSelect(v: any) {
    console.log(v);
    this.cert = this.certifications.filter((row: any) => (row.name).toLowerCase().includes(v.toLowerCase()))
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