import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../../components.module';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ComponentsModule
  ],
  exports:[
    HeaderComponent
  ]
})
export class HeaderModule { }
