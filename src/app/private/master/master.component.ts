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
   // tabs: Language[] = [this.lang.user_lang];
   // available_langs: any = [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }, { id: '2', name: 'Español', language: 'ES', emoji: '🇲🇽' }];
   available_langs: any = []

   constructor(
      public router: Router,
      public master: MasterService,

      private dialog: MatDialog,
      private ls: LocalStoreService,
      private output: OutputService,
      private provider: ProviderService,
      private activatedRoute: ActivatedRoute,
      private manager: CloudinaryWidgetManager,
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
   }

   ngOnInit(): void {
      this.breadcrumbs();

   }

   getData() {
      this.output.ready.next(false)
      this.output.table_ready.next(false)

      this.provider.BD_ActionAdminGet(this._modulo, 'get').subscribe((data: Response) => {
         console.log(data.msg);
         if (!data.error) {

            switch (this._modulo) {
               case 'events':
               case 'blogs':
               case 'membership':
                  this.dataToDisplay = data.msg
                  break

               case 'rfq':
                  this.dataToDisplay = data.msg.no_rfq
                  this.dataToDisplay1 = data.msg.is_rfq

                  break
               case 'companies':
                  this.dataToDisplay = data.msg.approved
                  this.dataToDisplay1 = data.msg.no_approved

                  break
               case 'investments':
                  this.dataToDisplay = [
                     {
                        '01_MONTO DE INVERSION': 1500,
                        '02_EMPLEOS GENERADOS': 24,
                        '03_SUPERFICIE EN CONSTRUCCION': 'Ladrillo',
                        '04_DESCRIPCION': 'Inversion de 1500 pesos'
                     },
                     {
                        '01_MONTO DE INVERSION': 1500,
                        '02_EMPLEOS GENERADOS': 24,
                        '03_SUPERFICIE EN CONSTRUCCION': 'Ladrillo',
                        '04_DESCRIPCION': 'Inversion de 1500 pesos'
                     },
                     {
                        '01_MONTO DE INVERSION': 1500,
                        '02_EMPLEOS GENERADOS': 24,
                        '03_SUPERFICIE EN CONSTRUCCION': 'Ladrillo',
                        '04_DESCRIPCION': 'Inversion de 1500 pesos'
                     },
                     {
                        '01_MONTO DE INVERSION': 1500,
                        '02_EMPLEOS GENERADOS': 24,
                        '03_SUPERFICIE EN CONSTRUCCION': 'Ladrillo',
                        '04_DESCRIPCION': 'Inversion de 1500 pesos'
                     },
                  ]
                  break

               case 'users':
                  this.dataToDisplay = data.msg.is_approved
                  this.dataToDisplay1 = data.msg.no_approved

                  break

               default:
                  break
            }
            this.output.ready.next(true)
            this.output.table_ready.next(true)
         } else {
            this.dataToDisplay = []
            this.dataToDisplay1 = []
         }
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
      this.router.navigate([this.router.url, 'detail', btoa(row.ID)])
   }

   add(): void {
      this.router.navigate([this.router.url, 'add'])
   }
}
