import { Ads, AdsData, AdsPosition, AdsPositionModel, AdsPositionResponseOrList, DesignData } from '@shared/interface/ads.interface';
import { IResponseResult, IResponseStructure, ResponseModel } from '@shared/interface';
import { Observable, catchError, map, of, throwError } from 'rxjs';

import { ApiCoreService } from '@shared/providers/engine/api-core.service';
import { Injectable } from '@angular/core';
import { OptionalAll } from '@shared/types/util.types';
import { Params } from "../interface/core.interface";
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  constructor(
    private apiCoreService: ApiCoreService,
    private http: HttpClient
  ) { }

  getAds(payload: Params): Observable<ResponseModel<AdsData>> {
    const api = `${environment.API_URL}/Banner/ListadoGeneral`;
    return this.apiCoreService.get
      <ResponseModel<AdsData>>
      (
        api,
        this.apiCoreService.httpParams(payload),
        this.apiCoreService.httpHeader()
      ).pipe(
        map((response: IResponseStructure) => {
          const responseApi: ResponseModel<AdsData> = {
            datos: (response?.datos as AdsData) ?? null,
            result: (response?.result as IResponseResult) ?? null
          }
          return responseApi
      })
    )
  }


  getBannerById(payload: number): Observable<ResponseModel<Ads>> {
    return this.apiCoreService.
      get<ResponseModel<Ads>>(
        `${environment.API_URL}/Banner/${payload}`,
        this.apiCoreService.httpParams(),
        this.apiCoreService.httpHeader()
      ).pipe(
        map((response: IResponseStructure) => {
          const responseApi: ResponseModel<Ads> = {
            datos: (response?.datos as Ads) ?? null,
            result: (response?.result as IResponseResult) ?? null,
          };
          return responseApi;
        })
      )
  }

  createBanner(payload: OptionalAll<Ads>) {
    const api = `${environment.API_URL}/Banner`;
    return this.apiCoreService.post(api, payload).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<Ads> = {
          datos: (response?.datos as Ads) ?? null,
          result: (response?.result as IResponseResult) ?? null,
        };
        return responseApi;
      }), catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  updateBanner(id: number, payload: OptionalAll<Ads>) {
    const api = `${environment.API_URL}/Banner/${id}`;
    return this.apiCoreService.put(api, payload).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<Ads> = {
          datos: (response?.datos as Ads) ?? null,
          result: (response?.result as IResponseResult) ?? null,
        };
        return responseApi;
      }), catchError((error) => {
        return throwError(() => error);
      })
    )
  }

  getDesign(payload: Params) {
    const api = `${environment.API_URL}/Banner/ListadoDesing`;
    return this.apiCoreService.get
      <ResponseModel<DesignData>>
      (
        api,
        this.apiCoreService.httpParams(payload),
        this.apiCoreService.httpHeader()
      ).pipe(
        map((response: IResponseStructure) => {
          const responseApi: ResponseModel<DesignData> = {
            datos: response?.datos as DesignData ?? null,
            result: response?.result as IResponseResult ?? null
          }
          return responseApi
        })
      )
  }

  createBannerPosition(data: OptionalAll<AdsPosition>[]) {

    if (!data) {
      return of();
    }

    const api = `${environment.API_URL}/BannerPosition`;
    return this.apiCoreService.post(api, data).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<AdsPositionResponseOrList[]> = {
          datos: (response?.datos as AdsPositionResponseOrList[]) ?? null,
          result: (response?.result as IResponseResult) ?? null,
        };
        return responseApi;
      })
    )
  }

  updateBannerPosition(data: OptionalAll<AdsPosition>[]) {
    if (!data) {
      return of();
    }
    const api = `${environment.API_URL}/BannerPosition`;
    return this.apiCoreService.put(api, data).pipe(
      map((response: IResponseStructure) => {
        const responseApi: ResponseModel<AdsPositionResponseOrList[]> = {
          datos: (response?.datos as AdsPositionResponseOrList[]) ?? null,
          result: (response?.result as IResponseResult) ?? null,
        };
        return responseApi;
      })
    )
  }

  getBannerPosition(fk_banner: number) {
    const api = `${environment.API_URL}/BannerPosition/ListadoGeneral/${fk_banner}`;
    return this.apiCoreService.get
      <ResponseModel<AdsPositionModel>>
      (
        api,
        this.apiCoreService.httpParams(),
        this.apiCoreService.httpHeader()
      ).pipe(
        map((response: IResponseStructure) => {
          const responseApi: ResponseModel<AdsPositionModel> = {
            datos: (response?.datos as AdsPositionModel) ?? null,
            result: (response?.result as IResponseResult) ?? null
          }
          return responseApi
        })
      )
  }
  deleteBannerPosition(code: number): Observable<any> {
    return this.http.delete(`${environment.API_URL}/BannerPosition/${code}`);
  }

  deleteBanner(code: number): Observable<boolean> {
    return this.http.delete<boolean>(`${environment.API_URL}/Banner/${code}`);
  }

  bannerValid(type: string): Observable<number> {
    return this.http.get<number>(`${environment.API_URL}/Banner/type/${type}`);
  }



}
