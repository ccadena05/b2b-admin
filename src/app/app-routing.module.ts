import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren:() => import('./private/private.module').then((m)=> m.PrivateModule),
    // canActivate: [AuthGuard],
    // data: { title: 'Dashboard', breadcrumb: 'DASHBOARD'}
  },
  {
    path: 'login',
    loadChildren:() => import('./public/auth/login/login.module').then((m)=> m.LoginModule),
  },
  {
    path: '**', redirectTo: 'not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
