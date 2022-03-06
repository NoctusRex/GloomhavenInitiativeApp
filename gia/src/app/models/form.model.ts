import { FormControl, FormGroup } from '@angular/forms';

export class Form {
  formGroup: FormGroup;

  constructor(fields: { [key: string]: FormControl }) {
    this.formGroup = new FormGroup(fields);
  }

  get<T>(key: string): T {
    return this.formGroup.get(key)?.value;
  }

  reset(): void {
    this.formGroup.reset();
  }

  set(field: { [key: string]: any }): void {
    this.formGroup.patchValue(field);
  }

  canSubmit(): boolean {
    return this.formGroup.status === 'VALID';
  }
}
