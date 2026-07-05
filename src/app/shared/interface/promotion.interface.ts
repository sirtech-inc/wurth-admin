import { CustomeFormControl, CustomeFormControlArray, OptionalAll } from "@shared/types/util.types";

import { PaginateModel } from "./core.interface";

export interface PromotionModel extends PaginateModel {
    datos: Promotion[];
}

export interface PromotionData {
    datos: Promotion[];
    count: number;
}

export interface Promotion {
    code: number
    //ecommerce: string[]
    ecommerce:string
    reference: string
    type: string | number
    type_division: string[]
    availability_start: string
    availability_end: string
    condition_promotion: number | string
    new_customer: string | boolean | number
    status: string | boolean | number
    amount: number
    products: OptionalAll<PrepareOption>[]
    date_created: string
    date_updated: string
}



export type PromotionForm = CustomeFormControlArray<OptionalAll<Promotion>, 'products'>
export type PromotionProductForm = CustomeFormControl<OptionalAll<PrepareOption>>

export interface PromotionByFinalPrice {
    code: number
    fk_code: number
    fk_product: number
    fk_promotion: number
    minimum_quantity: number
    discount: number
}

export interface PromotionByScale {
    code: number
    fk_code: number
    fk_product: number
    fk_promotion: number
    minimum_quantity: number
    maximum_quantity: number
    discount: number
}

export interface PromotionByBonusGiftAmount {
    code: number
    fk_code: number
    fk_product: number
    fk_promotion: number
    amount: number
}

export interface PrepareOption {
    item: number
    code: number
    name: string
    reference: string
    quantity_min: number
    quantity_max: number
    quantity: number
    discount: number
    amount : number
    fk_product: number
}

export interface PrepareItemPostResponse {
    fk_code: number
    code: number
    fk_promotion: number
    fk_product: number
    minimum_quantity: number
    maximum_quantity: number
    quantity: number
    discount: number
    amount: number
    name: string
    reference: string
}