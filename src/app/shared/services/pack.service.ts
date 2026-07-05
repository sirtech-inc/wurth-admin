import { IResponseResult, IResponseStructure, Params, ResponseModel } from '@shared/interface';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Pack, PacksData } from '@shared/interface/pack.interface';

import { ApiCoreService } from '@shared/providers/engine/api-core.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OptionalAll } from '@shared/types/util.types';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class PackService {

  constructor(
    private apiCoreService: ApiCoreService,
    private http: HttpClient
  ) { }

  getPacks(payload?: Params): Observable<ResponseModel<PacksData>> {
    const api = `${environment.API_URL}/Pack/ListadoGeneral`;
    return this.apiCoreService.get<ResponseModel<PacksData>>(
      api,
      this.apiCoreService.httpParams(payload),
      this.apiCoreService.httpHeader()
    ).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<PacksData> = {
          datos: response?.datos as PacksData ?? null,
          result: response?.result as IResponseResult ?? null
        }
        return responseApi
      }), catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    )
  }

  createPack(payload: OptionalAll<Pack>): Observable<ResponseModel<Pack>> {
    const api = `${environment.API_URL}/Pack`;
    return this.apiCoreService.post<OptionalAll<Pack>>(
      api,
      payload
    ).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<Pack> = {
          datos: response?.datos as Pack ?? null,
          result: response?.result as IResponseResult ?? null
        }
        return responseApi
      }), catchError((error: any) => {
        return throwError(() => error)
      })
    )

  }

  editPack(id: number): Observable<ResponseModel<Pack>> {
    const api = `${environment.API_URL}/Pack/${id}`;
    return this.apiCoreService.get<ResponseModel<Pack>>(
      api,
      this.apiCoreService.httpParams(),
      this.apiCoreService.httpHeader()
    ).pipe(
      map((response: IResponseStructure) => {

        const responseApi: ResponseModel<Pack> = {
          datos: response?.datos as Pack ?? null,
          result: response?.result as IResponseResult ?? null
        }

        return responseApi
      }), catchError((error: any) => {
        return throwError(() => error)
      })
    )
  }

  updatePack(payload: OptionalAll<Pack>, id: number): Observable<ResponseModel<Pack>> {
    const api = `${environment.API_URL}/Pack/${id}`;
    return this.apiCoreService.put<OptionalAll<Pack>>(
      api,
      payload
    ).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<Pack> = {
          datos: response?.datos as Pack ?? null,
          result: response?.result as IResponseResult ?? null
        }
        return responseApi
      }), catchError((error: HttpErrorResponse) => {
        return throwError(() => error)
      })
    )
  }

  deletePack(id: number): Observable<any> {
    return this.http.delete(`${environment.API_URL}/Pack/${id}`);
  }

}
