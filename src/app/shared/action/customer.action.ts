import { Params } from "@angular/router";
import { Customer } from "../interface";
import { OptionalAll } from "@shared/types/util.types";

export class GetCustomers {
    static readonly type = "[Customer] Get";
    constructor(public payload?: Params) { }
}

export class CreateCustomer {
    static readonly type = "[Customer] Create";
    constructor(public payload: OptionalAll<Customer>) { }
}

export class EditCustomer {
    static readonly type = "[Customer] Edit";
    constructor(public id: number) { }
}

export class UpdateCustomer {
    static readonly type = "[Customer] Update";
    constructor(public payload: OptionalAll<Customer>, public id: number) { }
}

// export class UpdateCustomerStatus {
//     static readonly type = "[Customer] Update Status";
//     constructor(public id: number, public status: boolean) { }
// }

// export class DeleteCustomer {
//     static readonly type = "[Customer] Delete";
//     constructor(public id: number) { }
// }

// export class DeleteAllCustomer {
//     static readonly type = "[Customer] Delete All";
//     constructor(public ids: number[]) { }
// }
