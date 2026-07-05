import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OptionalAll } from '@shared/types/util.types';
import { CustomValidators } from '@shared/validator/password-match';



interface PasswordValidatorRequired {
  minLenght: boolean;
  uppercase: boolean;
  lowercase: boolean;
  numeric: boolean;
  specialCharacter: boolean;
}

interface ErrorPasswordValidatorRequired {
  minLenght: boolean;
  uppercase: boolean;
  lowercase: boolean;
  numeric: boolean;
  specialCharacter: boolean;

}


@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent implements OnInit, OnChanges {

  @Input() Password: string;
  @Input() MinLength: number = 10;
  @Input() PasswordValidatorRequired: OptionalAll<PasswordValidatorRequired>;

  public ErrorPasswordValidatorRequired: OptionalAll<ErrorPasswordValidatorRequired> = {
    minLenght: false,
    uppercase: false,
    lowercase: false,
    numeric: false,
    specialCharacter: false
  }

  constructor( ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.initValidators(this.Password);
  }

  ngOnInit(): void {
  }

  initValidators(password: string) {
    Object.keys(this.ErrorPasswordValidatorRequired).forEach(key => {
      this.ErrorPasswordValidatorRequired[key] = false;
    })

    if (this.PasswordValidatorRequired.minLenght && CustomValidators.HasErrorPasswordValidatorLength(this.MinLength, password)) {
      this.ErrorPasswordValidatorRequired.minLenght = true;
    }
    if (this.PasswordValidatorRequired.uppercase && CustomValidators.HasErrorPasswordValidatorUpperCase(password)) {
      this.ErrorPasswordValidatorRequired.uppercase = true;
    }

    if (this.PasswordValidatorRequired.lowercase && CustomValidators.HasErrorPasswordValidatorLowerCase(password)) {
      this.ErrorPasswordValidatorRequired.lowercase = true;
    }

    if (this.PasswordValidatorRequired.numeric && CustomValidators.HasErrorPasswordValidatorNumeric(password)) {
      this.ErrorPasswordValidatorRequired.numeric = true;
    }

    if (this.PasswordValidatorRequired.specialCharacter && CustomValidators.HasErrorPasswordValidatorSpecialCharacters(password)) {
      this.ErrorPasswordValidatorRequired.specialCharacter = true;
    }

  }


}
