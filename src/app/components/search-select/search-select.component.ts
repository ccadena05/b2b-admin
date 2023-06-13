import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, ControlContainer, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
// import { TranslateService } from '@ngx-translate/core';


@Component({
   selector: 'search-select',
   templateUrl: './search-select.component.html',
   styleUrls: ['./search-select.component.scss'],
   viewProviders: [
      {
         provide: ControlContainer,
         useExisting: FormGroupDirective
      }
   ]
})
export class SearchSelectComponent implements OnInit, OnChanges, AfterViewInit {
   @Input() select: any;
   @Input() control!: AbstractControl;
   @Input() label: any;
   @Input() rq: any;
   _select: any;
   _label: any;
   _rq: any;
   _control: any;
   filtered: any[] = [];

   // @Output() response: EventEmitter<any> = new EventEmitter();

   constructor(
      // public translate: TranslateService,
   ) {
   }

   ngOnInit(): void {

   }
   ngOnChanges(changes: SimpleChanges) {
      this._select = changes['select']?.currentValue ?? this._select;
      this._label = changes['label']?.currentValue ?? this._label;
      this._rq = changes['rq']?.currentValue ?? this.rq;
      this._control = changes['control']?.currentValue ?? this.control;
      this.filtered = this._select;
      
      /*
            console.log('this._select', this._select);
            console.log('this._label', this._label);
            console.log('this._formCN', this._formCN);
            console.log('this._rq', this._rq);
      */
   }

   ngAfterViewInit() {

   }
   search(v: any) {
      this.filtered = this._select.filter((option: any) => this.transform(option.name).includes(this.transform(v))).slice(0,100);
   }

   selected(event: Event, control: AbstractControl) {
      control.patchValue(event)
      // this.response.emit(this._select.filter((option: any) => option.id === event));

   }

   controlName(control: any) {
      const parent = control?.parent as FormGroup
      return Object?.keys(parent?.controls).find(key => control === parent?.get(key)) || ''
   }

   transform(value: any) {
      return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   }

}
