// import { Params } from "@angular/router";

import { Ads, AdsPosition } from "@shared/interface/ads.interface";
import { OptionalAll, StrictPartial } from "@shared/types/util.types";

import { Params } from "@shared/interface";

export class GetAds {
    static readonly type = "[Ads] Get";
    constructor(public payload?: Params) { }
}

export class CreateAds {
    static readonly type = "[Ads] Create";
    constructor(
        public payload: {
            ads: OptionalAll<Ads>,
            positions: OptionalAll<AdsPosition>[],
        }
    ) { }
}

export class EditAds {
    static readonly type = "[Ads] Edit";
    constructor(public payload: number) { }
}

export class UpdateAds {
    static readonly type = "[Ads] Update";
    constructor(
        public payload: {
            ads: OptionalAll<Ads>,
            positions: OptionalAll<AdsPosition>[],
        },
        public id: number
    ) { }
}

export class GetDesign {
    static readonly type = "[Design] Get";
    constructor(public payload: Params) { }
}

export class EditAdsPosition {
    static readonly type = "[Ads] Get Position";
    constructor(public payload: number) { }
}

export class ResetAds {
    static readonly type = "[Ads] Reset";
    constructor() { }
}