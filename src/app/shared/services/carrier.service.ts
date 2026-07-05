import {Injectable} from "@angular/core";
import {ApiCoreService} from "@shared/providers/engine/api-core.service";
import {OptionalAll} from "@shared/types/util.types";
import {
    catchError,
    concat,
    concatMap,
    map,
    Observable,
    of,
    throwError
} from "rxjs";
import {IResponseResult, IResponseStructure, Params, ResponseModel} from "@shared/interface";
import {environment} from "@env/environment";
import {
    Carrier, CarrierData,
    CarrierDepartment, CarrierDepartments, CarrierDepartmentsData, CarrierFormatRange,
    CarrierLocation,
    CarrierRange, CarrierRangeDepartmentCost, CarrierResponse,
    CarrierValuesPost
} from "@shared/interface/carrier.interface";
import {NotificationService} from "@shared/services/notification.service";
import {Store} from "@ngxs/store";
import {CarrierSaveOk} from "@shared/action/carrier.action";

@Injectable({
    providedIn: 'root'
})
export class CarrierService {
    constructor(
        private apiCoreService: ApiCoreService,
        private notificationService: NotificationService,
        private store: Store
    ) {
    }

    public getCarriers(payload?: Params) : Observable<ResponseModel<CarrierData>>{
        const api = `${environment.API_URL}/Carrier/ListadoGeneral`;
        return this.apiCoreService.get<ResponseModel<CarrierData>>(
            api,
            this.apiCoreService.httpParams(payload),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<CarrierData> = {
                    datos: response?.datos as CarrierData ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }

    public getCarrierById(id: number): Observable<ResponseModel<CarrierResponse>> {
        const api = `${environment.API_URL}/Carrier/Datos`;
        return this.apiCoreService.get<ResponseModel<CarrierResponse>>(
            api,
            this.apiCoreService.httpParams({code_carrier: id}),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<CarrierResponse> = {
                    datos: response?.datos as CarrierResponse ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }

    public createUpdateCarrier(payload: OptionalAll<CarrierValuesPost>): Observable<any> {
        const api = `${environment.API_URL}/Carrier`;
        return this.apiCoreService.post<OptionalAll<Carrier>>(api, payload.carrier).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<Carrier> = {
                    datos: response?.datos as Carrier ?? null,
                    result: response?.result as IResponseResult ?? null
                };
                return responseApi;
            }),
            catchError((error: any) => {
                return throwError(() => error);
            }),

            concatMap((response1) => {
                const data: OptionalAll<CarrierLocation> = {
                    ...payload.location,
                    fk_carrier: response1.datos.code,
                };
                return this.createUpdateLocation(data).pipe(
                    concatMap(() => this.createUpdateRanges(payload.range, response1.datos.code)),
                );
            })
        );
    }

    public createUpdateLocation(payload: OptionalAll<CarrierLocation>): Observable<ResponseModel<CarrierLocation>> {
        const api = `${environment.API_URL}/CarrierLocation`;
        return this.apiCoreService.post<OptionalAll<CarrierLocation>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<CarrierLocation> = {
                    datos: response?.datos as CarrierLocation ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }

    public createUpdateRanges(payload: OptionalAll<CarrierFormatRange>[], carrier_id: number): Observable<any> {
        return of(...payload).pipe(
            concatMap(range => this.createUpdateRange(range, carrier_id)),
            catchError(error => {
                return of(error);
            })
        );
    }

    public createUpdateRange(payload: OptionalAll<CarrierFormatRange>, carrier_id: number) {
        const api = `${environment.API_URL}/CarrierRange`;
        payload.range.fk_carrier = carrier_id;

        return this.apiCoreService.post<OptionalAll<CarrierRange>>(api, payload.range).pipe(
            concatMap((response: IResponseStructure) => {
                const responseApi: ResponseModel<CarrierRange> = {
                    datos: response?.datos as CarrierRange ?? null,
                    result: response?.result as IResponseResult ?? null
                };
                const observables: Observable<any>[] = [];

                payload.department.forEach(department => {
                    const _department = {
                        ...department.department,
                        fk_carrier: carrier_id
                    };

                    observables.push(this.createUpdateDepartment(_department).pipe(
                        concatMap((response2) => {
                            const _cost = {
                                ...department.cost,
                                fk_carrier_range: responseApi.datos.code,
                                fk_carrier_department: response2.datos.code
                            };
                            return this.createUpdateCost(_cost);
                        })
                    ));
                });
                return concat(...observables).pipe(
                    map(() => responseApi),
                    catchError((error: any) => throwError(() => error))
                );
            }),
            catchError((error: any) => throwError(() => error))
        );
    }

    private createUpdateDepartment(payload: OptionalAll<CarrierDepartment>) {
        const api = `${environment.API_URL}/CarrierDepartment`;
        return this.apiCoreService.post<OptionalAll<CarrierDepartment>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<CarrierDepartment> = {
                    datos: response?.datos as CarrierDepartment ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }

    private createUpdateCost(payload: OptionalAll<CarrierRangeDepartmentCost>) {

        const api = `${environment.API_URL}/CarrierRangeDepartmentCost`;
        return this.apiCoreService.post<OptionalAll<CarrierRangeDepartmentCost>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<CarrierRangeDepartmentCost> = {
                    datos: response?.datos as CarrierRangeDepartmentCost ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                this.store.dispatch(new CarrierSaveOk(true))
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )

    }

    public getDepartments(): Observable<ResponseModel<CarrierDepartmentsData>> {
        const api = `${environment.API_URL}/CarrierDepartment/ListadoGeneral`;
        return this.apiCoreService.get<ResponseModel<CarrierDepartmentsData>>(
            api,
            this.apiCoreService.httpParams(),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<CarrierDepartmentsData> = {
                    datos: response?.datos as CarrierDepartmentsData ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }


}