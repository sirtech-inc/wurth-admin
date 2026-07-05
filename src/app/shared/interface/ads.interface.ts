import { CustomeFormControl, StrictPartialUsed } from '@shared/types/util.types';

import { PaginateModel } from "./core.interface";
import { Upload } from './file-image.interface';

// import { AdsPosition } from './ads.interface';



export interface AdsModel extends PaginateModel {
    datos: Ads[];
}

export interface AdsData {
    datos: Ads[];
    count: number;
}

export interface AdsPositionModel {
    datos : AdsPositionResponseOrList[]
}

export interface Ads {
    code: number
    name: string
    // ecommerce: number[] | string[] | string
    ecommerce : string[]
    type: string
    status: string | number | boolean
    fk_code_design: number
    date_create: string
    date_update: string
}

export type AdsForm = CustomeFormControl<StrictPartialUsed<Ads,
    'ecommerce' | 'name' | 'type' | 'status' | 'fk_code_design'
>>


export interface Design {
    code: number
    name: string
    file_name: string
    original_url: string
    position: string[]
}

export interface DesignData {
    datos: Design[];
}

export interface AdsPosition{
    imagen : string | File
    v_fk_banner : number
    v_position : string
    code : number
}
export interface AdsPositionResponseOrList extends Upload{
    code : number
    position : string
    fk_banner : number
}