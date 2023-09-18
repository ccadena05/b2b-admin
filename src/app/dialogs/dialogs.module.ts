import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/components/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CambiarContrasenaComponent } from './cambiar-contrasena/cambiar-contrasena.component';
import { ComponentsModule } from '../components/components.module';
// import { MatTableModule } from '../components/mat-table/mat-table.module';



@NgModule({
   declarations: [
      CambiarContrasenaComponent,
   ],
   imports: [
      CommonModule,
      MaterialModule,
      ReactiveFormsModule,
      FormsModule,
      RouterModule,
      ComponentsModule,
      // MatTableModule
    ],
})
export class DialogsModule { }
