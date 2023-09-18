import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
   selector: 'app-snackbar',
   templateUrl: './snackbar.component.html',
   styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
   snack: any;
   constructor(
      @Inject(MAT_SNACK_BAR_DATA) public data: any
   ) {
      this.snack = this.getInfo(data.key, data.msg);

   }

   ngOnInit(): void {
   }

   getInfo(data: any, msg?: any){
      let info = {
         0: {
            icon: 'exclamation-circle',
            color: '#ef0076',
            text: 'Ha ocurrido un error.',
            class: 'error'
         },
         1: {
            icon: 'info-circle',
            color: '#0076ef',
            text: msg,
            class: 'info'
         },
         2: {
            icon: 'circle-check',
            color: '#00ef76',
            text: 'Proceso ejecutado con éxito',
            class: 'done'
         }
      }
      return info[data as keyof typeof info];
   }

}
