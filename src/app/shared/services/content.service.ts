import { ContentMenu, ContentMenusData, ContentPage, ContentPageData } from "@shared/interface/content.interface";
import { IResponseResult, IResponseStructure, ResponseModel } from "@shared/interface";
import { Observable, catchError, map, throwError } from "rxjs";

import { ApiCoreService } from "@shared/providers/engine/api-core.service";
import { Injectable } from '@angular/core';
import { OptionalAll } from "@shared/types/util.types";
import { environment } from "@env/environment";

@Injectable({
    providedIn: 'root'
})
export class ContentService {

    constructor(
        private apiCoreService: ApiCoreService
    ) {
    }

    getMenus(ecommerce: string): Observable<ResponseModel<ContentMenusData>> {
        const api = `${environment.API_URL}/Menu/SelectList`;
        return this.apiCoreService.get<ResponseModel<ContentMenusData>>(
            api,
            this.apiCoreService.httpParams({
                ecommerce: ecommerce
            }),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {
                const raw = response?.datos;
                const normalized: ContentMenusData = Array.isArray(raw)
                    ? { datos: raw as ContentMenu[], count: (raw as ContentMenu[]).length }
                    : raw as ContentMenusData;
                const responseApi: ResponseModel<ContentMenusData> = {
                    datos: normalized ? this.formatTree(normalized, 0) : null,
                    result: (response?.result as IResponseResult) ?? null
                }
                return responseApi
            })
        )
    }

    private formatTree(data: ContentMenusData, parentId: number): ContentMenusData {
        const filteredMenu = data.datos.filter(menu => menu.parent === parentId);
        let totalCount = filteredMenu.length;

        const formattedMenu: ContentMenu[] = [];
        filteredMenu.forEach(cat => {
            const subcategoriesData = this.formatTree(data, cat.code);
            if (subcategoriesData.datos.length > 0) {
                cat.submenus = subcategoriesData.datos;
                totalCount += subcategoriesData.count;
            }
            formattedMenu.push(cat);
        });
        return {
            datos: formattedMenu,
            count: totalCount
        };
    }

    menuSave(payload: OptionalAll<ContentMenu>): Observable<ResponseModel<ContentMenu>> {
        const api = `${environment.API_URL}/Menu`;
        return this.apiCoreService.post<OptionalAll<ContentMenu>>(
            api,
            payload
        ).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<ContentMenu> = {
                    datos: response?.datos as ContentMenu ?? null,
                    result: response?.result as IResponseResult ?? null
                }
                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }

    editMenu(code: number): Observable<ResponseModel<ContentMenu>> {
        const api = `${environment.API_URL}/Menu/${code}`;
        return this.apiCoreService.get<ResponseModel<ContentMenu>>(
            api,
            this.apiCoreService.httpParams(),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {

                const responseApi: ResponseModel<ContentMenu> = {
                    datos: response?.datos as ContentMenu ?? null,
                    result: response?.result as IResponseResult ?? null
                }

                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )
    }

    getContentPageSelect(ecommerce: string): Observable<ResponseModel<OptionalAll<ContentPageData>>> {
        const api = `${environment.API_URL}/Content/SelectList`;
        return this.apiCoreService.get
            <ResponseModel<OptionalAll<ContentPageData>>>
            (
            api,
            this.apiCoreService.httpParams(
                { ecommerce: ecommerce }
            ),
            this.apiCoreService.httpHeader()
        ).pipe(
            map((response: IResponseStructure) => {

                const responseApi: ResponseModel<OptionalAll<ContentPageData>> = {
                    datos: response?.datos as OptionalAll<ContentPageData> ?? null,
                    result: response?.result as IResponseResult ?? null
                }

                return responseApi
            }), catchError((error: any) => {
                return throwError(() => error)
            })
        )

    }

}
