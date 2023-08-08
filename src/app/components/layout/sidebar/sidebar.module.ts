import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { MaterialModule } from '../../material/material.module';
import { RouterModule } from '@angular/router';
import {MouseEnterLeaveDebounceDirective} from 'src/app/directives/mouse-enter-leve-debounce.directive';
import { ComponentsModule } from '../../components.module';


@NgModule({
  declarations: [
    SidebarComponent,
    MouseEnterLeaveDebounceDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ComponentsModule
  ],
  exports:[
    SidebarComponent
  ]
  
})
export class SidebarModule { }
