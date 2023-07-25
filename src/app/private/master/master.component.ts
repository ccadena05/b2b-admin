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

   constructor(
      private provider: ProviderService,
      public router: Router,
      private activatedRoute: ActivatedRoute,
      private output: OutputService,
      private ls: LocalStoreService,
      private dialog: MatDialog,
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
      /* // this.output.ready.next(false);
      this.dataToDisplay = []
      this.provider.BD_ActionPost(this.modulo, 'index').subscribe(
          (index: any) => {
            console.log(index);
            index.forEach((el: any) => {
               el.link_id = this.modulo;
            });
            this.dataToDisplay = index;
            console.log(this.dataToDisplay);
            
            // this.output.ready.next(true);
         }
      ) */
      this.output.ready.next(false);
      this.output.table_ready.next(false);

      this.provider.BD_ActionAdminGet(this._modulo, 'get').subscribe((data) => {
         console.log(data);
         switch (this._modulo) {
            case 'events':
               this.dataToDisplay = data.msg;
               break;

            case 'blogs':
               this.dataToDisplay = data.msg;
               console.log(data.msg);
               break;

            case 'rfq':
               console.log(data.msg);

               this.dataToDisplay = data.msg.no_rfq;
               this.dataToDisplay1 = data.msg.is_rfq;
               console.log(data.msg);
               break;

            case 'companies':
               this.dataToDisplay = data.msg.approved;
               this.dataToDisplay1 = data.msg.no_approved;
               break;

            default:
               break;
         }
      });

      // this.provider.BD_ActionAdminGet(this._modulo, 'get').subscribe((data) => {
      //    this.dataToDisplay = data.msg.approved.is_rfq;
      //    console.log(data.msg.approved.is_rfq);
      // });

      // this.provider.BD_ActionAdminGet(this._modulo, 'get').subscribe(

      //    (data: Response) => {
      //       console.log(data);

      //       if (typeof data.msg == 'object') {
      //          if (this.router.url != '/m/rfq') {
      //             this.dataToDisplay = data.msg
      //          } else {
      //             const element2: any = []
      //             for (const key in data?.msg) {
      //                if (Object.prototype.hasOwnProperty.call(data?.msg, key)) {
      //                   const element = data?.msg[key];
      //                   for (const sub_key in data?.msg[key]) {
      //                      if (Object.prototype.hasOwnProperty.call(data?.msg[key], sub_key)) {
      //                         element2[sub_key + '_' + key] = data?.msg[key][sub_key];

      //                      }
      //                   }


      //                }
      //             }
      //             console.log(element2);
      //             this.dataArray = element2
      //             console.log(this.dataArray);
      //          }

      //          this.output.ready.next(true)
      //       } /* else {
      //          this.dataToDisplay = [{name: 'No hay registros disponibles'}]
      //       } */
      //    }

      // )

   }
   /*      
        this.output.ready.next(false)
        this.provider.BD_ActionAdminGet(this._modulo, 'get').subscribe(
  
           (data: Response) => {
              console.log(data);
              
              if (typeof data.msg == 'object' ) {
                 if(this.router.url != '/m/rfq'){
                    this.dataToDisplay = data.msg
                 } else {
                    let element2: any = []
                    for (const key in data?.msg) {
                       if (Object.prototype.hasOwnProperty.call(data?.msg, key)) {
                          const element = data?.msg[key];
                          for (const sub_key in data?.msg[key]) {
                             if (Object.prototype.hasOwnProperty.call(data?.msg[key], sub_key)) {
                                element2[sub_key + '_' + key] = data?.msg[key][sub_key];
                                // console.log(element2, sub_key + '_' + key);
                                // this.dataArray[sub_key + '_' + key] = element2;
                                this.dataArray = element2;
                             }
                          }
                          
                          
                       }
                    }
                 }
                 console.log(this.dataArray);
                 
                 this.output.ready.next(true)
              } 
           }
  
        )
  
     }
   */
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
}
