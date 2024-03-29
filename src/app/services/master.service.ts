import { Injectable, Sanitizer } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { JwtAuthService } from './auth/jwt-auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatRadioButton } from '@angular/material/radio';
import { MatCheckbox } from '@angular/material/checkbox';
import { config } from 'src/config';
import { ProviderService } from './provider/provider.service';
import { Response } from '../models/response.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogoConfirmacionComponent } from '../components/dialogo-confirmacion/dialogo-confirmacion.component';
import { Location } from '@angular/common';
import { LanguageService } from './language.service';
import { Language } from '../models/language.model';
// import { CloudinaryWidgetManager } from 'ngx-cloudinary-upload-widget';

@Injectable({
	providedIn: 'root'
})
export class MasterService {
	_languages: any = [];
	translate_keys = "id,text,active,identifier,languages_id";
	no_translate_keys = ["children", "cards", "carousel", "clusters"];

	constructor(
		private dialog: MatDialog,
		private location: Location,
		private jwt: JwtAuthService,
		private lang: LanguageService,
		private snackbar: MatSnackBar,
		private sanitizer: DomSanitizer,
		private formBuilder: FormBuilder,
		private provider: ProviderService,
		// private manager: CloudinaryWidgetManager
	) {
		this.languages();

	}

	patch(data: any, formGroup: FormGroup, tabs?: Language[]) {
		if (data)
			Object.keys(data)?.forEach((key) => {
				const control = formGroup.get(key);

				if (control instanceof FormArray)
					this.getterA(control).clear()

				if (control instanceof FormControl) {
					control.patchValue(data[key]);
				}

				else if (control instanceof FormGroup) {
					while (typeof data?.[key] == 'string')
						data[key] = JSON.parse(data?.[key])

					this.patch(data[key], control);
				}

				else if (control instanceof FormArray && Array.isArray(data[key])) {
					const formArray = control as FormArray;
					const dataArray = data[key];

					if (formArray.length < dataArray.length) {
						for (let i = formArray.length; i < dataArray.length; i++) {
							const subGroup = new FormGroup({});
							dataArray.forEach((array: any) => {
								Object.keys(array).forEach((sub_key: any) => {
									subGroup.addControl(sub_key, new FormControl(data[sub_key]));
								});
							});

							formArray.push(subGroup);
						}
					}

					dataArray.forEach((value: any, index: number) => {
						const subGroup = formArray.at(index) as FormGroup;
						this.patch(value, subGroup);
						formArray?.controls?.forEach(array => {
							if (array instanceof FormGroup && Object.keys(value).join() == this.translate_keys) {
								let new_lang = this._languages.filter((lang: any) => value.languages_id == lang.id)
								this.add_lang_tab(tabs  || [], new_lang[0], formGroup)
							}
						});
					});

					if (formArray.length > dataArray.length) {
						for (let i = formArray.length - 1; i >= dataArray.length; i--) {
							formArray.removeAt(i);
						}
					}
				} /* else if (control instanceof FormArray && !data[key]){

					(control as FormArray).push(new FormGroup({}));
					// console.log(formArray);
					
			} */
			});
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

	arr(form: FormGroup, control: string, type?: any) {
		// if (type)
		// return form.controls[control] as FormArray
		return (form.controls[control] as FormArray)
	}

	array(form: FormGroup, control: string, type?: any) {
		// if(control == 'title')
		// console.log((form.controls[control] as FormArray).controls);

		return (form.controls?.[control] as FormArray)?.controls
	}

	group(control: any) {
		return control as FormGroup
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

	certificate(name_id: any, name?: any): FormGroup {
		return this.formBuilder.group({
			id: [null],
			name: [name, Validators.required],
			name_id: [name_id, Validators.required],
			// file_name: [''],
			url: [null, Validators.required],
			active: ['1', Validators.required]
		});
	}

	category(p_c_id: any, c_id?: any): FormGroup {
		return this.formBuilder.group({
			id: [null],
			profile_company_id: [p_c_id, Validators.required],
			categories_id: [c_id, Validators.required],
			active: ['1', Validators.required]
		});
	}

	translation(languages_id: any, identifier?: any): FormGroup {
		return this.formBuilder.group({
			id: [null, identifier ? Validators.required : null],
			identifier: [null, identifier ? Validators.required : null],
			languages_id: [languages_id, Validators.required],
			text: [null, Validators.required],
			active: ['1', Validators.required],
		});
	}

	createSimpleTranslation(): FormGroup {
		return this.formBuilder.group({
			EN: [null],
			ES: [null],
		});
	}

	createGallery(url: any, identifier: any): FormGroup {
		return this.formBuilder.group({
			id: [null],
			identifier: [identifier],
			url: [url, Validators.required],
			active: ['1']
		})
	}

	create_cluster(c_id: any, p_c_id: any): FormGroup {
		return this.formBuilder.group({
			id: [null, Validators.required],
			cluster_id: [c_id, Validators.required],
			profile_company_id: [p_c_id, Validators.required],
			active: ['1']
		})
	}

	text_section(tabs: Language[]): FormGroup {
		return this.formBuilder.group({
			title: this.formBuilder.array(this.create_array(tabs)),
			description: this.formBuilder.array(this.create_array(tabs)),
			image_url: [null, Validators.required],
			type: ['section'],
		})
	}

	carousel_section(tabs: Language[]): FormGroup {
		return this.formBuilder.group({
			title: this.formBuilder.array(this.create_array(tabs)),
			carousel: this.formBuilder.array([this.carousel_item(tabs)]),
			type: ['carousel'],
		})
	}

	carousel_item(tabs: Language[]): FormGroup {
		return this.formBuilder.group({
			description: this.formBuilder.array(this.create_array(tabs)),
			image_url: [null, Validators.required]
		})
	}

	card_item(tabs: Language[]): FormGroup {
		return this.formBuilder.group({
			title: this.formBuilder.array(this.create_array(tabs)),
			description: this.formBuilder.array(this.create_array(tabs)),
			icon: [null, Validators.required],
			route: [null]
		})
	}

	card_section(tabs: Language[]): FormGroup {
		return this.formBuilder.group({
			title: this.formBuilder.array(this.create_array(tabs)),
			cards: this.formBuilder.array([this.card_item(tabs)]),
			type: ['cards'],
		})
	}


	linetime_section(tabs: Language[]): FormGroup {
		return this.formBuilder.group({
			title: this.formBuilder.array(this.create_array(tabs)),
			linetime: this.formBuilder.array([this.linetime_item(tabs)]),
			type: ['linetime'],

		})
	}

	linetime_item(tabs: Language[]): FormGroup {
		return this.formBuilder.group({
			label: this.formBuilder.array(this.create_array(tabs)),
			subtitle: this.formBuilder.array(this.create_array(tabs)),
			title: this.formBuilder.array(this.create_array(tabs)),
			description: this.formBuilder.array(this.create_array(tabs)),
			children: this.formBuilder.array([])
		})
	}

	linetime_child(tabs: Language[]): FormGroup {
		return this.formBuilder.group({
			label: this.formBuilder.array(this.create_array(tabs)),
			subtitle: this.formBuilder.array(this.create_array(tabs)),
			title: this.formBuilder.array(this.create_array(tabs)),
			description: this.formBuilder.array(this.create_array(tabs)),
		})
	}

	numberCard(languages_id: any, tabs: Language[]): FormGroup {
		let form = this.formBuilder.group({
			title: this.formBuilder.array(this.create_array(tabs)),
			number_cards: this.formBuilder.array([]),
			type: ['number_cards'],
		})

		for (let index = 0; index < 4; index++) {
			this.arr(form, 'cards').push(this.ncard(tabs))
		}

		return form
	}

	ncard(tabs: Language[]): FormGroup {
		return this.formBuilder.group({
			title: this.formBuilder.array(this.create_array(tabs)),
			icon: [null, Validators.required]
		})
	}

	create_array(tabs: Language[]) {
		let array: any = []
		tabs.forEach((tab: Language) => {
			array.push(this.translation(tab.id, null))
		});
		return array;
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

	turn_check(form: FormGroup, controls: string[]): boolean {
		console.log(controls.some(control => form.get(control)?.value !== null && form.get(control)?.value !== undefined && form.get(control)?.value !== '' && form.get(control)?.value !== ""));

		return controls.some(control => form.get(control)?.value !== null && form.get(control)?.value !== undefined && form.get(control)?.value !== '' && form.get(control)?.value !== "");
	}

	turn_check_array(form: FormGroup, controlNames: string[]): boolean {
		return controlNames.some(controlName => {
			const control = form.get(controlName) as FormControl;
			return control.value !== null && control.value !== undefined;
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

	add_lang_tab(tabs: Language[], language: any, form: FormGroup) {
		// console.log(tabs);
		
		if (!tabs.some((item: any) => item.id == language.id) && (language.id != this.lang.user_lang.id || language.id != this.lang.user_lang.id.toString())) {
			tabs.push(language);
			this.push_lang(language, form)
		}
	}

	push_lang(language: any, form: FormGroup) {
		Object.keys(form.controls).forEach(element => {
			if (form.controls[element] instanceof FormArray && !this.no_translate_keys.includes(element))
				this.getterA(form.controls[element]).push(this.translation(language.id, form.value?.[element]?.[0]?.['identifier'] ?? null))
			else if (form.controls[element] instanceof FormArray && this.no_translate_keys.includes(element))
				Object.keys(this.group(form.controls[element]).controls).forEach(number => {
					this.push_lang(language, this.group(this.group(form.controls[element]).controls[number]))
				});
		})
	}

	del_lang_tab(tabs: any, languages_id: any, form: FormGroup, tab_index: any) {

		if (tabs.length > 1) {
			tabs.splice(tab_index, 1)

			Object.keys(form.controls).forEach(element => {
				if (form.controls[element] instanceof FormArray) {
					const formArray = this.getterA(form.controls[element]);
					const indexToRemove = formArray.controls.findIndex(
						control => control.value.languages_id == languages_id
					)
					if (indexToRemove >= 0)
						formArray.removeAt(indexToRemove)
				}
			});
		}

	}

	add_lang_tab_array(tabs: Language[], language: any, form: FormGroup, array: any, item_index: any) {
		tabs.push(language);

		Object.keys(this.getterA(this.getterA(form.controls[array]).at(item_index)).controls).forEach((element: any) => {
			let form_array = this.getterA(this.getterA(form.controls[array]).at(item_index)).controls[element];
			console.log(element);
			console.log(form_array);



			if (form_array instanceof FormArray)
				this.getterA(form_array).push(this.translation(language.id, this.getterA(this.getterA(form.controls[array]).at(item_index)).value[element]?.[0]?.['identifier'] ?? null))
		})
	}

	del_lang_tab_array(total: any, form: FormGroup, tab_index: any, array: any) {
		if (total.length > 1) {
			total.splice(tab_index, 1)

			Object.keys(form.controls).forEach((element: any) => {
				if (this.getterA(this.getterA(form.controls[array])) instanceof FormArray) {
					const formArray = this.getterA(this.getterA(form.controls[array]));
					formArray.removeAt(tab_index)
				}
			});
		}
	}

	toogle_validators(action: boolean, controls: string[], form: any) {
		controls.forEach(control => {
			if (action)
				form.controls[control].setValidators(Validators.required)
			else {
				form.controls[control].removeValidators(Validators.required)
				/* if(form.controls[control] instanceof FormArray) {
					this.getterA(form.controls[control]).controls.forEach((control: any) => {
						control.controls['active'].patchValue(0)
					});
				} else {
					form.controls[control].patchValue(null)
				} */
			}
			form.controls[control].updateValueAndValidity()
		});
	}

	languages() {
		this.provider.BD_ActionGet('general', 'get_languages').subscribe(
			(languages: Response) => {
				// console.log(languages);
				this._languages = languages.msg
			}
		)
	}

	/* save(model: string, action: string, data: any, update?: any): boolean {
		this.dialog.open(DialogoConfirmacionComponent).afterClosed().subscribe(
			(confirm: any) => {
				if (confirm)
					return this.provider[(action.includes('update') || update) ? 'BD_ActionAdminPut' : 'BD_ActionAdminPost'](model, action, data).subscribe(
						(data: Response) => {
							console.log(data);

							if (!data.error) { // Se completó
								// this.location.back()
								this.snack(2)
							}
							else {// Error
								this.snack(0)
							}
							console.log('a');
							
							return !data.error
						}
					)
				else {
					this.snack(1, 'El elemento sigue visible')
					console.log(false);
					
					return false
				}
				console.log(null);
			}
		)
		console.log('b');
		
		return false
		console.log(null);
	} */

	async save(model: string, action: string, data: any, update?: any): Promise<boolean> {
		const confirm = await this.dialog.open(DialogoConfirmacionComponent).afterClosed().toPromise();

		if (confirm) {
			try {
				const response: any = await this.provider[(action.includes('update') || update) ? 'BD_ActionAdminPut' : 'BD_ActionAdminPost'](model, action, data).toPromise();
				console.log(response);

				if (!response?.error) { // Se completó
					// this.location.back()
					this.snack(2);
					return true;
				} else { // Error
					this.snack(0);
					return false;
				}
			} catch (error) {
				console.error(error);
				return false;
			}
		} else {
			this.snack(1, 'El elemento sigue visible');
			console.log(false);
			return false;
		}
	}




	delete(model: string, action: string, data: any) {
		this.dialog.open(DialogoConfirmacionComponent).afterClosed().subscribe(
			confirm => {
				if (confirm)
					this.provider.BD_ActionAdminDel(model, action, data).subscribe(
						(data: Response) => {
							console.log(data);

							if (!data.error) {// Se completó
								this.location.back()
								this.snack(2)
							}
							else // Error
								this.snack(0)
						}
					)
				else
					this.snack(1, 'El elemento sigue visible')
			}
		)
	}

	inner(code: string) {
		return this.sanitizer.bypassSecurityTrustHtml(code);
	}

	empty_translations(controls: string[], form: FormGroup, tabs: Language[]){
      
      controls.forEach((control: string) => {
         // console.log(control,  form.value?.[control].length, tabs.length, JSON.stringify(form.value?.[control]));
         // console.log(JSON.stringify(form.value?.[control]) == '[]', !JSON.stringify(form.value?.[control]), (form.value?.[control].length < tabs.length));
         
         if(JSON.stringify(form.value?.[control]) == '[]' || !JSON.stringify(form.value?.[control]) || (form.value?.[control].length < tabs.length)){
            tabs.forEach((tab: Language) => {
					if(form.controls[control].value.findIndex((c: any) => c.languages_id == tab.id) == -1)
               this.array(form, control).push(this.translation(tab.id, null))
               // this.master.arr(form, control).push(this.master.translation(tab.id, null))
            });
         }
      });
   }
}
