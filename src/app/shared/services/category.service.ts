import {
    CategoriesData,
    Category,
    CategoryModel,
    IResponseResult,
    IResponseStructure,
    ResponseModel
} from "@shared/interface";
import {Observable, catchError, map, throwError} from "rxjs";

import {ApiCoreService} from "@shared/providers/engine/api-core.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {OptionalAll, StrictPartial} from "@shared/types/util.types";
import {environment} from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class CategoryService {

    constructor(
        private apiCoreService: ApiCoreService
    ) {
    }


    public getCategories(): Observable<ResponseModel<CategoriesData>> {
        const api = `${environment.API_URL}/Category/ListadoGeneral`;
        return this.apiCoreService
            .get<ResponseModel<CategoriesData>>(
                api,
                this.apiCoreService.httpParams(),
                this.apiCoreService.httpHeader()
            )
            .pipe(
                map((response: IResponseStructure) => {
                    const responseApi: ResponseModel<CategoriesData> = {

                        datos: this.formatTree(response?.datos as CategoriesData, 0) ?? null,
                        result: (response?.result as IResponseResult) ?? null,
                    };
                    return responseApi;
                })
            );
    }
    public getCategoriesByEcommerce(ecommerce: string) {
        const api = `${environment.API_URL}/Category/ListadoGeneral/${ecommerce}`;
        return this.apiCoreService
            .get<ResponseModel<CategoriesData>>(
                api,
                this.apiCoreService.httpParams(),
                this.apiCoreService.httpHeader()
            )
            .pipe(
                map((response: IResponseStructure) => {
                    const responseApi: ResponseModel<CategoriesData> = {
                        datos: this.formatTree(response?.datos as CategoriesData, 0) ?? null,
                        result: (response?.result as IResponseResult) ?? null,
                    };
                    return responseApi;
                })
            );
    }

    private formatTree(data: CategoriesData, parentId: number): CategoriesData {
        const filteredCategories = data.datos.filter(cat => cat.parent === parentId);
        if (parentId === 0) {
            filteredCategories.sort((a, b) => Number(a.priority) - Number(b.priority));
        }else{
            filteredCategories.sort((a, b) => a.name.localeCompare(b.name));
        }
        let totalCount = filteredCategories.length;
        const formattedCategories: Category[] = [];
        filteredCategories.forEach(cat => {
            const subcategoriesData = this.formatTree(data, cat.code);
            if (subcategoriesData.datos.length > 0) {
                cat.subcategories = subcategoriesData.datos;
                totalCount += subcategoriesData.count;
            }
            formattedCategories.push(cat);
        });
        const organizedData: CategoriesData = {
            datos: formattedCategories,
            count: totalCount
        };
        return organizedData;
    }
    
    /*
    private formatTree(data: CategoriesData, parentId: number): CategoriesData {
        const filteredCategories = data.datos.filter(cat => cat.parent === parentId);
        let totalCount = filteredCategories.length;
        const formattedCategories: Category[] = [];
        filteredCategories.forEach(cat => {
            const subcategoriesData = this.formatTree(data, cat.code);
            if (subcategoriesData.datos.length > 0) {
                cat.subcategories = subcategoriesData.datos;
                totalCount += subcategoriesData.count;
            }
            formattedCategories.push(cat);
        });

        const organizedData: CategoriesData = {
            datos: formattedCategories,
            count: totalCount
        };
        return organizedData;
    }
    */

    getCategoryById(payload: number): Observable<ResponseModel<Category>> {

        return this.apiCoreService
            .get<ResponseModel<Category>>(
                `${environment.API_URL}/Category/${payload}`,
                this.apiCoreService.httpParams(),
                this.apiCoreService.httpHeader()
            )
            .pipe(
                map((response: IResponseStructure) => {
                    const responseApi: ResponseModel<Category> = {
                        datos: (response?.datos as Category) ?? null,
                        result: (response?.result as IResponseResult) ?? null,
                    };
                    return responseApi;
                })
            );

    }

    saveCategory(payload:OptionalAll<Category>){
        return this.apiCoreService
            .post(`${environment.API_URL}/Category`, payload)
            .pipe(
                map((response: IResponseStructure) => {
                    const responseApi: ResponseModel<Category> = {
                        datos: (response?.datos as Category) ?? null,
                        result: (response?.result as IResponseResult) ?? null,
                    };
                    return responseApi;
                }), catchError((error: HttpErrorResponse) => {
                    return throwError(() => error);
                })
            );
    }

    /*
    updateCategory(
      id: number,
      payload: StrictPartial<Category, "date_create" | "date_update" | "code" | "images">): Observable<ResponseModel<Category>> {
      return this.apiCoreService
        .put(`${environment.API_URL}/Category/${id}`, payload)
        .pipe(
          map((response: IResponseStructure) => {
            const responseApi: ResponseModel<Category> = {
              datos: (response?.datos as Category) ?? null,
              result: (response?.result as IResponseResult) ?? null,
            };
            return responseApi;
          }), catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
          })
        );

    }

    createCategory(payload: StrictPartial<Category, 'date_create' | 'date_update'  | 'code' | 'images'>): Observable<ResponseModel<Category>> {
      return this.apiCoreService
        .post(`${environment.API_URL}/Category`, payload)
        .pipe(
          map((response: IResponseStructure) => {
            const responseApi: ResponseModel<Category> = {
              datos: (response?.datos as Category) ?? null,
              result: (response?.result as IResponseResult) ?? null,
            };
            return responseApi;
          }), catchError((error: HttpErrorResponse) => {
            return throwError(() => error);
          })
        );
    }
  */
}
