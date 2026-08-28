import { Estadisticas, OrdersData, Product, ProductDataSelect, ProductModel, ProductsData, User } from "@shared/interface";
import { Observable, map } from "rxjs";
import { IResponseResult, IResponseStructure, ResponseModel } from "@shared/interface";

import { ApiCoreService } from "@shared/providers/engine/api-core.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"; 
import { Params } from "@shared/interface";
import { environment } from "@env/environment";
import { OrderPedidoDto } from "@shared/interface/orden.interface";


@Injectable({
    providedIn: 'root'
})

export class PedidoService {

    constructor(
        private http: HttpClient,
        private apiCoreService: ApiCoreService
    ) { }


    getClienteSearch(term: string): Observable<User[]> {
        return this.http.get<User[]>(`${environment.API_URL}/Customer/select/customer?search=${term}`);
    }

    getPedido(): Observable<Estadisticas> {
        return this.http.get<Estadisticas>(`${environment.API_URL}/Order/dashboard`).pipe(
            map((response: Estadisticas) => {
                return response;
            })
        );
    }

    
    getOrdersDetalleByCodigoOrden(idOrden: number): Observable<OrderPedidoDto> {
        return this.http.get<OrderPedidoDto>(`${environment.API_URL}/Order/pedido/${idOrden}`);
    }

    //  Via HttpClient (no <a href> directo) para que pase por el interceptor y lleve el
    //  header X-API-Key que exige ApiKeyMiddleware; un enlace plano daria 401.
    downloadArchivoOc(vArchivo: string): Observable<Blob> {
        return this.http.get(`${environment.API_URL}/DownUpFiles/download?vArchivo=${encodeURIComponent(vArchivo)}`, { responseType: 'blob' });
    }

    getOrden(payload?: Params): Observable<ResponseModel<OrdersData>> {
        const api = `${environment.API_URL}/Order/ListadoGeneral`;
        return this.apiCoreService
            .get<ResponseModel<OrdersData>>(
                api,
                this.apiCoreService.httpParams(payload),
                this.apiCoreService.httpHeader()
            )
            .pipe(
                map((response: IResponseStructure) => {
                    const responseApi: ResponseModel<OrdersData> = {
                        datos: (response?.datos as OrdersData) ?? null,
                        result: (response?.result as IResponseResult) ?? null,
                    };
                    return responseApi;
                })
            );
    }
    getProducts(payload?: Params): Observable<ResponseModel<ProductsData>> {
        const api = `${environment.API_URL}/Product/ListadoGeneral`;

        // valores por defecto para que no falle
        const defaultParams = {
            page: 1,
            paginate: 10,
            field: '',
            sort: ''
        };

        // si envías payload, se fusiona con los defaults
        const params = { ...defaultParams, ...payload };

        return this.apiCoreService
            .get<ResponseModel<ProductsData>>(
                api,
                this.apiCoreService.httpParams(params),
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




}
