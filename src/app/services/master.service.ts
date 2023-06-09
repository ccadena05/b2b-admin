import { Injectable, Sanitizer } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { JwtAuthService } from './auth/jwt-auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatRadioButton } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';
import { config } from 'src/config';
// import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';

@Injectable({
	providedIn: 'root'
})
export class MasterService {

	constructor(
		private snackbar: MatSnackBar,
		private formBuilder: FormBuilder,
		private jwt: JwtAuthService,
		private sanitizer: DomSanitizer,
		// private manager: CloudinaryWidgetManager
	) { }

	/* Función para hacer un Patch de un JSON a un formulario. Si hay checkbox, convierte a true o false, según sea el caso */
	patchForm(data: any, form: FormGroup, check?: any): any {

		if (check) {
			check.forEach((el: any) => {
				data[el] = data[el] == 1 ? true : false
			});
		}
		let keys_form = Object.keys(form.value)
		let keys_data = Object.keys(data)

		for (let index = 0; index < keys_form.length; index++) {
			for (let index2 = 0; index2 < keys_data.length; index2++) {
				if (keys_form[index] == keys_data[index2]) {
					if (form.get(keys_form[index]) instanceof FormArray) {
						// console.log(keys_form[index]);
						let key = keys_form[index] || '';
						// console.log(this.getterA(form.controls[key])?.controls );
						
						let index_data = Object.keys(data[keys_form[index]])
						let index_form = Object.keys(this.getterA(form.controls[key])?.controls)
						// console.log(index_data, index_form);
						
						for (let index3 = 0; index3 < index_data.length; index3++) {
							for (let index4 = 0; index4 < index_form.length; index4++) {

								if(index_data[index3] == index_form[index4]) {
									let subkey_data = Object.keys(data[keys_form[index]][index3])
									let subkey_form = Object.keys(this.getterA(form?.controls[keys_form[index]]).at(index3).value)
									for (let index5 = 0; index5 < subkey_data.length; index5++) {
										// const element = array[index5];
										for (let index6 = 0; index6 < subkey_form.length; index6++) {
											// const element = array[index6];
											if(subkey_data[index5] == subkey_form[index6]) {
												// console.log(this.getterC(this.getterG(this.getterA(form?.controls[keys_form[index]]).at(index3)).controls[subkey_data[index5]]));
												
												let fc = this.getterC(this.getterG(this.getterA(form?.controls[keys_form[index]]).at(index3)).controls[subkey_data[index5]])
												fc?.patchValue(data[keys_form[index]][index3][subkey_data[index5]])
											}
											
										}
										
									}
									// console.log(subkey_data, subkey_form);
									
									/* let ff = this.getterA(form?.controls[keys_form[index]]).at(index3);
									ff?.patchValue(data[keys_form[index]][index3]) */
								}
							}
						}
					} else if(keys_form[index] == 'schedule_week' && form.get(keys_form[index]) instanceof FormGroup){

						// console.log(JSON.parse(JSON.parse(data[keys_form[index].replace(/\\\\\\/g, '\\')])));
						// console.log(Object.keys(form.get(keys_form[index])?.value));
						let subkey_form_g = Object.keys(form.get(keys_form[index])?.value)
						let subkey_data_g = Object.keys(JSON.parse(JSON.parse(data[keys_form[index].replace(/\\\\\\/g, '\\')])))
						console.log(subkey_form_g, subkey_data_g);
						for (let index7 = 0; index7 < subkey_form_g.length; index7++) {
							for (let index8 = 0; index8 < subkey_data_g.length; index8++) {
								if(subkey_data_g[index8] == subkey_form_g[index7]) {
									let fc = this.getterG(form.controls[keys_form[index]]).controls[subkey_form_g[index7]]
									fc.patchValue(JSON.parse(JSON.parse(data[keys_form[index].replace(/\\\\\\/g, '\\')]))[subkey_data_g[index8]])
								}
								
							}
							
						}
						
					}
					
					else if (keys_form[index] == 'schedule_week' || keys_form[index] == 'tags') {
						try {
							// console.log(JSON.parse(data[keys_form[index].replace(/\\\\\\/g, '\\')]));
							// console.log(data[keys_form[index]].replace(/\\\\\\/g, '\\'));
							
							form.patchValue({
								[keys_form[index]]: JSON.parse(data[keys_form[index].replace(/\\\\\\/g, '\\')])
							})
						} catch (error) {
							form.patchValue({
								[keys_form[index]]: data[keys_form[index]]
							})
						}
					}

					else {
						
							 
						let value = typeof data[keys_form[index]] == 'number' ? data[keys_form[index]].toString() : data[keys_form[index]]
						form.patchValue({
							[keys_form[index]]: value
						})
					}
				}
			}
		}
	}

