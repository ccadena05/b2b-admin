import { Component, OnInit } from '@angular/core';
import { ProviderService } from 'src/app/services/provider/provider.service';
import { Response } from 'src/app/models/response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER, X } from '@angular/cdk/keycodes';
import { OutputService } from 'src/app/services/output.service';

@Component({
  selector: 'app-investments-form',
  templateUrl: './investments-form.component.html',
  styleUrls: ['./investments-form.component.scss']
})
export class InvestmentsFormComponent implements OnInit {
  available_langs: any = []
  tabs: any = [{ id: '1', name: 'English', language: 'EN', emoji: '🇺🇸' }]
  form_investments: FormGroup
  readonly separatorKeysCodes = [ENTER, COMMA] as const

  constructor(
    private provider: ProviderService,
    private form_builder: FormBuilder,
    public master: MasterService,
    private output: OutputService
  ) {
    this.form_investments = this.form_builder.group({
      total_amount: ['', Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required],
      city: [null, Validators.required],
      total_jobs: ['', Validators.required],
      suface_construction: ['', Validators.required],
      description: this.form_builder.array([this.master.createTranslation(1)]),
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
    console.log(this.form_investments.value)
  }

  addCategory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim()

    if (value) {
      if (this.form_investments.value.categories != null)
        this.form_investments.controls['categories'].patchValue(this.form_investments.value.categories + ', ' + value)
      else
        this.form_investments.controls['categories'].patchValue(value)
    }
    event.chipInput!.clear();
  }

  removeCategory(category: any): void {
    const tagToRemove = category + ', ';
    this.form_investments.value.categories = this.form_investments.value.categories.replace(tagToRemove, '')
  }
}