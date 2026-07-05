import { PaginateModel } from "./core.interface";

export interface TagModel extends PaginateModel {
    datos: Tag[];
}

export interface TagData {
    datos: Tag[];
    count: number;
}

export interface Tag {
    code: number;
    name: string;
    uri_seo: string;
    status: string;
    description: string;
    date_created: string;
}

export interface TagDataSelect {
    datos: TagToSelect[];
}

export interface TagToSelect {
    code: number;
    name: string;
    selected : boolean;
}