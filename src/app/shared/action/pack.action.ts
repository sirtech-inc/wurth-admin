import { OptionalAll } from "@shared/types/util.types";
import { Pack } from "@shared/interface/pack.interface";
import { Params } from "@shared/interface";

export class GetPacks{
    static readonly type = "[Pack] Get";
    constructor(public payload?: Params) {}
}

export class EditPack {
    static readonly type = "[Pack] Edit";
    constructor(public payload: number) { }
}

export class CreatePack{
    static readonly type = "[Pack] Create";
    constructor(public payload: OptionalAll<Pack>) { }
}

export class UpdatePack {
    static readonly type = "[Pack] Update";
    constructor(public payload: OptionalAll<Pack>, public id: number) {}
  } 