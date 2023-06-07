import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './master.component';

const routes: Routes = [
   {
      path:'',
      component: MasterComponent/* ,
         children: [
            {
               path:'/alumnos/detail/:id',
               loadChildren: () =>
                  import('./alumnos-detail/alumnos-detail.module').then((m) => m.AlumnosDetailModule)
            },
            {
               path:'egresados/detail/:id',
               loadChildren: () =>
                  import('./egresados-detail/egresados-detail.module').then((m) => m.EgresadosDetailModule)
            },
         ] */
   },
   /* {
      path:'alumnos/detail/:id',
      loadChildren: () =>
         import('./alumnos-detail/alumnos-detail.module').then((m) => m.DetailModule)
   },
   {
      path:'/egresados/detail/:id',
       loadChildren: () =>
         import('./egresados-detail/egresados-detail.module').then((m) => m.EgresadosDetailModule)
   }, */
/*    {
      path: 'detail/:id',
      loadChildren: () =>
      import('./detail/')
   } */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
