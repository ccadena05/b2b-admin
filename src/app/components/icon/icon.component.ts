import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
   selector: 'icon',
   templateUrl: './icon.component.html',
   styleUrls: ['./icon.component.scss']
})
export class IconComponent implements OnInit {
   @Input() i: string = '';
   _icon: any;
   _i: any

   constructor() { 
   }
   
   ngOnInit(): void {
   }
   
   ngOnChanges(changes: SimpleChanges) {
      this._i = changes['i']?.currentValue ?? this._i      
   }
}
