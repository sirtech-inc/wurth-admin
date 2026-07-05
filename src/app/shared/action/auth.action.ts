// import { AuthLogin } from "../interface/auth.interface";

import { AuthUserStateModel } from "../interface/auth.interface";

// 
export class Login{
    static readonly type = '[Auth] Login';
    constructor(public payload: AuthUserStateModel) {}
}

export class Logout{
    static readonly type = '[Auth] Logout';
    constructor() {}
}

export class AuthClear {
    static readonly type = "[Auth] Clear";
  }
  
  