	concat(data: any, array: any, key: any) {
		data.forEach((row: any) => {
			let new_array: string[] = [];
			array.forEach((element: any) => { new_array.push(row[element]) });
			row[key] = new_array.join(' | ');
		});
		return data;
	}

	compare_object(o1: any, o2: any) {
		if (JSON.stringify(o1) === JSON.stringify(o2))
			return o1
		return o2

	}

	/* Función para abrir un snackbar dinámico */
	snack(k: any, m?: any) {
		this.snackbar.openFromComponent(SnackbarComponent, {
			data: {
				key: k,
				msg: m
			}, duration: 5000
		})
	}

	invalid_form(id: any) {
		let form = document.getElementById(id);
		let firstInvalidControl = form?.getElementsByClassName('ng-invalid')[0];
		console.log(firstInvalidControl);
		
		firstInvalidControl?.scrollIntoView();
		(firstInvalidControl as HTMLElement).focus();
		this.snack(0, 'Revisa tu información e inténtalo de nuevo.')
	}

	getterA(control: AbstractControl) {
		return control as FormArray
	}

	getterC(control: AbstractControl) {
		return control as FormControl
	}

	getterG(control: AbstractControl) {
		return control as FormGroup
	}

	createTranslation(languages_id: any): FormGroup {
		return this.formBuilder.group({
			id: [null, Validators.required],
			identifier: [null, Validators.required],
			languages_id: [languages_id, Validators.required],
			text: [null, Validators.required],
			active: ['1', Validators.required],
		});
	}

	changeKey(mapeo: { [oldKey: string]: string }, json: any) {
		json?.forEach((row: any, index: any) => {
			Object.keys(mapeo).forEach(key => {
				json[index][mapeo[key] || ''] = json[index][key]
			});

		});
		return json;
	}

	lang_index(array: any) {
		return array[array.findIndex((obj: any) => obj.languages_id == (this.jwt.getLang() ?? 1))]
	}

	youtubeFrame(url: any) {
		var regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^\s&]+)/;
		let match = url?.match(regex);
		let id: any
		if (match && match[1]) {
			id = match[1]; // Devolver el ID del video
		} else {
			id = null; // No se encontró un ID válido
		}
		// console.log(id);

		return this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + id);
	}

	require_control(form: FormGroup, controls: string[]) {
		controls.forEach((control) => {
			form.get(control)?.setValidators(Validators.required)
		});
	}

	turn_check(controls: FormControl[]): boolean {
		return controls.some(control => control.value !== null && control.value !== undefined && control.value !== '' && control.value !== "");
	}

	turn_check_array(formArrays: FormArray[]): boolean {
		return formArrays.some(formArray => {
			return formArray.controls.some(control => {
				const textControl = control.get('text') as FormControl;
				return textControl.value !== null && textControl.value !== undefined;
			});
		});
	}

	addslashes(string: any) {
		return string.replace(/\\/g, '\\\\').
			replace(/\u0008/g, '\\b').
			replace(/\t/g, '\\t').
			replace(/\n/g, '\\n').
			replace(/\f/g, '\\f').
			replace(/\r/g, '\\r').
			replace(/'/g, '\\\'').
			replace(/"/g, '\\"');
	}

	/* Función para saber si un FormArray tiene la estructura de tRANSLATE 
	hasStructure(control: AbstractControl, fields: string[]) {
		
		if ((control instanceof FormArray)){


		control.controls.forEach(con => {
			console.log('|', Object.keys(con.value), ' - ', fields, '|');
			return this.arraysEqual(Object.keys(con.value), fields);

		});
}
		return false

	}

	arraysEqual(a: any, b: any) {
		// si los arreglos tienen longitudes diferentes, no son iguales
		if (a.length !== b.length)
			return false;

		// compara cada elemento del arreglo usando el operador ==
		for (let i = 0; i < a.length; i++) {
			if (a[i] !== b[i])
				return false;
		}

		// si todos los elementos son iguales, los arreglos son iguales
		return true;
	} 
	*/

	hasValue(variable: any): boolean {
		return variable != null && variable != undefined && variable != '' && variable != "";
	}

	/* uploadPDF(control: any) {
      this.manager.open(config.upload_config).subscribe(
         data => {
            if (data.event == 'success') {
               control?.patchValue(data.info.secure_url)
            }
         }
      )
   } */
}
