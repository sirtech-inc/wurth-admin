import { AbstractControl, ValidationErrors } from "@angular/forms";

export class FormValidator {

    static PackingValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        let packingArray: string[] = value.split(',');
        let isValid = true;
        isValid = packingArray.every(element => !isNaN(Number(element)) && Number(element) > 0 && Number.isInteger(Number(element)));
        return isValid ? null : { invalidPacking: true };
    }

    static AmountValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        let isValid = !isNaN(Number(value)) && Number(value) > 0 && /^-?\d+(\.\d{1,2})?$/.test(value);
        return isValid ? null : { invalidAmount: true };
    }

    static PositiveIntegerValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        let isValid = !isNaN(Number(value)) && Number(value) >= 0 && Number.isInteger(Number(value));
        return isValid ? null : { invalidNumber: true };
    }

    // validar una cantidad  minimo , debe ser mayor a 0. No debe aceptar valores negativos.Solo valores enteros
    static MinQuantityValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        let isValid = !isNaN(Number(value)) && Number(value) > 0 && Number.isInteger(Number(value));
        return isValid ? null : { invalidQuantity: true };
    }

    static DiscountValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) return null;
        let isValid = !isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 99.99 && /^-?\d+(\.\d{1,2})?$/.test(value);
        return isValid ? null : { invalidDiscount: true };
    }

    // Requiere que se seleccione al menos una accion: envio gratis o aplicar descuento
    static ActionsRequiredValidator(group: AbstractControl): ValidationErrors | null {
        const freeShipping = group.get('free_shipping')?.value;
        const applyDiscount = group.get('apply_discount')?.value;
        const hasFreeShipping = freeShipping === true || freeShipping === 1;
        const hasApplyDiscount = applyDiscount !== null && applyDiscount !== undefined && applyDiscount !== '' && Number(applyDiscount) > 0;
        return hasFreeShipping || hasApplyDiscount ? null : { actionsRequired: true };
    }


}