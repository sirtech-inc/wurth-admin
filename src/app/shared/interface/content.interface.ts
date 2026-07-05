import { CustomeFormControl, OptionalAll } from "@shared/types/util.types";

import { PaginateModel } from "@shared/interface/core.interface";

export interface ContentMenuModel extends PaginateModel {
    datos: ContentMenu[]
}

export interface ContentMenusData {
    datos: ContentMenu[];
    count: number;
}

export interface ContentMenu {
    code: number
    ecommerce: string
    name: string
    position: string
    parent: number
    check_external_link: string
    fk_content: number
    link_external: string
    reference: string
    status: string

    parent_id: number
    submenus: OptionalAll<ContentMenu>[]
}

export type ContentMenuForm = CustomeFormControl<OptionalAll<ContentMenu>>

export interface ContentPage {
    code: number
    title: string
}
export interface ContentPageData {
    datos: OptionalAll<ContentPage>[]
}