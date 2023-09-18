import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailRoutingModule } from './alumnos-detail-routing.module';
import { AlumnosDetailComponent } from './alumnos-detail.component';
import { MaterialModule } from 'src/app/components/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
// import { MatTableModule } from 'src/app/components/mat-table/mat-table.module';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    AlumnosDetailComponent
  ],
  imports: [
    CommonModule,
    DetailRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    // MatTableModule,
    ComponentsModule
  ],
  providers: [
   {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
 ],
})
export class AlumnosDetailModule { }
