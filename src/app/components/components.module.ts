import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './layout/footer/footer.component';
import { BreadcrumbsComponent } from './layout/breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';
import { WaiterComponent } from './waiter/waiter.component';
import { MaterialModule } from './material/material.module';
import { FunnelChartComponent } from './charts/funnel-chart/funnel-chart.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { ColumnChartComponent } from './charts/column-chart/column-chart.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { NumberToRomanSymbolPipe } from '../pipes/number-to-roman.pipe';
import { KardexComponent } from './kardex/kardex.component';
import { MatTableModule } from './mat-table/mat-table.module';
import { PagosComponent } from './pagos/pagos.component';
import { MatTableGroupComponent } from './mat-table-group/mat-table-group.component';
import { SearchSelectComponent } from './search-select/search-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { RecursiveSelectComponent } from './recursive-select/recursive-select.component';
import { LocationComponent } from './location/location.component';


let components = [
   FooterComponent,
   BreadcrumbsComponent,
   WaiterComponent,
   KardexComponent,
   PagosComponent,
   SearchSelectComponent,
   RecursiveSelectComponent,
   LocationComponent
]

@NgModule({
  declarations: [components, 
    FunnelChartComponent, 
    BarChartComponent, 
    ColumnChartComponent, 
    PieChartComponent, 
    LineChartComponent, 
    NumberToRomanSymbolPipe, 
    MatTableGroupComponent, 
    SnackbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[components]
})
export class ComponentsModule { }
