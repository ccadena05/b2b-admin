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
import { QuillModule } from 'ngx-quill';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { CompaniesDetailComponent } from './companies-detail/companies-detail.component';
import { MatTableModule } from 'src/app/components/mat-table/mat-table.module';
import { RfqFormComponent } from './rfq-form/rfq-form.component';
import { RfqEditComponent } from './rfq-edit/rfq-edit.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { CategoriesFormComponent } from './categories-form/categories-form.component';
import { MembershipsFormComponent } from './memberships-form/memberships-form.component';
import { ClustersFormComponent } from './clusters-form/clusters-form.component';
import { InvestmentsFormComponent } from './investments-form/investments-form.component';
import { StaticFormComponent } from './static-form/static-form.component';
import { PreviewComponent } from './static-form/preview/preview.component';

@NgModule({
  declarations: [
    PrivateComponent,
    EventsFormComponent,
    BlogFormComponent,
    CompaniesDetailComponent,
    RfqFormComponent,
    RfqEditComponent,
    UsersFormComponent,
    CategoriesFormComponent,
    MembershipsFormComponent,
    ClustersFormComponent,
    InvestmentsFormComponent,
    StaticFormComponent,
    PreviewComponent,
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
    MatTableModule,
    QuillModule.forRoot(),
    NgxCloudinaryWidgetModule.forRoot({ cloudName: environment.cloudName }),
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
