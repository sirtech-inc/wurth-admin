import { OptionalAll } from "@shared/types/util.types";
import { Params } from "../interface/core.interface";
import { User } from "../interface/user.interface";

export class GetUsers {
  static readonly type = "[User] Get";
  constructor(public payload?: Params) {}
}

export class CreateUser {
  static readonly type = "[User] Create";
  constructor(public payload: OptionalAll<User>) {}
}

export class EditUser {
  static readonly type = "[User] Edit";
  constructor(public id: number) {}
}

export class UpdateUser {
  static readonly type = "[User] Update";
  constructor(public payload: OptionalAll<User>, public id: number) {}
}