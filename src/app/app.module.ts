import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthGuard } from './guards/auth.guard';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorCatchingInterceptor } from './services/auth/error-interceptor.service';
import { NgwWowModule } from 'ngx-wow';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MaterialModule } from './components/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigDialogModule } from './public/config-dialog/config-dialog.module';
import { LowerDashPipe } from './pipes/lower-dash.pipe';
import { DialogsModule } from './dialogs/dialogs.module';
import { ComponentsModule } from './components/components.module';

export function getPaginatorIntl() {
   const paginatorIntl = new MatPaginatorIntl();
   paginatorIntl.itemsPerPageLabel = 'Registros por página:';
   paginatorIntl.nextPageLabel = 'Página siguiente';
   paginatorIntl.previousPageLabel = 'Página anterior';
   paginatorIntl.firstPageLabel = 'Primera página';
   paginatorIntl.lastPageLabel = 'Última página';
   return paginatorIntl;
}
@NgModule({
   declarations: [
      AppComponent,
      LowerDashPipe,
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      HttpClientModule,
      NgwWowModule,
      MaterialModule,
      FormsModule,
      ReactiveFormsModule,
      ConfigDialogModule,
      DialogsModule,
      ComponentsModule
   ],
   providers: [AuthGuard, {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorCatchingInterceptor,
      multi: true
   },
      { provide: MatPaginatorIntl, useValue: getPaginatorIntl() },
      LowerDashPipe
   ],

   bootstrap: [AppComponent]
})

export class AppModule { }
