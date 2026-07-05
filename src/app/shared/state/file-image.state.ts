import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { Files, Images, Upload } from "@shared/interface";
import { ListImages, UploadFileAttachment, UploadFileImage } from "@shared/action/file-image.action";

import { FileImageService } from "@shared/services/file-image.service";
import { Injectable } from "@angular/core";
import { NotificationService } from "@shared/services/index.service";
import { ResetLoaderStateAction } from "@shared/action";
import { tap } from "rxjs";

export class FileImageStateModel {
    upload = {
        datos: [] as Upload[],
        total: 0
    }
    images = {
        datos: [] as Images[]
    }
    files = {
        datos: [] as Files[]
    }
    selectedFile: Upload | null;
}



@State<FileImageStateModel>({
    name: "file",
    defaults: {
        upload: {
            datos: [],
            total: 0
        },
        images: {
            datos: []
        },
        files: {
            datos: []
        },
        selectedFile: null
    },
})
@Injectable()
export class FileState {

    constructor(
        private store: Store,
        private notificationService: NotificationService,
        private fileImageService: FileImageService,
    ) { }

    @Selector()
    static selectedFile(state: FileImageStateModel) {
        return state.selectedFile;
    }

    @Selector()
    static getImages(state: FileImageStateModel) {
        return state.images.datos;
    }

    @Action(UploadFileImage)
    uploadFile(ctx: StateContext<FileImageStateModel>, { payload, modeData, extraData, multiple }: UploadFileImage) {
        return this.fileImageService.uploadImage(payload, modeData, extraData, multiple).pipe(
            tap({
                next: result => {

                    ctx.patchState({
                        upload: {
                            datos: [...ctx.getState().upload.datos, result?.datos],
                            total: ctx.getState().upload.total + 1
                        },
                        selectedFile: result?.datos
                    });
                    if (result?.result?.status === 200 && result?.result?.detail) {
                        this.notificationService.showSuccess(result.result.detail);
                    }

                },
                error: err => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        );
    }

    @Action(UploadFileAttachment)
    uploadFileAttachment(ctx: StateContext<FileImageStateModel>, { payload, modeData, extraData, multiple }: UploadFileAttachment) {
        return this.fileImageService.uploadAttachment(payload, modeData, extraData, multiple).pipe(
            tap({
                next: result => {

                    ctx.patchState({
                        upload: {
                            datos: [...ctx.getState().upload.datos, result?.datos],
                            total: ctx.getState().upload.total + 1
                        },
                        selectedFile: result?.datos
                    });
                    if (result?.result?.status === 200 && result?.result?.detail) {
                        this.notificationService.showSuccess(result.result.detail);
                    }

                },
                error: err => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        );
    }

    @Action(ListImages)
    listImages(ctx: StateContext<FileImageStateModel>, { type_module }: ListImages) {
        return this.fileImageService.listImages(type_module).pipe(
            tap({
                next: result => {
                    ctx.patchState({
                        images: {
                            datos: result?.datos.datos
                        }
                    });
                },
                error: err => {
                    this.store.dispatch(new ResetLoaderStateAction())
                    if (err?.error?.message) {
                        throw new Error(err?.error?.message);
                    }
                }
            })
        );
    }

}