import {IResponseResult, IResponseStructure, ResponseModel} from "@shared/interface";
import {Observable, catchError, map, of, throwError} from "rxjs";
import {Product, ProductDataSelect, ProductModel, ProductsData} from "@shared/interface";

import {ApiCoreService} from "@shared/providers/engine/api-core.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {OptionalAll} from "@shared/types/util.types";
import {Params} from "@shared/interface";
import {environment} from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class ProductService {

    constructor(
        private apiCoreService: ApiCoreService
    ) {
    }

    getProducts(payload?: Params): Observable<ResponseModel<ProductsData>> {
        const api = `${environment.API_URL}/Product/ListadoGeneral`;
        return this.apiCoreService
            .get<ResponseModel<ProductsData>>(
                api,
                this.apiCoreService.httpParams(payload),
                this.apiCoreService.httpHeader()
            )
            .pipe(
                map((response: IResponseStructure) => {
                    const responseApi: ResponseModel<ProductsData> = {
                        datos: (response?.datos as ProductsData) ?? null,
                        result: (response?.result as IResponseResult) ?? null,
                    };
                    return responseApi;
                })
            );
    }


    getProductsToSelect(payload?: string): Observable<ResponseModel<ProductDataSelect>> {
        return this.apiCoreService.get<ProductDataSelect>(
            `${environment.API_URL}/Product/SelectList/` + payload,
            this.apiCoreService.httpParams(),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<ProductDataSelect> = {
                    datos: response?.datos as ProductDataSelect ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            })
        )
    }

    getProductById(id: number): Observable<ResponseModel<Product>> {
        const api = `${environment.API_URL}/Product/${id}`

        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams(),
            this.apiCoreService.httpHeader()
        )
            .pipe(
                map((response: IResponseStructure) => {
                    const datos = (response?.datos as Product) ?? null
                    const responseDatos:Product = {
                        ...datos,
                        code : datos?.code ?? 0,
                        images_id : datos?.images?.length > 0 ? datos?.images.map((item) => item.code) : null,
                        attachment_id : datos?.attachment?.length > 0 ? datos?.attachment.map((item) => item.code) : null,
                        cross_sell_products_id : datos?.cross_sell_products?.length > 0 ? datos?.cross_sell_products.map((item) => item.code) : null,
                        related_products_id: datos?.related_products?.length > 0 ? datos?.related_products.map((item) => item.code) : null,
                        cross_sell_products : datos?.cross_sell_products?.length > 0 ? datos?.cross_sell_products : null,
                        related_products : datos?.related_products?.length > 0 ? datos?.related_products : null,
                        related_random: datos?.related_random === 'active' || datos?.related_random === true ? 1 : 0,
                        status: datos?.status === 'active' || datos?.status === true ? 1 : 0,
                        status_featured: datos?.status_featured === 'active' || datos?.status_featured === true ? 1 : 0,
                        status_trending: datos?.status_trending === 'active' || datos?.status_trending === true ? 1 : 0,
                        status_offer : datos?.status_offer === 'active' || datos?.status_offer === true ? 1 : 0,
                        tag: datos?.tag?.length > 0 ? datos?.tag : null,
                    }

                    const responseApi: ResponseModel<Product> = {
                        datos: responseDatos,
                        result: (response?.result as IResponseResult) ?? null,
                    };
                    return responseApi;
                }),
                catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                })
            );
    }



   saveProduct(payload: OptionalAll<Product>): Observable<ResponseModel<Product>> {
        const api = `${environment.API_URL}/Product`
        return this.apiCoreService.post<OptionalAll<Product>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<Product> = {
                    datos: response?.datos as Product ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        )
    }


}
