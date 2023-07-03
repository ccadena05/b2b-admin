import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
   selector: 'recursive-select',
   templateUrl: './recursive-select.component.html',
   styleUrls: ['./recursive-select.component.scss']
})
export class RecursiveSelectComponent implements OnInit {
   @Input() select: any;
   @Input() control!: AbstractControl;
   @Input() label: any;
   @Input() rq: any;

   _select: any;
   _label: any;
   _rq: any;
   _control: any;
   filtered: any = [];
   constructor(

   ) {
   }

   ngOnInit(): void {

   }
   ngOnChanges(changes: SimpleChanges) {
      this._label = changes['label']?.currentValue ?? this._label;
      this._rq = changes['rq']?.currentValue ?? this.rq;
      this._control = changes['control']?.currentValue ?? this.control;
      this._select = {}
      this._select['children'] = changes['select']?.currentValue ?? this.select;
      this.filtered = this._select;
/* 
      console.log(changes);


      console.log('this._select', this._select);
      console.log('filtered', this.filtered);

      console.log('this._label', this._label);
      console.log('this._control', this._control);
      console.log('this._rq', this._rq);
      console.log(this.filtered?.children);
 */
   }
   /* 
      ngAfterViewInit() {
   
      }
      search(v: any) {
         this.filtered = this._select.filter((option: any) => this.transform(option.name).includes(this.transform(v))).slice(0, 100);
      }
   
      selected(event: Event, control: AbstractControl) {
         control.patchValue(event)
         console.log(event);
         
         // this.response.emit(this._select.filter((option: any) => option.id === event));
   
      }
   
      controlName(control: any) {
         const parent = control?.parent as FormGroup
         return Object?.keys(parent?.controls).find(key => control === parent?.get(key)) || ''
      }
   
      transform(value: any) {
         return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      }
    */

   // @Input() categories: any[] = [];
   //   @Input() label: string = '';
   // @Input() language: string = '';
   @Output() categorySelected = new EventEmitter<any>();
   selectedCategory: any;

   onSelectionChange(event: any, control: AbstractControl): void {
      if (this.selectedCategory) {
         this.categorySelected.emit(this.selectedCategory);
      }
      control.patchValue(event.value.id)

   }

   onCategorySelected(category: any): void {
      this.categorySelected.emit(category);
   }

   hasChildren(category: any): boolean {
      return category && category.children && category.children.length > 0;
   }

/*    search(v: any) {
      const _all: any = []
      console.log(this._select);
      console.log(v.length);
      
      if(v.length >=1) {
         this.filtered['children'] = this._select?.children?.filter((option: any) => {
         // return (
          return this.transform(option.ES).includes(this.transform(v)) 
         //   this.transform(option.EN).includes(this.transform(v))
         // );
       });
      } else {
         this.filtered['children'] = _all['children']
      }
      console.log(this._select, this.filtered);
      
   } */

/*    transform(value: any) {
      // console.log(this.sch.nativeElement.value);
      return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   } */

}
