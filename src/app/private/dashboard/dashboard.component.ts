
import * as  Highcharts from 'highcharts';
import { Chart } from 'angular-highcharts';
import funnel from 'highcharts/modules/funnel';

import { Component, OnInit } from '@angular/core';
import { JwtAuthService } from 'src/app/services/auth/jwt-auth.service';
import jwt_decode from 'jwt-decode';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { OutputService } from 'src/app/services/output.service';

funnel(Highcharts);

@Component({
   selector: 'app-dashboard',
   templateUrl: './dashboard.component.html',
   styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {
   displayName: string;
   dataCharts: any;
   mes = new Date().getMonth();
   mesN = '';
   meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
   ready: boolean = false;

   seriesOptions: any;
   forecast: Chart = new Chart ({});

   constructor(
      private jwtAuth: JwtAuthService,
      private provider: ProviderService,
      private output: OutputService
   ) {

      this.ready = false;
      this.meses.forEach((mes: any, indice: number) => {
         this.mes == indice ? this.mesN = mes : '';
      });

      this.displayName = this.jwtAuth.getUser()?.displayName;
      this.provider.BD_ActionPost('highcharts', 'dataCharts', { file: 'becas' }).subscribe({
         next: (data: any) => {
            console.log(data);
            this.dataCharts = data['data'];
            this.ready = true;

         }, error: (error: any) => {
            console.log(JSON.stringify(error));
         }
      });
      this.output.ready.next(true)
      this.generarChart();
   }

   ngOnInit(): void {
      console.log(this.getDecodedAccessToken().data.role)
   }

   getDecodedAccessToken(): any {
      return jwt_decode(this.jwtAuth.getJwtToken());
   }

   generarChart(){
      /* this.provider.BD_ActionPost('highcharts', 'getDataCharts', { file: 'forecast' }).subscribe({
         next: (data: any) => {
         this.seriesOptions = data;
         this.forecast = new Chart({
             chart: {
                 height: 350,
                 type: 'funnel',
                 backgroundColor: 'rgba(0,0,0,0)',
                 style: {
                     color: '#FFF'
                 }
             },
             title: {
                 text: 'Forecast',
                 style: {
                     color: '#FFF'
                 }
             },
             plotOptions: {
                 funnel: {
                     dataLabels: {
                         enabled: true,
                         format: '{point.name} ({point.y})',
                         softConnector: true,
                         style: {
                             // fontFamily: 'monospace',
                             color: '#FFF'
                         }
                     },
                     center: ['40%', '50%'],
                     neckWidth: '30%',
                     neckHeight: '25%',
                     width: '80%'
                 }
             },
             legend: {
                 enabled: false
             },
             credits: {
                 enabled: false
             },
             series: this.seriesOptions
         })
     }, error: (error: any) => {
         console.log(JSON.stringify(error));
     }}) */
   }

}

