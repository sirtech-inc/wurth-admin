import { IResponseResult, IResponseStructure, ResponseModel } from "@shared/interface";
import { Observable, map } from "rxjs";

import { ApiCoreService } from "@shared/providers/engine/api-core.service";
import { Injectable } from "@angular/core";
import { ParameterState } from "@shared/state/parameter.state";
import { ParametersData } from "@shared/interface/parameter.interface";
import { Store } from "@ngxs/store";
import { environment } from "@env/environment";

/**
 *
 *
 * @export
 * @class ParameterService
 */
@Injectable({
    providedIn: "root",
})
export class ParameterService {

    constructor(
        private apiCoreService: ApiCoreService,
        private store: Store
    ) { }


    getParameters(payload: string, addDefaultOption?: boolean): Observable<ResponseModel<ParametersData>> {

        if (!payload) {
            throw new Error("Payload is required")
        }

        const api = `${environment.API_URL}/Parametrs/${payload}`
        return this.apiCoreService.get<ResponseModel<ParametersData>>(
            api,
            this.apiCoreService.httpParams(),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {

                // insertar in valor al inicio
                const data = response.datos as ParametersData
                if (addDefaultOption) {
                    data.lista.unshift({
                        description_1: 'Ninguno',
                        description_2: 'Ninguno',
                        value_1: null,
                        value_2: null
                    })
                }

                const responseApi: ResponseModel<ParametersData> = {
                    // datos: response.datos as ParametersData,
                    datos: data,
                    result: response.result as IResponseResult
                }
                return responseApi
            })
        )
    }

    getOtherByValue(value: number | number[], key: string): string[] {
        if (!key) return null

        const data = this.store.selectSnapshot(ParameterState.parametersAdvanceDropDown(key))
        if (!data) return null

        const result = data.filter(parameter => Array.isArray(value) ? value.includes(parameter.code) : parameter.code === value)
            .map(parameter => parameter.other.value);
        return result || null
    }

    getValueByOther(other: string | string[], key: string): number[] {
        if (!key) return null

        const data = this.store.selectSnapshot(ParameterState.parametersAdvanceDropDown(key))

        if (!data) return null

        const result = data.filter(parameter => Array.isArray(other) ? other.includes(parameter.other.value) : parameter.other.value === other)
            .map(parameter => parameter.code);

        return result || null


    }

}