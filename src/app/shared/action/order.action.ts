import { Params } from "../interface/core.interface";

export class GetOrders {
  static readonly type = "[Order] Get";
  constructor(public payload?: Params) {}
}