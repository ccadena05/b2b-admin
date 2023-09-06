import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, Renderer2, SimpleChange, SimpleChanges } from '@angular/core';
import { MasterService } from 'src/app/services/master.service';


@Component({
   selector: 'icon',
   templateUrl: './icon.component.html',
   styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
   @Input() i: string = '';
   @Input() c: string = '';
   @Input() h: string = '';
   _i: string = '';
   _c: string = '';
   _prev_c: string = '';
   _h: string = '';
   path: string = ''
   icon: any = ''

   constructor(
      public master: MasterService,
      private http: HttpClient,
   ) {
   }

   ngOnInit(): void {
   }

   ngOnChanges(changes: SimpleChanges) {
      this._i = changes['i']?.currentValue ?? this.i;
      this._c = this._prev_c = changes['c']?.currentValue ?? this._c;
      this._h = changes['h']?.currentValue ?? this._h;
      console.log(this._c);
      
      this.path = `assets/icons2/${this._i}.svg`;

      this.inner()
   }

   over() {
      this.c = this._c = this._h
      this.inner()

   }

   out() {
      this.c = this._c = this._prev_c
      this.inner()

   }

   inner() {
      this.http.get(this.path, { responseType: 'text' }).subscribe(
         (data: any) => {
            this.icon = this._c ? data.replace(/<svg(.*?)stroke="([^"]*)"([^>]*)>/g, `<svg$1stroke="${this._c}"$3>`) : data;
            this.icon = this.master.inner(this.icon)
         }
      );
   }

}
