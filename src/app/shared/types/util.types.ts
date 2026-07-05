import {FormArray, FormControl, FormGroup} from "@angular/forms";

export type CustomeFormControlArray<T, A extends keyof T = keyof T> = {
    [P in keyof T]: P extends A ? (T[P] extends any[] ? FormArray<FormControl<T[P][number]>> : never) : FormControl<T[P]>;
};

export type CustomeFormControl<T> = {
    [P in keyof T]: FormControl<T[P]>;
};

export type CustomeFormGroup<T> = {
    [P in keyof T]: FormGroup | FormArray;
};

/*
export type CustomeFormGroup<T, F extends keyof T = keyof T, A extends keyof T = never, C extends keyof T = never> = {
    [P in keyof T]: P extends F ? FormGroup : P extends A ? FormArray : P extends C ? FormControl<T[P]> : never;
};
*/

export type StrictPartial<T, K extends keyof T> = Partial<Pick<T, K>> & Required<Pick<T, Exclude<keyof T, K>>>;
export type StrictPartialUsed<T, K extends keyof T> = Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
export type OptionalAll<T> = { [K in keyof T]?: T[K]; };


// type Optional<T> = {
//     [K in keyof T]?: T[K];
// };
// type SameKeys<T> = Partial<T> & Required<Pick<T, keyof T>>;
// export type OptionalAll<T> = Optional<T> & SameKeys<T>;




export type Courtesy = 'Sr' | 'Sra' | 'Srta'

export type TypePersonCompany = 'company' | 'person'

export type TypeForm = 'create' | 'edit'

export type ContentType = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain' | 'text/html' | 'application/xml' | 'application/pdf'
export type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text'

export type TypeStatus = string | number | boolean
export type CategoryFeatureStyleType  = 'simple' | 'shopNow' | 'effect'

export type OrdenFormControl<T> = {
    [P in keyof T]: FormControl<T[P]>;
};
