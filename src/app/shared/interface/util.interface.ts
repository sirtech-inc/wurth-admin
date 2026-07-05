import { OptionalAll } from "@shared/types/util.types"

export interface IResponseResult {
    title: string
    status: number
    detail: string
    errors: string
}

export interface IResponseStructure {
    result: {}
    datos: {}
}
export interface ResponseModel<T> {
    datos: T,
    result: IResponseResult
}

export interface Select2DataFormat<T>{
    label : string,
    value : number,
    other : T
}
export interface AdvanceDropDownFormat<T>{
    code : number,
    name : string,
    other : T
}

export interface SimpleFormat{
    value: string
    description: string
}

export interface Select2Format{
    label: string
    value : number | string
}