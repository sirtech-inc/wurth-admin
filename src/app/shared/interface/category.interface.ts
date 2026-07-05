// import { Images } from "./images.interface";
import { PaginateModel } from "./core.interface";
import { Images } from "./file-image.interface";
import {CustomeFormControl, OptionalAll} from "@shared/types/util.types";

// import { TypeEcommerce } from "@shared/types/util.types";

// export interface CategoryModel extends PaginateModel {
//     data: Category[];
// }

export interface CategoryModel extends OptionalAll<PaginateModel> {
    datos: Category[];
}

export interface CategoriesData {
    datos: Category[];
    count: number;
}

export interface Category {
    code: number;
    date_create: string;
    date_update: string;
    description: string;
    ecommerce: string;
    fk_imagen_icon: number;
    fk_imagen_image: number;
    images?: Images[];
    module: string;
    name: string;
    parent: number;
    parent_id: number;
    priority: number;
    slug: string;
    status: string;
    subcategories: Category[];
}

export type CategoryForm = CustomeFormControl<OptionalAll<Category>>