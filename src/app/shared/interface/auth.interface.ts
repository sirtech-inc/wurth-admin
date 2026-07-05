import { Response } from "./interfaces.interface";

export interface AuthUserStateModel {
    email: string;
    password: string;
}

export interface AuthStateModel {
    email: string;
    token: string;
    name : string;
}

export interface AuthResponse extends Response<AuthStateModel> {
    ok : boolean;
    message : string;
    data : AuthStateModel
}


export interface UserLogin {
  code: number;
  name: string;
  ecommerce: string[];
  lastname: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  date_create: string;
}

export interface Result {
  title: string;
  status: number;
  detail: string;
  errors: string;
}

export interface UserResponse {
  user: UserLogin;
  token: string;
  result: Result;
}


//   export interface AuthUserForgotModel {
//     email: string;
//   }
  
//   export interface VerifyEmailOtpModel {
//     email: string;
//     token: number;
//   }
  
//   export interface UpdatePasswordModel {
//     password: string;
//     password_confirmation: string;
//     email: string;
//     token: number;
//   }
  