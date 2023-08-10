import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/services/master.service';

@Component({
  selector: 'app-investments-form',
  templateUrl: './investments-form.component.html',
  styleUrls: ['./investments-form.component.scss']
})
export class InvestmentsFormComponent implements OnInit {
  form: FormGroup

  constructor(
    private form_builder: FormBuilder,
    public master: MasterService
  ) {
    this.form = this.form_builder.group({
      total_amount: ['', Validators.required],
      country: [null, Validators.required],
      state: [null, Validators.required],
      city: [null, Validators.required],
      total_jobs: ['', Validators.required],
      suface_construction: ['', Validators.required],
      description: this.form_builder.array([this.master.createTranslation(1)]),
      categories: [null, Validators.required]
    })
  }

  ngOnInit(): void {
  }

  save() {
    console.log(this.form.valid)
  }
}
