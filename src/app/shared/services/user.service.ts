import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import {
  IResponseResult,
  IResponseStructure,
  ResponseModel,
} from "@shared/interface";
import { Observable, catchError, map, of, tap, throwError } from "rxjs";
import { OptionalAll, StrictPartial } from "@shared/types/util.types";
import { User, UserModel, UsersData } from "../interface/user.interface";

import { ApiCoreService } from "@shared/providers/engine/api-core.service";
import { HideLoaderAction } from "@shared/action";
import { Injectable } from "@angular/core";
import { Params } from "../interface/core.interface";
import { Router } from "@angular/router";
import { Store } from "@ngxs/store";
import { environment } from "../../../environments/environment";

// import { User, UserAddress, UserModel } from "../interface/user.interface";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    private apiCoreService: ApiCoreService
  ) {}

  getUsers(payload: Params): Observable<ResponseModel<UsersData>> {
    const api = `${environment.API_URL}/User/ListadoGeneral`;
    return this.apiCoreService
      .get<ResponseModel<UsersData>>(
        api,
        this.apiCoreService.httpParams(payload),
        this.apiCoreService.httpHeader()
      )
      .pipe(
        map((response: IResponseStructure) => {
          const responseApi: ResponseModel<UsersData> = {
            datos: (response?.datos as UsersData) ?? null,
            result: (response?.result as IResponseResult) ?? null,
          };
          return responseApi;
        })
      );
  }

  getUserById(payload: number): Observable<ResponseModel<User>> {
    return this.apiCoreService
      .get<ResponseModel<User>>(
        `${environment.API_URL}/User/${payload}`,
        this.apiCoreService.httpParams(),
        this.apiCoreService.httpHeader()
      )
      .pipe(
        map((response: IResponseStructure) => {
          const responseApi: ResponseModel<User> = {
            datos: (response?.datos as User) ?? null,
            result: (response?.result as IResponseResult) ?? null,
          };
          return responseApi;
        })
      );
  }

  updateUser(
    id: number,
    payload: OptionalAll<User>
  ): Observable<ResponseModel<User>> {
    return this.apiCoreService
      .put(`${environment.API_URL}/User/${id}`, payload)
      .pipe(
        map((response: IResponseStructure) => {
          const responseApi: ResponseModel<User> = {
            datos: (response?.datos as User) ?? null,
            result: (response?.result as IResponseResult) ?? null,
          };
          return responseApi;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  createUser(
    payload: OptionalAll<User>
  ): Observable<ResponseModel<User>> {
    return this.apiCoreService
      .post(`${environment.API_URL}/User`, payload)
      .pipe(
        map((response: IResponseStructure) => {
          const responseApi: ResponseModel<User> = {
            datos: (response?.datos as User) ?? null,
            result: (response?.result as IResponseResult) ?? null,
          };
          return responseApi;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }
}
