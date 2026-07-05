import { CustomeFormControl, OptionalAll } from "@shared/types/util.types";

import { PaginateModel } from "./core.interface";

export interface CouponModel extends PaginateModel {
    datos: Coupon[];
}

export interface CouponData {
    datos: Coupon[];
    count: number;
}

export interface Coupon {
    code: number
    name: string
    ecommerce: string[]
    description: string
    reference: string
    status: string | number | boolean

    customer_type: string
    division: string[]
    availability_start: string
    availability_end: string
    minimum_amount: number
    tax_included: string | number | boolean
    shipping_included: string | number | boolean
    available_per_user: number
    quantity_available: number

    free_shipping: string | number | boolean
    apply_discount : string | number
    discount: number
    amount: number
    amount_tax_included: string | number | boolean
    order_or_product: string | number
    fk_product: number
    date_create : string
}

export type CouponForm = CustomeFormControl<OptionalAll<Coupon>>