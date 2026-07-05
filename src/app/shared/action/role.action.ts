import { Params } from "@shared/interface/core.interface";
import {RolePermission} from "@shared/interface/role.interface";

export class GetRoles {
    static readonly type = "[Role] Get";
    constructor(public payload?: Params) { }
}

export class GetRolesToSelect{
    static readonly type = "[Role] Get To Select";
    constructor() { }
}

export class EditRole {
    static readonly type = "[Role] Edit";
    constructor(public id: number) { }
}

export class CreateRole {
    static readonly type = "[Role] Create";
    constructor(public payload: RolePermission) { }
}

export class UpdateRole {
    static readonly type = "[Role] Update";
    constructor(public payload: RolePermission, public id: number) { }
}


/*
export class CreateRole {
    static readonly type = "[Role] Create";
    constructor(public payload: Role) { }
}



export class UpdateRole {
    static readonly type = "[Role] Update";
    constructor(public payload: Role, public id: number) { }
}*/

