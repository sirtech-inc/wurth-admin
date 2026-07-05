import {Category} from "../interface/category.interface";
import {Params} from "../interface/core.interface";

export class GetCategories {
    static readonly type = "[Category] Get";

    constructor(public payload?: Params) {
    }
}

export class GetCategoriesByEcommerce {
    static readonly type = "[Category] GetByEcommerce";

    constructor(public ecommerce: string, public payload?: string) {}

}


export class SaveCategory {
    static readonly type = "[Category] Save";

    constructor(
        public payload: Category,
    ) {
    }
}

/*
export class CreateCategory {
    static readonly type = "[Category] Create";

    constructor(public payload: Category) {
    }
}
export class UpdateCategory {
    static readonly type = "[Category] Update";

    constructor(public payload: Category, public id: number, public ecommerce: string) {
    }
}
*/

export class EditCategory {
    static readonly type = "[Category] Edit";

    constructor(public id: number) {
    }
}


export class ResetCategory {
    static readonly type = "[Category] Reset";

    constructor() {
    }
}


export class CategoryTree {
    static readonly type = "[Category] Tree";

    constructor() {
    }
}

export class SetEcommerce {
    static readonly type = "[Category] SetEcommerce";
    constructor(public ecommerce: string) {
    }
}