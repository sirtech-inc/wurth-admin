import { CustomeFormControl, CustomeFormControlArray, OptionalAll } from "@shared/types/util.types";

import { Attachment } from "./attachment.interface";
import { PaginateModel } from "./core.interface";

export interface PackModel extends PaginateModel {
    datos: Pack[];
}
export interface PacksData {
    datos: Pack[];
    count: number;
}

export interface Pack {
    code: number
    name: string
    reference: string
    ecommerce: string[]
    price: number
    stock: number
    // products : FormArray<OptionalAll<PackProduct>[]>
    //OptionalAll<PackProduct>[]
    product: PackProduct[]
    image: number[]
    images: Attachment[]
    status: string | boolean | number
    date_create: string
    date_update: string
}


export type PackForm = CustomeFormControlArray<OptionalAll<Pack>, 'product'>
// export type PackForm = CustomeFormControl<OptionalAll<Pack>>
export type PackProducForm = CustomeFormControl<OptionalAll<PackProduct>>

export interface PackProduct {
    item: number
    code: number
    fk_pack: number
    fk_product: number
    name : string
    reference : string
    quantity: number
    discount: number
    delete: number
    date_create: string
    date_update: string
}