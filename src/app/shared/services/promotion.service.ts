import { IResponseResult, IResponseStructure, Params, PrepareItemPostResponse, PrepareOption, Promotion, PromotionData, ResponseModel } from "@shared/interface";
import { Observable, catchError, concatMap, delay, from, map, switchMap, throwError, toArray } from "rxjs";

import { ApiCoreService } from "@shared/providers/engine/api-core.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { OptionalAll } from "@shared/types/util.types";
import { environment } from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class PromotionService {

    constructor(
        private apiCoreService: ApiCoreService,
        private http: HttpClient,
    ) { }

    importPromotion(payload: OptionalAll<Promotion>) {
        return this.createPromotion(payload).pipe(
            switchMap(response => {
                return from(this.prepareFormatItems(payload.products, response.datos.code)).pipe(
                    concatMap(item => {
                        if (payload.type === 'escala') return this.createPromotionScale(item)
                        if (payload.type === 'precio-final') return this.createPromotionFinalPrice(item)
                        if (payload.type === 'lleva-gratis' && payload.condition_promotion === 1) return this.createPromotionBonusGiftAmount(item)
                        if (payload.type === 'lleva-gratis' && payload.condition_promotion === 2) return this.createPromotionBonusGiftQuantity(item)
                        return null
                    }),
                    toArray()
                )
            })
        )
    }

    private prepareFormatItems(items: OptionalAll<PrepareOption>[], fk_promotion: number): OptionalAll<PrepareItemPostResponse>[] {
        if (items) {
            const data = items.map((item) => {
                return {
                    fk_code: 0,
                    fk_product: item.code,
                    fk_promotion: fk_promotion,
                    minimum_quantity: item.quantity_min,
                    maximum_quantity: item.quantity_max,
                    discount: item.discount,
                    amount: item.amount,
                    quantity: item.quantity,
                    quantity_max: item.quantity_max,
                    quantity_min: item.quantity_min,
                    reference: item.reference,
                    code: item.code
                }
            })
            return data
        }
        return null
    }


    getPromotion(payload: Params): Observable<ResponseModel<PromotionData>> {
        const api = `${environment.API_URL}/Promotion/ListadoGeneral`
        return this.apiCoreService.get<ResponseModel<PromotionData>>(
            api,
            this.apiCoreService.httpParams(payload),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {

                const responseApi: ResponseModel<PromotionData> = {
                    datos: response?.datos as PromotionData ?? null,
                    result: response?.result as IResponseResult ?? null
                }

                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    createPromotion(payload: OptionalAll<Promotion>): Observable<ResponseModel<Promotion>> {
        const api = `${environment.API_URL}/Promotion`
        return this.apiCoreService.post<OptionalAll<Promotion>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<Promotion> = {
                    datos: response?.datos as Promotion ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    updatePromotion(payload: OptionalAll<Promotion>): Observable<ResponseModel<Promotion>> {
        const api = `${environment.API_URL}/Promotion`
        return this.apiCoreService.post<OptionalAll<Promotion>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<Promotion> = {
                    datos: response?.datos as Promotion ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    createPromotionScale(payload: OptionalAll<PrepareItemPostResponse>): Observable<ResponseModel<PrepareItemPostResponse>> {
        const api = `${environment.API_URL}/PromotionScale`
        return this.apiCoreService.post<OptionalAll<PrepareItemPostResponse>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<PrepareItemPostResponse> = {
                    datos: response?.datos as PrepareItemPostResponse ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    createPromotionFinalPrice(payload: OptionalAll<PrepareItemPostResponse>): Observable<ResponseModel<PrepareItemPostResponse>> {
        const api = `${environment.API_URL}/PromotionFinalPrice`
        return this.apiCoreService.post<OptionalAll<PrepareItemPostResponse>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<PrepareItemPostResponse> = {
                    datos: response?.datos as PrepareItemPostResponse ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    createPromotionBonusGiftAmount(payload: OptionalAll<PrepareItemPostResponse>): Observable<ResponseModel<PrepareItemPostResponse>> {
        const api = `${environment.API_URL}/PromotionBonusGiftAmount`
        return this.apiCoreService.post<OptionalAll<PrepareItemPostResponse>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<PrepareItemPostResponse> = {
                    datos: response?.datos as PrepareItemPostResponse ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    createPromotionBonusGiftQuantity(payload: OptionalAll<PrepareItemPostResponse>): Observable<ResponseModel<PrepareItemPostResponse>> {
        const api = `${environment.API_URL}/PromotionBonusGiftQuantity`
        return this.apiCoreService.post<OptionalAll<PrepareItemPostResponse>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<PrepareItemPostResponse> = {
                    datos: response?.datos as PrepareItemPostResponse ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    editPromotion(id: number): Observable<ResponseModel<Promotion>> {
        const api = `${environment.API_URL}/Promotion/${id}`
        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams(),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {

                const responseApi: ResponseModel<Promotion> = {
                    datos: response?.datos as Promotion ?? null,
                    result: response?.result as IResponseResult ?? null
                }

                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    editPromotionScale(id: number): Observable<ResponseModel<PrepareItemPostResponse[]>> {
        const api = `${environment.API_URL}/PromotionScale/ListadoGeneral`
        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams({
                id: id
            }),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {

                const responseApi: ResponseModel<PrepareItemPostResponse[]> = {
                    datos: response?.datos as PrepareItemPostResponse[] ?? null,
                    result: response?.result as IResponseResult ?? null
                }

                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    editPromotionFinalPrice(id: number): Observable<ResponseModel<PrepareItemPostResponse[]>> {
        const api = `${environment.API_URL}/PromotionFinalPrice/ListadoGeneral`
        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams({
                id: id
            }),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {

                const responseApi: ResponseModel<PrepareItemPostResponse[]> = {
                    datos: response?.datos as PrepareItemPostResponse[] ?? null,
                    result: response?.result as IResponseResult ?? null
                }

                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    editPromotionBonusGiftAmount(id: number): Observable<ResponseModel<PrepareItemPostResponse[]>> {
        const api = `${environment.API_URL}/PromotionBonusGiftAmount/ListadoGeneral`
        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams({
                id: id
            }),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {

                const responseApi: ResponseModel<PrepareItemPostResponse[]> = {
                    datos: response?.datos as PrepareItemPostResponse[] ?? null,
                    result: response?.result as IResponseResult ?? null
                }

                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    editPromotionBonusGiftQuantity(id: number): Observable<ResponseModel<PrepareItemPostResponse[]>> {
        const api = `${environment.API_URL}/PromotionBonusGiftQuantity/ListadoGeneral`
        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams({
                id: id
            }),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {

                const responseApi: ResponseModel<PrepareItemPostResponse[]> = {
                    datos: response?.datos as PrepareItemPostResponse[] ?? null,
                    result: response?.result as IResponseResult ?? null
                }

                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }

    deleteProducto(code: number): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.API_URL}/PromotionFinalPrice/${code}`);
    }

    deletePromotion(code: number): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.API_URL}/Promotion/${code}`);
    }

    getProductoPromocionFinal(code: number): Observable<PrepareItemPostResponse> {
        return this.http.get<PrepareItemPostResponse>(`${environment.API_URL}/PromotionFinalPrice/productopromocion/${code}`);
    }

    updateProductoPromocionFinal(code: number, payload: PrepareItemPostResponse): Observable<PrepareItemPostResponse> {
        return this.http.put<PrepareItemPostResponse>(`${environment.API_URL}/PromotionFinalPrice/${code}`, payload);
    }



}