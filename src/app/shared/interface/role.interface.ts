import { PaginateModel } from "./core.interface";

export interface RoleModel extends PaginateModel {
    datos: Role[];
}

export interface RolesDataSelect{
    datos : RoleToSelect[];
}
export interface RolesData {
    datos: Role[];
    count: number;
}

export interface RolePermission {
    rol : Role;
    permission: Permission[]; 
}

// export interface RolePermissionModel extends RolePermission{ }

export interface Role {
    code: number;
    name: string;
    status: string;
    date_create: string;
    date_update: string;
}
export interface RoleToSelect {
    code: number;
    name: string;
}




export interface Permission {
    code: number;
    fk_role: number;
    fk_module: number;
    name: string;
    view: string;
    edit: string;
    create: string;
    delete: string;
}