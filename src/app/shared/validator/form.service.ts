import { FormGroup, Validators } from '@angular/forms';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  public static enableDisableSpecificFields(formGroup: FormGroup, fieldsToEnable: string[], enable: boolean): void {
    fieldsToEnable.forEach(fieldName => {
      const control = formGroup.get(fieldName);
      if (control) {
        if (enable) {
          control.enable();
        } else {
          control.disable();
        }
      }
    });

    (Object as any).values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.enableDisableSpecificFields(control, fieldsToEnable, enable);
      }
    });
  }

  public static markFormGroupTouched(formGroup: FormGroup): void {
    (Object as any).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  public static markFieldsAsTouched(formGroup: FormGroup, fieldsToMarkTouched: string[]): void {
    fieldsToMarkTouched.forEach(fieldName => {
      const control = formGroup.get(fieldName);
      if (control) {
        control.markAsTouched();
      }
    });
  }


  public static setRequiredSpecificFields(formGroup: FormGroup, fieldsToSetRequired: string[], isRequired: boolean): void {
    fieldsToSetRequired.forEach(fieldName => {
      const control = formGroup.get(fieldName);
      if (control) {
        if (isRequired) {
          control.setValidators(Validators.required);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity();
      }
    });
    (Object as any).values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.setRequiredSpecificFields(control, fieldsToSetRequired, isRequired);
      }
    });
  }

  public static updateValueAndValidityForFields(formGroup: FormGroup, fieldsToUpdate: string[]): void {
    fieldsToUpdate.forEach(fieldName => {
      const control = formGroup.get(fieldName);
      if (control) {
        control.updateValueAndValidity();
      }
    });
  }



}
