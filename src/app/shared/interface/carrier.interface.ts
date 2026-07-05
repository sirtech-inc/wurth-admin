import {PaginateModel} from "@shared/interface/core.interface";
import {Attachment} from "@shared/interface/attachment.interface";
import {FormArray, FormGroup} from "@angular/forms";
import {OptionalAll} from "@shared/types/util.types";

export interface CarrierModel extends PaginateModel {
    datos: Carrier[];
}

export interface CarrierData {
    datos: Carrier[];
    count: number;
}

export interface CarrierResponse {
    carrier: Carrier
    department: CarrierDepartment[]
    location: CarrierLocation
    range: CarrierRange[]
    department_cost: CarrierRangeDepartmentCost[]
}

export interface CarrierDepartmentsData {
    datos: CarrierDepartments[];
}

export interface Carrier {
    code: number
    name: string
    description: string
    image: number
    images: Attachment
    date_create: string
    status: string | boolean | number
    carrier_range: number[]
}

export interface CarrierLocation {
    code: number
    fk_carrier: number
    free_shipping: boolean | number | string
    tax_included: boolean | number | string
}

export interface CarrierRange {
    code: number
    fk_carrier: number
    range_min: number
    range_max: number
}

export interface CarrierDepartment {
    code: number
    fk_carrier: number
    fk_department: number
    department: string
    active: boolean | number | string
}

export interface CarrierRangeDepartmentCost {
    code: number
    fk_carrier_range: number
    fk_carrier_department: number
    shipping_cost: number
}

export interface GroupCarrierForm {
    carrier: FormGroup
    location: FormGroup
    range: FormArray
    department: FormArray
}

export interface CarrierValuesPost {
    carrier: OptionalAll<Carrier>
    location: OptionalAll<CarrierLocation>
    range: OptionalAll<CarrierFormatRange>[]
}

export interface CarrierFormatRange {
    range: OptionalAll<CarrierRange>
    department: OptionalAll<CarrierFormatDepartment>[]
}

export interface CarrierFormatDepartment {
    department: OptionalAll<CarrierDepartment>
    cost: OptionalAll<CarrierRangeDepartmentCost>
}

export interface CarrierDepartments {
    code: number
    code_mspa: string
    name: string
}

