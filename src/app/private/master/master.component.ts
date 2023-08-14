import { AfterContentInit, Component, OnDestroy, OnInit, SimpleChange } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent, Event, NavigationStart } from '@angular/router';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { OutputService } from 'src/app/services/output.service';
import { menu } from 'src/app/private/menu';
import { LocalStoreService } from 'src/app/services/local-store.service';
import { filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { b2b_menu } from '../b2b_menu';
import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';
import { config } from 'src/config';
import { Response } from 'src/app/models/response.model';
import { MatTableComponent } from 'src/app/components/mat-table/mat-table.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, X } from '@angular/cdk/keycodes';

@Component({
   selector: 'app-master',
   templateUrl: './master.component.html',
   styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit {
   modulo: any;
   dataToDisplay: any;
   dataToDisplay1: any;
   masterSection: any;
   b2b_menu = b2b_menu;
   url: any;
   form_investments: FormGroup;
   readonly separatorKeysCodes = [ENTER, COMMA] as const;
   tabs: any = [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }];
   // available_langs: any = [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }, { id: '2', name: 'Español', language: 'ES', emoji: '🇲🇽' }];
   available_langs: any = []

   constructor(
      private provider: ProviderService,
      public router: Router,
      private activatedRoute: ActivatedRoute,
      private output: OutputService,
      private ls: LocalStoreService,
      private dialog: MatDialog,
      private manager: CloudinaryWidgetManager,
      private form_builder: FormBuilder,
      public master: MasterService
   ) {
      router.events.pipe(
         filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
      ).subscribe((e: RouterEvent) => {
         if (e instanceof NavigationEnd) {
            this.modulo = this.activatedRoute.snapshot.paramMap.get('modulo');
            this.masterSection = this.findInMenu('link', '/m/' + this.modulo)?.label
            this.getData();
         }
      });

      this.form_investments = this.form_builder.group({
         total_amount: ['', Validators.required],
         country: [null, Validators.required],
         state: [null, Validators.required],
         city: [null, Validators.required],
         total_jobs: ['', Validators.required],
         suface_construction: ['', Validators.required],
         description: this.form_builder.array([this.master.createTranslation(1)]),
         categories: [null, Validators.required]
      })
   }

   ngOnInit(): void {
      this.breadcrumbs();

   }

   getData() {
      this.output.ready.next(false)
      this.output.table_ready.next(false)

      this.provider.BD_ActionAdminGet(this._modulo, 'get').subscribe((data) => {
         if (!data.error) {
            switch (this._modulo) {
               case 'events':
                  this.dataToDisplay = data.msg
                  // this.output.ready.next(true)
                  // this.output.table_ready.next(true)
                  break;

               case 'blogs':
                  this.dataToDisplay = data.msg
                  this.output.ready.next(true)
                  this.output.table_ready.next(true)
                  break;

               case 'rfq':
                  this.dataToDisplay = data.msg.no_rfq
                  this.dataToDisplay1 = data.msg.is_rfq
                  this.output.ready.next(true)
                  this.output.table_ready.next(true)
                  break;

               case 'companies':
                  this.dataToDisplay = data.msg.approved
                  this.dataToDisplay1 = data.msg.no_approved
                  this.output.ready.next(true)
                  this.output.table_ready.next(true)
                  break;

               default:
                  break;
            }
         } else {
            this.dataToDisplay = []
            this.dataToDisplay1 = []
         }
      })

      this.provider.BD_ActionAdminGet('general', 'get_languages').subscribe((langs: Response) => {
         this.available_langs = langs
      })
   }

   get _modulo() {
      let m = ''
      this.activatedRoute.params.subscribe(params => {
         // console.log(params);
         m = params['modulo'];
      });

      return m
   }

   findInMenu(propiedad: any, valor: any) {
      let turnBack: any

      this.b2b_menu.filter(
         (item: any) => {
            if (item.link == valor)
               turnBack = item
         }
      )


      /* this.b2b_menu.forEach((element: any) => {
         element.filter((el: any, index: any) => {
            if (el[propiedad] === valor)
               turnBack = el.item;
         })
      }); */
      return turnBack
   }

   breadcrumbs() {
      this.ls.update('bc', [
         {
            item: this.masterSection,
            link: null/* '/m/' + this.modulo */
         }
      ])
   }


   edit(row?: any): void {
      console.log([this.router.url, 'detail', btoa(row.ID), row.ID]);

      this.router.navigate([this.router.url, 'detail', btoa(row.ID)])
   }

   add(): void {
      this.router.navigate([this.router.url, 'add'])
   }

   save() {
      console.log(this.form_investments.value)
   }

   addCategory(event: MatChipInputEvent): void {
      const value = (event.value || '').trim();

      if (value) {
         if (this.form_investments.value.categories != null)
            this.form_investments.controls['categories'].patchValue(this.form_investments.value.categories + ', ' + value);
         else
            this.form_investments.controls['categories'].patchValue(value);
      }
      event.chipInput!.clear();
   }

   removeCategory(category: any): void {
      const tagToRemove = category + ', ';
      this.form_investments.value.categories = this.form_investments.value.categories.replace(tagToRemove, '');
   }
}
