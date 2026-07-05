import { ContentMenu } from "@shared/interface/content.interface";
import { OptionalAll } from "@shared/types/util.types";

export class GetContentMenu {
    static readonly type = '[Menu] Get Content Menu';
    constructor(
        public ecommerce: string
    ) { }
}

export class GetContentPageMenu {
    static readonly type = '[Menu] Get Content Page Menu';
    constructor(
        public ecommerce: string
    ) { }

}

export class SetEcommerceMenu {
    static readonly type = '[Menu] Set Ecommerce Menu';
    constructor(
        public ecommerce: string
    ) { }
}

export class CreateUpdateContentMenu {
    static readonly type = '[Menu] Create Update Content Menu';
    constructor(
        public payload: OptionalAll<ContentMenu>
    ) { }
}

export class EdithContentMenu {
    static readonly type = '[Menu] Edith Content Menu';
    constructor(
        public payload: number
    ) { }
}

export class GetContentPageSelect {
    static readonly type = '[Menu] Get Content Page Select';
    constructor(
        public payload: string
    ) { }
}