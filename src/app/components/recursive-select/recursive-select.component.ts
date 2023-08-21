import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';

@Component({
   selector: 'recursive-select',
   templateUrl: './recursive-select.component.html',
   styleUrls: ['./recursive-select.component.scss']
})
export class RecursiveSelectComponent implements OnInit, OnChanges {
   @Output() categorySelected = new EventEmitter<any>();
   @Input() control!: AbstractControl;
   @Input() generation: number = 0;
   @Input() rq: boolean = false;
   @Input() label: string = '';
   @Input() select: any = [];
   @Input() value: any = [];

   selectedCategory: any;
   _control!: AbstractControl;
   _generation: number = 0;
   _rq: boolean = false;
   _label: string = '';
   _select: any = [];
   _value: any = [];
   filtered: any = [];

   constructor(
      public master: MasterService
    ) {
   }

   ngOnInit(): void {
   }

   ngOnChanges(changes: SimpleChanges) {
      this._control = changes['control']?.currentValue ?? this.control;
      this._generation = changes['generation']?.currentValue ?? this.generation;
      this._select = {}
      this._select['children'] = changes['select']?.currentValue ?? this.select;
      this._label = changes['label']?.currentValue ?? this._label;
      this._rq = changes['rq']?.currentValue ?? this.rq;
      this._value = changes['value']?.currentValue ?? this.value;

      this.filtered = this._select;

      if(this._value?.length > 0 && this.filtered['children'])
      {
         let event: any = {value: {id: this._value[this._generation]}};
         this.selectedCategory = this.filtered['children'].find((child: any) => child.id == event.value.id)
         this.onSelectionChange(event, this._control)
      } else if(!this._value){
         let event: any = {value: {id: null}};
         this.selectedCategory = null
         this.onSelectionChange(event, this._control)
      }
/*       console.log(this._control.value);
      if(this._control.value.length > 0)
         this._control.patchValue(this._control.value[this._generation]) */
      /* 
      console.log(changes);
      console.log('this._generation', this._generation);
      console.log('this._select', this._select);
      console.log('filtered', this.filtered);
      console.log('this._label', this._label);
      console.log('this._control', this._control);
      console.log('this._rq', this._rq);
      console.log(this.filtered?.children);
 */
   }

   search(v: any) {
      this.filtered['children'] = this._select['children'].filter((option: any) => this.transform(option?.EN)?.includes(this.transform(v)) || this.transform(option?.ES)?.includes(this.transform(v))).slice(0, 100);
   }

   transform(value: any) {
      return value?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   }

   

   onSelectionChange(event: any, control: AbstractControl): void {
      
      if (this.selectedCategory) {
         this.selectedCategory.generation = this._generation;
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
}
