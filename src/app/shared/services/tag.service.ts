import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { IResponseResult, IResponseStructure, ResponseModel } from "@shared/interface";
import { Observable, catchError, map, of, throwError } from "rxjs";
import { Tag, TagData, TagDataSelect, TagModel } from "../interface/tag.interface";

import { ApiCoreService } from "@shared/providers/engine/api-core.service";
import { Injectable } from "@angular/core";
import { Params } from "../interface/core.interface";
import { RolesData } from "@shared/interface/role.interface";
import { StrictPartial } from "@shared/types/util.types";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class TagService {

  constructor(
    private apiCoreService: ApiCoreService
  ) { }

  getTags(payload?: Params): Observable<ResponseModel<TagData>> {
    const api = `${environment.API_URL}/Tag/ListadoGeneral`
    return this.apiCoreService.get<ResponseModel<RolesData>>(
      api,
      this.apiCoreService.httpParams(payload),
      this.apiCoreService.httpHeader()
    ).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<TagData> = {
          datos: response?.datos as TagData ?? null,
          result: response?.result as IResponseResult ?? null
        }
        return responseApi
      })
    )
  }

  createTag(
    payload: StrictPartial<Tag, "date_created" | "code">
  ): Observable<ResponseModel<Tag>> {
    return this.apiCoreService
      .post(`${environment.API_URL}/Tag`, payload)
      .pipe(
        map((response: IResponseStructure) => {
          const responseApi: ResponseModel<Tag> = {
            datos: (response?.datos as Tag) ?? null,
            result: (response?.result as IResponseResult) ?? null,
          };
          return responseApi;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  getTagById(id: number): Observable<ResponseModel<Tag>> {
    const api = `${environment.API_URL}/Tag/${id}`
    return this.apiCoreService.get(
      api,
      this.apiCoreService.httpParams(),
      this.apiCoreService.httpHeader()
    )
      .pipe(
        map((response: IResponseStructure) => {
          const responseApi: ResponseModel<Tag> = {
            datos: (response?.datos as Tag) ?? null,
            result: (response?.result as IResponseResult) ?? null,
          };
          return responseApi;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );
  }

  updateTag(
    payload: StrictPartial<Tag, "date_created" | "code">,
    id: number
  ) {
    return this.apiCoreService
      .put(`${environment.API_URL}/Tag/${id}`, payload)
      .pipe(
        map((response: IResponseStructure) => {
          const responseApi: ResponseModel<Tag> = {
            datos: (response?.datos as Tag) ?? null,
            result: (response?.result as IResponseResult) ?? null,
          };
          return responseApi;
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        })
      );

  }

  getTagsToSelect(): Observable<ResponseModel<TagDataSelect>> {
    return this.apiCoreService.get<TagDataSelect>(
      `${environment.API_URL}/Tag/SelectList`,
      this.apiCoreService.httpParams(),
      this.apiCoreService.httpHeader()
    ).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<TagDataSelect> = {
          datos: response?.datos as TagDataSelect ?? null,
          result: response?.result as IResponseResult ?? null
        }
        return responseApi
      })
    )
  }


}
