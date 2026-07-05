import { SocialNetworks, CategoryModel, ValuesResponse } from '@shared/interface';
import {OptionalAll} from "@shared/types/util.types";

export class CreateUpdateSettingOption {
    static readonly type = "[Setting] Insert/Update";

    constructor(public payload: OptionalAll<ValuesResponse>) {
    }
}
export class ClearSetting {
    static readonly type = "[Setting] Clear";
}
export class ClearSocialNetworks {
    static readonly type = "[Setting] Clear Social Networks";
}
export class CreateUpdateSocialNetworks {
    static readonly type = "[Setting] Insert/Update Social Networks";

    constructor(
        public payload : {
            ecommerce: number,
            ecommerce_plain: string,
            socialNetworks: SocialNetworks[]
        }
    ) {
    }
}

export class GetSettingOption {
    static readonly type = "[Setting] Get";
}
export class GetSettingOptionByEcommerce {
    static readonly type = "[Setting] Get By Ecommerce";

    constructor(public ecommerce: string) {
    }
}
export class GetSocialNetworks {
    static readonly type = "[Setting] Get Social Networks";

    constructor(public payload: string) {
    }
}
export class GetCategoriesForSetting {
    static readonly type = "[Setting] Get Categories";
    constructor(public ecommerce:string) {}
}
export class GetSettingLinks {
    static readonly type = "[Setting] Get Links";
}
export class GetSettingContents{
    static readonly type = "[Setting] Get Contents";
    constructor(
        public ecommerce:string
    ) {}
}

export class GetSettingPolicies {
    static readonly type = "[Setting] Get Policies";
}
