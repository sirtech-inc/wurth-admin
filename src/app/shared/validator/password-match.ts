import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {


  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);
      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }

  // un metodo para contraseña con un minimo de 10 caracteres
  static PasswordValidatorLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasMinLength = value.length >= minLength;
      return !hasMinLength ? { invalidPasswordLength: true } : null;
    };
  }

  // un metodo para contraseña con un minimo de 10 caracteres donde se pase el valor y devuelva el error como booleano
  static HasErrorPasswordValidatorLength(minLength: number, value: string): boolean {
    if (!value) {
      return false;
    }
    const hasMinLength = value.length >= minLength;
    return !hasMinLength;
  }


  // un metodo para contraseña con al menos 1 mayuscula
  static PasswordValidatorUpperCase(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasUpperCase = /[A-Z]/.test(value);
    return !hasUpperCase ? { invalidPasswordUpperCase: true } : null;
  }

  static HasErrorPasswordValidatorUpperCase(value: string): boolean {
    if (!value) {
      return false;
    }
    const hasUpperCase = /[A-Z]/.test(value);
    return !hasUpperCase;
  }


  // un metodo para contraseña con al menos 1 minuscula
  static PasswordValidatorLowerCase(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasLowerCase = /[a-z]/.test(value);
    return !hasLowerCase ? { invalidPasswordLowerCase: true } : null;
  }

  static HasErrorPasswordValidatorLowerCase(value: string): boolean {
    if (!value) {
      return false;
    }
    const hasLowerCase = /[a-z]/.test(value);
    return !hasLowerCase;
  }

  // un metodo para contraseña con al menos 1 numero
  static PasswordValidatorNumeric(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasNumeric = /[0-9]/.test(value);
    return !hasNumeric ? { invalidPasswordNumeric: true } : null;
  }

  static HasErrorPasswordValidatorNumeric(value: string): boolean {
    if (!value) {
      return false;
    }
    const hasNumeric = /[0-9]/.test(value);
    return !hasNumeric;
  }



  // un metodo para contraseña con al menos 1 caracter especial
  static PasswordValidatorSpecialCharacters(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasSpecialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    return !hasSpecialCharacters ? { invalidPasswordSpecialCharacter: true } : null;
  }

  static HasErrorPasswordValidatorSpecialCharacters(value: string): boolean {
    if (!value) {
      return false;
    }
    const hasSpecialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    return !hasSpecialCharacters;
  }




}
