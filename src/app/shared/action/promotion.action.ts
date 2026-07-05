import { Params, PrepareOption, Promotion } from "@shared/interface";

import { OptionalAll } from "@shared/types/util.types";

export class GetPromotion {
    static readonly type = "[Promotion] Get";
    constructor(public payload?: Params) { }
}

export class CreatePromotion {
    static readonly type = "[Promotion] Create";
    constructor(public payload: OptionalAll<Promotion>) { }
}
export class ResetPromotion {
    static readonly type = "[Promotion] Reset";
}
export class CreatePromotionScale {
    static readonly type = "[Promotion] Create Scale";
    constructor(public payload: {
        idPromotion: number,
        items: OptionalAll<PrepareOption>[]
    }) { }
}
export class CreatePromotionFinalPrice {
    static readonly type = "[Promotion] Create Final Price";
    constructor(
        public payload: {
            idPromotion: number,
            items: OptionalAll<PrepareOption>[]
        }
    ) { }
}
export class CreatePromotionBonusGiftAmount {
    static readonly type = "[Promotion] Create Bonus Gift Amount";
    constructor(
        public payload: {
            idPromotion: number,
            amount: number,
            items: OptionalAll<PrepareOption>[],

        }
    ) { }
}
export class CreatePromotionBonusGiftQuantity {
    static readonly type = "[Promotion] Create Bonus Gift Quantity";
    constructor(
        public payload: {
            idPromotion: number,
            items: OptionalAll<PrepareOption>[]
        }
    ) { }
}


export class EditPromotion {
    static readonly type = "[Promotion] Edit";
    constructor(public payload: number) { }
}

export class EditPromotionScale {
    static readonly type = "[Promotion] Edit Scale";
    constructor(public payload: number) { }
}
export class EditPromotionFinalPrice {
    static readonly type = "[Promotion] Edit Final Price";
    constructor(public payload: number) { }
}
export class EditPromotionBonusGiftAmount {
    static readonly type = "[Promotion] Edit Bonus Gift Amount";
    constructor(public payload: number) { }
}
export class EditPromotionBonusGiftQuantity {
    static readonly type = "[Promotion] Edit Bonus Gift Quantity";
    constructor(public payload: number) { }
}


export class UpdatePromotion {
    static readonly type = "[Promotion] Update";
    constructor(public payload: OptionalAll<Promotion>, public id: number) { }
}


export class ImportPromotion {
    static readonly type = "[Promotion] Import";
    constructor(
        public payload: {
            items: OptionalAll<Promotion>[],
            type: string,
            condition?: number
        }
    ) { }
}

export class ImportingPromotionScale {
    static readonly type = "[Promotion] Import Scale";
    constructor(public payload: boolean) { }
}
export class ImportingPromotionFinalPrice {
    static readonly type = "[Promotion] Import Final Price";
    constructor(public payload: boolean) { }
}
export class ImportingPromotionBonusGiftAmount {
    static readonly type = "[Promotion] Import Bonus Gift Amount";
    constructor(public payload: boolean) { }
}
export class ImportingPromotionBonusGiftQuantity {
    static readonly type = "[Promotion] Import Bonus Gift Quantity";
    constructor(public payload: boolean) { }
}

export class ImportCompleted{
    static readonly type = "[Promotion] Import Completed";
    constructor(public payload: boolean) { }
}

export class ResetImport {
    static readonly type = "[Promotion] Reset Import";
}