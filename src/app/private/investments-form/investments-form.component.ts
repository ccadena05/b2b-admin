import { Component, OnInit } from '@angular/core';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { Response } from 'src/app/models/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, X } from '@angular/cdk/keycodes';
import { OutputService } from 'src/app/services/output.service';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/services/language.service';
import { Language } from 'src/app/models/language.model';

@Component({
  selector: 'app-investments-form',
  templateUrl: './investments-form.component.html',
  styleUrls: ['./investments-form.component.scss']
})
export class InvestmentsFormComponent implements OnInit {
  available_langs: any = []
  tabs: Language[] = [this.lang.user_lang];
  form: FormGroup
  readonly separatorKeysCodes = [ENTER, COMMA] as const

  constructor(
    public router: Router,
    public master: MasterService,

    private lang: LanguageService,
    private output: OutputService,
    private provider: ProviderService,
    private form_builder: FormBuilder,
  ) {
    this.form = this.form_builder.group({
      total_amount: ['', Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required],
      city: [null, Validators.required],
      total_jobs: ['', Validators.required],
      suface_construction: ['', Validators.required],
      description: this.form_builder.array([this.master.translation(1)]),
      categories: [null, Validators.required]
    })

    this.get()
  }

  ngOnInit(): void {
  }

  get() {
    this.output.ready.next(false)
    this.output.table_ready.next(false)
    this.provider.BD_ActionAdminGet('general', 'get_languages').subscribe((langs: Response) => {
      this.available_langs = langs.msg
      this.output.ready.next(true)
      this.output.table_ready.next(true)
    })
  }

  save() {
    console.log(this.form.value)
  }

  delete() {
    
  }

  addCategory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim()

    if (value) {
      if (this.form.value.categories != null)
        this.form.controls['categories'].patchValue(this.form.value.categories + ', ' + value)
      else
        this.form.controls['categories'].patchValue(value)
    }
    event.chipInput!.clear();
  }

  removeCategory(category: any): void {
    const tagToRemove = category + ', ';
    this.form.value.categories = this.form.value.categories.replace(tagToRemove, '')
  }
}
