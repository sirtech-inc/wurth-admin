import {Coupon, CouponData} from "@shared/interface/coupon.interface";
import {IResponseResult, IResponseStructure, Params, ResponseModel} from "@shared/interface";
import {Observable, catchError, map, throwError} from "rxjs";

import {ApiCoreService} from "@shared/providers/engine/api-core.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {OptionalAll} from "@shared/types/util.types";
import {environment} from "@env/environment";
import {Pack} from "@shared/interface/pack.interface";

@Injectable({
    providedIn: "root",
})
export class CouponService {
    constructor(
        private apiCoreService: ApiCoreService
    ) {
    }


    getCoupons(payload: Params): Observable<ResponseModel<CouponData>> {
        const api = `${environment.API_URL}/Coupon/ListadoGeneral`
        return this.apiCoreService.get<ResponseModel<CouponData>>(
            api,
            this.apiCoreService.httpParams(payload),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {

                const responseApi: ResponseModel<CouponData> = {
                    datos: response?.datos as CouponData ?? null,
                    result: response?.result as IResponseResult ?? null
                }

                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    createCoupon(payload: OptionalAll<Coupon>): Observable<ResponseModel<Coupon>> {
        const api = `${environment.API_URL}/Coupon`
        return this.apiCoreService.post<OptionalAll<Coupon>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<Coupon> = {
                    datos: response?.datos as Coupon ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }

    editCoupon(payload: number): Observable<ResponseModel<Coupon>> {
        const api = `${environment.API_URL}/Coupon/${payload}`
        return this.apiCoreService.get<ResponseModel<Coupon>>(
            api,
            this.apiCoreService.httpParams(),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<Coupon> = {
                    datos: response?.datos as Coupon ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }

    updateCoupon(id: number, payload: OptionalAll<Coupon>): Observable<ResponseModel<Coupon>> {
        const api = `${environment.API_URL}/Coupon/${id}`;
        return this.apiCoreService.put<OptionalAll<Coupon>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<Coupon> = {
                    datos: response?.datos as Coupon ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error)
            })
        )
    }

}