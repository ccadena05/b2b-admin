import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivateComponent } from './private.component';
import { EventsFormComponent } from './events-form/events-form.component';
import { BlogFormComponent } from './blog-form/blog-form.component';
import { CompaniesDetailComponent } from './companies-detail/companies-detail.component';
import { RfqFormComponent } from './rfq-form/rfq-form.component';
import { RfqEditComponent } from './rfq-edit/rfq-edit.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { CategoriesFormComponent } from './categories-form/categories-form.component';
import { MembershipsFormComponent } from './memberships-form/memberships-form.component';
import { ClustersFormComponent } from './clusters-form/clusters-form.component';
import { InvestmentsFormComponent } from './investments-form/investments-form.component';
import { StaticFormComponent } from './static-form/static-form.component';
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
      },

      {
        path: 'm/events/add',
        component: EventsFormComponent
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
        path: 'm/companies/add',
        component: CompaniesDetailComponent
      },
      {
        path: 'm/users/add',
        component: UsersFormComponent
      },
      {
        path: 'm/categories/add',
        component: CategoriesFormComponent
      },
      {
        path: 'm/membership/add',
        component: MembershipsFormComponent
      },
      {
        path: 'm/clusters/add',
        component: ClustersFormComponent
      },
      {
        path: 'm/investments/add',
        component: InvestmentsFormComponent
      },
      {
        path: 'm/static/add',
        component: StaticFormComponent
      },

      {
        path: 'm/events/detail/:id',
        component: EventsFormComponent
      },
      {
        path: 'm/blogs/detail/:id',
        component: BlogFormComponent
      },
      {
        path: 'm/rfq/detail/:id',
        component: RfqEditComponent
      },
      {
        path: 'm/companies/detail/:id',
        component: CompaniesDetailComponent
      },
      {
        path: 'm/users/detail/:id',
        component: UsersFormComponent
      },
      {
        path: 'm/categories/detail/:id',
        component: CategoriesFormComponent
      },
      {
        path: 'm/membership/detail/:id',
        component: MembershipsFormComponent
      },
      {
        path: 'm/clusters/detail/:id',
        component: ClustersFormComponent
      },
      {
        path: 'm/investments/detail/:id',
        component: InvestmentsFormComponent
      },
      {
        path: 'm/static/detail/:id',
        component: StaticFormComponent
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
