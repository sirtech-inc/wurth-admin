import {OptionalAll} from "@shared/types/util.types";
import {Params} from "@shared/interface";
import {Product} from "@shared/interface";

// import { StrictPartial } from "../interface/util.interface";

export class GetProducts {
    static readonly type = "[Product] Get";

    constructor(public payload?: Params) {
    }
}


export class GetProductsToSelect {
    static readonly type = "[Product] Get To Select";

    constructor(public payload?: string) {
    }
}

/*
export class CreateProduct {
  static readonly type = "[Product] Create";
  constructor(public payload: OptionalAll<Product>) {}
}
export class UpdateProduct {
  static readonly type = "[Product] Update";
  constructor(public payload: OptionalAll<Product>, public id: number) {}
}
*/

export class SaveProduct {
    static readonly type = "[Product] Save";

    constructor(public payload: OptionalAll<Product>) {
    }
}

export class EditProduct {
    static readonly type = "[Product] Edit";

    constructor(public payload: number) {
    }
}


export class ResetProduct {
    static readonly type = "[Product] Reset";

    constructor() {
    }
}