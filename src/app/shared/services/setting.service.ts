import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, throwError} from 'rxjs';
import {
    IResponseResult,
    IResponseStructure,
    ResponseModel,
    Setting, SettingContents, SettingLinks, SettingPolicies,
    SocialNetworks, SocialNetworksPost,
    ValuesResponse
} from '@shared/interface';
import {ApiCoreService} from "@shared/providers/engine/api-core.service";
import {OptionalAll} from "@shared/types/util.types";
import {environment} from "@env/environment";
import {Store} from "@ngxs/store";
import {SettingState} from "@shared/state/setting.state";

@Injectable({
    providedIn: 'root'
})
export class SettingService {

    constructor(
        private apiCoreService: ApiCoreService,
        private store: Store
    ) {
    }

    createUpdateSetting(payload: OptionalAll<ValuesResponse>): Observable<ResponseModel<ValuesResponse>> {
        const api = `${environment.API_URL}/Configuration`;
        return this.apiCoreService.post<OptionalAll<ValuesResponse>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<ValuesResponse> = {
                    datos: response?.datos as ValuesResponse ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }
    createUpdateSocialNetworks(payload: SocialNetworksPost): Observable<ResponseModel<SocialNetworksPost>> {
        const api = `${environment.API_URL}/ConfigurationSocialNetwork`;
        return this.apiCoreService.post<SocialNetworksPost>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<SocialNetworksPost> = {
                    datos: response?.datos as SocialNetworksPost ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }

    getSettingByEcommerce(ecommerce: string): Observable<ResponseModel<ValuesResponse>> {
        const api = `${environment.API_URL}/Configuration/${ecommerce}`;
        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams(),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<ValuesResponse> = {
                    datos: response?.datos as ValuesResponse ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }
    getSocialNetworks(payload: string): Observable<ResponseModel<SocialNetworks[]>> {
        const api = `${environment.API_URL}/ConfigurationSocialNetwork/SelectList`;
        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams({
                fk_configuration: payload
            }),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<SocialNetworks[]> = {
                    datos: response?.datos as SocialNetworks[] ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }
    getSettingLinks(): Observable<ResponseModel<SettingLinks[]>> {
        const api = `${environment.API_URL}/Configuration/ConfigurationLink_SelectList`;
        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams(),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<SettingLinks[]> = {
                    datos: response?.datos as SettingLinks[] ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }
    getSettingContents(ecommerce:string): Observable<ResponseModel<SettingContents[]>> {
        const api = `${environment.API_URL}/Content/SelectList_Page`;
        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams({
                ecommerce : ecommerce
            }),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<SettingContents[]> = {
                    datos: response?.datos as SettingContents[] ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }
    getSettingPolicies(): Observable<ResponseModel<SettingPolicies[]>> {
        const api = `${environment.API_URL}/Policies/SelectList`;
        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams(),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<SettingPolicies[]> = {
                    datos: response?.datos as SettingPolicies[] ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }

}
