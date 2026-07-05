import { CustomeFormControl, OptionalAll } from "@shared/types/util.types";

import { PaginateModel } from "./core.interface";

export interface UserModel extends PaginateModel {
    datos: User[];
}

export interface UsersData {
    datos: User[];
    count: number;
}

export interface User {
    code: number
    name: string
    lastname: string
    email: string
    phone: string
    status: string | boolean | number
    password: string
    password_confirmation: string
    fk_role: number
    ecommerce: string[]
    date_create: string
    date_update: string
    document_number?: string
}

export type UserForm = CustomeFormControl<OptionalAll<User>>