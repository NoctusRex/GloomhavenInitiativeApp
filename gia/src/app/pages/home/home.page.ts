import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { InitiativesConfigurationService } from 'src/app/services/initatives-configuration.service';
import { TranslationService } from 'src/app/services/translation.service';
import { Form } from '../../models/form.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
})
export class HomePage implements OnInit {
  form: Form;

  constructor(
    protected initiativesConfigurationService: InitiativesConfigurationService,
    protected translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.form = new Form({
      initiative: new FormControl(undefined, [
        Validators.required,
        Validators.min(1),
        Validators.max(99),
        (control: AbstractControl): ValidationErrors | null => {
          const forbidden = !Number.isInteger(control.value);
          return forbidden ? { forbiddenName: { value: control.value } } : null;
        },
      ]),
    });
  }

  onSubmit() {
    if (!this.form.canSubmit()) return;

    console.warn(this.form.get('initiative'));
  }
}
