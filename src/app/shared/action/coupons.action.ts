import { Coupon } from "@shared/interface/coupon.interface";
import { OptionalAll } from "@shared/types/util.types";
import { Params } from "@shared/interface";

export class GetCoupon {
    static readonly type = "[Coupon] Get";
    constructor(public payload?: Params) { }
}


export class EditCoupon {
    static readonly type = "[Coupon] Edit";
    constructor(public payload: number) { }
}

export class CreateCoupon {
    static readonly type = "[Coupon] Create";
    constructor(public payload: OptionalAll<Coupon>) { }
}

export class UpdateCoupon {
    static readonly type = "[Coupon] Update";
    constructor(public payload: OptionalAll<Coupon>, public id: number) { }
}