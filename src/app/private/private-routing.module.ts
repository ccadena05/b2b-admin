import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateComponent } from './private.component';
import { EventsFormComponent } from './events-form/events-form.component';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { CompaniesDetailComponent } from './companies-detail/companies-detail.component';
import { RfqFormComponent } from './rfq-form/rfq-form.component';
import { RfqEditComponent } from './rfq-edit/rfq-edit.component';
const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'prefix',
      },
      {
        path: 'demo',
        loadChildren: () =>
          import('./demo/demo.module').then((m) => m.DemoModule),
        data: { title: 'Demo', breadcrumb: 'DEMO' },
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        //  data: { title: 'Dashboard', breadcrumb: 'DASHBOARD' },
      },
      {
        path: 'm/events/detail/:id',
        component: EventsFormComponent
        //   data: { title: 'Alumnos', breadcrumb: 'ALUMNOS' },
      },
      {
        path: 'm/events/add',
        component: EventsFormComponent
        //   data: { title: 'Alumnos', breadcrumb: 'ALUMNOS' },
      },
      {
        path: 'm/blogs/add',
        component: BlogFormComponent
      },
      {
        path: 'm/rfq/add',
        component: RfqFormComponent
      },
      {
        path: 'm/blogs/detail/:id',
        component: BlogFormComponent
      },
      {
        path: 'm/companies/detail',
        component: CompaniesDetailComponent
      },
      {
        path: 'm/rfq/detail/:id',
        component: RfqEditComponent
      },
      {
        path: 'm/:modulo',
        loadChildren: () =>
          import('./master/master.module').then((m) => m.MasterModule),
        //   data: { title: 'Alumnos', breadcrumb: 'ALUMNOS' },
      },
      /* {
        path: 'm/:modulo/detail/:id',
        loadChildren: () =>
          import('./egresados/detail/alumnos-detail.module').then((m) => m.DetailModule),
        //   data: { title: 'Alumnos', breadcrumb: 'ALUMNOS' },
      }, */
      {
        path: 'not-found',
        loadChildren: () => import('./../public/not-found/not-found.module').then((m) => m.NotFoundModule),
      },
      {
        path: 'perfil',
        loadChildren: () =>
          import('./perfil/perfil.module').then((m) => m.PerfilModule),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule { }
