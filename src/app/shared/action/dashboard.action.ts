import { Params } from "@shared/interface";

export class GetDashboard {
    static readonly type = "[Dashboard] Get";
    constructor(public payload?: Params) { }
}