import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { MaterialModule } from '../components/material/material.module';
import { CloudinaryModule } from '@cloudinary/ng';
import { NgxCloudinaryWidgetModule } from 'ngx-cloudinary-upload-widget';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorCatchingInterceptor } from '../services/auth/error-interceptor.service';
// import { PrivateSideNavbarComponent } from '../components/sidebars/private-side-navbar/private-side-navbar.component';
// import { PrivateSideNavbarListComponent } from '../components/sidebars/private-side-navbar-list/private-side-navbar-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '../components/layout/footer/footer.component';
import { ComponentsModule } from '../components/components.module';
import { RoutePartsService } from '../services/route-parts.service';
import { HeaderModule } from '../components/layout/header/header.module';
import { SidebarModule } from '../components/layout/sidebar/sidebar.module';
import { MasterModule } from './master/master.module';
import { EventsFormComponent } from './events-form/events-form.component';
// import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    PrivateComponent,
    EventsFormComponent,

  ],
  imports: [
    ComponentsModule,
    CommonModule,
    PrivateRoutingModule,
    MaterialModule,
    CloudinaryModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    SidebarModule,
    MasterModule,
    NgxCloudinaryWidgetModule.forRoot({cloudName: environment.cloudName}),
  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: ErrorCatchingInterceptor,
        multi: true,
    },
    RoutePartsService,

],
})
export class PrivateModule { }
