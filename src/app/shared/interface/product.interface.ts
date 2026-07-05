import { CustomeFormControl, OptionalAll, StrictPartialUsed, TypeStatus } from "../types/util.types";

import { Attachment } from "./attachment.interface";
import { PaginateModel } from "./core.interface";
import { Option } from "@angular/cli/src/command-builder/utilities/json-schema";

export interface ProductModel extends PaginateModel {
    datos: Product[];
}

export interface ProductsData {
    datos: Product[];
    count: number;
}

export interface Product {
    code: number
    ecommerce: string | number | number[] | string[]
    name: string
    reference: string
    short_description: string
    description: string

    tag: number[]
    category: number[]
    package: number[] | string
    related_random: TypeStatus
    related_products: OptionalAll<Product[]> | number[]
    related_products_id: number[]

    cross_sell_products: OptionalAll<Product[]> | number[]
    cross_sell_products_id: number[]


    url_youtube: string

    seo_title: string
    seo_description: string

    images: Attachment[] | number[],
    images_id: number[],

    image_meta: Attachment | number
    image_meta_id: number

    status_offer: TypeStatus
    status_featured: TypeStatus
    //status_social: TypeStatus
    status_trending: TypeStatus
    status: TypeStatus

    attachment: Attachment[] | number[],
    attachment_id: number[]
    //attachment: number[]
    attachment_response: Attachment[]


    date_create: string
    date_update: string
}

export type ProductForm = CustomeFormControl<StrictPartialUsed<Product,
    'ecommerce' | 'name' | 'reference' | 'category' | 'package'
>>


export interface ProductDataSelect {
    datos: ProductToSelect[];
}

export interface ProductToSelect {
    code: number;
    name: string;
    reference: string;
    status: TypeStatus
}