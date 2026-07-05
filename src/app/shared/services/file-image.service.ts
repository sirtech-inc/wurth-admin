import {IResponseResult, IResponseStructure, Images, ResponseModel, Upload} from "@shared/interface";
import {map, of} from "rxjs";

import {ApiCoreService} from "@shared/providers/engine/api-core.service";
import {ImageData} from "@shared/interface/file-image.interface";
import {Injectable} from "@angular/core";
import {environment} from "@env/environment";

@Injectable({
    providedIn: "root",
})
export class FileImageService {

    constructor(
        private apiCoreService: ApiCoreService
    ) {
    }

    uploadImage(file: File, modeData?: 'queryString' | 'formData', extraData?: {}, multiple?: boolean) {

        if (file === null || file === undefined) {
            const responseApi: ResponseModel<Upload> = {
                datos: null,
                result: {
                    detail: '',
                    status: 200,
                    title: '',
                    errors: null
                },
            };
            return of(responseApi);
        }
        /*
        if (file === null || file === undefined) return of(
          {
            datos: null,
            result: {
              detail: '',
              status: 200
            }
          } as ResponseModel<Upload>
        );
        */
        const formData: FormData = new FormData();
        const queryParams = new URLSearchParams();
        let api = `${environment.API_URL}/Images/${multiple ? 'uploadList' : 'upload'}`;

        if (Array.isArray(file)) {
            file.forEach(element => {
                formData.append('imagen', element);
            });
        } else {
            formData.append('imagen', file);
        }

        if (modeData === 'queryString' && extraData) {
            Object.keys(extraData).forEach(key => {
                queryParams.append(key, extraData[key]);
            });
            api = `${api}?${queryParams.toString()}`;
        }
        if (modeData === 'formData' && extraData) {
            Object.keys(extraData).forEach(key => {
                formData.append(key, extraData[key]);
            });
        }

        return this.apiCoreService.post(api, formData).pipe(
            map((response: IResponseStructure) => {

                const responseApi: ResponseModel<Upload> = {
                    datos: (response?.datos as Upload) ?? null,
                    result: (response?.result as IResponseResult) ?? null,
                };
                return responseApi;

            })
        )
    }

    listImages(type_module: string) {
        const api = `${environment.API_URL}/Images/ListadoGeneral`
        return this.apiCoreService.get(
            api,
            this.apiCoreService.httpParams({_module: type_module, _page: 0, _limit: 0}),
            this.apiCoreService.httpHeader()).pipe(
            map((response: IResponseStructure) => {
                const responseApi: ResponseModel<ImageData> = {
                    datos: (response?.datos as ImageData) ?? null,
                    result: (response?.result as IResponseResult) ?? null,
                };
                return responseApi;
            })
        )
    }


    uploadAttachment(file: File, modeData?: 'queryString' | 'formData', extraData?: {}, multiple?: boolean) {

        if (file === null || file === undefined) {
            const responseApi: ResponseModel<Upload> = {
                datos: null,
                result: {
                    detail: '',
                    status: 200,
                    title: '',
                    errors: null
                },
            };
            return of(responseApi);
        }

        const formData: FormData = new FormData();
        const queryParams = new URLSearchParams();
        let api = `${environment.API_URL}/Files/${multiple ? 'uploadList' : 'upload'}`;

        if (Array.isArray(file)) {
            file.forEach(element => {
                formData.append('imagen', element);
            });
        } else {
            formData.append('imagen', file);
        }

        if (modeData === 'queryString' && extraData) {
            Object.keys(extraData).forEach(key => {
                queryParams.append(key, extraData[key]);
            });
            api = `${api}?${queryParams.toString()}`;
        }
        if (modeData === 'formData' && extraData) {
            Object.keys(extraData).forEach(key => {
                formData.append(key, extraData[key]);
            });
        }

        return this.apiCoreService.post(api, formData).pipe(
            map((response: IResponseStructure) => {

                const responseApi: ResponseModel<Upload> = {
                    datos: (response?.datos as Upload) ?? null,
                    result: (response?.result as IResponseResult) ?? null,
                };
                return responseApi;

            })
        )
    }

}