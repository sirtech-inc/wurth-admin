import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { IResponseResult, IResponseStructure, ResponseModel } from "@shared/interface";
import { Observable, catchError, map, of, throwError } from "rxjs";
import { RolePermission, RolesData, RolesDataSelect } from "@shared/interface/role.interface";

import { ApiCoreService } from "@shared/providers/engine/api-core.service";
import { Injectable } from "@angular/core";
import { Params } from "../interface/core.interface";
import { environment } from "../../../environments/environment";

// import { Role, RoleModel, Module, RolesData, RoleToSelect, RolesDataSelect } from "../interface/role.interface";




@Injectable({
  providedIn: "root",
})
export class RoleService {

  constructor(
    private apiCoreService: ApiCoreService
  ) { }


  getRoles(payload?: Params): Observable<ResponseModel<RolesData>> {
    const api = `${environment.API_URL}/Rol/ListadoGeneral`
    return this.apiCoreService.get<ResponseModel<RolesData>>(
      api,
      this.apiCoreService.httpParams(payload),
      this.apiCoreService.httpHeader()
    ).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<RolesData> = {
          datos: response?.datos as RolesData ?? null,
          result: response?.result as IResponseResult ?? null
        }
        return responseApi
      })
    )
  }

  getRolesToSelect(): Observable<ResponseModel<RolesDataSelect>> {
    return this.apiCoreService.get<RolesDataSelect>(
      `${environment.API_URL}/Rol/SelectList`,
      this.apiCoreService.httpParams(),
      this.apiCoreService.httpHeader()
    ).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<RolesDataSelect> = {
          datos: response?.datos as RolesDataSelect ?? null,
          result: response?.result as IResponseResult ?? null
        }
        return responseApi
      })
    )
  }

  getRoleById(payload: number): Observable<ResponseModel<RolePermission>> {
    return this.apiCoreService.get<RolePermission>(
      `${environment.API_URL}/Rol/${payload}`,
      this.apiCoreService.httpParams(),
      this.apiCoreService.httpHeader()
    ).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<RolePermission> = {
          datos: response?.datos as RolePermission ?? null,
          result: response?.result as IResponseResult ?? null
        }
        return responseApi
      })
    )
  }

  createRole(payload: RolePermission): Observable<ResponseModel<RolePermission>> {
    return this.apiCoreService.post<RolePermission>(
      `${environment.API_URL}/Rol`,
      payload,
      this.apiCoreService.httpHeader()
    ).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<RolePermission> = {
          datos: response?.datos as RolePermission ?? null,
          result: response?.result as IResponseResult ?? null
        }
        return responseApi
      }),catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    )
  }

  updateRole(id: number, payload: RolePermission): Observable<ResponseModel<RolePermission>> {
    return this.apiCoreService.put<RolePermission>(
      `${environment.API_URL}/Rol/${id}`,
      payload,
      this.apiCoreService.httpHeader()
    ).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<RolePermission> = {
          datos: response?.datos as RolePermission ?? null,
          result: response?.result as IResponseResult ?? null
        }
        return responseApi
      }),catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    )
  }


}
