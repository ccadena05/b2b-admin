import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';
import { ProviderService } from 'src/app/services/provider/provider.service';

@Component({
  selector: 'location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  viewProviders: [
    {
       provide: ControlContainer,
       useExisting: FormGroupDirective
    }
 ]
})
export class LocationComponent implements OnInit {
   sel: any = [];
   /*    @Input() country!: FormControl;
      @Input() state!: FormControl;
      @Input() city!: FormControl; */
   @Input() form!: FormGroup;
   /*    _country!: FormControl;
      _state!: FormControl;
      _city!: FormControl; */
   _form!: FormGroup;

   constructor(
      private provider: ProviderService,
      private master: MasterService
   ) {
      this.countries();
   }

   ngOnInit(): void {
   }

   ngOnChanges(changes: SimpleChanges) {
      /*       this._country = changes['country']?.currentValue ?? this.country;
            this._state = changes['state']?.currentValue ?? this.state;
            this._city = changes['city']?.currentValue ?? this.city; */
      this._form = changes['form']?.currentValue ?? this.form;
      // console.log(this._form);

      this._form?.controls['country']?.valueChanges.subscribe(
         (country: any) => {
            this.states(country)
            // console.log(this._form.controls['country'].value);
            
         }
      )

      this._form?.controls['state']?.valueChanges.subscribe(
         (state: any) => {
            this.cities(state)
         }
      )
   }

   ngAfterViewInit() {
   }

   countries() {
      this.provider.BD_ActionGet('general', 'get_countries').subscribe(
         (countries: any) => {
            // console.log(countries.msg)
            if (!countries.error)
               this.sel['countries'] = this.master.concat(countries?.msg, ['e', 'n'], 'name');

         }
      )
   }

   states(country_id: any) {
      this.provider.BD_ActionGet('general', 'get_states', { country_id }).subscribe(
         (all_states: any) => {
            // console.log(all_states);
            if (!all_states.error)
               this.sel['all_states'] = this.master?.changeKey({ 's': 'name' }, all_states?.msg)

         }
      )
   }

   cities(state_id: any) {
      this.provider.BD_ActionGet('general', 'get_cities', { state_id }).subscribe(
         (all_cities: any) => {
            // console.log(all_cities);
            if (!all_cities.error)
               this.sel['all_cities'] = this.master.changeKey({ 'name': 'number', 'c': 'name' }, all_cities?.msg)
         }
      )
   }

}
